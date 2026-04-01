import {
  LitElement,
  html,
  css,
} from "lit";
import { sharedTileStyles } from "../smartvanio-shared.js";

class VanCtlTileBinarySensor extends LitElement {
  static get properties() {
    return {
      hass:     { type: Object },
      entityId: { type: String, attribute: "entity-id" },
      editMode: { type: Boolean, attribute: "edit-mode" },
      variant:  { type: String }, // "door" | "button"
      deviceId: { type: String, attribute: "device-id" },
      channel:  { type: String },
    };
  }

  constructor() {
    super();
    this.variant = "door";
  }

  _emitEdit() {
    this.dispatchEvent(new CustomEvent("smartvanio-edit-entity", {
      detail: { entity_id: this.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _pressButton() {
    const topic = `smartvanio/${this.deviceId}/binary_sensor/${this.channel}/state`;
    this.hass.callService("mqtt", "publish", {
      topic,
      payload: '{"state":"ON"}',
    });
    setTimeout(() => {
      this.hass.callService("mqtt", "publish", {
        topic,
        payload: '{"state":"OFF"}',
      });
    }, 150);
  }

  _renderDoor() {
    const entity_id = this.entityId;
    const isOpen = this.hass.states[entity_id]?.state === "on";
    const label = this.hass.entities?.[entity_id]?.name ||
      this.hass.states[entity_id]?.attributes?.friendly_name ||
      entity_id.split(".").pop();

    return html`
      <div
        class="sensor-tile ${isOpen ? "active" : ""} ${this.editMode ? "editable" : ""}"
        data-eid="${entity_id}"
        @click=${this.editMode ? () => this._emitEdit() : undefined}
      >
        <ha-icon icon="${isOpen ? "mdi:door-open" : "mdi:door-closed"}"></ha-icon>
        <span class="sensor-label">${label}</span>
        ${this.editMode
          ? html`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`
          : html`<span class="sensor-state">${isOpen ? "Open" : "Closed"}</span>`}
      </div>
    `;
  }

  _renderButton() {
    const entity_id = this.entityId;
    const pressed = this.hass.states[entity_id]?.state === "on";
    const label = this.hass.entities?.[entity_id]?.name ||
      this.hass.states[entity_id]?.attributes?.friendly_name ||
      entity_id.split(".").pop();

    return html`
      <div
        class="btn-tile ${pressed ? "active" : ""} ${this.editMode ? "editable" : ""}"
        data-eid="${entity_id}"
        @click=${() => {
          this.editMode ? this._emitEdit() : this._pressButton();
        }}
      >
        ${this.editMode
          ? html`<ha-icon class="btn-edit-icon" icon="mdi:cog-outline"></ha-icon>`
          : html`<ha-icon icon="${pressed ? "mdi:circle-slice-8" : "mdi:circle-outline"}"></ha-icon>`}
        <span>${label}</span>
        <span class="btn-state">${this.editMode ? "Edit" : pressed ? "Pressed" : "—"}</span>
      </div>
    `;
  }

  render() {
    if (!this.hass || !this.entityId) return html``;
    return this.variant === "button" ? this._renderButton() : this._renderDoor();
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host { display: block; }

        /* ── Door / sensor tile ──── */
        .sensor-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: border-color 0.2s;
        }

        .sensor-tile ha-icon {
          --mdc-icon-size: 22px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .sensor-tile.active {
          border-color: var(--warning-color, #ff9800);
        }
        .sensor-tile.active ha-icon {
          color: var(--warning-color, #ff9800);
        }

        .sensor-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }

        .sensor-state {
          font-size: 12px;
          color: var(--secondary-text-color);
          font-weight: 500;
        }

        .sensor-tile.active .sensor-state {
          color: var(--warning-color, #ff9800);
        }

        /* ── Button tile ──── */
        .btn-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          text-align: center;
          transition: border-color 0.2s, background 0.1s;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-tile:active:not(.editable) {
          background: var(--secondary-background-color);
        }

        .btn-tile ha-icon {
          --mdc-icon-size: 24px;
          color: var(--secondary-text-color);
          transition: color 0.15s;
        }

        .btn-tile.active {
          border-color: var(--primary-color, #03a9f4);
        }
        .btn-tile.active ha-icon {
          color: var(--primary-color, #03a9f4);
        }

        .btn-state {
          font-size: 11px;
          color: var(--secondary-text-color);
        }

        .btn-tile.active .btn-state {
          color: var(--primary-color, #03a9f4);
        }

        .btn-edit-icon {
          --mdc-icon-size: 24px;
          color: var(--primary-color);
        }
      `,
    ];
  }
}

customElements.define("smartvanio-tile-binary-sensor", VanCtlTileBinarySensor);
