import {
  LitElement,
  html,
  css,
} from "lit";
import { tankDef, sharedTileStyles } from "../smartvanio-shared.js";

class VanCtlTileTank extends LitElement {
  static get properties() {
    return {
      hass:     { type: Object },
      entityId: { type: String, attribute: "entity-id" },
      editMode: { type: Boolean, attribute: "edit-mode" },
      label:    { type: String },
    };
  }

  _emitEdit() {
    this.dispatchEvent(new CustomEvent("smartvanio-edit-entity", {
      detail: { entity_id: this.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this.hass || !this.entityId) return html``;
    const entity_id = this.entityId;
    const displayLabel = this.label ||
      this.hass.entities?.[entity_id]?.name ||
      this.hass.states[entity_id]?.attributes?.friendly_name ||
      entity_id.split(".").pop();

    const def = tankDef(entity_id, displayLabel);
    const state = this.hass.states[entity_id];
    const raw = parseFloat(state?.state ?? "0");
    const value = isNaN(raw) ? 0 : raw;
    const unit = state?.attributes?.unit_of_measurement ?? "%";
    const warn =
      (def.warnBelow !== undefined && value <= def.warnBelow) ||
      (def.warnAbove !== undefined && value >= def.warnAbove);
    const fill = warn ? "var(--error-color, #f44336)" : def.color;

    return html`
      <div
        class="tank ${this.editMode ? "editable" : ""}"
        data-eid="${entity_id}"
        @click=${this.editMode ? () => this._emitEdit() : undefined}
      >
        <div class="tank-top">
          <ha-icon icon="${def.icon}" style="color:${fill}"></ha-icon>
          <span class="tank-label">${displayLabel}</span>
          ${this.editMode
            ? html`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`
            : html`<span class="tank-pct ${warn ? "warn" : ""}">${Math.round(value)}${unit}</span>`}
        </div>
        <div class="tank-track">
          <div
            class="tank-fill"
            style="width:${Math.min(100, Math.max(0, value))}%; background:${fill}"
          ></div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host { display: block; }

        .tank {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 12px 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tank-top {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tank-top ha-icon {
          --mdc-icon-size: 18px;
          flex-shrink: 0;
        }

        .tank-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }

        .tank-pct {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary-text-color);
        }

        .tank-pct.warn {
          color: var(--error-color, #f44336);
        }

        .tank-track {
          height: 8px;
          border-radius: 4px;
          background: var(--slider-track, var(--secondary-background-color, #e0e0e0));
          overflow: hidden;
        }

        .tank-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
      `,
    ];
  }
}

customElements.define("smartvanio-tile-tank", VanCtlTileTank);
