import {
  LitElement,
  html,
  css,
} from "lit";
import { rgbToHex, sharedTileStyles } from "../smartvanio-shared.js";
import "./smartvanio-select.js";

class VanCtlModalEdit extends LitElement {
  static get properties() {
    return {
      hass:             { type: Object },
      entityId:         { type: String, attribute: "entity-id" },
      deviceId:         { type: String, attribute: "device-id" },
      editName:         { type: String, attribute: "edit-name" },
      editRows:         { type: Array },
      editSaving:       { type: Boolean, attribute: "edit-saving" },
      editLoading:      { type: Boolean, attribute: "edit-loading" },
      calPoints:        { type: Array },
      calKind:          { type: String, attribute: "cal-kind" },
      lightSegments:    { type: Array },
      maxLeds:          { type: Number, attribute: "max-leds" },
      expandedSegColor: { type: String, attribute: "expanded-seg-color" },
      saveError:        { type: String, attribute: "save-error" },
      isButton:         { type: Boolean, attribute: "is-button" },
      isTank:           { type: Boolean, attribute: "is-tank" },
      isLight:          { type: Boolean, attribute: "is-light" },
      targetEntities:   { type: Array },
    };
  }

  constructor() {
    super();
    this.editRows = [];
    this.lightSegments = [];
    this.maxLeds = 0;
    this.calPoints = null;
    this.calKind = "linear";
    this.targetEntities = [];
  }

  // ─── Emit helpers ───────────────────────────────────────────────

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  // ─── Calibration section ─────────────────────────────────────────

  _renderCalibrationSection() {
    const voltageId = this.entityId + "_voltage";
    const liveV = parseFloat(this.hass?.states[voltageId]?.state ?? 0);
    const pts = this.calPoints ?? [];
    return html`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">Calibration</span>
          <span class="cal-live">Live: ${liveV.toFixed(3)} V</span>
        </div>
        <div class="cal-header-row">
          <span class="cal-col-hdr">Voltage (V)</span>
          <span class="cal-col-hdr">Level (%)</span>
          <span></span><span></span>
        </div>
        ${pts.map(
          (pt, i) => html`
            <div class="cal-row">
              <input
                type="number"
                class="cal-input"
                min="0"
                max="3.3"
                step="0.001"
                .value=${String(pt[0])}
                @change=${(e) => this._emit("smartvanio-update-cal-point", { index: i, field: 0, value: e.target.value })}
              />
              <input
                type="number"
                class="cal-input"
                min="0"
                max="100"
                step="1"
                .value=${String(pt[1])}
                @change=${(e) => this._emit("smartvanio-update-cal-point", { index: i, field: 1, value: e.target.value })}
              />
              <button
                class="capture-btn"
                title="Capture current voltage"
                @click=${() => this._emit("smartvanio-capture-voltage", { index: i })}
              >
                <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
              </button>
              <button
                class="delete-row-btn"
                @click=${() => this._emit("smartvanio-remove-cal-point", { index: i })}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `,
        )}
        <button class="add-row-btn" @click=${() => this._emit("smartvanio-add-cal-point")}>
          <ha-icon icon="mdi:plus"></ha-icon> Add Point
        </button>
      </div>
      <div class="modal-section">
        <label class="modal-label">Interpolation Type</label>
        <smartvanio-select
          .value=${this.calKind}
          .options=${[
            { value: "linear",    label: "Linear" },
            { value: "cubic",     label: "Cubic" },
            { value: "quadratic", label: "Quadratic" },
            { value: "slinear",   label: "Smooth Linear" },
          ]}
          @smartvanio-change=${(e) => this._emit("smartvanio-update-cal-point", { field: "kind", value: e.detail.value })}
        ></smartvanio-select>
      </div>
    `;
  }

  // ─── Light segments section ──────────────────────────────────────

