import {
  LitElement,
  html,
  css,
} from "lit";
import { formatRelativeTime, sharedTileStyles } from "../smartvanio-shared.js";

class VanCtlTileScene extends LitElement {
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

  _emitOpenSceneModal() {
    this.dispatchEvent(new CustomEvent("smartvanio-open-scene-modal", {
      detail: { entity_id: this.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this.hass || !this.entityId) return html``;
    const entity_id = this.entityId;
    const state = this.hass.states[entity_id];
    const icon = state?.attributes?.icon ?? "mdi:palette";
    const lightCount = state?.attributes?.light_count ?? 0;
    const lastActivated = state?.state;
    const neverActivated =
      !lastActivated ||
      lastActivated === "unknown" ||
      lastActivated === "unavailable";
    const timeLabel = neverActivated
      ? "Never activated"
      : formatRelativeTime(lastActivated);
    const label = this.label ||
      this.hass.entities?.[entity_id]?.name ||
      state?.attributes?.friendly_name ||
      entity_id.split(".").pop();

    return html`
      <div
        class="scene-tile ${this.editMode ? "editable" : ""}"
        @click=${() =>
          this.editMode
            ? this._emitOpenSceneModal()
            : this.hass.callService("scene", "turn_on", { entity_id })}
      >
        <div class="scene-icon-wrap">
          <ha-icon icon="${icon}"></ha-icon>
        </div>
        <div class="scene-info">
          <div class="scene-name">${label}</div>
          <div class="scene-meta">
            <span>${lightCount} light${lightCount !== 1 ? "s" : ""}</span>
            <span class="scene-dot">·</span>
            <span>${timeLabel}</span>
          </div>
        </div>
        ${this.editMode
          ? html`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`
          : ""}
      </div>
    `;
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host { display: block; }

        .scene-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.2s, background 0.1s;
        }
        .scene-tile:active:not(.editable) {
          background: var(--secondary-background-color);
        }

        .scene-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--primary-color) 12%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .scene-icon-wrap ha-icon {
          --mdc-icon-size: 22px;
          color: var(--primary-color);
        }

        .scene-info {
          flex: 1;
          min-width: 0;
        }
        .scene-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .scene-meta {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 2px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .scene-dot {
          opacity: 0.5;
        }
      `,
    ];
  }
}

customElements.define("smartvanio-tile-scene", VanCtlTileScene);
