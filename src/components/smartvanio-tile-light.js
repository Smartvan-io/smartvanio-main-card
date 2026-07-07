import {
  LitElement,
  html,
  css,
  nothing,
} from "lit";
import { live } from "lit/directives/live.js";
import { COLOR_PRESETS, sharedTileStyles } from "../smartvanio-shared.js";

const SLIDER_THROTTLE_MS = 150;

class VanCtlTileLight extends LitElement {
  static get properties() {
    return {
      hass:      { type: Object },
      entityId:  { type: String, attribute: "entity-id" },
      editMode:  { type: Boolean, attribute: "edit-mode" },
      deviceId:  { type: String, attribute: "device-id" },
      // internal drag state — Map<eid, {active, brightness}>
      _dragState:        { type: Object, state: true },
      _expandedSegColor: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._dragState = new Map();
    this._expandedSegColor = null;
    // Per-entity throttle state: { lastSent: ms, pending: timeoutId, pendingValue: number }
    this._sendThrottle = new Map();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._sendThrottle.values()) {
      if (t.pending) clearTimeout(t.pending);
    }
    this._sendThrottle.clear();
  }

  // Throttle live brightness updates during drag so we send roughly every
  // SLIDER_THROTTLE_MS, with a trailing call to make sure the final value
  // lands even if it arrived inside the throttle window.
  _throttledSendBrightness(eid, brightness) {
    const now = performance.now();
    let t = this._sendThrottle.get(eid);
    if (!t) {
      t = { lastSent: 0, pending: null, pendingValue: brightness };
      this._sendThrottle.set(eid, t);
    }
    t.pendingValue = brightness;
    const elapsed = now - t.lastSent;
    if (elapsed >= SLIDER_THROTTLE_MS) {
      if (t.pending) { clearTimeout(t.pending); t.pending = null; }
      t.lastSent = now;
      this._setBrightness(eid, brightness);
      return;
    }
    if (t.pending) return; // trailing call already queued, value will pick up pendingValue
    t.pending = setTimeout(() => {
      const tt = this._sendThrottle.get(eid);
      if (!tt) return;
      tt.lastSent = performance.now();
      tt.pending = null;
      this._setBrightness(eid, tt.pendingValue);
    }, SLIDER_THROTTLE_MS - elapsed);
  }

  _flushBrightness(eid, brightness) {
    const t = this._sendThrottle.get(eid);
    if (t?.pending) { clearTimeout(t.pending); t.pending = null; }
    if (t) t.lastSent = performance.now();
    this._setBrightness(eid, brightness);
  }

  // ─── Light state helpers ────────────────────────────────────────

  _lightIsOn(eid) {
    return this.hass.states[eid]?.state === "on";
  }

  _lightRgb(eid) {
    return this.hass.states[eid]?.attributes?.rgb_color ?? [255, 255, 255];
  }

  _lightSupRgb(eid) {
    return (
      this.hass.states[eid]?.attributes?.supported_color_modes?.includes("rgb") ?? false
    );
  }

  _lightBrightness(eid) {
    const drag = this._dragState.get(eid);
    if (drag?.active) return drag.brightness;
    const stored = parseFloat(localStorage.getItem(`smartvanio_bri_${eid}`));
    if (!isNaN(stored)) return stored;
    const state = this.hass.states[eid];
    return state?.attributes?.brightness ?? state?.attributes?.last_brightness ?? 255;
  }

  _persistBrightness(eid, brightness) {
    localStorage.setItem(`smartvanio_bri_${eid}`, brightness);
  }

  _lightPct(eid) {
    return Math.round((this._lightBrightness(eid) / 255) * 100);
  }

  // ─── Service actions ────────────────────────────────────────────

  _toggleLight(entity_id) {
    this.hass.callService("light", "toggle", { entity_id });
  }

  _setBrightness(entity_id, value) {
    this.hass.callService("light", "turn_on", {
      entity_id,
      brightness: Math.round(value),
    });
  }

  _setColor(entity_id, r, g, b) {
    this.hass.callService("light", "turn_on", {
      entity_id,
      rgb_color: [r, g, b],
    });
  }

