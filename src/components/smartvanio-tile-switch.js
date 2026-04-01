import {
  LitElement,
  html,
  css,
} from "lit";
import { sharedTileStyles } from "../smartvanio-shared.js";

class VanCtlTileSwitch extends LitElement {
  static get properties() {
    return {
      hass:     { type: Object },
      entityId: { type: String, attribute: "entity-id" },
      editMode: { type: Boolean, attribute: "edit-mode" },
      icon:     { type: String },
      label:    { type: String },
    };
  }

  constructor() {
    super();
    this.icon = "mdi:electric-switch";
  }

  _emitEdit() {
    this.dispatchEvent(new CustomEvent("smartvanio-edit-entity", {
      detail: { entity_id: this.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _toggle() {
    const isOn = this.hass.states[this.entityId]?.state === "on";
    this.hass.callService("switch", isOn ? "turn_off" : "turn_on", {
      entity_id: this.entityId,
    });
  }

  render() {
    if (!this.hass || !this.entityId) return html``;
    const isOn = this.hass.states[this.entityId]?.state === "on";
    const label = this.label ||
      this.hass.entities?.[this.entityId]?.name ||
      this.hass.states[this.entityId]?.attributes?.friendly_name ||
      this.entityId.split(".").pop();

    return html`
      <div
        class="switch-tile ${isOn ? "on" : ""} ${this.editMode ? "editable" : ""}"
        data-eid="${this.entityId}"
        @click=${() => this.editMode ? this._emitEdit() : this._toggle()}
      >
        <ha-icon icon="${this.icon}" class="sw-icon"></ha-icon>
        <span class="sw-label">${label}</span>
        ${this.editMode
          ? html`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`
          : html`<div class="toggle ${isOn ? "on" : ""}">
              <div class="toggle-dot"></div>
            </div>`}
      </div>
    `;
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host { display: block; }

        .switch-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.2s;
        }

        .switch-tile.on {
          border-color: var(--primary-color, #03a9f4);
        }

        .sw-icon {
          --mdc-icon-size: 22px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .switch-tile.on .sw-icon {
          color: var(--primary-color, #03a9f4);
        }

        .sw-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }
      `,
    ];
  }
}

customElements.define("smartvanio-tile-switch", VanCtlTileSwitch);
