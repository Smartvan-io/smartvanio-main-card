import { LitElement, html, css } from "lit";

/**
 * Rich entity picker with search, icons, and live values.
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
    this._onDocClick = (e) => {
      if (!this._open) return;
      const path = e.composedPath();
      if (!path.includes(this)) this._open = false;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._onDocClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._onDocClick, true);
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

  _toggleOpen() {
    this._open = !this._open;
    this._search = "";
    if (this._open) {
      requestAnimationFrame(() => this._positionDropdown());
    }
  }

  _positionDropdown() {
    const sel = this.shadowRoot?.querySelector('.selected');
    const dd = this.shadowRoot?.querySelector('.dropdown');
    if (!sel || !dd) return;
    const rect = sel.getBoundingClientRect();
    dd.style.left = `${rect.left}px`;
    dd.style.width = `${rect.width}px`;
    // Check if dropdown fits below, otherwise open above
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const ddHeight = Math.min(300, dd.scrollHeight);
    if (spaceBelow >= ddHeight || spaceBelow >= rect.top) {
      dd.style.top = `${rect.bottom + 4}px`;
      dd.style.bottom = 'auto';
      dd.style.maxHeight = `${Math.min(300, spaceBelow)}px`;
    } else {
      dd.style.bottom = `${window.innerHeight - rect.top + 4}px`;
      dd.style.top = 'auto';
      dd.style.maxHeight = `${Math.min(300, rect.top - 8)}px`;
    }
  }

  render() {
    const selected = this.value ? this.hass?.states?.[this.value] : null;
    const selName = selected?.attributes?.friendly_name ?? (this.value ? this.value.split(".").pop().replace(/_/g, " ") : "");
    const selIcon = selected?.attributes?.icon || (this.value ? this._domainIcon(this.value) : "");
    const selVal = selected ? this._formatVal(selected.state, selected.attributes?.unit_of_measurement) : "";

    return html`
      <div class="picker">
        <div class="selected" @click=${() => this._toggleOpen()}>
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
        ${this._open ? html`
          <div class="dropdown">
            <input class="search" type="text" placeholder="Search entities..."
              .value=${this._search}
              @input=${(e) => { this._search = e.target.value; }}
              @click=${(e) => e.stopPropagation()} />
            <div class="list">
              ${this.pinnedEntity && this.hass?.states?.[this.pinnedEntity] ? (() => {
                const ps = this.hass.states[this.pinnedEntity];
                const pn = ps.attributes?.friendly_name ?? this.pinnedEntity.split(".").pop().replace(/_/g, " ");
                const pi = ps.attributes?.icon || this._domainIcon(this.pinnedEntity);
                return html`
                  <div class="option pinned ${this.pinnedEntity === this.value ? 'active' : ''}"
                       @click=${() => this._select(this.pinnedEntity)}>
                    <ha-icon class="opt-icon" icon="${pi}" style="--mdc-icon-size:18px"></ha-icon>
                    <div class="opt-info">
                      <span class="opt-name">${pn}</span>
                      <span class="opt-eid">${this.pinnedEntity}</span>
                    </div>
                    <span class="pinned-badge">this entity</span>
                  </div>
                  <div class="pinned-divider"></div>
                `;
              })() : ""}
              ${this._filtered().filter(e => e.eid !== this.pinnedEntity).map((e) => html`
                <div class="option ${e.eid === this.value ? 'active' : ''}"
                     @click=${() => this._select(e.eid)}>
                  <ha-icon class="opt-icon" icon="${e.icon}" style="--mdc-icon-size:18px"></ha-icon>
                  <div class="opt-info">
                    <span class="opt-name">${e.name}</span>
                    <span class="opt-eid">${e.eid}</span>
                  </div>
                  <span class="opt-val">${this._formatVal(e.val, e.unit)}</span>
                </div>
              `)}
              ${this._filtered().filter(e => e.eid !== this.pinnedEntity).length === 0 && !this.pinnedEntity ? html`
                <div class="no-results">No entities found</div>
              ` : ""}
            </div>
          </div>
        ` : ""}
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
      .sel-val { font-size: 12px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; }
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

      .dropdown {
        position: fixed;
        z-index: 10000;
        background: var(--sv-bg-elevated, #1E1E2A);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .search {
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-bottom: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        background: transparent;
        color: var(--sv-text-primary, #fff);
        font-size: 13px;
        font-family: inherit;
        outline: none;
        box-sizing: border-box;
      }
      .search::placeholder { color: var(--sv-text-secondary, #888); }

      .list {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }
      .list::-webkit-scrollbar { width: 4px; }
      .list::-webkit-scrollbar-thumb { background: var(--sv-border, #333); border-radius: 2px; }

      .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background 0.1s;
      }
      .option:hover { background: var(--sv-bg-surface, #16161E); }
      .option.active { background: color-mix(in srgb, var(--sv-accent, #4a9eff) 12%, transparent); }

      .opt-icon { color: var(--sv-text-secondary, #888); flex-shrink: 0; }
      .opt-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
      .opt-name { font-size: 13px; color: var(--sv-text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-eid { font-size: 10px; color: var(--sv-text-secondary, #666); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-val { font-size: 12px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; white-space: nowrap; }

      .option.pinned {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 8%, transparent);
      }
      .option.pinned:hover {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 15%, transparent);
      }

      .pinned-badge {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--sv-accent, #4a9eff);
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 15%, transparent);
        padding: 2px 6px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .pinned-divider {
        height: 1px;
        background: var(--sv-border, rgba(255,255,255,0.08));
        margin: 2px 0;
      }

      .no-results {
        padding: 16px;
        text-align: center;
        color: var(--sv-text-secondary, #888);
        font-size: 13px;
      }
    `;
  }
}

customElements.define("smartvanio-entity-picker", SmartVanEntityPicker);
