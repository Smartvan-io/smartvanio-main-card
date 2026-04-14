import {
  LitElement,
  html,
  css,
} from "lit";
import { hexToRgb, rgbToHex, sharedTileStyles } from "../smartvanio-shared.js";
import "./smartvanio-select.js";
import "./smartvanio-entity-picker.js";

class VanCtlModalScene extends LitElement {
  static get properties() {
    return {
      hass:           { type: Object },
      editingScene:   { type: String, attribute: "editing-scene" },  // entity_id | "new"
      sceneEditName:  { type: String, attribute: "scene-edit-name" },
      sceneEditLights:  { type: Array },
      sceneEditSaving:  { type: Boolean, attribute: "scene-edit-saving" },
      deviceId:       { type: String, attribute: "device-id" },
      lightOptions:   { type: Array },   // grouped options for add-light dropdown
      allScenes:      { type: Array },
    };
  }

  constructor() {
    super();
    this.sceneEditLights = [];
    this.lightOptions = [];
    this.allScenes = [];
  }

  _entityLabel(eid) {
    const override = this.hass?.entities?.[eid]?.name;
    if (override) return override;
    const friendly = this.hass?.states[eid]?.attributes?.friendly_name ?? "";
    const haDeviceId = this.hass?.entities?.[eid]?.device_id;
    const dev = haDeviceId ? this.hass?.devices?.[haDeviceId] : null;
    const devName = dev?.name_by_user ?? dev?.name ?? "";
    return devName && friendly.startsWith(devName + " ")
      ? friendly.slice(devName.length + 1)
      : friendly || eid.split(".").pop();
  }

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this.editingScene) return html``;
    const isNew = this.editingScene === "new";

    const usedEids = new Set((this.sceneEditLights ?? []).map((l) => l.entity_id));
    const hasAvailable = this.hass ? Object.keys(this.hass.states)
      .some((eid) => eid.startsWith("light.") && !usedEids.has(eid)) : false;

    return html`
      <div
        class="modal-overlay"
        @click=${(e) => { if (e.target === e.currentTarget) this._emit("smartvanio-modal-close"); }}
      >
        <div class="modal">
          <div class="modal-header">
            <span>${isNew ? "New Scene" : "Edit Scene"}</span>
            <button class="modal-close" @click=${() => this._emit("smartvanio-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="modal-body">
            <!-- Name -->
            <div class="modal-section">
              <label class="modal-label">Scene Name</label>
              <input
                class="modal-input"
                type="text"
                placeholder="e.g. Evening Glow"
                .value=${this.sceneEditName ?? ""}
                @input=${(e) => this._emit("smartvanio-update-scene-name", { value: e.target.value })}
              />
            </div>

            <!-- Lights -->
            <div class="modal-section">
              <div class="modal-section-header">
                <span class="modal-label">Lights</span>
                <button
                  class="add-row-btn"
                  title="Snapshot current HA state into each light"
                  @click=${() => this._emit("smartvanio-capture-scene-state")}
                >
                  <ha-icon icon="mdi:camera"></ha-icon> Capture
                </button>
              </div>

              <!-- Add-light picker -->
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${""}
                .domains=${["light"]}
                .excludeEntities=${[...usedEids]}
                placeholder=${hasAvailable ? "+ Add light…" : "All lights added"}
                @smartvanio-change=${(e) => { if (e.detail.value) this._emit("smartvanio-add-scene-light", { entity_id: e.detail.value }); }}
              ></smartvanio-entity-picker>

              <!-- Light list -->
              ${!(this.sceneEditLights ?? []).length
                ? html`<div class="no-automations">No lights added yet.</div>`
                : ""}
              ${(this.sceneEditLights ?? []).map((light) => {
                const isOn = (light.state ?? "ON").toUpperCase() === "ON";
                const [r, g, b] = light.rgb_color ?? [255, 255, 255];
                const bri = Math.round(((light.brightness ?? 255) / 255) * 100);
                const stateObj = this.hass?.states[light.entity_id];
                const supRgb = stateObj?.attributes?.supported_color_modes?.includes("rgb") ?? false;
                const effectList = stateObj?.attributes?.effect_list ?? [];
                const hasEffects = effectList.length > 0;
                const currentEffect = light.effect ?? "";
                const colorHex = rgbToHex(r, g, b);
                const sliderColor = isOn ? `rgb(${r},${g},${b})` : "rgba(128,128,128,0.4)";
                const sliderBg = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${bri}%, var(--slider-track,#e0e0e0) ${bri}%, var(--slider-track,#e0e0e0) 100%)`;
                const label = this._entityLabel(light.entity_id);

                return html`
                  <div class="scene-light-card">
                    <div class="scene-light-row">
                      <span class="scene-light-name">${label}</span>
                      <button
                        class="scene-state-btn ${isOn ? "on" : ""}"
                        @click=${() => this._emit("smartvanio-update-scene-light", {
                          entity_id: light.entity_id,
                          field: "state",
                          value: isOn ? "OFF" : "ON",
                        })}
                      >
                        ${isOn ? "On" : "Off"}
                      </button>
                      <button
                        class="delete-row-btn"
                        @click=${() => this._emit("smartvanio-remove-scene-light", { entity_id: light.entity_id })}
                      >
                        <ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    </div>
                    <div class="scene-light-controls">
                      ${isOn ? html`
                        <input
                          type="range"
                          class="br-slider scene-light-bri"
                          min="1"
                          max="100"
                          .value=${String(bri)}
                          style="--sc:rgb(${r},${g},${b}); background:${sliderBg}"
                          @input=${(e) => {
                            const pct = e.target.value;
                            const c = `rgb(${r},${g},${b})`;
                            e.target.style.background = `linear-gradient(to right,${c} 0%,${c} ${pct}%,var(--slider-track,#e0e0e0) ${pct}%,var(--slider-track,#e0e0e0) 100%)`;
                          }}
                          @change=${(e) => this._emit("smartvanio-update-scene-light", {
                            entity_id: light.entity_id,
                            field: "brightness",
                            value: Math.round((+e.target.value / 100) * 255),
                          })}
                        />
                        ${supRgb && !currentEffect ? html`
                          <input
                            type="color"
                            class="seg-color-input scene-light-color"
                            .value=${colorHex}
                            @input=${(e) => {
                              const [cr, cg, cb] = hexToRgb(e.target.value);
                              this._emit("smartvanio-update-scene-light", {
                                entity_id: light.entity_id,
                                field: "rgb_color",
                                value: [cr, cg, cb],
                              });
                            }}
                          />
                        ` : ""}
                      ` : ""}
                      <smartvanio-select
                        .value=${currentEffect}
                        ?disabled=${!hasEffects}
                        .options=${hasEffects ? [
                          { value: "", label: "No effect" },
                          ...effectList.map(e => ({ value: e, label: e })),
                        ] : [{ value: "", label: "No effects" }]}
                        @smartvanio-change=${(e) => this._emit("smartvanio-update-scene-light", {
                          entity_id: light.entity_id,
                          field: "effect",
                          value: e.detail.value || null,
                        })}
                      ></smartvanio-select>
                    </div>
                  </div>
                `;
              })}
            </div>
          </div>

          <div class="modal-footer">
            ${!isNew
              ? html`
                  <button class="modal-btn delete" @click=${() => this._emit("smartvanio-delete-scene")}>
                    Delete
                  </button>
                `
              : ""}
            <button class="modal-btn cancel" @click=${() => this._emit("smartvanio-modal-close")}>
              Cancel
            </button>
            <button
              class="modal-btn save"
              ?disabled=${this.sceneEditSaving}
              @click=${() => this._emit("smartvanio-save-scene")}
            >
              ${this.sceneEditSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host { display: block; }

        /* ── Modal overlay ──── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal {
          background: var(--card-background-color, #fff);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
          flex-shrink: 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-close:hover {
          color: var(--primary-text-color);
        }
        .modal-close ha-icon {
          --mdc-icon-size: 20px;
        }

        .modal-body {
          padding: 18px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--secondary-text-color);
        }

        .modal-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .modal-input:focus {
          border-color: var(--primary-color);
        }

        .no-automations {
          font-size: 13px;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 8px 0;
        }

        .add-row-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid var(--primary-color, #03a9f4);
          border-radius: 6px;
          color: var(--primary-color);
          font-size: 13px;
          font-weight: 500;
          padding: 4px 10px;
          cursor: pointer;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .add-row-btn:hover {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }
        .add-row-btn ha-icon {
          --mdc-icon-size: 16px;
        }

        .delete-row-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .delete-row-btn:hover {
          color: var(--error-color, #f44336);
          background: rgba(244, 67, 54, 0.08);
        }
        .delete-row-btn ha-icon {
          --mdc-icon-size: 18px;
        }

        /* ── Scene light cards ──── */
        .scene-light-card {
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--secondary-background-color, rgba(255,255,255,0.04));
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .scene-light-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
        }
        .scene-light-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .scene-light-controls smartvanio-select {
          flex: 1;
          min-width: 120px;
        }

        .scene-light-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .scene-state-btn {
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--secondary-text-color);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .scene-state-btn.on {
          background: color-mix(in srgb, var(--primary-color) 15%, transparent);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .scene-light-bri {
          flex: 1;
          min-width: 60px;
        }

        .scene-light-color {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .seg-color-input {
          width: 36px;
          height: 36px;
          padding: 2px;
          border: none;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
        }

        /* ── Modal footer ──── */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px;
          border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          flex-shrink: 0;
        }

        .modal-btn {
          padding: 9px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-btn.cancel {
          background: var(--secondary-background-color, #f0f0f0);
          color: var(--primary-text-color);
        }
        .modal-btn.cancel:hover {
          background: var(--divider-color);
        }
        .modal-btn.save {
          background: var(--primary-color, #03a9f4);
          color: white;
        }
        .modal-btn.save:hover {
          opacity: 0.88;
        }
        .modal-btn[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modal-btn.delete {
          background: none;
          border: 1px solid var(--error-color, #f44336);
          color: var(--error-color, #f44336);
          margin-right: auto;
        }
        .modal-btn.delete:hover {
          background: rgba(244, 67, 54, 0.08);
        }
      `,
    ];
  }
}

customElements.define("smartvanio-modal-scene", VanCtlModalScene);
