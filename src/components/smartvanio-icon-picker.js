import { LitElement, html, css } from "lit";

/**
 * Searchable icon picker with preview.
 *
 * Usage:
 *   <smartvanio-icon-picker
 *     .value=${"mdi:thermometer"}
 *     placeholder="Choose icon"
 *     @smartvanio-change=${(e) => handler(e.detail.value)}
 *   ></smartvanio-icon-picker>
 */

// Curated list of commonly useful MDI icons
const ICONS = [
  "mdi:thermometer", "mdi:temperature-celsius", "mdi:snowflake-thermometer",
  "mdi:water", "mdi:water-percent", "mdi:water-pump", "mdi:water-thermometer",
  "mdi:gauge", "mdi:gauge-low", "mdi:gauge-full", "mdi:speedometer",
  "mdi:battery", "mdi:battery-50", "mdi:battery-charging", "mdi:battery-heart",
  "mdi:lightning-bolt", "mdi:flash", "mdi:power-plug", "mdi:power",
  "mdi:solar-power", "mdi:solar-panel", "mdi:white-balance-sunny", "mdi:weather-sunny",
  "mdi:current-ac", "mdi:current-dc", "mdi:sine-wave",
  "mdi:meter-electric", "mdi:meter-gas", "mdi:counter",
  "mdi:fuel", "mdi:gas-station", "mdi:propane-tank",
  "mdi:lightbulb", "mdi:lightbulb-outline", "mdi:lightbulb-group",
  "mdi:led-strip", "mdi:led-strip-variant", "mdi:ceiling-light",
  "mdi:lamp", "mdi:floor-lamp", "mdi:desk-lamp", "mdi:wall-sconce",
  "mdi:toggle-switch", "mdi:toggle-switch-off", "mdi:electric-switch-closed",
  "mdi:fan", "mdi:fan-off", "mdi:hvac",
  "mdi:air-conditioner", "mdi:snowflake", "mdi:fire",
  "mdi:radiator", "mdi:heat-wave", "mdi:coolant-temperature",
  "mdi:home", "mdi:home-thermometer", "mdi:home-lightning-bolt",
  "mdi:car", "mdi:car-battery", "mdi:car-electric",
  "mdi:rv-truck", "mdi:caravan", "mdi:bus",
  "mdi:signal", "mdi:wifi", "mdi:bluetooth",
  "mdi:motion-sensor", "mdi:door-open", "mdi:door-closed",
  "mdi:window-open", "mdi:window-closed",
  "mdi:lock", "mdi:lock-open", "mdi:shield",
  "mdi:camera", "mdi:cctv", "mdi:eye",
  "mdi:clock", "mdi:timer", "mdi:timer-sand", "mdi:calendar",
  "mdi:bell", "mdi:alert", "mdi:alert-circle",
  "mdi:check-circle", "mdi:close-circle", "mdi:information",
  "mdi:map-marker", "mdi:compass", "mdi:navigation",
  "mdi:speedometer", "mdi:chart-line", "mdi:chart-bar",
  "mdi:pulse", "mdi:heart-pulse", "mdi:wave",
  "mdi:volume-high", "mdi:volume-off", "mdi:speaker",
  "mdi:music", "mdi:radio", "mdi:television",
  "mdi:fridge", "mdi:stove", "mdi:microwave",
  "mdi:washing-machine", "mdi:dishwasher",
  "mdi:shower", "mdi:toilet", "mdi:faucet",
  "mdi:trash-can", "mdi:recycle", "mdi:delete-empty",
  "mdi:leaf", "mdi:flower", "mdi:tree",
  "mdi:cloud", "mdi:weather-cloudy", "mdi:weather-rainy",
  "mdi:umbrella", "mdi:weather-windy",
  "mdi:earth", "mdi:terrain", "mdi:waves",
  "mdi:rope", "mdi:hook", "mdi:wrench", "mdi:hammer",
  "mdi:cog", "mdi:tune", "mdi:tools",
  "mdi:arrow-up", "mdi:arrow-down", "mdi:arrow-left", "mdi:arrow-right",
  "mdi:swap-vertical", "mdi:swap-horizontal",
  "mdi:upload", "mdi:download", "mdi:sync",
  "mdi:plus", "mdi:minus", "mdi:close",
  "mdi:magnify", "mdi:filter",
  "mdi:star", "mdi:heart", "mdi:thumb-up",
  "mdi:account", "mdi:account-group",
  "mdi:help-circle", "mdi:puzzle",
  "mdi:tag", "mdi:label", "mdi:bookmark",
  "mdi:flag", "mdi:pin",
  "mdi:link", "mdi:attachment",
  "mdi:folder", "mdi:file", "mdi:file-document",
  "mdi:image", "mdi:video", "mdi:microphone",
  "mdi:printer", "mdi:cellphone", "mdi:laptop",
  "mdi:server", "mdi:database", "mdi:chip",
  "mdi:usb", "mdi:ethernet", "mdi:access-point",
  "mdi:smoke-detector", "mdi:fire-extinguisher",
  "mdi:medical-bag", "mdi:pill",
  "mdi:bed", "mdi:sofa", "mdi:table-furniture",
  "mdi:scale-bathroom", "mdi:weight",
  "mdi:ruler", "mdi:tape-measure",
  "mdi:inclinometer", "mdi:angle-acute",
  "mdi:gas-cylinder", "mdi:barrel",
];