  _renderLightSegmentsSection() {
    const segs = this.lightSegments ?? [];
    return html`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">LED Strip</span>
        </div>
        <div class="seg-field">
          <span class="seg-field-label">Max LEDs</span>
          <input
            type="number"
            class="cal-input"
            min="1"
            step="1"
            .value=${String(this.maxLeds || "")}
            placeholder="e.g. 60"
            @change=${(e) => this._emit("smartvanio-update-segment", { id: "__maxLeds__", field: "maxLeds", value: Math.max(1, +e.target.value) })}
          />
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">Segments</span>
          <button class="add-row-btn" @click=${() => this._emit("smartvanio-add-segment")}>
            <ha-icon icon="mdi:plus"></ha-icon> Add
          </button>
        </div>
        ${!segs.length
          ? html`<div class="no-automations">No segments — click Add to create one.</div>`
          : ""}
        ${segs.map(
          (seg, i) => html`
            <div class="seg-card">
              <div class="seg-card-top">
                <input
                  type="color"
                  class="seg-color-input"
                  .value=${rgbToHex(seg.r, seg.g, seg.b)}
                  @input=${(e) => this._emit("smartvanio-update-segment", { id: seg.id ?? i, field: "color", value: e.target.value })}
                />
                <input
                  type="text"
                  class="modal-input seg-name-input"
                  .value=${seg.name}
                  placeholder="Name"
                  @input=${(e) => this._emit("smartvanio-update-segment", { id: seg.id ?? i, field: "name", value: e.target.value })}
                />
                <button
                  class="delete-row-btn"
                  @click=${() => this._emit("smartvanio-remove-segment", { id: seg.id ?? i })}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              <div class="seg-card-bottom">
                <div class="seg-field">
                  <span class="seg-field-label">Start</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="0"
                    step="1"
                    .value=${String(seg.start ?? 0)}
                    @change=${(e) => this._emit("smartvanio-update-segment", { id: seg.id ?? i, field: "start", value: Math.max(0, +e.target.value) })}
                  />
                </div>
                <div class="seg-field">
                  <span class="seg-field-label">End</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="0"
                    step="1"
                    .value=${String(seg.end ?? 0)}
                    @change=${(e) => this._emit("smartvanio-update-segment", { id: seg.id ?? i, field: "end", value: Math.max(0, +e.target.value) })}
                  />
                </div>
                <div class="seg-field">
                  <span class="seg-field-label">Brightness</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="1"
                    max="100"
                    .value=${String(seg.brightness)}
                    @change=${(e) => this._emit("smartvanio-update-segment", { id: seg.id ?? i, field: "brightness", value: Math.max(1, Math.min(100, +e.target.value)) })}
                  />
                  <span class="seg-bri-unit">%</span>
                </div>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  // ─── Main render ─────────────────────────────────────────────────

  render() {
    if (!this.entityId) return html``;
    const entity_id = this.entityId;
    const label = this.hass?.entities?.[entity_id]?.name ||
      this.hass?.states[entity_id]?.attributes?.friendly_name ||
      entity_id.split(".").pop();

    return html`
      <div
        class="modal-overlay"
        @click=${(e) => { if (e.target === e.currentTarget) this._emit("smartvanio-modal-close"); }}
      >
        <div class="modal">
          <div class="modal-header">
            <span>Edit ${label}</span>
            <button class="modal-close" @click=${() => this._emit("smartvanio-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="modal-body">
            ${this.editLoading
              ? html`<div class="modal-loading">Loading…</div>`
              : html`
                  <div class="modal-section">
                    <label class="modal-label">Display Name</label>
                    <input
                      class="modal-input"
                      type="text"
                      .value=${this.editName ?? ""}
                      @input=${(e) => this._emit("smartvanio-update-edit-name", { value: e.target.value })}
                    />
                  </div>

                  ${this.isLight ? this._renderLightSegmentsSection() : ""}
                  ${this.isTank ? this._renderCalibrationSection() : ""}
                  ${this.isButton
                    ? html`
                        <div class="modal-section">
                          <div class="modal-section-header">
                            <span class="modal-label">Automations</span>
                            <button class="add-row-btn" @click=${() => this._emit("smartvanio-add-edit-row")}>
                              <ha-icon icon="mdi:plus"></ha-icon> Add
                            </button>
                          </div>
                          ${!(this.editRows ?? []).length
                            ? html`<div class="no-automations">No automations yet — click Add to create one.</div>`
                            : ""}
                          ${(this.editRows ?? []).map(
                            (row, i) => html`
                              <div class="automation-row">
                                <smartvanio-select
                                  .value=${row.gesture}
                                  .options=${[
                                    { value: "press",        label: "Press" },
                                    { value: "double_press", label: "Double Press" },
                                    { value: "hold",         label: "Press & Hold" },
                                  ]}
                                  placeholder="— Gesture —"
                                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "gesture", value: e.detail.value })}
                                ></smartvanio-select>

