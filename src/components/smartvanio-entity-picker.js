import { LitElement, html, css } from "lit";

/**
 * Rich entity picker with search, icons, and live values.
 *
 * When opened, presents a full-screen bottom-sheet modal so the on-screen
 * keyboard on tablets doesn't shrink/hide the picker's search input or list.
 *
 * Usage:
 *   <smartvanio-entity-picker
 *     .hass=${this.hass}
 *     .value=${"sensor.battery_voltage"}
 *     .domains=${["sensor"]}
 *     .excludeDomains=${["light","switch"]}
 *     placeholder="Select entity"
 *     @smartvanio-change=${(e) => handler(e.detail.value)}
 *   ></smartvanio-entity-picker>
 */
class SmartVanEntityPicker extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      value: { type: String },
      domains: { type: Array },
      excludeDomains: { type: Array },
      excludeEntities: { type: Array },
      pinnedEntity: { type: String, attribute: "pinned-entity" },
      placeholder: { type: String },
      _open: { type: Boolean },
      _search: { type: String },
    };
  }

  constructor() {
    super();
    this.hass = null;
    this.value = "";
    this.domains = [];
    this.excludeDomains = [];
    this.excludeEntities = [];
    this.pinnedEntity = "";
    this.placeholder = "Select entity";
    this._open = false;
    this._search = "";
    this._onKeydown = (e) => {
      if (e.key === "Escape" && this._open) this._close();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeydown);
  }

  updated(changedProps) {
    // Auto-focus the search input when the sheet opens so the user can start
    // typing immediately. RAF ensures the element is in the DOM first.
    if (changedProps.has("_open") && this._open) {
      requestAnimationFrame(() => {
        this.shadowRoot?.querySelector(".ep-search")?.focus();
      });
    }
  }

  _getEntities() {
    if (!this.hass?.states) return [];
    const domains = this.domains ?? [];
    const exclude = new Set(this.excludeDomains ?? []);
    const excludeEids = new Set(this.excludeEntities ?? []);
    return Object.entries(this.hass.states)
      .filter(([eid]) => {
        if (excludeEids.has(eid)) return false;
        const d = eid.split(".")[0];
        if (exclude.has(d)) return false;
        return domains.length === 0 || domains.includes(d);
      })
      .map(([eid, state]) => {
        const name = state.attributes?.friendly_name ?? eid.split(".").pop().replace(/_/g, " ");
        const icon = state.attributes?.icon || this._domainIcon(eid);
        const val = state.state;
        const unit = state.attributes?.unit_of_measurement ?? "";
        return { eid, name, icon, val, unit };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  _domainIcon(eid) {
    const d = eid.split(".")[0];
    const map = {
      sensor: "mdi:eye",
      binary_sensor: "mdi:checkbox-blank-circle-outline",
      switch: "mdi:toggle-switch",
      light: "mdi:lightbulb",
      fan: "mdi:fan",
      button: "mdi:gesture-tap-button",
      script: "mdi:script-text",
      input_boolean: "mdi:toggle-switch-outline",
      number: "mdi:numeric",
      scene: "mdi:palette",
      select: "mdi:form-select",
    };
    return map[d] ?? "mdi:puzzle";
  }

  _filtered() {
    const all = this._getEntities();
    if (!this._search) return all;
    const q = this._search.toLowerCase();
    return all.filter(
      (e) => e.name.toLowerCase().includes(q) || e.eid.toLowerCase().includes(q)
    );
  }

  _select(eid) {
    this._open = false;
    this._search = "";
    this.dispatchEvent(
      new CustomEvent("smartvanio-change", {
        detail: { value: eid },
        bubbles: true,
        composed: true,
      })
    );
  }

  _clear(e) {
    e.stopPropagation();
    this._select("");
  }

  _formatVal(val, unit) {
    if (val === "unavailable" || val === "unknown") return val;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const display = Number.isInteger(num) ? val : num.toFixed(1);
      return unit ? `${display} ${unit}` : display;
    }
    return val;
  }

  _open_() { this._open = true; this._search = ""; }
  _close() { this._open = false; this._search = ""; }

  _onOverlayClick(e) {
    // Only dismiss when the tap lands on the backdrop itself, not propagated
    // from the sheet.
    if (e.target === e.currentTarget) this._close();
  }

  render() {
    const selected = this.value ? this.hass?.states?.[this.value] : null;
    const selName = selected?.attributes?.friendly_name ?? (this.value ? this.value.split(".").pop().replace(/_/g, " ") : "");
    const selIcon = selected?.attributes?.icon || (this.value ? this._domainIcon(this.value) : "");
    const selVal = selected ? this._formatVal(selected.state, selected.attributes?.unit_of_measurement) : "";

    return html`
      <div class="picker">
        <div class="selected" @click=${() => this._open_()}>
          ${this.value ? html`
            <ha-icon class="sel-icon" icon="${selIcon}" style="--mdc-icon-size:18px"></ha-icon>
            <span class="sel-name">${selName}</span>
            <span class="sel-val">${selVal}</span>
            <button class="sel-clear" @click=${this._clear}>✕</button>
          ` : html`
            <span class="sel-placeholder">${this.placeholder}</span>
          `}
          <span class="chevron"></span>
        </div>
        ${this._open ? this._renderSheet() : ""}
      </div>
    `;
  }

  _renderSheet() {
    const pinned = this.pinnedEntity && this.hass?.states?.[this.pinnedEntity];
    const pinnedState = pinned ? this.hass.states[this.pinnedEntity] : null;
    const pinnedName = pinnedState?.attributes?.friendly_name ?? (pinned ? this.pinnedEntity.split(".").pop().replace(/_/g, " ") : "");
    const pinnedIcon = pinnedState?.attributes?.icon || (pinned ? this._domainIcon(this.pinnedEntity) : "");
    const others = this._filtered().filter((e) => e.eid !== this.pinnedEntity);

    return html`
      <div class="ep-overlay" @click=${this._onOverlayClick}>
        <div class="ep-sheet" @click=${(e) => e.stopPropagation()}>
          <div class="ep-header">
            <span class="ep-title">${this.placeholder ?? "Select entity"}</span>
            <button class="ep-close" @click=${() => this._close()} aria-label="Close">
              <ha-icon icon="mdi:close" style="--mdc-icon-size:22px"></ha-icon>
            </button>
          </div>
          <input class="ep-search" type="search"
            inputmode="search" enterkeyhint="search" autocomplete="off"
            placeholder="Search entities..."
            .value=${this._search}
            @input=${(e) => { this._search = e.target.value; }} />
          <div class="ep-list">
            ${pinned ? html`
              <div class="option pinned ${this.pinnedEntity === this.value ? "active" : ""}"
                   @click=${() => this._select(this.pinnedEntity)}>
                <ha-icon class="opt-icon" icon="${pinnedIcon}" style="--mdc-icon-size:22px"></ha-icon>
                <div class="opt-info">
                  <span class="opt-name">${pinnedName}</span>
                  <span class="opt-eid">${this.pinnedEntity}</span>
                </div>
                <span class="pinned-badge">this entity</span>
              </div>
              <div class="pinned-divider"></div>
            ` : ""}
            ${others.map((e) => html`
              <div class="option ${e.eid === this.value ? "active" : ""}"
                   @click=${() => this._select(e.eid)}>
                <ha-icon class="opt-icon" icon="${e.icon}" style="--mdc-icon-size:22px"></ha-icon>
                <div class="opt-info">
                  <span class="opt-name">${e.name}</span>
                  <span class="opt-eid">${e.eid}</span>
                </div>
                <span class="opt-val">${this._formatVal(e.val, e.unit)}</span>
              </div>
            `)}
            ${others.length === 0 && !pinned ? html`
              <div class="no-results">No entities found</div>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; min-width: 0; }

      .picker { position: relative; }

      .selected {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        background: var(--sv-bg-surface, #16161E);
        cursor: pointer;
        min-height: 20px;
        transition: border-color 0.2s;
      }
      .selected:hover { border-color: var(--sv-accent, #4a9eff); }

      .sel-icon { color: var(--sv-text-secondary, #888); flex-shrink: 0; }
      .sel-name { flex: 1; font-size: 13px; color: var(--sv-text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sel-val  { font-size: 12px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; }
      .sel-placeholder { flex: 1; font-size: 13px; color: var(--sv-text-secondary, #888); }
      .sel-clear {
        background: none; border: none; color: var(--sv-text-secondary, #888);
        cursor: pointer; font-size: 12px; padding: 2px 4px; line-height: 1;
      }
      .sel-clear:hover { color: var(--sv-red, #ff5252); }

      .chevron {
        flex-shrink: 0;
        width: 0; height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--sv-text-secondary, #888);
      }

      /* ── Picker sheet (full-screen modal) ───────────────────── */

      .ep-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        animation: ep-fade-in 0.18s ease-out;
      }

      @keyframes ep-fade-in {
        from { background: rgba(0, 0, 0, 0); }
        to   { background: rgba(0, 0, 0, 0.55); }
      }

      .ep-sheet {
        background: var(--sv-bg-overlay, #161B22);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 0 0 18px 18px;
        width: min(640px, 100%);
        max-height: 92dvh;
        display: flex;
        flex-direction: column;
        padding: 14px;
        gap: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        animation: ep-slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes ep-slide-down {
        from { transform: translateY(-20px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
      }

      .ep-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 2px 4px;
      }
      .ep-title {
        font-size: 17px;
        font-weight: 600;
        color: var(--sv-text-primary, #fff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ep-close {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        background: var(--sv-bg-elevated, #1E1E2A);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 22px;
        color: var(--sv-text-secondary, #888);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .ep-close:hover { background: var(--sv-border, #2A2A38); color: var(--sv-text-primary, #fff); }
      .ep-close:active { background: var(--sv-bg-input, #212830); }

      .ep-search {
        width: 100%;
        font-size: 16px;        /* >=16px prevents iOS Safari auto-zoom on focus */
        font-family: inherit;
        padding: 14px 16px;
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 12px;
        background: var(--sv-bg-input, #212830);
        color: var(--sv-text-primary, #fff);
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.15s;
      }
      .ep-search:focus { border-color: var(--sv-accent, #4a9eff); }
      .ep-search::placeholder { color: var(--sv-text-secondary, #888); }

      .ep-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        margin: 0 -4px;
        padding: 0 4px 4px;
      }
      .ep-list::-webkit-scrollbar { width: 4px; }
      .ep-list::-webkit-scrollbar-thumb { background: var(--sv-border, #333); border-radius: 2px; }

      .option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        cursor: pointer;
        border-radius: 10px;
        transition: background 0.1s;
        touch-action: manipulation;
      }
      .option:hover { background: var(--sv-bg-surface, #16161E); }
      .option:active { background: var(--sv-bg-elevated, #1E1E2A); }
      .option.active { background: color-mix(in srgb, var(--sv-accent, #4a9eff) 14%, transparent); }

      .opt-icon { color: var(--sv-text-secondary, #888); flex-shrink: 0; }
      .opt-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .opt-name { font-size: 15px; color: var(--sv-text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-eid  { font-size: 11px; color: var(--sv-text-secondary, #666); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-val  { font-size: 13px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; white-space: nowrap; }

      .option.pinned {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 8%, transparent);
      }
      .option.pinned:hover {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 16%, transparent);
      }

      .pinned-badge {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--sv-accent, #4a9eff);
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 18%, transparent);
        padding: 3px 7px;
        border-radius: 5px;
        flex-shrink: 0;
      }

      .pinned-divider {
        height: 1px;
        background: var(--sv-border, rgba(255,255,255,0.08));
        margin: 6px 4px;
      }

      .no-results {
        padding: 24px 16px;
        text-align: center;
        color: var(--sv-text-secondary, #888);
        font-size: 14px;
      }
    `;
  }
}

customElements.define("smartvanio-entity-picker", SmartVanEntityPicker);