class SmartVanIconPicker extends LitElement {
  static get properties() {
    return {
      value: { type: String },
      placeholder: { type: String },
      _open: { type: Boolean },
      _search: { type: String },
    };
  }

  constructor() {
    super();
    this.value = "";
    this.placeholder = "Choose icon";
    this._open = false;
    this._search = "";
    this._onDocClick = (e) => {
      if (!this._open) return;
      if (!e.composedPath().includes(this)) this._open = false;
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

  _filtered() {
    if (!this._search) return ICONS;
    const q = this._search.toLowerCase().replace("mdi:", "");
    return ICONS.filter((ic) => ic.toLowerCase().includes(q));
  }

  _select(icon) {
    this._open = false;
    this._search = "";
    this.dispatchEvent(
      new CustomEvent("smartvanio-change", {
        detail: { value: icon },
        bubbles: true,
        composed: true,
      })
    );
  }

  _clear(e) {
    e.stopPropagation();
    this._select("");
  }

  _shortName(icon) {
    return icon.replace("mdi:", "").replace(/-/g, " ");
  }

  render() {
    return html`
      <div class="picker">
        <div class="selected" @click=${() => { this._open = !this._open; this._search = ""; }}>
          ${this.value ? html`
            <ha-icon class="sel-icon" icon="${this.value}" style="--mdc-icon-size:18px"></ha-icon>
            <span class="sel-name">${this._shortName(this.value)}</span>
            <button class="sel-clear" @click=${this._clear}>&times;</button>
          ` : html`
            <span class="sel-placeholder">${this.placeholder}</span>
          `}
          <span class="chevron"></span>
        </div>
        ${this._open ? html`
          <div class="dropdown">
            <input class="search" type="text" placeholder="Search icons..."
              .value=${this._search}
              @input=${(e) => { this._search = e.target.value; }}
              @click=${(e) => e.stopPropagation()} />
            <div class="grid">
              ${this._filtered().map((ic) => html`
                <div class="icon-cell ${ic === this.value ? 'active' : ''}"
                     title="${this._shortName(ic)}"
                     @click=${() => this._select(ic)}>
                  <ha-icon icon="${ic}" style="--mdc-icon-size:22px"></ha-icon>
                  <span class="icon-label">${this._shortName(ic)}</span>
                </div>
              `)}
              ${this._filtered().length === 0 ? html`
                <div class="no-results">
                  No matches
                  ${this._search.startsWith("mdi:") ? html`
                    <button class="use-custom" @click=${() => this._select(this._search)}>
                      Use "${this._search}"
                    </button>
                  ` : ""}
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; width: 100%; }

      .picker { position: relative; width: 100%; }

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

      .sel-icon { color: var(--sv-accent, #4a9eff); flex-shrink: 0; }
      .sel-name { flex: 1; font-size: 13px; color: var(--sv-text-primary, #fff); }
      .sel-placeholder { flex: 1; font-size: 13px; color: var(--sv-text-secondary, #888); }
      .sel-clear {
        background: none; border: none; color: var(--sv-text-secondary, #888);
        cursor: pointer; font-size: 14px; padding: 2px 4px; line-height: 1;
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
        position: absolute;
        top: calc(100% + 4px);
        left: 0; right: 0;
        z-index: 200;
        background: var(--sv-bg-elevated, #1E1E2A);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        overflow: hidden;
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

      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px;
      }
      .grid::-webkit-scrollbar { width: 4px; }
      .grid::-webkit-scrollbar-thumb { background: var(--sv-border, #333); border-radius: 2px; }

      .icon-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 4px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.1s;
        color: var(--sv-text-secondary, #888);
      }
      .icon-cell:hover {
        background: var(--sv-bg-surface, #16161E);
        color: var(--sv-text-primary, #fff);
      }
      .icon-cell.active {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 15%, transparent);
        color: var(--sv-accent, #4a9eff);
      }

      .icon-label {
        font-size: 9px;
        text-align: center;
        line-height: 1.1;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .no-results {
        grid-column: 1 / -1;
        padding: 16px;
        text-align: center;
        color: var(--sv-text-secondary, #888);
        font-size: 13px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
      }

      .use-custom {
        background: var(--sv-bg-surface, #16161E);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-accent, #4a9eff);
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
      }
      .use-custom:hover { border-color: var(--sv-accent); }
    `;
  }
}

customElements.define("smartvanio-icon-picker", SmartVanIconPicker);