                                <smartvanio-select
                                  .value=${row.target_entity_id}
                                  .options=${(this.targetEntities ?? []).map((g) => ({
                                    groupLabel: g.label,
                                    options: g.entities.map((ent) => ({
                                      value: ent.entity_id,
                                      label: ent.label,
                                    })),
                                  }))}
                                  placeholder="— Target —"
                                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "target_entity_id", value: e.detail.value })}
                                ></smartvanio-select>

                                <smartvanio-select
                                  .value=${row.action}
                                  .options=${this._actionsForEntity(row.target_entity_id).map((act) => ({
                                    value: act,
                                    label: this._actionLabel(act),
                                  }))}
                                  placeholder="— Action —"
                                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "action", value: e.detail.value })}
                                ></smartvanio-select>

                                <button
                                  class="delete-row-btn"
                                  @click=${() => this._emit("smartvanio-remove-edit-row", { id: i })}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </button>
                              </div>
                            `,
                          )}
                        </div>
                      `
                    : ""}
                `}
          </div>

          ${this.saveError
            ? html`<div class="save-error">${this.saveError}</div>`
            : ""}
          <div class="modal-footer">
            <button class="modal-btn cancel" @click=${() => this._emit("smartvanio-modal-close")}>
              Cancel
            </button>
            <button
              class="modal-btn save"
              ?disabled=${this.editSaving}
              @click=${() => this._emit("smartvanio-save-edit", {
                entity_id: this.entityId,
                name: this.editName,
                rows: this.editRows,
                calPoints: this.calPoints,
                calKind: this.calKind,
                lightSegments: this.lightSegments,
                maxLeds: this.maxLeds,
              })}
            >
              ${this.editSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _actionsForEntity(entity_id) {
    const domain = entity_id?.split(".")?.[0];
    if (domain === "light" || domain === "switch") return ["toggle", "turn_on", "turn_off"];
    if (domain === "scene") return ["turn_on"];
    return ["toggle"];
  }

  _actionLabel(action) {
    if (action === "turn_on") return "Activate";
    if (action === "turn_off") return "Turn off";
    if (action === "toggle")   return "Toggle";
    return action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
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

        .modal-loading {
          text-align: center;
          color: var(--secondary-text-color);
          padding: 20px;
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

        /* ── Automation rows ──── */
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

        .automation-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        smartvanio-select {
          flex: 1;
          min-width: 100px;
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

        /* ── Save error ──── */
        .save-error {
          padding: 8px 12px;
          margin: 0 16px 8px;
          background: rgba(220, 50, 50, 0.15);
          border: 1px solid rgba(220, 50, 50, 0.4);
          border-radius: 6px;
          color: #ff6b6b;
          font-size: 12px;
          word-break: break-word;
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

        /* ── Calibration section ──── */
        .cal-live {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-color);
        }

        .cal-header-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 6px;
          padding: 0 2px;
        }

        .cal-col-hdr {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--secondary-text-color);
        }

        .cal-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 6px;
          align-items: center;
        }

        .cal-input {
          width: 100%;
          padding: 7px 8px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 13px;
          box-sizing: border-box;
          outline: none;
        }
        .cal-input:focus {
          border-color: var(--primary-color);
        }

        .capture-btn {
          background: none;
          border: 1px solid var(--primary-color);
          border-radius: 6px;
          padding: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: var(--primary-color);
          transition: background 0.15s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .capture-btn:hover {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }
        .capture-btn ha-icon {
          --mdc-icon-size: 16px;
        }

        /* ── Segment cards ──── */
        .seg-card {
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 10px;
        }

        .seg-card-top {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .seg-card-bottom {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .seg-field {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .seg-field-label {
          font-size: 0.75rem;
          color: var(--secondary-text-color, #888);
          white-space: nowrap;
        }

        .seg-field .cal-input {
          width: 60px;
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

        .seg-name-input {
          min-width: 0;
        }

        .seg-bri-unit {
          font-size: 0.75rem;
          color: var(--secondary-text-color, #888);
        }
      `,
    ];
  }
}

customElements.define("smartvanio-modal-edit", VanCtlModalEdit);
