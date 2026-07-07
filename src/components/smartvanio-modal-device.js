import { LitElement, html, css } from "lit";
import "./smartvanio-select.js";

class SmartVanModalDevice extends LitElement {
  static get properties() {
    return {
      hass:          { type: Object },
      device:        { type: Object },
      deviceId:      { type: String, attribute: "device-id" },
      entities:      { type: Array },
      inCardEids:    { type: Object },
      slots:         { type: Object },
      _tab:          { type: String, state: true },
      _calTab:       { type: String, state: true },  // which sensor channel tab
      _calData:      { type: Object, state: true },
      _calSaving:    { type: Boolean, state: true },
      _calNames:     { type: Object, state: true },  // { sensor_1: "Water Tank", ... }
      _renamingSensor: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this.entities = [];
    this.inCardEids = new Set();
    this.slots = {};
    this._tab = "entities";
    this._calTab = "";
    this._calData = {};
    this._calSaving = false;
    this._calNames = {};
    this._renamingSensor = null;
  }

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  // ─── Identify resistive sensor channels ──────────────────

  _getResistiveSensors() {
    const sensors = [];
    for (const e of this.entities) {
      const eid = e.eid;
      const rawMatch = eid.match(/sensor\.(.+?)_(sensor_\d+)_raw$/);
      if (!rawMatch) continue;

      const prefix = rawMatch[1];
      const sensorKey = rawMatch[2];

      const interpEid = `sensor.${prefix}_${sensorKey}_interpolated_value`;
      const interpState = this.hass?.states[interpEid];
      const interpAttrs = interpState?.attributes ?? {};

      // Use the friendly name of the interpolated value entity as the sensor label
      const interpEntry = this.hass?.entities?.[interpEid];
      const defaultLabel = `Sensor ${sensorKey.replace("sensor_", "")}`;
      const friendlyName = interpEntry?.name
        || interpAttrs.friendly_name
        || defaultLabel;

      // Read calibration from the interpolated entity's extra attributes
      const currentPoints = this._parsePoints(
        interpAttrs.calibration_points != null
          ? JSON.stringify(interpAttrs.calibration_points)
          : null
      );
      const currentKind = interpAttrs.calibration_kind ?? "linear";

      // Build MQTT command topics using the deviceId (MQTT device name)
      const devName = this.deviceId || "";
      const pointsCommandTopic = `${devName}/text/${sensorKey}_interpolation_points/command`;
      const kindCommandTopic = `${devName}/select/${sensorKey}_interpolation_kind/command`;

      sensors.push({
        key: sensorKey,
        label: friendlyName,
        defaultLabel,
        rawEid: eid,
        interpEid,
        pointsCommandTopic,
        kindCommandTopic,
        rawValue: parseFloat(e.state?.state ?? 0),
        currentPoints,
        currentKind,
      });
    }
    return sensors;
  }

  _parsePoints(stateStr) {
    if (!stateStr) return [[0, 0], [3.3, 100]];
    try {
      const parsed = JSON.parse(stateStr);
      if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
    } catch {}
    return [[0, 0], [3.3, 100]];
  }

  resetCalData() {
    this._calData = {};
    this._calNames = {};
    this._calTab = "";
  }

  _ensureCalData(sensors) {
    let changed = false;
    const data = { ...this._calData };
    const names = { ...this._calNames };
    for (const s of sensors) {
      if (!data[s.key]) {
        data[s.key] = {
          points: s.currentPoints.map(p => [...p]),
          kind: s.currentKind,
        };
        changed = true;
      }
      if (names[s.key] === undefined) {
        names[s.key] = s.label;
        changed = true;
      }
    }
    if (changed) {
      this._calData = data;
      this._calNames = names;
    }
    // Auto-select first sensor tab
    if (!this._calTab && sensors.length) {
      this._calTab = sensors[0].key;
    }
  }

  // ─── Calibration mutations ─────────────────────────────────

  _updateCalPoint(sensorKey, index, field, value) {
    const data = { ...this._calData };
    const entry = { ...data[sensorKey] };
    const points = entry.points.map(p => [...p]);
    points[index][field] = parseFloat(value);
    entry.points = points;
    data[sensorKey] = entry;
    this._calData = data;
  }

  _captureVoltage(sensorKey, index, liveV) {
    const data = { ...this._calData };
    const entry = { ...data[sensorKey] };
    const points = entry.points.map(p => [...p]);
    points[index][0] = liveV;
    entry.points = points;
    data[sensorKey] = entry;
    this._calData = data;
  }

  _addCalPoint(sensorKey) {
    const data = { ...this._calData };
    const entry = { ...data[sensorKey] };
    entry.points = [...entry.points, [0, 0]];
    data[sensorKey] = entry;
    this._calData = data;
  }

  _removeCalPoint(sensorKey, index) {
    const data = { ...this._calData };
    const entry = { ...data[sensorKey] };
    entry.points = entry.points.filter((_, i) => i !== index);
    data[sensorKey] = entry;
    this._calData = data;
  }

  _updateCalKind(sensorKey, value) {
    const data = { ...this._calData };
    data[sensorKey] = { ...data[sensorKey], kind: value };
    this._calData = data;
  }

  _updateCalName(sensorKey, value) {
    this._calNames = { ...this._calNames, [sensorKey]: value };
  }

  async _mqttPublish(topic, payload) {
    await this.hass.callService("mqtt", "publish", {
      topic,
      payload,
      retain: false,
    });
  }

  async _saveCalibration() {
    this._calSaving = true;
    const sensors = this._getResistiveSensors();

    try {
      for (const s of sensors) {
        const cal = this._calData[s.key];
        if (!cal) continue;

        const sortedPoints = [...cal.points].sort((a, b) => a[0] - b[0]);

        // Save interpolation points via MQTT command topic
        if (s.pointsCommandTopic) {
          await this._mqttPublish(s.pointsCommandTopic, JSON.stringify(sortedPoints));
        }

        // Save interpolation kind via MQTT command topic
        if (s.kindCommandTopic) {
          await this._mqttPublish(s.kindCommandTopic, cal.kind);
        }

        // Rename the interpolated value entity if changed
        const newName = (this._calNames[s.key] ?? "").trim();
        const currentName = this.hass?.entities?.[s.interpEid]?.name;
        if (newName && newName !== s.label && newName !== currentName) {
          await this.hass.callWS({
            type: "config/entity_registry/update",
            entity_id: s.interpEid,
            name: newName,
          });
        }
      }
    } catch (err) {
      console.error("SmartVan: failed to save calibration", err);
    } finally {
      this._calSaving = false;
    }
  }

  // ─── Helpers ───────────────────────────────────────────────

  _defaultDomainIcon(domain) {
    const icons = {
      light: "mdi:lightbulb",
      switch: "mdi:toggle-switch",
      sensor: "mdi:eye",
      binary_sensor: "mdi:door-open",
      number: "mdi:numeric",
      select: "mdi:form-dropdown",
      scene: "mdi:palette",
      script: "mdi:script-text",
    };
    return icons[domain] ?? "mdi:puzzle";
  }

  _label(eid) {
    return (
      this.hass?.entities?.[eid]?.name ||
      this.hass?.states[eid]?.attributes?.friendly_name ||
      eid.split(".").pop()
    );
  }

  // ─── Render ────────────────────────────────────────────────

  render() {
    if (!this.device) return html``;

    const devName = this.device.name_by_user ?? this.device.name ?? "Unknown";
    const resistiveSensors = this._getResistiveSensors();
    this._ensureCalData(resistiveSensors);
    const hasCal = resistiveSensors.length > 0;

    const tabs = [{ id: "entities", label: "Entities" }];
    if (hasCal) tabs.push({ id: "calibration", label: "Calibration" });

    return html`
      <div class="modal-overlay" @click=${(e) => {
        if (e.target === e.currentTarget) this._emit("smartvanio-device-modal-close");
      }}>
        <div class="modal">
          <div class="modal-header">
            <span>${devName}</span>
            <button class="modal-close" @click=${() => this._emit("smartvanio-device-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          ${tabs.length > 1 ? html`
            <div class="tab-bar">
              ${tabs.map(t => html`
                <button class="tab-btn ${this._tab === t.id ? 'active' : ''}"
                  @click=${() => { this._tab = t.id; }}>
                  ${t.label}
                </button>
              `)}
            </div>
          ` : ""}

          <div class="modal-body">
            ${this._tab === "entities" ? this._renderEntitiesTab() : ""}
            ${this._tab === "calibration" ? this._renderCalibrationTab(resistiveSensors) : ""}
          </div>
        </div>
      </div>
    `;
  }

  // ─── Entities tab ──────────────────────────────────────────

  _renderEntitiesTab() {
    const inCard = this.entities.filter(e => this.inCardEids.has(e.eid));
    const notInCard = this.entities.filter(e => !this.inCardEids.has(e.eid));

    return html`
      ${inCard.length ? html`
        <div class="ent-section">
          <div class="ent-label">In card</div>
          ${inCard.map(e => this._renderEntity(e, true))}
        </div>
      ` : ""}
      ${notInCard.length ? html`
        <div class="ent-section">
          <div class="ent-label">Available</div>
          ${notInCard.map(e => this._renderEntity(e, false))}
        </div>
      ` : ""}
      ${!inCard.length && !notInCard.length ? html`
        <div class="empty-msg">No entities found for this device.</div>
      ` : ""}
    `;
  }

  _renderEntity(e, inCard) {
    const domain = e.eid.split(".")[0];
    const icon = e.state.attributes?.icon ?? this._defaultDomainIcon(domain);
    const name = this._label(e.eid);
    const stateVal = e.state.state;
    const unavail = stateVal === "unavailable";
    const unit = e.state.attributes?.unit_of_measurement ?? "";

    return html`
      <div class="ent-row ${inCard ? 'in-card' : ''} ${unavail ? 'unavail' : ''}">
        <ha-icon icon="${icon}" style="--mdc-icon-size:16px"></ha-icon>
        <span class="ent-name" title="${e.eid}">${name}</span>
        <span class="ent-state">${unavail ? "N/A" : stateVal}${unit && !unavail ? " " + unit : ""}</span>
        ${inCard
          ? html`<span class="ent-action remove" title="Remove from card"
              @click=${() => this._emit("smartvanio-device-remove-entity", { eid: e.eid, domain })}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
            </span>`
          : html`<span class="ent-action add" title="Add to card"
              @click=${() => this._emit("smartvanio-device-add-entity", { eid: e.eid, domain })}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
            </span>`
        }
      </div>
    `;
  }

  // ─── Calibration tab ───────────────────────────────────────

  _renderCalibrationTab(sensors) {
    const active = sensors.find(s => s.key === this._calTab) ?? sensors[0];
    if (!active) return html`<div class="empty-msg">No sensors found.</div>`;

    return html`
      ${sensors.length > 1 ? html`
        <div class="cal-tabs">
          ${sensors.map(s => html`
            <button class="cal-tab ${this._calTab === s.key ? 'active' : ''}"
              @click=${() => { this._calTab = s.key; }}>
              ${this._calNames[s.key] || s.defaultLabel}
            </button>
          `)}
        </div>
      ` : ""}
      ${this._renderSensorCalibration(active)}
      <div class="cal-footer">
        <button class="modal-btn save" ?disabled=${this._calSaving}
          @click=${() => this._saveCalibration()}>
          ${this._calSaving ? "Saving..." : "Save Calibration"}
        </button>
      </div>
    `;
  }

  _renderSensorCalibration(sensor) {
    const cal = this._calData[sensor.key] ?? { points: [], kind: "linear" };
    const liveV = parseFloat(this.hass?.states[sensor.rawEid]?.state ?? 0);
    const interpState = this.hass?.states[sensor.interpEid];
    const interpVal = interpState?.state ?? "\u2014";
    const sensorName = this._calNames[sensor.key] ?? sensor.label;

    return html`
      <div class="cal-sensor">
        <div class="cal-sensor-header">
          <div class="cal-name-row">
            <label class="cal-name-label">Name</label>
            <input type="text" class="cal-name-input"
              .value=${sensorName}
              @input=${(e) => this._updateCalName(sensor.key, e.target.value)}
              placeholder="${sensor.defaultLabel}"
            />
          </div>
          <div class="cal-live-values">
            <div class="cal-live-item">
              <span class="cal-live-label">Raw</span>
              <span class="cal-live-value">${liveV.toFixed(3)} V</span>
            </div>
            <div class="cal-live-item">
              <span class="cal-live-label">Value</span>
              <span class="cal-live-value interp">${interpVal}</span>
            </div>
          </div>
        </div>

        <div class="cal-table">
          <div class="cal-header-row">
            <span class="cal-col-hdr">Voltage (V)</span>
            <span class="cal-col-hdr">Mapped Value</span>
            <span></span><span></span>
          </div>

          ${cal.points.map((pt, i) => html`
            <div class="cal-row">
              <input type="number" class="cal-input" min="0" max="5" step="0.001"
                .value=${String(pt[0])}
                @change=${(e) => this._updateCalPoint(sensor.key, i, 0, e.target.value)}
              />
              <input type="number" class="cal-input" min="0" step="1"
                .value=${String(pt[1])}
                @change=${(e) => this._updateCalPoint(sensor.key, i, 1, e.target.value)}
              />
              <button class="capture-btn" title="Capture current voltage"
                @click=${() => this._captureVoltage(sensor.key, i, liveV)}>
                <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
              </button>
              <button class="delete-row-btn" title="Remove point"
                @click=${() => this._removeCalPoint(sensor.key, i)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `)}
        </div>

        <button class="add-row-btn" @click=${() => this._addCalPoint(sensor.key)}>
          <ha-icon icon="mdi:plus"></ha-icon> Add Point
        </button>

        <div class="cal-kind-row">
          <label class="cal-kind-label">Interpolation</label>
          <smartvanio-select
            .value=${cal.kind}
            .options=${[
              { value: "linear",    label: "Linear" },
              { value: "cubic",     label: "Cubic" },
              { value: "quadratic", label: "Quadratic" },
              { value: "slinear",   label: "Smooth Linear" },
            ]}
            @smartvanio-change=${(e) => this._updateCalKind(sensor.key, e.detail.value)}
          ></smartvanio-select>
        </div>
      </div>
    `;
  }

  // ─── Styles ────────────────────────────────────────────────

  static get styles() {
    return css`
      :host { display: block; }

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
        max-width: 680px;
        max-height: 88dvh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        font-size: 17px;
        font-weight: 600;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }

      .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        color: var(--secondary-text-color);
        transition: color 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .modal-close:hover { color: var(--primary-text-color); }
      .modal-close ha-icon { --mdc-icon-size: 22px; }

      /* ── Top-level tabs ──���─ */
      .tab-bar {
        display: flex;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        padding: 0 22px;
        flex-shrink: 0;
      }

      .tab-btn {
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 12px 18px;
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .tab-btn.active {
        color: var(--primary-color, #03a9f4);
        border-bottom-color: var(--primary-color, #03a9f4);
      }
      .tab-btn:hover:not(.active) {
        color: var(--primary-text-color);
      }

      /* ── Body ──── */
      .modal-body {
        padding: 18px 22px;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .empty-msg {
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 14px;
        padding: 24px 0;
      }

      /* ── Entity rows ──── */
      .ent-section {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ent-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        opacity: 0.7;
      }

      .ent-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 13px;
        color: var(--secondary-text-color);
        transition: background 0.15s;
      }
      .ent-row:hover { background: var(--secondary-background-color); }
      .ent-row.in-card { color: var(--primary-text-color); }
      .ent-row.unavail { opacity: 0.4; }

      .ent-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .ent-state {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        opacity: 0.6;
      }

      .ent-action {
        cursor: pointer;
        opacity: 0.4;
        transition: opacity 0.15s, color 0.15s;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .ent-action:hover { opacity: 1; }
      .ent-action.add { color: var(--success-color, #4caf50); }
      .ent-action.remove { color: var(--error-color, #f44336); }

      /* ── Calibration sensor tabs ──── */
      .cal-tabs {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }

      .cal-tab {
        flex: 1;
        background: var(--secondary-background-color, #f5f5f5);
        border: 2px solid transparent;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s, background 0.2s;
        text-align: center;
        -webkit-tap-highlight-color: transparent;
      }
      .cal-tab.active {
        border-color: var(--primary-color, #03a9f4);
        color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, var(--secondary-background-color, #f5f5f5));
      }
      .cal-tab:hover:not(.active) {
        color: var(--primary-text-color);
      }

      /* ── Calibration panel ──── */
      .cal-sensor {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .cal-sensor-header {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cal-name-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .cal-name-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
      }

      .cal-name-input {
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
      .cal-name-input:focus { border-color: var(--primary-color); }

      .cal-live-values {
        display: flex;
        gap: 16px;
      }

      .cal-live-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
      }

      .cal-live-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .cal-live-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-color);
        font-variant-numeric: tabular-nums;
      }
      .cal-live-value.interp {
        color: var(--success-color, #4caf50);
      }

      /* ── Calibration table ──── */
      .cal-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cal-header-row {
        display: grid;
        grid-template-columns: 1fr 1fr 44px 44px;
        gap: 8px;
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
        grid-template-columns: 1fr 1fr 44px 44px;
        gap: 8px;
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
        transition: border-color 0.2s;
      }
      .cal-input:focus { border-color: var(--primary-color); }

      .capture-btn {
        width: 44px;
        height: 44px;
        background: none;
        border: 1px solid var(--primary-color);
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        transition: background 0.15s;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .capture-btn:hover {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .capture-btn ha-icon { --mdc-icon-size: 20px; }

      .delete-row-btn {
        width: 44px;
        height: 44px;
        background: none;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--error-color, #f44336);
        opacity: 0.6;
        transition: opacity 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .delete-row-btn:hover { opacity: 1; }
      .delete-row-btn ha-icon { --mdc-icon-size: 20px; }

      .add-row-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: none;
        border: 1px solid var(--primary-color, #03a9f4);
        border-radius: 10px;
        color: var(--primary-color);
        font-size: 14px;
        font-weight: 500;
        padding: 10px 16px;
        cursor: pointer;
        transition: background 0.15s;
        align-self: flex-start;
        -webkit-tap-highlight-color: transparent;
      }
      .add-row-btn:hover {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .add-row-btn ha-icon { --mdc-icon-size: 18px; }

      .cal-kind-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 4px;
      }

      .cal-kind-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .cal-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 4px;
      }

      .modal-btn {
        padding: 12px 28px;
        border-radius: 10px;
        border: none;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, opacity 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .modal-btn.save {
        background: var(--primary-color, #03a9f4);
        color: white;
      }
      .modal-btn.save:hover { opacity: 0.88; }
      .modal-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
    `;
  }
}

customElements.define("smartvanio-modal-device", SmartVanModalDevice);
