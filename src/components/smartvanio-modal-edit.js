import {
  LitElement,
  html,
  css,
} from "lit";
import { ref } from "lit/directives/ref.js";
import { rgbToHex, sharedTileStyles } from "../smartvanio-shared.js";
import "./smartvanio-select.js";
import "./smartvanio-entity-picker.js";

class VanCtlModalEdit extends LitElement {
  static get properties() {
    return {
      hass:             { type: Object },
      entityId:         { type: String, attribute: "entity-id" },
      deviceId:         { type: String, attribute: "device-id" },
      editName:         { type: String, attribute: "edit-name" },
      editArea:         { type: String, attribute: "edit-area" },
      _areaPickerOpen:  { type: Boolean, state: true },
      _areaFilter:      { type: String, state: true },
      _selectedSegIdx:  { type: Number, state: true },
      _dragRemoveIdx:   { type: Number, state: true },
      _ledTab:          { type: String, state: true },
      _rightTab:        { type: String, state: true },
      _modalView:       { type: String, state: true }, // 'control' | 'settings'
      lightPatterns:    { type: Object },
      entityPatterns:   { type: Object },  // { name: stops[] } from MQTT
      activePattern:    { type: String, attribute: "active-pattern" },  // "entity_id:patternName"
      _patternStops:    { type: Array, state: true },
      _editingPatternName: { type: String, state: true },
      _selectedStopIdx: { type: Number, state: true },
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
      isSwitch:         { type: Boolean, attribute: "is-switch" },
      switchMode:       { type: Object },  // { entityId, options:[], current } for NO/NC relay mode, or null
      isTank:           { type: Boolean, attribute: "is-tank" },
      isLight:          { type: Boolean, attribute: "is-light" },
      isSensor:         { type: Boolean, attribute: "is-sensor" },
      targetEntities:   { type: Array },
      sourceEntities:   { type: Array },
    };
  }

  constructor() {
    super();
    this.editRows = [];
    this.lightSegments = [];
    this.lightPatterns = {};
    this.entityPatterns = {};
    this.activePattern = null;
    this._patternStops = null; // initialized in _initPatternStops()
    this._editingPatternName = '';
    this._selectedStopIdx = null;
    this._ledTab = 'segments';
    this._rightTab = null; // null = auto-select based on entity type
    this._modalView = null; // null = auto ('control' for lights, 'settings' otherwise)
    this.maxLeds = 0;
    this.switchMode = null;
    this.calPoints = null;
    this.calKind = "linear";
    this.targetEntities = [];
    this.sourceEntities = [];
    this._presetColors = [
      [255, 180, 107],  // warm white
      [255, 100, 100],  // red
      [100, 200, 255],  // cool blue
      [100, 255, 130],  // green
    ];
  }

  // ─── Light control view ──────────────────────────────────────────

  updated(changedProps) {
    super.updated(changedProps);
    // Reset to control view when entity changes
    if (changedProps.has('entityId') && changedProps.get('entityId') !== undefined) {
      this._modalView = null;
      this._wheelDrawn = false;
    }
  }

  _rgbToWheelPos(rgb, size) {
    if (!rgb) return null;
    const [r, g, b] = rgb.map(c => c / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (max === 0) return null;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d + 6) % 6 * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
    const s = d / max;
    const cx = size / 2, radius = cx - 4;
    const angle = h * Math.PI / 180;
    const dist = s * radius;
    return { x: cx + Math.cos(angle) * dist, y: cx + Math.sin(angle) * dist };
  }

  _onWheelRef(canvas) {
    if (canvas && !canvas._wheelDrawn) {
      this._drawColorWheel(canvas);
      canvas._wheelDrawn = true;
    }
  }