  // ─── Slider drag ────────────────────────────────────────────────

  _onSliderInput(eid, e) {
    const brightness = (e.target.value / 100) * 255;
    this._dragState = new Map(this._dragState).set(eid, { active: true, brightness });
    this._updateSliderFill(e.target);
    this._throttledSendBrightness(eid, brightness);
  }

  _onSliderChange(eid, e) {
    const brightness = (e.target.value / 100) * 255;
    this._dragState = new Map(this._dragState).set(eid, { active: false, brightness });
    this._persistBrightness(eid, brightness);
    this._flushBrightness(eid, brightness);
  }

  _updateSliderFill(input) {
    const pct = input.value;
    const color = input.style.getPropertyValue("--sc") || "var(--primary-color)";
    input.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--slider-track, #e0e0e0) ${pct}%, var(--slider-track, #e0e0e0) 100%)`;
  }

  // ─── Emit edit event ────────────────────────────────────────────

  _emitEdit() {
    this.dispatchEvent(new CustomEvent("smartvanio-edit-entity", {
      detail: { entity_id: this.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  // ─── Segment control row ────────────────────────────────────────

  _renderSegCtrlRow(seg) {
    const [r, g, b] = seg.attributes.rgb_color ?? [255, 255, 255];
    const brightness = this._lightBrightness(seg.entity_id);
    const pct = Math.round((brightness / 255) * 100);
    const name =
      this.hass.entities?.[seg.entity_id]?.name ||
      seg.attributes.friendly_name ||
      "Segment";
    const isOn = seg.state === "on";
    const colorOpen = this._expandedSegColor === seg.entity_id;
    const trackColor = isOn ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},0.35)`;
    const sliderBg = `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}%, var(--slider-track,#e0e0e0) ${pct}%, var(--slider-track,#e0e0e0) 100%)`;
    return html`
      <div class="seg-ctrl-row ${isOn ? "on" : ""}">
        <button
          class="seg-ctrl-toggle ${isOn ? "on" : ""}"
          style="${isOn ? `background:rgba(${r},${g},${b},0.2); color:rgb(${r},${g},${b})` : ""}"
          @click=${(e) => {
            e.stopPropagation();
            this.hass.callService("light", "toggle", { entity_id: seg.entity_id });
          }}
        ><ha-icon icon="mdi:power"></ha-icon></button>
        <span class="seg-ctrl-name">${name}</span>
        <input
          type="range"
          min="1"
          max="100"
          .value=${this._dragState.get(seg.entity_id)?.active ? nothing : live(pct)}
          class="br-slider seg-ctrl-bri"
          style="--sc:rgb(${r},${g},${b}); background:${sliderBg}"
          @input=${(e) => this._onSliderInput(seg.entity_id, e)}
          @change=${(e) => this._onSliderChange(seg.entity_id, e)}
        />
        <button
          class="seg-ctrl-color-btn"
          style="background:rgb(${r},${g},${b}); ${colorOpen ? "outline:2px solid var(--primary-color)" : ""}"
          title="Change colour"
          @click=${(e) => {
            e.stopPropagation();
            this._expandedSegColor = colorOpen ? null : seg.entity_id;
          }}
        ></button>
      </div>
      ${colorOpen
        ? html`
            <div class="seg-ctrl-colors">
              ${COLOR_PRESETS.map(
                (c) => html`
                  <button
                    class="color-dot"
                    style="background:rgb(${c.r},${c.g},${c.b})"
                    title="${c.name}"
                    @click=${(e) => {
                      e.stopPropagation();
                      this._setColor(seg.entity_id, c.r, c.g, c.b);
                      this._expandedSegColor = null;
                    }}
                  ></button>
                `,
              )}
            </div>
          `
        : ""}
    `;
  }

  // ─── Render ─────────────────────────────────────────────────────

  render() {
    if (!this.hass || !this.entityId) return html``;
    const entity_id = this.entityId;
    const isOn = this._lightIsOn(entity_id);
    const [r, g, b] = this._lightRgb(entity_id);
    const pct = this._lightPct(entity_id);
    const supRgb = this._lightSupRgb(entity_id);
    const label = this.hass.entities?.[entity_id]?.name ||
      this.hass.states[entity_id]?.attributes?.friendly_name ||
      entity_id.split(".").pop();
    const glow = isOn ? `rgba(${r},${g},${b},0.4)` : "transparent";
    const ic = isOn ? `rgb(${r},${g},${b})` : "var(--secondary-text-color, #888)";
    const sliderBg = isOn
      ? `linear-gradient(to right, rgb(${r},${g},${b}) 0%, rgb(${r},${g},${b}) ${pct}%, var(--slider-track,#e0e0e0) ${pct}%, var(--slider-track,#e0e0e0) 100%)`
      : "";

    // Gather segment entities for this light
    const segs = Object.values(this.hass.states)
      .filter(
        (s) =>
          s.entity_id.startsWith("light.") &&
          s.attributes?.smartvanio_parent_entity_id === entity_id,
      )
      .sort(
        (a, b_) =>
          (a.attributes.segment_start ?? 0) -
          (b_.attributes.segment_start ?? 0),
      );

    return html`
      <div
        class="light-tile ${isOn ? "on" : ""} ${this.editMode ? "editable" : ""}"
        data-eid="${entity_id}"
      >
        <div
          class="lt-header"
          @click=${() =>
            this.editMode ? this._emitEdit() : this._toggleLight(entity_id)}
        >
          <div class="lt-icon" style="--glow:${glow}; --ic:${ic}">
            <ha-icon icon="mdi:lightbulb${isOn ? "-on" : "-outline"}"></ha-icon>
          </div>
          <div class="lt-info">
            <div class="lt-name">${label}</div>
            <div class="lt-state">${isOn ? `${pct}%` : "Off"}</div>
          </div>
          ${this.editMode
            ? html`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`
            : html`<div class="toggle ${isOn ? "on" : ""}">
                <div class="toggle-dot"></div>
              </div>`}
        </div>

        ${this.editMode
          ? html`
              ${segs.length
                ? html`
                    <div class="seg-edit-list">
                      ${segs.map((seg) => {
                        const [sr, sgG, sb] = seg.attributes.rgb_color ?? [255, 255, 255];
                        const alpha =
                          seg.state === "on"
                            ? (seg.attributes.brightness ?? 255) / 255
                            : 0.3;
                        const name =
                          this.hass.entities?.[seg.entity_id]?.name ||
                          seg.attributes.friendly_name ||
                          seg.entity_id;
                        const start = seg.attributes.segment_start ?? 0;
                        const end = seg.attributes.segment_end ?? 0;
                        const segOn = seg.state === "on";
                        return html`
                          <div
                            class="seg-row ${segOn ? "on" : ""}"
                            @click=${(e) => {
                              e.stopPropagation();
                              this.hass.callService(
                                "light",
                                segOn ? "turn_off" : "turn_on",
                                { entity_id: seg.entity_id },
                              );
                            }}
                          >
                            <span
                              class="seg-row-swatch"
                              style="background:rgba(${sr},${sgG},${sb},${alpha})"
                            ></span>
                            <span class="seg-row-name">${name}</span>
                            <span class="seg-row-range">${start}–${end}</span>
                            <ha-icon
                              class="seg-row-toggle-icon"
                              icon="mdi:power${segOn ? "" : "-off"}"
                            ></ha-icon>
                          </div>
                        `;
                      })}
                    </div>
                  `
                : ""}
            `
          : html`
              <div class="lt-controls">
                <input
                  type="range"
                  min="1"
                  max="100"
                  .value=${this._dragState.get(entity_id)?.active ? nothing : live(pct)}
                  @input=${(e) => {
                    if (segs.length) {
                      const brightness = (e.target.value / 100) * 255;
                      const newDrag = new Map(this._dragState);
                      newDrag.set(entity_id, { active: true, brightness });
                      segs.forEach((seg) => {
                        newDrag.set(seg.entity_id, { active: true, brightness });
                        this._throttledSendBrightness(seg.entity_id, brightness);
                      });
                      this._dragState = newDrag;
                      this._updateSliderFill(e.target);
                    } else {
                      this._onSliderInput(entity_id, e);
                    }
                  }}
                  @change=${(e) => {
                    if (segs.length) {
                      const brightness = (e.target.value / 100) * 255;
                      const newDrag = new Map(this._dragState);
                      newDrag.set(entity_id, { active: false, brightness });
                      this._persistBrightness(entity_id, brightness);
                      segs.forEach((seg) => {
                        newDrag.set(seg.entity_id, { active: false, brightness });
                        this._persistBrightness(seg.entity_id, brightness);
                        this._flushBrightness(seg.entity_id, brightness);
                      });
                      this._dragState = newDrag;
                    } else {
                      this._onSliderChange(entity_id, e);
                    }
                  }}
                  class="br-slider"
                  style="--sc:rgb(${r},${g},${b}); background:${sliderBg}"
                />
                ${supRgb
                  ? html`
                      ${segs.length
                        ? html`
                            <div class="seg-ctrl-list">
                              ${segs.map((seg) => this._renderSegCtrlRow(seg))}
                            </div>
                          `
                        : html`
                            <div class="color-row">
                              ${COLOR_PRESETS.map(
                                (c) => html`
                                  <button
                                    class="color-dot"
                                    style="background:rgb(${c.r},${c.g},${c.b})"
                                    title="${c.name}"
                                    @click=${() => this._setColor(entity_id, c.r, c.g, c.b)}
                                  ></button>
                                `,
                              )}
                            </div>
                          `}
                    `
                  : ""}
              </div>
            `}
      </div>
    `;
  }

  static get styles() {
    return [
      sharedTileStyles,
      css`
        :host {
          display: block;
          --slider-track: var(--secondary-background-color, #e0e0e0);
        }

        .light-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .light-tile.on {
          border-color: var(--primary-color, #03a9f4);
        }

        .lt-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .lt-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: color-mix(in srgb, var(--ic) 12%, transparent);
          box-shadow: 0 0 12px var(--glow);
          transition: all 0.3s;
        }

        .lt-icon ha-icon {
          --mdc-icon-size: 20px;
          color: var(--ic);
          transition: color 0.3s;
        }

        .lt-info {
          flex: 1;
          min-width: 0;
        }

        .lt-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lt-state {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 1px;
        }

        .lt-controls {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ── Colour presets ──── */
        .color-row {
          display: flex;
          gap: 7px;
          justify-content: center;
        }

        .color-dot {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          padding: 0;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .color-dot:active {
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        /* ── Inline segment controls ──── */
        .seg-ctrl-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 6px;
        }

        .seg-ctrl-row {
          display: grid;
          grid-template-columns: 28px 1fr minmax(60px, 1fr) 22px;
          align-items: center;
          gap: 6px;
          padding: 3px 0;
        }

        .seg-ctrl-toggle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--divider-color, rgba(0,0,0,0.1));
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .seg-ctrl-toggle ha-icon {
          --mdc-icon-size: 15px;
        }

        .seg-ctrl-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .seg-ctrl-bri {
          width: 100%;
        }

        .seg-ctrl-color-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.15);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .seg-ctrl-color-btn:hover {
          transform: scale(1.15);
        }

        .seg-ctrl-colors {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 4px 2px 4px 34px;
        }

        /* ── Segment rows in edit mode tile ──── */
        .seg-edit-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 10px 6px;
        }

        .seg-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s;
          background: var(--secondary-background-color, #f5f5f5);
        }

        .seg-row.on {
          background: color-mix(
            in srgb,
            var(--primary-color, #03a9f4) 10%,
            var(--secondary-background-color, #f5f5f5)
          );
        }

        .seg-row-swatch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        .seg-row-name {
          flex: 1;
          font-size: 12px;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .seg-row-range {
          font-size: 11px;
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
        }

        .seg-row:hover {
          opacity: 0.8;
        }

        .seg-row-toggle-icon {
          --mdc-icon-size: 14px;
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
        }

        .seg-row.on .seg-row-toggle-icon {
          color: var(--primary-color, #03a9f4);
        }
      `,
    ];
  }
}

customElements.define("smartvanio-tile-light", VanCtlTileLight);