  _drawColorWheel(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, radius = cx - 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g, b] = this._hsvToRgb(angle, 1, 1);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(1, `rgb(${r},${g},${b})`);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  _hsvToRgb(h, s, v) {
    const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  _ctrlBriPick(e, capture) {
    if (capture) {
      e.target.setPointerCapture(e.pointerId);
      this._briDragging = true;
    }
    if (!e.buttons && !capture) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pad = 20; // keeps thumb inside bar
    const x = Math.max(pad, Math.min(e.clientX - rect.left, rect.width - pad));
    const pct = Math.round(((x - pad) / (rect.width - pad * 2)) * 100);
    this._localBri = pct;
    this.requestUpdate();
    const now = Date.now();
    if (!this._lastBriEmit || now - this._lastBriEmit > 80) {
      this._lastBriEmit = now;
      this._emit('smartvanio-light-brightness', { brightness: pct });
    }
  }

  _ctrlBriRelease(e) {
    e.target.releasePointerCapture(e.pointerId);
    this._briDragging = false;
    // Always send the final brightness on release
    if (this._localBri != null) {
      this._emit('smartvanio-light-brightness', { brightness: this._localBri });
    }
    setTimeout(() => { this._localBri = null; this.requestUpdate(); }, 500);
  }

  _ctrlColorPick(e, capture) {
    if (capture) {
      e.target.setPointerCapture(e.pointerId);
      this._colorDragging = true;
    }
    if (!e.buttons && !capture) return;
    e.stopPropagation();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const cx = canvas.width / 2, cy = canvas.height / 2, radius = cx - 4;
    const x = (e.clientX - rect.left) * scale - cx;
    const y = (e.clientY - rect.top) * scale - cy;
    const dist = Math.sqrt(x * x + y * y);
    if (dist > radius + 8) return;
    const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const sat = Math.min(dist / radius, 1);
    const [r, g, b] = this._hsvToRgb(hue, sat, 1);
    this._localRgb = [r, g, b];
    this.requestUpdate();
    // Throttle service calls — update local state instantly but limit HA calls
    const now = Date.now();
    if (!this._lastColorEmit || now - this._lastColorEmit > 80) {
      this._lastColorEmit = now;
      this._emit('smartvanio-light-color', { rgb: [r, g, b] });
    }
  }

  _ctrlColorRelease(e) {
    e.target.releasePointerCapture(e.pointerId);
    this._colorDragging = false;
    // Always send the final color on release
    if (this._localRgb) {
      this._emit('smartvanio-light-color', { rgb: [...this._localRgb] });
    }
    // Clear local override after HA state has time to settle
    setTimeout(() => { this._localRgb = null; this.requestUpdate(); }, 500);
  }

  _patternGradientCSS(stops) {
    if (!stops?.length) return '';
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const max = sorted[sorted.length - 1].pos || 1;
    const parts = sorted.map(s => {
      const bri = (s.brightness ?? 100) / 100;
      return `rgb(${Math.round(s.r * bri)},${Math.round(s.g * bri)},${Math.round(s.b * bri)}) ${(s.pos / max * 100).toFixed(1)}%`;
    });
    return `linear-gradient(to right, ${parts.join(', ')})`;
  }

  _renderControlView() {
    const eid = this.entityId;
    const state = this.hass?.states?.[eid];
    const isOn = state?.state === 'on';
    const attrs = state?.attributes ?? {};
    const haBri = attrs.brightness != null ? Math.round((attrs.brightness / 255) * 100) : (isOn ? 100 : 0);
    const bri = this._localBri ?? haBri;
    const curRgb = attrs.rgb_color;
    const supRgb = (attrs.supported_color_modes ?? []).some(m => ['rgb', 'hs', 'xy', 'rgbw', 'rgbww'].includes(m));

    const patterns = this.entityPatterns ?? {};
    const patternNames = Object.keys(patterns);

    // Check for active pattern gradient
    let activePatternName = null;
    if (this.activePattern?.startsWith(eid + ':')) {
      activePatternName = this.activePattern.slice(eid.length + 1);
    }
    const activeStops = activePatternName ? patterns[activePatternName] : null;
    const patternGrad = activeStops ? this._patternGradientCSS(activeStops) : null;
    const liveRgb = this._localRgb || curRgb;
    const briColor = liveRgb ? `rgb(${liveRgb.join(',')})` : 'var(--primary-color)';

    return html`
      <div class="ctrl-view">
        <div class="ctrl-power-row">
          <div class="ctrl-status">
            <ha-icon icon="mdi:lightbulb${isOn ? '' : '-outline'}"
              style="--mdc-icon-size:24px; color:${isOn && liveRgb ? `rgb(${liveRgb.join(',')})` : isOn ? 'var(--primary-color)' : 'var(--secondary-text-color)'}"></ha-icon>
            <span class="ctrl-status-text">${isOn ? `${bri}%` : 'Off'}</span>
          </div>
          <button class="ctrl-power-btn ${isOn ? 'on' : ''}"
            @click=${() => this._emit('smartvanio-light-toggle')}>
            <ha-icon icon="mdi:power" style="--mdc-icon-size:22px"></ha-icon>
          </button>
        </div>

        <div class="ctrl-bri-bar" style="--bri:${bri}; --bri-color:${briColor}"
          @pointerdown=${(e) => this._ctrlBriPick(e, true)}
          @pointermove=${(e) => this._ctrlBriPick(e, false)}
          @pointerup=${(e) => this._ctrlBriRelease(e)}>
          <div class="ctrl-bri-track"><div class="ctrl-bri-fill" style="${patternGrad ? `background:${patternGrad}; width:100%; opacity:0.35` : ''}"></div></div>
          <div class="ctrl-bri-thumb" style="${patternGrad ? `background:none; border-color:rgba(255,255,255,0.8)` : ''}"></div>
        </div>

        ${supRgb ? (() => {
          const indicatorRgb = this._localRgb || curRgb;
          const pos = this._rgbToWheelPos(indicatorRgb, 200);
          return html`
          <div class="ctrl-wheel-wrap">
            <canvas class="ctrl-color-wheel" width="200" height="200"
              ${ref((el) => { if (el) this._onWheelRef(el); })}
              @pointerdown=${(e) => this._ctrlColorPick(e, true)}
              @pointermove=${(e) => this._ctrlColorPick(e, false)}
              @pointerup=${(e) => this._ctrlColorRelease(e)}></canvas>
            ${pos ? html`<div class="ctrl-wheel-indicator" style="left:${pos.x}px;top:${pos.y}px;background:rgb(${indicatorRgb.join(',')})"></div>` : ''}
          </div>
          <div class="ctrl-presets">
            ${this._presetColors.map(([r, g, b]) => html`
              <span class="ctrl-swatch" style="background:rgb(${r},${g},${b})"
                @click=${() => this._emit('smartvanio-light-color', { rgb: [r, g, b] })}></span>
            `)}
          </div>
          `;
        })() : ''}
        ${patternNames.length ? html`
          <div class="ctrl-patterns">
            ${patternNames.map(name => html`
              <div class="ctrl-pattern-chip ${this.activePattern === `${eid}:${name}` ? 'active' : ''}"
                title="${name}"
                @click=${() => this._emit('smartvanio-light-pattern', { name, stops: patterns[name] })}>
                <div class="ctrl-pattern-gradient" style="background:${this._patternGradientCSS(patterns[name])}"></div>
                <span class="ctrl-pattern-name">${name}</span>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ─── Area picker ─────────────────────────────────────────────────

  _renderAreaPicker() {
    const areas = Object.values(this.hass?.areas ?? {}).sort((a, b) => a.name.localeCompare(b.name));
    const selectedName = this.editArea || '';
    const open = this._areaPickerOpen;
    const filter = (this._areaFilter ?? '').toLowerCase();
    const filtered = filter ? areas.filter(a => a.name.toLowerCase().includes(filter)) : areas;

    return html`
      <div class="area-picker">
        <button class="area-picker-btn" @click=${() => { this._areaPickerOpen = !open; this._areaFilter = ''; }}>
          ${selectedName
            ? html`<ha-icon icon="mdi:map-marker" style="--mdc-icon-size:16px; color:var(--primary-color)"></ha-icon><span>${selectedName}</span>`
            : html`<span class="area-picker-placeholder">Select area…</span>`}
          <ha-icon icon="mdi:chevron-${open ? 'up' : 'down'}" style="--mdc-icon-size:18px; margin-left:auto; opacity:0.5"></ha-icon>
        </button>
        ${open ? html`
          <div class="area-picker-overlay"
            @click=${(e) => { if (e.target === e.currentTarget) this._areaPickerOpen = false; }}>
            <div class="area-picker-sheet" @click=${(e) => e.stopPropagation()}>
              <div class="area-picker-sheet-header">
                <span class="area-picker-sheet-title">Select area</span>
                <button class="area-picker-sheet-close" @click=${() => { this._areaPickerOpen = false; }} aria-label="Close">
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:22px"></ha-icon>
                </button>
              </div>
              <input class="area-picker-search" type="search"
                inputmode="search" enterkeyhint="search" autocomplete="off"
                placeholder="Search areas…"
                .value=${this._areaFilter ?? ''}
                @input=${(e) => { this._areaFilter = e.target.value; }}
              />
              <div class="area-picker-list">
                ${selectedName ? html`
                  <div class="area-picker-item clear" @click=${() => { this._emit("smartvanio-update-edit-area", { value: '' }); this._areaPickerOpen = false; }}>
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:18px"></ha-icon><span>Clear selection</span>
                  </div>
                ` : ''}
                ${filtered.map(a => html`
                  <div class="area-picker-item ${a.name === selectedName ? 'selected' : ''}"
                    @click=${() => { this._emit("smartvanio-update-edit-area", { value: a.name }); this._areaPickerOpen = false; }}>
                    <ha-icon icon="${a.icon || 'mdi:map-marker'}" style="--mdc-icon-size:20px"></ha-icon>
                    <span>${a.name}</span>
                  </div>
                `)}
                ${!filtered.length ? html`<div class="area-picker-empty">No areas found</div>` : ''}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  updated(changed) {
    super.updated?.(changed);
    if (changed.has('_areaPickerOpen') && this._areaPickerOpen) {
      requestAnimationFrame(() => {
        this.shadowRoot?.querySelector('.area-picker-search')?.focus();
      });
    }
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
    const max = this.maxLeds || 100;
    const sel = this._selectedSegIdx;
    const selectedSeg = sel !== null && sel !== undefined && segs[sel] ? segs[sel] : null;

    return html`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">LED Strip</span>
          <div class="seg-max-wrap">
            <span class="seg-max-label">LEDs:</span>
            <input type="number" class="seg-max-input" min="1" step="1"
              .value=${String(max)}
              @change=${(e) => this._emit("smartvanio-update-segment", { id: "__maxLeds__", field: "maxLeds", value: Math.max(1, +e.target.value) })} />
          </div>
        </div>

        <!-- Visual strip -->
        <div class="strip-wrap">
          <div class="strip-bar"
            @click=${(e) => this._onStripClick(e, segs, max)}>
            ${segs.map((seg, i) => {
              const left = (seg.start / max) * 100;
              const width = ((seg.end - seg.start + 1) / max) * 100;
              const isSelected = sel === i;
              return html`
                <div class="strip-seg ${isSelected ? 'selected' : ''} ${this._dragRemoveIdx === i ? 'drag-removing' : ''}"
                  style="left:${left}%;width:${width}%;background:rgba(${seg.r},${seg.g},${seg.b},${(seg.brightness ?? 100) / 100})"
                  @click=${(e) => {
                    e.stopPropagation();
                    if (this._segLpFired) { this._segLpFired = false; return; }
                    this._selectedSegIdx = i;
                    this.requestUpdate();
                    // Open color picker for this segment
                    const input = e.currentTarget.querySelector('.strip-seg-color');
                    if (input) input.click();
                  }}
                  @pointerdown=${(e) => {
                    if (e.target.closest('.strip-handle')) return;
                    this._segLpFired = false;
                    this._segLpTimer = setTimeout(() => {
                      this._segLpTimer = null;
                      this._segLpFired = true;
                      this._startSegDragRemove(e, i);
                    }, 400);
                  }}
                  @pointerup=${() => { if (this._segLpTimer) { clearTimeout(this._segLpTimer); this._segLpTimer = null; } }}
                  @pointerleave=${() => { if (this._segLpTimer) { clearTimeout(this._segLpTimer); this._segLpTimer = null; } }}>
                  <span class="strip-seg-label">${seg.name || `${seg.start}-${seg.end}`}</span>
                  <input type="color" class="strip-seg-color"
                    .value=${rgbToHex(seg.r, seg.g, seg.b)}
                    @click=${(e) => e.stopPropagation()}
                    @input=${(e) => { e.stopPropagation(); this._emitSegUpdate(i, "color", e.target.value); }} />
                  <!-- Left drag handle -->
                  <div class="strip-handle strip-handle-l"
                    @pointerdown=${(e) => this._onHandleDrag(e, i, 'start', segs, max)}></div>
                  <!-- Right drag handle -->
                  <div class="strip-handle strip-handle-r"
                    @pointerdown=${(e) => this._onHandleDrag(e, i, 'end', segs, max)}></div>
                </div>
              `;
            })}
            <!-- LED markers -->
            ${max <= 120 ? html`<div class="strip-ticks">
              ${[0, Math.floor(max / 4), Math.floor(max / 2), Math.floor(max * 3 / 4), max - 1].map(n => html`
                <span class="strip-tick" style="left:${(n / max) * 100}%">${n}</span>
              `)}
            </div>` : ''}
          </div>
        </div>

        <!-- Selected segment detail -->
        ${selectedSeg ? html`
          <div class="seg-detail">
            <div class="seg-detail-row">
              <input type="text" class="modal-input seg-name-input" placeholder="Segment name"
                .value=${selectedSeg.name}
                @input=${(e) => this._emitSegUpdate(sel, "name", e.target.value)} />
              <button class="delete-row-btn" @click=${() => { this._selectedSegIdx = null; this._emit("smartvanio-remove-segment", { id: selectedSeg.id ?? sel }); }}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          </div>
        ` : html`
          <div class="seg-hint">${segs.length ? 'Tap a segment to edit, or tap empty space to add' : 'Tap the strip to add your first segment'}</div>
        `}

        <!-- Segment list -->
        ${segs.length ? html`
          <div class="seg-list">
            ${segs.map((s, i) => html`
              <div class="seg-list-item ${sel === i ? 'active' : ''}" @click=${() => { this._selectedSegIdx = i; this.requestUpdate(); }}>
                <label class="seg-list-swatch-label">
                  <span class="seg-list-swatch" style="background:rgb(${s.r},${s.g},${s.b})"></span>
                  <input type="color" class="seg-list-color-input"
                    .value=${rgbToHex(s.r, s.g, s.b)}
                    @click=${(e) => e.stopPropagation()}
                    @input=${(e) => { e.stopPropagation(); this._emitSegUpdate(i, "color", e.target.value); }} />
                </label>
                <span class="seg-list-name">${s.name || `Segment ${i + 1}`}</span>
                <span class="seg-list-range">${s.start}–${s.end}</span>
                <button class="seg-list-del" @click=${(e) => { e.stopPropagation(); if (sel === i) this._selectedSegIdx = null; this._emit("smartvanio-remove-segment", { id: s.id ?? i }); }}>
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  _startSegDragRemove(e, idx) {
    const seg = e.currentTarget;
    const startY = e.clientY;
    this._dragRemoveIdx = idx;
    seg.setPointerCapture(e.pointerId);

    const onMove = (ev) => {
      const dy = ev.clientY - startY;
      if (dy > 60) {
        seg.style.transform = `translateY(${dy}px)`;
        seg.style.opacity = Math.max(0, 1 - (dy - 60) / 60).toString();
      } else {
        seg.style.transform = `translateY(${Math.max(0, dy)}px)`;
        seg.style.opacity = '1';
      }
    };

    const onUp = (ev) => {
      seg.removeEventListener('pointermove', onMove);
      seg.removeEventListener('pointerup', onUp);
      seg.removeEventListener('pointercancel', onUp);
      seg.releasePointerCapture(ev.pointerId);
      seg.style.transform = '';
      seg.style.opacity = '';
      this._dragRemoveIdx = null;

      const dy = ev.clientY - startY;
      if (dy > 80) {
        // Dragged down far enough — remove
        if (this._selectedSegIdx === idx) this._selectedSegIdx = null;
        const segs = this.lightSegments ?? [];
        this._emit("smartvanio-remove-segment", { id: segs[idx]?.id ?? idx });
      }
      this.requestUpdate();
    };

    seg.addEventListener('pointermove', onMove);
    seg.addEventListener('pointerup', onUp);
    seg.addEventListener('pointercancel', onUp);
  }

  _emitSegUpdate(idx, field, value) {
    const seg = (this.lightSegments ?? [])[idx];
    if (!seg) return;
    this._emit("smartvanio-update-segment", { id: seg.id ?? idx, field, value });
    // Delay preview so parent's lightSegments updates before preview reads them
    if (this._segPreviewTimer) clearTimeout(this._segPreviewTimer);
    this._segPreviewTimer = setTimeout(() => this._emit("smartvanio-segment-preview"), 80);
  }

  _onStripClick(e, segs, max) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ledPos = Math.round((x / rect.width) * max);
    // Check if clicking on empty space
    const occupied = segs.some(s => ledPos >= s.start && ledPos <= s.end);
    if (occupied) return;
    // Find gap boundaries
    let gapStart = 0, gapEnd = max - 1;
    for (const s of segs) {
      if (s.end < ledPos && s.end + 1 > gapStart) gapStart = s.end + 1;
      if (s.start > ledPos && s.start - 1 < gapEnd) gapEnd = s.start - 1;
    }
    const newStart = Math.max(gapStart, ledPos - 5);
    const newEnd = Math.min(gapEnd, ledPos + 5);
    this._emit("smartvanio-add-segment-at", { start: newStart, end: newEnd });
    this._selectedSegIdx = segs.length; // select the new one
    this.requestUpdate();
  }

  _onHandleDrag(e, segIdx, edge, segs, max) {
    e.stopPropagation();
    e.preventDefault();
    const handle = e.target;
    handle.setPointerCapture(e.pointerId);
    const bar = handle.closest('.strip-bar');
    const barRect = bar.getBoundingClientRect();
    const seg = segs[segIdx];
    this._selectedSegIdx = segIdx;

    // Find neighbours (sorted) so we can shrink them on overlap
    const sorted = segs.map((s, i) => ({ ...s, _i: i })).sort((a, b) => a.start - b.start);
    const sortedIdx = sorted.findIndex(s => s._i === segIdx);
    const prev = sortedIdx > 0 ? sorted[sortedIdx - 1] : null;
    const next = sortedIdx < sorted.length - 1 ? sorted[sortedIdx + 1] : null;

    // Debounce preview to let Lit update the parent's lightSegments first
    let previewTimer = null;
    const schedulePreview = () => {
      if (previewTimer) clearTimeout(previewTimer);
      previewTimer = setTimeout(() => this._emit("smartvanio-segment-preview"), 60);
    };

    const onMove = (ev) => {
      const x = ev.clientX - barRect.left;
      let ledPos = Math.round((x / barRect.width) * max);
      ledPos = Math.max(0, Math.min(max - 1, ledPos));

      if (edge === 'start') {
        ledPos = Math.min(ledPos, seg.end);
        if (prev) ledPos = Math.max(prev.start + 1, ledPos);
        else ledPos = Math.max(0, ledPos);
        if (prev && ledPos <= prev.end) {
          this._emit("smartvanio-update-segment", { id: prev.id ?? prev._i, field: "end", value: ledPos - 1 });
        }
        this._emit("smartvanio-update-segment", { id: seg.id ?? segIdx, field: "start", value: ledPos });
      } else {
        ledPos = Math.max(ledPos, seg.start);
        if (next) ledPos = Math.min(next.end - 1, ledPos);
        else ledPos = Math.min(max - 1, ledPos);
        if (next && ledPos >= next.start) {
          this._emit("smartvanio-update-segment", { id: next.id ?? next._i, field: "start", value: ledPos + 1 });
        }
        this._emit("smartvanio-update-segment", { id: seg.id ?? segIdx, field: "end", value: ledPos });
      }
      schedulePreview();
    };

    const onUp = () => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      if (previewTimer) clearTimeout(previewTimer);
      // Final preview after all updates have settled
      setTimeout(() => this._emit("smartvanio-segment-preview"), 80);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
  }

  // (Segments / Patterns / Automations tabs rendered in right column)

  // ─── Pattern gradient editor ───────────────────────────────────

  get _maxPos() { return Math.max(1, this.maxLeds || 100); }

  /** Rescale stop positions so they span 0 → _maxPos, preserving relative spacing. */
  _normalizeStops(stops) {
    if (!stops?.length) return stops;
    const srcMax = Math.max(1, ...stops.map(s => s.pos));
    const dstMax = this._maxPos;
    if (srcMax === dstMax) return stops;
    return stops.map(s => ({ ...s, pos: Math.round(s.pos / srcMax * dstMax) }));
  }

  _initPatternStops() {
    if (!this._patternStops) {
      const max = this._maxPos;
      const eid = this.entityId;
      // If a pattern is already active, load its stops into the editor
      let activePatName = null;
      if (this.activePattern?.startsWith(eid + ':')) {
        activePatName = this.activePattern.slice(eid.length + 1);
      }
      const activeStops = activePatName ? (this.entityPatterns ?? {})[activePatName] : null;
      if (activeStops?.length) {
        this._patternStops = this._normalizeStops([...activeStops]);
        this._editingPatternName = activePatName;
        // Don't preview — strip already shows this pattern
      } else {
        this._patternStops = [
          { pos: 0,                        r: 75,  g: 0,   b: 130, brightness: 100 },
          { pos: Math.round(max * 0.25),   r: 138, g: 43,  b: 226, brightness: 100 },
          { pos: Math.round(max * 0.5),    r: 23,  g: 13,  b: 89,  brightness: 80  },
          { pos: Math.round(max * 0.75),   r: 199, g: 21,  b: 133, brightness: 100 },
          { pos: max,                      r: 25,  g: 25,  b: 112, brightness: 90  },
        ];
        this._emit("smartvanio-pattern-preview", { stops: this._patternStops });
      }
    }
  }

  _gradientCSS(stops) {
    if (!stops?.length) return 'linear-gradient(to right, #333, #333)';
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const max = this._maxPos;
    const parts = sorted.map(s => {
      const bri = (s.brightness ?? 100) / 100;
      return `rgb(${Math.round(s.r * bri)},${Math.round(s.g * bri)},${Math.round(s.b * bri)}) ${(s.pos / max * 100).toFixed(1)}%`;
    });
    return `linear-gradient(to right, ${parts.join(', ')})`;
  }

  _renderPatternsSection() {
    this._initPatternStops();
    const stops = this._patternStops ?? [];
    const max = this._maxPos;
    const sel = this._selectedStopIdx;
    const selectedStop = sel !== null && sel !== undefined && stops[sel] ? stops[sel] : null;
    const patterns = this.lightPatterns ?? {};
    const patternNames = Object.keys(patterns);
    const currentName = this._editingPatternName ?? '';

    return html`
      <div class="modal-section pat-section">

        <!-- Gradient preview + stop handles (cssgradient.io style) -->
        <div class="pat-editor">
          <div class="pat-bar-wrap">
            <!-- Checkerboard background -->
            <div class="pat-bar-bg"></div>
            <!-- Gradient overlay -->
            <div class="pat-bar" style="background:${this._gradientCSS(stops)}"
              @click=${(e) => this._onPatternStripClick(e, stops)}></div>
          </div>
          <!-- Stop handles below the bar -->
          <div class="pat-handle-track"
            @click=${(e) => this._onPatternStripClick(e, stops)}>
            ${stops.map((stop, i) => {
              const pct = max > 0 ? (stop.pos / max * 100) : 0;
              const isSelected = sel === i;
              return html`
                <div class="pat-handle ${isSelected ? 'selected' : ''}"
                  style="left:${pct}%"
                  @click=${(e) => { e.stopPropagation(); this._selectedStopIdx = i; this.requestUpdate(); }}
                  @pointerdown=${(e) => this._onStopDrag(e, i, stops)}>
                  <div class="pat-handle-arrow"></div>
                  <div class="pat-handle-color" style="background:rgb(${stop.r},${stop.g},${stop.b})"></div>
                </div>
              `;
            })}
          </div>
        </div>

        <!-- Selected stop controls -->
        ${selectedStop ? html`
          <div class="pat-stop-ctrl">
            <label class="pat-color-label">
              <div class="pat-color-preview" style="background:rgb(${selectedStop.r},${selectedStop.g},${selectedStop.b})"></div>
              <input type="color" class="pat-color-input"
                .value=${rgbToHex(selectedStop.r, selectedStop.g, selectedStop.b)}
                @input=${(e) => this._updateStop(sel, 'color', e.target.value)} />
            </label>
            <div class="pat-hex-wrap">
              <span class="pat-field-label">Hex</span>
              <input type="text" class="pat-hex-input"
                .value=${rgbToHex(selectedStop.r, selectedStop.g, selectedStop.b)}
                @change=${(e) => {
                  const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                  if (v.length === 6) this._updateStop(sel, 'color', '#' + v);
                }} />
            </div>
            <div class="pat-pos-wrap">
              <span class="pat-field-label">LED</span>
              <input type="number" class="pat-pos-input" min="0" max="${max}"
                .value=${String(selectedStop.pos)}
                @change=${(e) => this._updateStop(sel, 'pos', Math.max(0, Math.min(max, +e.target.value)))} />
            </div>
            <button class="pat-stop-del" ?disabled=${stops.length <= 2} @click=${() => {
              if (stops.length <= 2) return;
              this._patternStops = stops.filter((_, j) => j !== sel);
              this._selectedStopIdx = null;
              this._emit("smartvanio-pattern-preview", { stops: this._patternStops });
              this.requestUpdate();
            }}>
              <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:18px"></ha-icon>
            </button>
          </div>
        ` : html`
          <div class="pat-hint">Tap the gradient bar to add a color stop</div>
        `}

        <!-- Save pattern -->
        <div class="pat-save-row">
          <input type="text" class="modal-input pat-name-input" placeholder="Pattern name…"
            .value=${currentName}
            @input=${(e) => { this._editingPatternName = e.target.value; }} />
          <button class="modal-btn save pat-save-btn"
            ?disabled=${!currentName.trim() || stops.length < 2}
            @click=${() => {
              const name = currentName.trim();
              if (!name || stops.length < 2) return;
              this._emit("smartvanio-save-pattern", { name, stops: stops });
            }}>Save</button>
        </div>

        <!-- Saved patterns list -->
        ${patternNames.length ? html`
          <div class="pat-list">
            ${patternNames.map(name => {
              const isCurrent = name === currentName;
              return html`
                <div class="pat-list-item ${isCurrent ? 'active' : ''}" @click=${() => {
                  this._patternStops = this._normalizeStops([...patterns[name]]);
                  this._editingPatternName = name;
                  this._selectedStopIdx = null;
                  this._emit("smartvanio-pattern-preview", { stops: this._patternStops });
                  this.requestUpdate();
                }}>
                  <span class="pat-list-grad" style="background:${this._gradientCSS(this._normalizeStops(patterns[name]))}"></span>
                  <span class="pat-list-name">${name}</span>
                  <button class="pat-list-del" @click=${(e) => {
                    e.stopPropagation();
                    this._emit("smartvanio-delete-pattern", { name });
                  }}>
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                  </button>
                </div>
              `;
            })}
          </div>
        ` : ''}

        <!-- Add new pattern button -->
        <button class="pat-add-btn" @click=${() => this._newRandomPattern()}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:18px"></ha-icon>
          Add Pattern
        </button>
      </div>
    `;
  }

  _newRandomPattern() {
    const max = this._maxPos;
    // Random nebula palette — pick 5 random colors from a cosmic range
    const nebula = [
      [75, 0, 130],    [138, 43, 226],  [23, 13, 89],    [199, 21, 133],
      [25, 25, 112],   [72, 61, 139],   [148, 0, 211],   [186, 85, 211],
      [255, 20, 147],  [0, 0, 139],     [65, 105, 225],  [30, 144, 255],
      [0, 191, 255],   [123, 104, 238], [218, 112, 214], [255, 0, 255],
      [75, 0, 180],    [100, 0, 150],   [0, 50, 120],    [180, 50, 200],
    ];
    const pick = () => nebula[Math.floor(Math.random() * nebula.length)];
    const count = 4 + Math.floor(Math.random() * 3); // 4–6 stops
    const stops = [];
    for (let i = 0; i < count; i++) {
      const [r, g, b] = pick();
      stops.push({
        pos: Math.round((i / (count - 1)) * max),
        r, g, b,
        brightness: 70 + Math.floor(Math.random() * 31),
      });
    }
    this._patternStops = stops;
    this._editingPatternName = '';
    this._selectedStopIdx = null;
    this._emit("smartvanio-pattern-preview", { stops });
    this.requestUpdate();
  }

  _onPatternStripClick(e, stops) {
    const track = e.target.closest('.pat-editor')?.querySelector('.pat-handle-track');
    const rect = (track || e.currentTarget).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const max = this._maxPos;
    const pos = Math.round((x / rect.width) * max);
    // Find nearest stops to interpolate color
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    let r = 255, g = 255, b = 255;
    if (sorted.length >= 2) {
      let lo = sorted[0], hi = sorted[sorted.length - 1];
      for (let i = 0; i < sorted.length - 1; i++) {
        if (pos >= sorted[i].pos && pos <= sorted[i + 1].pos) {
          lo = sorted[i]; hi = sorted[i + 1]; break;
        }
      }
      const range = hi.pos - lo.pos;
      const t = range > 0 ? (pos - lo.pos) / range : 0;
      r = Math.round(lo.r + t * (hi.r - lo.r));
      g = Math.round(lo.g + t * (hi.g - lo.g));
      b = Math.round(lo.b + t * (hi.b - lo.b));
    }
    const newStops = [...stops, { pos, r, g, b, brightness: 100 }];
    this._patternStops = newStops;
    this._selectedStopIdx = newStops.length - 1;
    this._emit("smartvanio-pattern-preview", { stops: newStops });
    this.requestUpdate();
  }

  _onStopDrag(e, stopIdx, stops) {
    e.stopPropagation();
    e.preventDefault();
    const wrap = e.target.closest('.pat-editor');
    const track = wrap?.querySelector('.pat-handle-track');
    const trackRect = (track || wrap).getBoundingClientRect();
    this._selectedStopIdx = stopIdx;
    const startY = e.clientY;
    let removedByDrag = false;

    const max = this._maxPos;
    const onMove = (ev) => {
      const dy = Math.abs(ev.clientY - startY);
      // If dragged far off vertically and more than 2 stops, remove it
      if (dy > 80 && stops.length > 2) {
        if (!removedByDrag) {
          removedByDrag = true;
          this._patternStops = stops.filter((_, j) => j !== stopIdx);
          this._selectedStopIdx = null;
          this._emit("smartvanio-pattern-preview", { stops: this._patternStops });
          this.requestUpdate();
        }
        return;
      }
      const x = ev.clientX - trackRect.left;
      let pos = Math.round((x / trackRect.width) * max);
      pos = Math.max(0, Math.min(max, pos));
      const updated = [...this._patternStops];
      updated[stopIdx] = { ...updated[stopIdx], pos };
      this._patternStops = updated;
      this._emit("smartvanio-pattern-preview", { stops: updated });
      this.requestUpdate();
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  _updateStop(idx, field, value) {
    const stops = [...(this._patternStops ?? [])];
    if (!stops[idx]) return;
    if (field === 'color') {
      const hex = value.replace('#', '');
      stops[idx] = {
        ...stops[idx],
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    } else {
      stops[idx] = { ...stops[idx], [field]: value };
    }
    this._patternStops = stops;
    this._emit("smartvanio-pattern-preview", { stops: stops });
    this.requestUpdate();
  }

  // ─── Automations section (shared by inline and tabbed views) ─────

  _renderAutomationsSection() {
    return html`
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
            <div class="automation-row-v2">
              <div class="auto-row-trigger">
                <span class="auto-row-label-text">Trigger</span>
                <smartvanio-entity-picker
                  .hass=${this.hass}
                  .value=${row.source_entity_id}
                  .domains=${["binary_sensor", "button", "switch"]}
                  pinned-entity=${this.entityId}
                  placeholder="Select trigger…"
                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "source_entity_id", value: e.detail.value })}
                ></smartvanio-entity-picker>
                <smartvanio-select
                  .value=${row.gesture}
                  .options=${this._eventsForSource(row.source_entity_id).map((ev) => ({
                    value: ev.value,
                    label: ev.label,
                  }))}
                  placeholder="— event —"
                  ?disabled=${!row.source_entity_id}
                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "gesture", value: e.detail.value })}
                ></smartvanio-select>
              </div>
              <div class="auto-row-target">
                <span class="auto-row-label-text">Target</span>
                <smartvanio-entity-picker
                  .hass=${this.hass}
                  .value=${row.target_entity_id}
                  .domains=${["light", "switch", "fan", "scene", "cover", "lock"]}
                  pinned-entity=${this.entityId}
                  placeholder="Select target…"
                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "target_entity_id", value: e.detail.value })}
                ></smartvanio-entity-picker>
              </div>
              <div class="auto-row-action">
                <span class="auto-row-label-text">Action</span>
                <smartvanio-select
                  .value=${row.action}
                  .options=${this._actionsForEntity(row.target_entity_id).map((act) => ({
                    value: act,
                    label: this._actionLabel(act),
                  }))}
                  placeholder="— select —"
                  ?disabled=${!row.target_entity_id}
                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "action", value: e.detail.value })}
                ></smartvanio-select>
                ${row.action === "turn_on_for" ? html`
                  <div class="auto-duration-input">
                    <input type="number" min="1" max="480" .value=${row.duration || "5"}
                      @input=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "duration", value: e.target.value })}
                    />
                    <span class="auto-duration-unit">min</span>
                  </div>
                ` : ""}
                ${row.action === "set_brightness" ? html`
                  <div class="auto-brightness-input">
                    <input type="range" min="1" max="100" .value=${row.brightness_pct || "50"}
                      @input=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "brightness_pct", value: e.target.value })}
                    />
                    <span class="auto-brightness-value">${row.brightness_pct || 50}%</span>
                  </div>
                ` : ""}
              </div>
              <button
                class="delete-row-btn auto-row-delete"
                @click=${() => this._emit("smartvanio-remove-edit-row", { id: i })}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
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
    const haDeviceId = this.hass?.entities?.[entity_id]?.device_id;
    const haDevice = haDeviceId ? this.hass?.devices?.[haDeviceId] : null;
    const deviceName = haDevice?.name_by_user ?? haDevice?.name ?? null;
    const override = this.hass?.entities?.[entity_id]?.name;
    const friendly = this.hass?.states[entity_id]?.attributes?.friendly_name ?? '';
    // Strip device name prefix from friendly_name (same as main card _label)
    const label = override || (deviceName && friendly.startsWith(deviceName + ' ')
      ? friendly.slice(deviceName.length + 1)
      : friendly || entity_id.split('.').pop());

    const view = this._modalView ?? (this.isLight ? 'control' : 'settings');

    return html`
      <div
        class="modal-overlay"
        @click=${(e) => { if (e.target === e.currentTarget) this._emit("smartvanio-modal-close"); }}
      >
        <div class="modal ${view === 'control' ? 'modal-control' : ''}">
          <div class="modal-header">
            ${view === 'settings' && this.isLight ? html`
              <button class="modal-header-btn" @click=${() => { this._modalView = 'control'; }}>
                <ha-icon icon="mdi:arrow-left" style="--mdc-icon-size:20px"></ha-icon>
              </button>
            ` : ''}
            <span>${view === 'control' ? label : `Edit ${label}`}${deviceName ? html`<span class="modal-header-device">${deviceName}</span>` : ''}</span>
            <div class="modal-header-actions">
              ${view === 'control' && this.isLight ? html`
                <button class="modal-header-btn" @click=${() => { this._modalView = 'settings'; }}>
                  <ha-icon icon="mdi:cog" style="--mdc-icon-size:20px"></ha-icon>
                </button>
              ` : ''}
              <button class="modal-close" @click=${() => this._emit("smartvanio-modal-close")}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
          </div>

          ${view === 'control' ? html`
            <div class="modal-body">
              ${this._renderControlView()}
            </div>
          ` : html`
          <div class="modal-body two-col">
            ${this.editLoading
              ? html`<div class="modal-loading">Loading…</div>`
              : html`
                  <div class="modal-col-left">
                    <div class="modal-section">
                      <label class="modal-label">Display Name</label>
                      <input
                        class="modal-input"
                        type="text"
                        .value=${this.editName ?? ""}
                        @input=${(e) => this._emit("smartvanio-update-edit-name", { value: e.target.value })}
                      />
                    </div>

                    <div class="modal-section">
                      <label class="modal-label">Area</label>
                      ${this._renderAreaPicker()}
                    </div>

                    ${this.isSwitch && this.switchMode ? html`
                    <div class="modal-section">
                      <label class="modal-label">Relay Mode</label>
                      <smartvanio-select
                        .value=${this.switchMode.current}
                        .options=${(this.switchMode.options ?? []).map(o => ({ value: o, label: o }))}
                        @smartvanio-change=${(e) => this._emit("smartvanio-set-switch-mode", { value: e.detail.value })}
                      ></smartvanio-select>
                      <p class="switch-mode-hint">Choose "Normally Closed" for relays wired NC, so this switch reflects the device's real power state (on = circuit closed).</p>
                    </div>
                    ` : ""}

                    ${this.isTank ? this._renderCalibrationSection() : ""}
                  </div>

                  <div class="modal-col-right">
                    ${this.isLight ? html`
                      <div class="right-tabs">
                        <button class="right-tab ${(this._rightTab ?? 'segments') === 'segments' ? 'active' : ''}"
                          @click=${() => { this._rightTab = 'segments'; this._emit("smartvanio-segment-preview"); }}>Segments</button>
                        <button class="right-tab ${this._rightTab === 'patterns' ? 'active' : ''}"
                          @click=${() => {
                            this._rightTab = 'patterns';
                            // Re-apply pattern preview to strip (may have been showing segments)
                            if (this._patternStops?.length) {
                              this._emit("smartvanio-pattern-preview", { stops: this._patternStops });
                            }
                          }}>Patterns</button>
                        <button class="right-tab ${this._rightTab === 'automations' ? 'active' : ''}"
                          @click=${() => { this._rightTab = 'automations'; }}>Automations</button>
                      </div>
                      ${(this._rightTab ?? 'segments') === 'segments'
                        ? this._renderLightSegmentsSection()
                        : this._rightTab === 'patterns'
                          ? this._renderPatternsSection()
                          : this._renderAutomationsSection()}
                    ` : this.isSensor ? html`
                    <!-- Simplified sensor automation: value above/below threshold → target → action -->
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
                          <div class="automation-row-v2">
                            <div class="auto-row-condition">
                              <span class="auto-row-label-text">When value is</span>
                              <div class="sensor-condition-row">
                                <smartvanio-select
                                  .value=${row.gesture || 'above'}
                                  .options=${[
                                    { value: 'above', label: 'Above' },
                                    { value: 'below', label: 'Below' },
                                  ]}
                                  @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "gesture", value: e.detail.value })}
                                ></smartvanio-select>
                                <input type="number" class="sensor-threshold-input"
                                  placeholder="Value"
                                  .value=${row.threshold ?? ''}
                                  @input=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "threshold", value: e.target.value })} />
                              </div>
                            </div>
                            <div class="auto-row-target">
                              <span class="auto-row-label-text">Target</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${row.target_entity_id}
                                .domains=${["light", "switch", "fan", "scene", "cover", "lock"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select target…"
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "target_entity_id", value: e.detail.value })}
                              ></smartvanio-entity-picker>
                            </div>
                            <div class="auto-row-action">
                              <span class="auto-row-label-text">Action</span>
                              <smartvanio-select
                                .value=${row.action}
                                .options=${this._actionsForEntity(row.target_entity_id).map((act) => ({
                                  value: act,
                                  label: this._actionLabel(act),
                                }))}
                                placeholder="— select —"
                                ?disabled=${!row.target_entity_id}
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "action", value: e.detail.value })}
                              ></smartvanio-select>
                            </div>
                            <button
                              class="delete-row-btn auto-row-delete"
                              @click=${() => this._emit("smartvanio-remove-edit-row", { id: i })}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </div>
                        `,
                      )}
                    </div>
                  ` : html`
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
                          <div class="automation-row-v2">
                            <div class="auto-row-trigger">
                              <span class="auto-row-label-text">Trigger</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${row.source_entity_id}
                                .domains=${["binary_sensor", "button", "switch"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select trigger…"
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "source_entity_id", value: e.detail.value })}
                              ></smartvanio-entity-picker>
                              <smartvanio-select
                                .value=${row.gesture}
                                .options=${this._eventsForSource(row.source_entity_id).map((ev) => ({
                                  value: ev.value,
                                  label: ev.label,
                                }))}
                                placeholder="— event —"
                                ?disabled=${!row.source_entity_id}
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "gesture", value: e.detail.value })}
                              ></smartvanio-select>
                            </div>
                            <div class="auto-row-target">
                              <span class="auto-row-label-text">Target</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${row.target_entity_id}
                                .domains=${["light", "switch", "fan", "scene", "cover", "lock"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select target…"
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "target_entity_id", value: e.detail.value })}
                              ></smartvanio-entity-picker>
                            </div>
                            <div class="auto-row-action">
                              <span class="auto-row-label-text">Action</span>
                              <smartvanio-select
                                .value=${row.action}
                                .options=${this._actionsForEntity(row.target_entity_id).map((act) => ({
                                  value: act,
                                  label: this._actionLabel(act),
                                }))}
                                placeholder="— select —"
                                ?disabled=${!row.target_entity_id}
                                @smartvanio-change=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "action", value: e.detail.value })}
                              ></smartvanio-select>
                              ${row.action === "turn_on_for" ? html`
                                <div class="auto-duration-input">
                                  <input type="number" min="1" max="480" .value=${row.duration || "5"}
                                    @input=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "duration", value: e.target.value })}
                                  />
                                  <span class="auto-duration-unit">min</span>
                                </div>
                              ` : ""}
                              ${row.action === "set_brightness" ? html`
                                <div class="auto-brightness-input">
                                  <input type="range" min="1" max="100" .value=${row.brightness_pct || "50"}
                                    @input=${(e) => this._emit("smartvanio-update-edit-row", { id: i, field: "brightness_pct", value: e.target.value })}
                                  />
                                  <span class="auto-brightness-value">${row.brightness_pct || 50}%</span>
                                </div>
                              ` : ""}
                            </div>
                            <button
                              class="delete-row-btn auto-row-delete"
                              @click=${() => this._emit("smartvanio-remove-edit-row", { id: i })}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </div>
                        `,
                      )}
                    </div>
                  `}
                  </div>
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
                area: this.editArea,
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
          `}
        </div>
      </div>
    `;
  }

  _actionsForEntity(entity_id) {
    const domain = entity_id?.split(".")?.[0];
    if (domain === "light")
      return ["toggle", "turn_on", "turn_off", "turn_on_for", "set_brightness"];
    if (domain === "switch" || domain === "fan")
      return ["toggle", "turn_on", "turn_off", "turn_on_for"];
    if (domain === "scene") return ["turn_on"];
    if (domain === "lock") return ["lock", "unlock"];
    if (domain === "cover") return ["open_cover", "close_cover", "stop_cover"];
    return ["toggle"];
  }

  _actionLabel(action) {
    const labels = {
      toggle: "Toggle",
      turn_on: "Turn On",
      turn_off: "Turn Off",
      turn_on_for: "Turn On for…",
      set_brightness: "Set Brightness…",
      lock: "Lock",
      unlock: "Unlock",
      open_cover: "Open",
      close_cover: "Close",
      stop_cover: "Stop",
    };
    return labels[action] ?? action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  _eventsForSource(eid) {
    const domain = eid?.split(".")?.[0];
    if (domain === "binary_sensor" || domain === "button") {
      return [
        { value: "press", label: "Pressed" },
        { value: "double_press", label: "Double Pressed" },
        { value: "hold", label: "Held" },
      ];
    }
    if (domain === "switch" || domain === "light" || domain === "fan") {
      return [
        { value: "off_to_on", label: "Turned On" },
        { value: "on_to_off", label: "Turned Off" },
      ];
    }
    if (domain === "cover") {
      return [
        { value: "off_to_on", label: "Opened" },
        { value: "on_to_off", label: "Closed" },
      ];
    }
    if (domain === "lock") {
      return [
        { value: "off_to_on", label: "Unlocked" },
        { value: "on_to_off", label: "Locked" },
      ];
    }
    return [{ value: "press", label: "Activated" }];
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
          align-items: stretch;
          justify-content: center;
          z-index: 1000;
          padding: 0;
        }

        .modal {
          background: var(--card-background-color, #fff);
          border-radius: 16px;
          width: 100%;
          max-width: 1060px;
          max-height: 100dvh;
          height: 100dvh;
          border-radius: 0;
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

        .modal-header-device {
          display: block;
          font-size: 11px;
          font-weight: 400;
          color: var(--secondary-text-color);
          margin-top: 2px;
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
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-body.two-col {
          flex-direction: row;
          gap: 24px;
        }

        .modal-col-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          min-width: 0;
        }

        .switch-mode-hint {
          margin: 8px 0 0;
          font-size: 12px;
          line-height: 1.4;
          color: var(--secondary-text-color);
        }

        .modal-col-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          min-width: 0;
        }

        .modal-body.two-col .modal-col-right {
          border-left: 1px solid var(--sv-border, rgba(255, 255, 255, 0.06));
          padding-left: 24px;
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

        /* ── Automation row v2 ──── */

        .automation-row-v2 {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 8px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 4px;
        }

        .auto-row-trigger,
        .auto-row-target,
        .auto-row-action {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .auto-row-trigger > *,
        .auto-row-target > *,
        .auto-row-action > * {
          min-width: 0;
        }

        .auto-row-trigger smartvanio-entity-picker,
        .auto-row-target smartvanio-entity-picker {
          flex: 2;
        }

        .auto-row-trigger smartvanio-select {
          flex: 1;
        }

        .auto-row-action smartvanio-select {
          flex: 1;
        }

        .auto-row-label-text {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--secondary-text-color);
          min-width: 50px;
          width: 50px;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .auto-row-trigger .auto-row-label-text {
          color: var(--primary-color, #4a9eff);
        }

        .auto-row-target .auto-row-label-text {
          color: #ffb830;
        }

        .auto-row-action .auto-row-label-text {
          color: #66bb6a;
        }

        .auto-row-condition .auto-row-label-text {
          color: var(--primary-color, #4a9eff);
        }

        .sensor-condition-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sensor-condition-row smartvanio-select {
          flex: 0 0 auto;
          min-width: 100px;
        }

        .sensor-threshold-input {
          flex: 1;
          min-width: 70px;
          max-width: 120px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--primary-text-color);
          font-size: 14px;
          padding: 9px 12px;
          text-align: center;
          -moz-appearance: textfield;
        }

        .sensor-threshold-input::-webkit-inner-spin-button,
        .sensor-threshold-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .sensor-threshold-input:focus {
          outline: none;
          border-color: var(--primary-color, #4a9eff);
        }

        .auto-duration-input {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .auto-duration-input input[type="number"] {
          width: 60px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--primary-text-color);
          font-size: 14px;
          padding: 9px 12px;
          text-align: center;
          -moz-appearance: textfield;
        }
        .auto-duration-input input[type="number"]::-webkit-inner-spin-button,
        .auto-duration-input input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .auto-duration-input input:focus {
          outline: none;
          border-color: var(--primary-color, #4a9eff);
        }

        .auto-duration-unit {
          font-size: 13px;
          color: var(--secondary-text-color);
        }

        .auto-brightness-input {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .auto-brightness-input input[type="range"] {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          outline: none;
        }
        .auto-brightness-input input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color, #4a9eff);
          cursor: pointer;
        }

        .auto-brightness-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          min-width: 36px;
          text-align: right;
        }

        .auto-row-trigger,
        .auto-row-target,
        .auto-row-action {
          grid-column: 1;
        }

        .auto-row-delete {
          grid-column: 2;
          grid-row: 1 / -1;
          align-self: center;
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
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
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

        .seg-name-input {
          min-width: 0;
          flex: 1;
        }

        /* Segment brightness slider */
        .seg-bri-slider-wrap {
          flex: 1;
          position: relative;
          height: 36px;
          cursor: pointer;
          touch-action: none;
          user-select: none;
        }
        .seg-bri-track {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
        }
        .seg-bri-fill {
          height: 100%;
          background: var(--seg-color, var(--primary-color));
          opacity: 0.3;
          width: calc(12px + (100% - 24px) * var(--seg-bri, 100) / 100);
        }
        .seg-bri-thumb {
          position: absolute;
          top: 50%;
          left: calc(12px + (100% - 24px) * var(--seg-bri, 100) / 100);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--seg-color, var(--primary-color));
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .seg-bri-value {
          font-size: 12px;
          color: var(--secondary-text-color, #888);
          min-width: 32px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Swatch color picker in segment list */
        .seg-list-swatch-label {
          position: relative;
          display: inline-flex;
          cursor: pointer;
          flex-shrink: 0;
        }
        .seg-list-color-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
        }

        /* ── Visual strip editor ──── */
        .strip-wrap {
          margin: 8px 0 12px;
        }

        .strip-bar {
          position: relative;
          width: 100%;
          height: 64px;
          background: repeating-linear-gradient(
            90deg,
            var(--secondary-background-color, #222) 0px,
            var(--secondary-background-color, #222) 1px,
            transparent 1px,
            transparent 10px
          );
          border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
          border-radius: 8px;
          cursor: pointer;
          overflow: visible;
          touch-action: none;
        }

        .strip-seg {
          position: absolute;
          top: 2px;
          bottom: 2px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.15s;
          min-width: 12px;
          z-index: 1;
        }

        .strip-seg.selected {
          box-shadow: 0 0 0 2px var(--primary-color, #03a9f4);
          z-index: 2;
        }
        .strip-seg.drag-removing {
          z-index: 10;
          transition: none;
        }
        .strip-seg-color {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
          pointer-events: none;
        }

        .strip-seg-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(0,0,0,0.7);
          text-shadow: 0 1px 2px rgba(255,255,255,0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 6px;
          pointer-events: none;
        }

        .strip-handle {
          position: absolute;
          top: -4px;
          bottom: -4px;
          width: 28px;
          cursor: col-resize;
          z-index: 3;
          touch-action: none;
        }
        .strip-handle::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 28px;
          border-radius: 3px;
          background: rgba(255,255,255,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .strip-handle-l {
          left: -8px;
        }
        .strip-handle-l::after {
          left: 10px;
        }
        .strip-handle-r {
          right: -8px;
        }
        .strip-handle-r::after {
          right: 10px;
        }
        .strip-handle:hover::after,
        .strip-handle:active::after {
          background: rgba(255,255,255,1);
          height: 32px;
          width: 6px;
        }

        .strip-ticks {
          position: absolute;
          bottom: -16px;
          left: 0;
          right: 0;
          height: 12px;
          pointer-events: none;
        }
        .strip-tick {
          position: absolute;
          font-size: 9px;
          color: var(--secondary-text-color, #888);
          transform: translateX(-50%);
        }

        .seg-detail {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          margin-top: 8px;
        }
        .seg-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .seg-hint {
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 12px 0 4px;
        }

        /* Segment list */
        .seg-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 8px;
          border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
          padding-top: 8px;
        }
        .seg-list-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.15s;
        }
        .seg-list-item:hover { background: rgba(255,255,255,0.05); }
        .seg-list-item.active { background: rgba(var(--rgb-primary-color, 66,135,245), 0.15); outline: 1px solid rgba(var(--rgb-primary-color, 66,135,245), 0.5); }
        .seg-list-swatch {
          width: 14px; height: 14px;
          border-radius: 3px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .seg-list-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .seg-list-range {
          color: var(--secondary-text-color, #888);
          font-size: 12px;
          flex-shrink: 0;
        }
        .seg-list-bri {
          color: var(--secondary-text-color, #888);
          font-size: 12px;
          flex-shrink: 0;
          min-width: 32px;
          text-align: right;
        }
        .seg-list-del {
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          cursor: pointer;
          padding: 2px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .seg-list-del:hover { opacity: 1; color: var(--error-color, #f44); }

        /* Right column tabs (Segments / Patterns / Automations) */
        .right-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        }
        .right-tab {
          flex: 1;
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 10px 12px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .right-tab:hover { color: var(--primary-text-color, #fff); }
        .right-tab.active {
          color: var(--primary-color, #4287f5);
          border-bottom-color: var(--primary-color, #4287f5);
        }

        /* Pattern gradient editor */
        /* ── Pattern editor (cssgradient.io inspired) ──── */
        .pat-section { display: flex; flex-direction: column; gap: 12px; }

        .pat-editor {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .pat-bar-wrap {
          position: relative;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        }
        .pat-bar-bg {
          position: absolute; inset: 0;
          background: repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%) 0 0 / 12px 12px;
        }
        .pat-bar {
          position: absolute; inset: 0;
          cursor: crosshair;
        }

        /* Stop handle track — overlaps bottom of gradient bar */
        .pat-handle-track {
          position: relative;
          height: 28px;
          margin: -6px 11px 0;
          cursor: crosshair;
          overflow: visible;
          z-index: 3;
        }
        .pat-handle {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          cursor: grab;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }
        .pat-handle-arrow {
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid rgba(255,255,255,0.4);
          transition: border-bottom-color 0.15s;
        }
        .pat-handle-color {
          width: 22px; height: 22px;
          border-radius: 4px;
          border: 2.5px solid rgba(255,255,255,0.55);
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pat-handle:active { cursor: grabbing; }
        .pat-handle:hover .pat-handle-color {
          border-color: rgba(255,255,255,0.85);
        }
        .pat-handle.selected .pat-handle-color {
          border-color: var(--primary-color, #4287f5);
          box-shadow: 0 0 0 2px var(--primary-color, #4287f5), 0 1px 4px rgba(0,0,0,0.5);
        }
        .pat-handle.selected .pat-handle-arrow {
          border-bottom-color: var(--primary-color, #4287f5);
        }

        /* Selected stop controls */
        .pat-stop-ctrl {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--secondary-background-color, rgba(255,255,255,0.04));
          border-radius: 8px;
        }
        .pat-color-label {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pat-color-preview {
          width: 40px; height: 40px;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }
        .pat-color-input {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
          border: none; padding: 0;
        }
        .pat-field-label {
          font-size: 10px;
          color: var(--secondary-text-color, #888);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .pat-hex-wrap, .pat-pos-wrap {
          display: flex;
          flex-direction: column;
        }
        .pat-hex-input {
          width: 72px;
          background: var(--card-background-color, #1c1c1c);
          color: var(--primary-text-color, #fff);
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 13px;
          font-family: monospace;
        }
        .pat-pos-input {
          width: 56px;
          background: var(--card-background-color, #1c1c1c);
          color: var(--primary-text-color, #fff);
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 13px;
          text-align: center;
        }
        .pat-stop-del {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--secondary-text-color, #999);
          cursor: pointer;
          padding: 6px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .pat-stop-del:hover { opacity: 1; color: var(--error-color, #f44); }
        .pat-stop-del:disabled { opacity: 0.15; cursor: default; }

        .pat-hint {
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 8px 0;
        }

        /* Save row */
        .pat-save-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .pat-name-input { flex: 1; }
        .pat-save-btn { flex-shrink: 0; min-width: 60px; }

        /* Saved patterns list */
        .pat-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
          padding-top: 8px;
        }
        .pat-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .pat-list-item:hover { background: rgba(255,255,255,0.05); }
        .pat-list-item.active {
          background: rgba(var(--rgb-primary-color, 66,135,245), 0.15);
          outline: 1px solid rgba(var(--rgb-primary-color, 66,135,245), 0.5);
        }
        .pat-list-grad {
          width: 48px; height: 24px;
          border-radius: 4px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .pat-list-name {
          flex: 1;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pat-list-del {
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          cursor: pointer;
          padding: 2px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .pat-list-del:hover { opacity: 1; color: var(--error-color, #f44); }

        .pat-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          border: 1px dashed var(--divider-color, rgba(255,255,255,0.15));
          border-radius: 8px;
          background: none;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .pat-add-btn:hover {
          color: var(--primary-text-color, #fff);
          border-color: var(--primary-color, #4287f5);
        }

        .seg-max-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .seg-max-label {
          font-size: 12px;
          color: var(--secondary-text-color, #888);
        }
        .seg-max-input {
          width: 60px;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          text-align: center;
        }

        /* ── Area picker ──── */
        .area-picker {
          position: relative;
        }
        .area-picker-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          box-sizing: border-box;
          text-align: left;
        }
        .area-picker-placeholder {
          color: var(--secondary-text-color, #888);
        }
        /* ── Area picker sheet (full-screen modal, escapes parent clipping) ── */
        .area-picker-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          animation: ap-fade-in 0.18s ease-out;
        }
        @keyframes ap-fade-in {
          from { background: rgba(0, 0, 0, 0); }
          to   { background: rgba(0, 0, 0, 0.55); }
        }
        .area-picker-sheet {
          background: var(--card-background-color, #fff);
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 0 0 18px 18px;
          width: min(640px, 100%);
          max-height: 92dvh;
          display: flex;
          flex-direction: column;
          padding: 14px;
          gap: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          animation: ap-slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ap-slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .area-picker-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 2px 4px;
        }
        .area-picker-sheet-title {
          font-size: 17px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .area-picker-sheet-close {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
          border-radius: 22px;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .area-picker-sheet-close:hover {
          background: var(--divider-color, rgba(0,0,0,0.12));
          color: var(--primary-text-color);
        }
        .area-picker-search {
          width: 100%;
          font-size: 16px;  /* >=16px prevents iOS auto-zoom on focus */
          font-family: inherit;
          padding: 14px 16px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 12px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .area-picker-search:focus { border-color: var(--primary-color); }
        .area-picker-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          touch-action: pan-y;
          margin: 0 -4px;
          padding: 0 4px 4px;
        }
        .area-picker-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          cursor: pointer;
          font-size: 15px;
          border-radius: 10px;
          transition: background 0.15s;
          touch-action: manipulation;
        }
        .area-picker-item:hover { background: var(--secondary-background-color, #f5f5f5); }
        .area-picker-item:active { background: var(--divider-color, rgba(0,0,0,0.08)); }
        .area-picker-item.selected {
          color: var(--primary-color);
          font-weight: 600;
          background: color-mix(in srgb, var(--primary-color, #4a9eff) 12%, transparent);
        }
        .area-picker-item.clear {
          color: var(--error-color, #db4437);
          font-size: 14px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.08));
          margin-bottom: 4px;
          border-radius: 10px 10px 0 0;
        }
        .area-picker-empty {
          padding: 24px 16px;
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 14px;
        }

        /* ── Modal header actions ──── */
        .modal-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .modal-header-btn {
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
        .modal-header-btn:hover {
          color: var(--primary-text-color);
        }

        /* ── Control view (compact modal for lights) ──── */
        .modal.modal-control {
          max-width: 400px;
        }
        .ctrl-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .ctrl-power-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .ctrl-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ctrl-status-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .ctrl-power-btn {
          background: none;
          border: 2px solid var(--divider-color, rgba(255,255,255,0.1));
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--secondary-text-color);
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .ctrl-power-btn.on {
          color: var(--primary-color, #4a9eff);
          border-color: var(--primary-color, #4a9eff);
        }
        .ctrl-power-btn:hover { opacity: 0.8; }
        .ctrl-bri-bar {
          position: relative;
          width: 100%;
          height: 40px;
          border-radius: 20px;
          background: var(--secondary-background-color, #1a1a2e);
          cursor: pointer;
          touch-action: none;
        }
        .ctrl-bri-track {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
        }
        .ctrl-bri-fill {
          height: 100%;
          background: var(--bri-color, var(--primary-color));
          opacity: 0.25;
          width: calc(20px + (100% - 40px) * var(--bri, 0) / 100);
        }
        .ctrl-bri-thumb {
          position: absolute;
          top: 50%;
          left: calc(20px + (100% - 40px) * var(--bri, 0) / 100);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bri-color, var(--primary-color));
          border: 3px solid #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ctrl-wheel-wrap {
          position: relative;
          width: 200px;
          height: 200px;
        }
        .ctrl-color-wheel {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          cursor: pointer;
          touch-action: none;
        }
        .ctrl-wheel-indicator {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ctrl-presets {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .ctrl-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.15s, transform 0.15s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .ctrl-swatch:hover { transform: scale(1.15); border-color: var(--primary-text-color); }
        .ctrl-patterns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          width: 100%;
        }
        .ctrl-pattern-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 6px;
          transition: border-color 0.15s, transform 0.15s;
          min-width: 60px;
          flex: 1;
        }
        .ctrl-pattern-gradient {
          width: 100%;
          height: 24px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .ctrl-pattern-name {
          font-size: 11px;
          color: var(--secondary-text-color);
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ctrl-pattern-chip:hover { transform: scale(1.05); border-color: var(--primary-text-color); }
        .ctrl-pattern-chip.active { border-color: var(--primary-color, #4a9eff); box-shadow: 0 0 8px rgba(74, 158, 255, 0.4); }
        .ctrl-pattern-chip.active .ctrl-pattern-name { color: var(--primary-color, #4a9eff); }

        /* ── Responsive: tablets & smaller screens ──── */
        @media (max-width: 900px) {
          .modal-body.two-col {
            flex-direction: column;
          }
          .modal-body.two-col .modal-col-right {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--sv-border, rgba(255, 255, 255, 0.06));
            padding-top: 16px;
          }
        }

        @media (max-width: 768px) {
          .modal-header { padding: 12px 14px; font-size: 15px; }
          .modal-body { padding: 14px; gap: 16px; }
          .modal-input {
            font-size: 16px;
            padding: 10px 12px;
          }
          .cal-input {
            font-size: 16px;
            padding: 10px 12px;
          }
          .seg-max-input {
            font-size: 16px;
            padding: 10px 12px;
            width: 70px;
          }
          .seg-name-input {
            font-size: 16px !important;
            padding: 10px 12px !important;
          }
          .seg-detail {
            padding: 14px;
          }
          .seg-detail-row { gap: 10px; }
          .seg-field-label { font-size: 12px; }
          .strip-bar { height: 72px; }
          .strip-handle { width: 36px; }
          .strip-handle-l { left: -12px; }
          .strip-handle-r { right: -12px; }
          .strip-handle::after {
            width: 6px;
            height: 32px;
          }
          .strip-seg-label { font-size: 11px; }
          .seg-list-item {
            padding: 10px 10px;
            font-size: 14px;
          }
          .pat-bar-wrap { height: 56px; }
          .pat-handle-color { width: 26px; height: 26px; }
          .pat-hex-input, .pat-pos-input {
            font-size: 16px;
            padding: 8px 10px;
          }
          .pat-color-preview { width: 44px; height: 44px; }
          .right-tab {
            font-size: 14px;
            padding: 12px;
          }
          .modal-btn {
            padding: 12px 24px;
            font-size: 15px;
          }
          .add-row-btn {
            padding: 8px 14px;
            font-size: 14px;
          }
        }
      `,
    ];
  }
}

customElements.define("smartvanio-modal-edit", VanCtlModalEdit);
