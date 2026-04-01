/**
 * VanCtl HMI Card — tablet-first instrument cluster dashboard.
 *
 * Layout:
 *   ┌────────────────────┬──────────────────────────────┐
 *   │  LEFT PANEL (tabs) │  RIGHT PANEL (accordion)     │
 *   │  ❄️ Climate        │  [Pinned actions strip]      │
 *   │  🎬 Scenes         │  ▶ Lighting (accordion)      │
 *   │  ⚡ Actions        │  ▶ Power (accordion)         │
 *   │  🫧 Level          │  ⚙️ Config button            │
 *   │  📊 Status         │                              │
 *   ├────────────────────┴──────────────────────────────┤
 *   │  Resources bar: Water | Gas | Waste | Fuel | Batt │
 *   └──────────────────────────────────────────────────┘
 */

import {
  LitElement,
  html,
  css,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { GridDragController } from "./grid-drag-controller.js";
import {
  autoPackLayout,
  applyMove,
  rebuildOccupancy,
  migrateFromTileOrder,
  findClosestLayoutKey,
  reflowLayout,
} from "./grid-layout-engine.js";
import "./components/smartvanio-select.js";
import "./components/smartvanio-modal-edit.js";
import "./components/smartvanio-modal-scene.js";
import "./components/smartvanio-tile-light.js";
import "./components/smartvanio-tile-switch.js";
import "./components/smartvanio-tile-tank.js";
import "./components/smartvanio-tile-binary-sensor.js";
import "./components/smartvanio-tile-inclinometer.js";
import "./components/smartvanio-tile-scene.js";


// ── Tab definitions ───────────────────────────────────────
const TABS = [
  { id: "climate", icon: "mdi:thermometer", label: "Climate" },
  { id: "scenes", icon: "mdi:palette", label: "Scenes" },
  { id: "actions", icon: "mdi:lightning-bolt", label: "Automations" },
  { id: "level", icon: "mdi:spirit-level", label: "Level" },
  { id: "status", icon: "mdi:gauge", label: "Status" },
];

// ── Climate arc constants ─────────────────────────────────
const C_CX = 100;
const C_CY = 100;
const C_START = 135;
const C_SWEEP = 270;
const C_WR = 82;
const C_TR = 62;
const C_WL = (C_WR * C_SWEEP * Math.PI) / 180; // ≈386
const C_TL = (C_TR * C_SWEEP * Math.PI) / 180; // ≈292

function polarXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(r, sweepDeg = C_SWEEP) {
  const [sx, sy] = polarXY(C_CX, C_CY, r, C_START);
  const [ex, ey] = polarXY(C_CX, C_CY, r, C_START + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

function waterTempColor(t) {
  if (t < 35) return "#5cacff";
  if (t < 60) return "#f0b72f";
  return "#ff9492";
}

// ── Main component ────────────────────────────────────────
class VanCtlHmiCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _selectedId: { type: String },
      _dragState: { type: Object },
      _pendingTargetTemp: { type: Number },
      _openSections: { type: Object },
      _activeTab: { type: String },
      _setupMode: { type: Boolean },
      _pendingSlots: { type: Object },
      _cardConfig: { type: Object },
      _mqttDeviceConfig: { type: Object },
      _deviceStatuses: { type: Object },
      _knownDevices: { type: Object },
      _editingEntity: { type: String },
      _editName: { type: String },
      _editRows: { type: Array },
      _editSaving: { type: Boolean },
      _editLoading: { type: Boolean },
      _saveError: { type: String },
      _autoModal:       { type: Object },
      _tilePopover:     { type: Object },
      _editingScene:    { type: String },
      _sceneEditName:   { type: String },
      _sceneEditLights: { type: Array },
      _sceneEditSaving: { type: Boolean },
      _dndMode:         { type: Boolean },
    };
  }

  constructor() {
    super();
    this._selectedId = null;
    this._dragState = new Map();
    this._pendingTargetTemp = null;
    this._climateDragging = false;
    this._openSections = {
      groups: true,
      lighting: true,
    };
    this._lpTimer = null;
    this._lpOrigin = null;
    this._activeTab = "climate";
    this._setupMode = false;
    this._pendingSlots = null;
    this._cardConfig = { pinnedActions: [] };
    this._mqttDeviceConfig = null;
    this._mqttUnsub = null;
    this._mqttDevUnsub = null;
    this._statusUnsub = null;
    this._allDevCfgUnsub = null;
    this._deviceStatuses = {};
    this._knownDevices = {};
    this._editingEntity = null;
    this._editName = "";
    this._editRows = [];
    this._editSaving = false;
    this._editLoading = false;
    this._editOriginalIds = {};
    this._saveError = null;
    this._autoModal       = null;
    this._tilePopover     = null;
    this._tileLpTimer     = null;
    this._tileLpOrigin    = null;
    this._editingScene    = null;
    this._sceneEditName   = "";
    this._sceneEditLights = [];
    this._sceneEditSaving = false;
    this._dndMode = false;
    this._gridRo = null;
    this._gridCols = 4;
    this._gridRows = 4;
    this._gridCellW = 72;
    this._gridKey = "4x4";
    this._currentLayout = null;
    this._dragController = new GridDragController(this);
    this._cmMove = (e) => this._onClimatePointerMove(e);
    this._cmUp = () => this._onClimatePointerUp();
  }

  connectedCallback() {
    super.connectedCallback();
    // Set card height = viewport bottom minus our top edge.
    // This works regardless of whether the parent has an explicit height.
    const setH = () => {
      const top = this.getBoundingClientRect().top;
      const h = window.innerHeight - top;
      if (h > 100) this.style.height = `${h}px`;
    };
    this._ro = new ResizeObserver(setH);
    this._ro.observe(document.documentElement);
    requestAnimationFrame(setH);

    // Walk up through HA's shadow DOM tree and make every container
    // transparent so the nebula on :host / body shows through.
    this._applyNebulaBg();
  }

  setConfig(config) {
    if (!config) throw new Error("smartvanio-main-card: config required");
    this.config = config;
    if (config.device_id) this._selectedId = config.device_id;
  }

  shouldUpdate() {
    return true;
  }

  updated(changedProps) {
    super.updated?.(changedProps);
    if (changedProps.has("_selectedId")) {
      if (this._mqttUnsub) {
        this._mqttUnsub();
        this._mqttUnsub = null;
      }
      if (this._selectedId && this.hass) this._subscribeMqttConfig();
    } else if (changedProps.has("hass") && this._selectedId) {
      if (!this._mqttUnsub) this._subscribeMqttConfig();
    }
    // Wildcard subscriptions — established once when hass first available
    if (this.hass && !this._statusUnsub) this._subscribeBoardStatuses();
    if (this.hass && !this._allDevCfgUnsub) this._subscribeAllBoardConfigs();

    // Setup grid ResizeObserver for square cells + layout resolution
    if (!this._setupMode) this._setupGridObserver();
    else { this._gridRo?.disconnect(); this._gridRo = null; }

    // Toggle DnD overflow class
    if (changedProps.has('_dndMode') || changedProps.has('_setupMode')) {
      this.classList.toggle('dnd-active', this._dndMode && !this._setupMode);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
    this._gridRo?.disconnect();
    this._gridRo = null;
    if (this._mqttUnsub) {
      this._mqttUnsub();
      this._mqttUnsub = null;
    }
    if (this._statusUnsub) {
      this._statusUnsub();
      this._statusUnsub = null;
    }
    if (this._allDevCfgUnsub) {
      this._allDevCfgUnsub();
      this._allDevCfgUnsub = null;
    }
    window.removeEventListener("pointermove", this._cmMove);
    window.removeEventListener("pointerup", this._cmUp);
  }

  _applyNebulaBg() {
    const nebula = [
      'radial-gradient(ellipse at 15% 20%, rgba(124,131,255,0.18) 0%, transparent 50%)',
      'radial-gradient(ellipse at 85% 15%, rgba(34,211,238,0.10) 0%, transparent 40%)',
      'radial-gradient(ellipse at 70% 75%, rgba(244,114,182,0.08) 0%, transparent 45%)',
      'radial-gradient(ellipse at 30% 65%, rgba(99,102,241,0.14) 0%, transparent 38%)',
      'radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.05) 0%, transparent 55%)',
      '#0A0E1A',
    ].join(',');

    // 1. Set nebula on html + body
    document.documentElement.style.setProperty('background', nebula, 'important');
    document.body.style.setProperty('background', 'transparent', 'important');

    // 2. Walk up from card through shadow roots, injecting a <style> into
    //    each one to make the host and all HA background vars transparent.
    const CSS_ID = 'smartvanio-nebula';
    const transparentCSS = `
      :host {
        background: transparent !important;
        --primary-background-color: transparent !important;
        --lovelace-background: transparent !important;
        --ha-card-background: transparent !important;
      }
    `;

    let node = this;
    while (node) {
      const root = node.getRootNode();
      if (root instanceof ShadowRoot) {
        if (!root.getElementById(CSS_ID)) {
          const s = document.createElement('style');
          s.id = CSS_ID;
          s.textContent = transparentCSS;
          root.appendChild(s);
        }
        root.host.style.setProperty('background', 'transparent', 'important');
        node = root.host;
      } else if (node.parentElement) {
        node.style.setProperty('background', 'transparent', 'important');
        node = node.parentElement;
      } else {
        break;
      }
    }
  }

  getCardSize() {
    return 8;
  }
  static getStubConfig() {
    return {
      slots: {
        resources: [],
        pitch: "",
        roll: "",
        temperature: "",
        fans: [],
        lights: [],
        switches: [],
        status_sensors: [],
      },
    };
  }

  // ── MQTT config ───────────────────────────────────────────

  async _subscribeMqttConfig() {
    if (!this.hass || !this._selectedId) return;
    const topic = `smartvanio/${this._selectedId}/hmi_config`;
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          // Skip MQTT echo while in DnD mode or right after saving
          if (this._dndMode || this._mqttSaveGuard) return;
          if (msg?.payload) {
            try {
              const cfg = JSON.parse(msg.payload);
              this._cardConfig = { pinnedActions: [], ...cfg };
              // Re-resolve layout for current grid dimensions
              this._currentLayout = null;
              if (this._gridCols > 0) this._applyLayoutForCurrentGrid();
            } catch {
              /* ignore parse errors */
            }
          }
        },
        { type: "mqtt/subscribe", topic },
      );
      this._mqttUnsub = unsub;
    } catch (err) {
      console.warn("[VanCtl HMI] MQTT config subscribe failed:", err);
    }
  }

  async _subscribeBoardStatuses() {
    if (!this.hass) return;
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          if (!msg?.topic || !msg?.payload) return;
          const parts = msg.topic.split("/");
          if (parts.length < 3) return;
          const deviceId = parts[1];
          try {
            const payload = JSON.parse(msg.payload);
            this._deviceStatuses = {
              ...this._deviceStatuses,
              [deviceId]: payload.state === "online" ? "online" : "offline",
            };
          } catch {
            /* ignore */
          }
        },
        { type: "mqtt/subscribe", topic: "smartvanio/+/status" },
      );
      this._statusUnsub = unsub;
    } catch (err) {
      console.warn("[VanCtl HMI] MQTT status subscribe failed:", err);
    }
  }

  async _subscribeAllBoardConfigs() {
    if (!this.hass) return;
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          if (!msg?.payload) return;
          try {
            const cfg = JSON.parse(msg.payload);
            if (!cfg.device_id) return;
            this._knownDevices = {
              ...this._knownDevices,
              [cfg.device_id]: {
                name: cfg.name,
                model: cfg.model,
                firmware: cfg.firmware,
              },
            };
            // Keep single-device config in sync for setup mode auto-populate
            if (cfg.device_id === this._selectedId)
              this._mqttDeviceConfig = cfg;
          } catch {
            /* ignore */
          }
        },
        { type: "mqtt/subscribe", topic: "smartvanio/+/config" },
      );
      this._allDevCfgUnsub = unsub;
    } catch (err) {
      console.warn("[VanCtl HMI] MQTT board config subscribe failed:", err);
    }
  }

  // ── Slot resolution ───────────────────────────────────────
  // Returns a normalised slot map when config.slots is present (or MQTT
  // device manifest has slot annotations). Returns null to fall back to
  // legacy device-id auto-discovery mode.

  _resolveSlots() {
    // MQTT-persisted slots (saved via setup mode) take priority over YAML config
    const cfgSlots = this._cardConfig?.slots ?? this.config?.slots;

    // If no explicit slots config, check for MQTT manifest annotations
    if (cfgSlots === undefined) {
      const manifest = this._mqttDeviceConfig;
      if (!manifest?.entities?.some((e) => e.slot)) return null;
      return this._buildSlotsFromManifest(manifest);
    }

    // Normalise array entries: allow bare entity_id strings
    const norm = (arr) =>
      (arr ?? []).map((item) =>
        typeof item === "string" ? { entity: item } : { ...item },
      );

    return {
      resources: norm(cfgSlots.resources),
      pitch: cfgSlots.pitch ?? null,
      roll: cfgSlots.roll ?? null,
      temperature: cfgSlots.temperature ?? null,
      fans: norm(cfgSlots.fans),
      lights: norm(cfgSlots.lights),
      switches: norm(cfgSlots.switches),
      status_sensors: cfgSlots.status_sensors ?? [],
      // climate system
      water_temp: cfgSlots.water_temp ?? null,
      target_temp: cfgSlots.target_temp ?? null,
      fan_speed: cfgSlots.fan_speed ?? null,
      climate_mode: cfgSlots.climate_mode ?? null,
      heater: cfgSlots.heater ?? null,
      water_pump: cfgSlots.water_pump ?? null,
      groups: (cfgSlots.groups ?? []).map((g) => ({
        id: g.id ?? `grp_${Math.random().toString(36).slice(2)}`,
        name: g.name ?? "Group",
        lights: g.lights ?? [],
        scenes: g.scenes ?? [],
      })),
      tileOrder: cfgSlots.tileOrder ?? null,
    };
  }

  // Builds slot map from MQTT device manifest slot annotations.
  // Used when device_id is set and the PCB firmware annotates entities.
  _buildSlotsFromManifest(manifest) {
    const devEntities = this._entities();
    const result = {
      resources: [],
      pitch: null,
      roll: null,
      temperature: null,
      fans: [],
      lights: [],
      switches: [],
      buttons: [],
      status_sensors: [],
      water_temp: null,
      target_temp: null,
      fan_speed: null,
      climate_mode: null,
      heater: null,
      water_pump: null,
    };
    const listSlots = new Set([
      "resources",
      "fans",
      "lights",
      "switches",
      "buttons",
      "status_sensors",
    ]);

    for (const mEntity of manifest.entities) {
      if (!mEntity.slot) continue;
      const eid = this._findEntityByChannel(
        mEntity.type,
        mEntity.channel,
        devEntities,
      );
      if (!eid) continue;
      const slot = mEntity.slot;
      if (
        slot === "resources" ||
        slot === "fans" ||
        slot === "lights" ||
        slot === "switches" ||
        slot === "buttons"
      ) {
        result[slot].push({
          entity: eid,
          name: mEntity.name ?? mEntity.channel,
        });
      } else if (slot === "status_sensors") {
        result.status_sensors.push(eid);
      } else if (slot in result) {
        result[slot] = eid;
      }
    }
    return result;
  }

  _findEntityByChannel(type, channel, devEntities) {
    if (!devEntities) return null;
    const domainMap = {
      sensor: "sensors",
      switch: "switches",
      light: "lights",
      binary_sensor: "binary_sensors",
      number: "numbers",
      select: "selects",
    };
    const list = devEntities[domainMap[type]] ?? [];
    return list.find(({ eid }) => eid.includes(channel))?.eid ?? null;
  }

  _saveMqttConfig() {
    if (!this.hass || !this._selectedId) return;
    // Guard against our own MQTT echo resetting layout
    this._mqttSaveGuard = true;
    clearTimeout(this._mqttSaveGuardTimer);
    this._mqttSaveGuardTimer = setTimeout(() => { this._mqttSaveGuard = false; }, 2000);
    this.hass.callService("mqtt", "publish", {
      topic: `smartvanio/${this._selectedId}/hmi_config`,
      payload: JSON.stringify(this._cardConfig),
      retain: true,
      qos: 1,
    });
  }

  // ── Setup mode ────────────────────────────────────────────

  _enterSetupMode() {
    this._dndMode = false;
    const empty = {
      resources: [],
      pitch: null,
      roll: null,
      temperature: null,
      fans: [],
      lights: [],
      switches: [],
      buttons: [],
      status_sensors: [],
      groups: [],
      water_temp: null,
      target_temp: null,
      fan_speed: null,
      climate_mode: null,
      heater: null,
      water_pump: null,
    };
    const current = this._resolveSlots() ?? empty;
    const pending = JSON.parse(JSON.stringify(current));
    const entities = this._entities();

    if (entities) {
      // Merge device-discovered entities that aren't already in saved slots,
      // so the user can see and remove them in setup mode.
      const mergeItems = (slotItems, discovered) => {
        const saved = new Set(slotItems.map((s) => s.entity));
        return [
          ...slotItems,
          ...discovered
            .filter((e) => !saved.has(e.eid))
            .map((e) => ({ entity: e.eid, name: null })),
        ];
      };

      pending.lights = mergeItems(pending.lights, entities.lights);
      pending.switches = mergeItems(
        pending.switches,
        this._powerSwitches(entities.switches),
      );
      pending.buttons = mergeItems(
        pending.buttons ?? [],
        this._buttonEntities(entities.binary_sensors),
      );

      // Resources
      const savedResources = new Set(pending.resources.map((r) => r.entity));
      const find = (pat) =>
        entities.sensors.find(({ eid }) => pat.test(eid))?.eid;
      [
        { eid: find(/water_tank$/), name: "Water", color: "#5cacff" },
        { eid: find(/gas_tank$/), name: "Gas", color: "#f0b72f" },
        { eid: find(/waste_tank$/), name: "Waste", color: "#ff9492" },
        { eid: find(/fuel_level/), name: "Fuel", color: "#2bd853" },
      ].forEach(({ eid, name, color }) => {
        if (eid && !savedResources.has(eid))
          pending.resources.push({ entity: eid, name, color });
      });
    }

    this._pendingSlots = pending;
    this._setupMode = true;
  }

  _cancelSetupMode() {
    this._setupMode = false;
    this._pendingSlots = null;
  }

  _saveSetupMode() {
    this._cardConfig = { ...this._cardConfig, slots: this._pendingSlots };
    this._saveMqttConfig();
    this._setupMode = false;
    this._pendingSlots = null;
  }

  _setPS(key, val) {
    this._pendingSlots = { ...this._pendingSlots, [key]: val };
  }

  _addPSItem(key, item) {
    this._pendingSlots = {
      ...this._pendingSlots,
      [key]: [...(this._pendingSlots[key] ?? []), item],
    };
  }

  _removePSItem(key, i) {
    const arr = [...(this._pendingSlots[key] ?? [])];
    arr.splice(i, 1);
    this._pendingSlots = { ...this._pendingSlots, [key]: arr };
  }

  _updatePSItem(key, i, field, val) {
    const arr = [...(this._pendingSlots[key] ?? [])];
    arr[i] = { ...arr[i], [field]: val };
    this._pendingSlots = { ...this._pendingSlots, [key]: arr };
  }

  // ── Group helpers ──────────────────────────────────────────

  _isGroupOn(group) {
    return (group.lights ?? []).some(
      (eid) => this.hass.states[eid]?.state === "on",
    );
  }

  _toggleGroup(group) {
    const service = this._isGroupOn(group) ? "turn_off" : "turn_on";
    for (const eid of group.lights ?? [])
      this.hass.callService("light", service, { entity_id: eid });
  }

  _groupBrightness(group) {
    const vals = (group.lights ?? [])
      .map(eid => this.hass?.states?.[eid])
      .filter(s => s?.state === 'on')
      .map(s => s.attributes?.brightness ?? 255);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }

  _setGroupBrightness(group, bri) {
    for (const eid of group.lights ?? []) {
      this.hass.callService("light", "turn_on", {
        entity_id: eid,
        brightness: bri,
      });
    }
  }

  // ── Tile sizing system ──────────────────────────────────────
  // Each tile type declares its allowed sizes. The current size lives in the layout {w,h}.

  static TILE_SIZES = {
    group:  [[1,1], [3,3]],
    light:  [[1,1]],
    switch: [[1,1]],
  };

  /** Get allowed sizes for a tile item. */
  _allowedSizes(item) {
    return this.constructor.TILE_SIZES[item.type] ?? [[1,1]];
  }

  /** Cycle to the next allowed size for a tile. */
  _cycleTileSize(itemId, item) {
    if (!this._currentLayout?.[itemId]) return;
    const sizes = this._allowedSizes(item);
    if (sizes.length <= 1) return;
    const cur = this._currentLayout[itemId];
    const idx = sizes.findIndex(([w, h]) => w === cur.w && h === cur.h);
    const [nw, nh] = sizes[(idx + 1) % sizes.length];
    const update = () => {
      const updated = { ...this._currentLayout };
      updated[itemId] = { ...cur, w: nw, h: nh };
      this._currentLayout = applyMove(updated, itemId, cur.col, cur.row, this._gridCols);
    };
    if (this._dndMode) {
      update();
      this.requestUpdate();
    } else {
      this._animateGridTransition(update);
    }
  }

  _enterDndMode() {
    this._dndMode = true;
  }

  _exitDndMode() {
    // Save current layout under the current grid key
    if (this._currentLayout) {
      const layouts = { ...(this._cardConfig?.slots?.layouts ?? {}) };
      layouts[this._gridKey] = structuredClone(this._currentLayout);

      // Also maintain backward-compatible tileOrder
      const items = Object.entries(this._currentLayout)
        .sort(([, a], [, b]) => a.row - b.row || a.col - b.col)
        .map(([id]) => id);

      const slots = {
        ...(this._cardConfig?.slots ?? {}),
        layouts,
        tileOrder: items,
      };
      this._cardConfig = { ...this._cardConfig, slots };
    }
    this._saveMqttConfig();
    this._dndMode = false;
  }

  _onGroupPointerDown(e, group) {
    const pos = this._currentLayout?.[group.id];
    const expanded = pos && pos.w >= 3 && pos.h >= 3;
    if (expanded) return;
    if (e.button !== 0 && e.pointerType !== "touch") return;
    this._lpOrigin = { x: e.clientX, y: e.clientY };
    this._lpTimer = setTimeout(() => {
      this._lpTimer = null;
      this._lpOrigin = null;
      this._cycleTileSize(group.id, { type: 'group' });
    }, 500);
  }

  _onGroupPointerMove(e, group) {
    const pos = this._currentLayout?.[group.id];
    const expanded = pos && pos.w >= 3 && pos.h >= 3;
    if (expanded) return;
    if (!this._lpTimer || !this._lpOrigin) return;
    const dx = e.clientX - this._lpOrigin.x;
    const dy = e.clientY - this._lpOrigin.y;
    if (Math.sqrt(dx * dx + dy * dy) > 8) {
      clearTimeout(this._lpTimer);
      this._lpTimer = null;
      this._lpOrigin = null;
    }
  }

  _onGroupPointerUp(e, group) {
    const pos = this._currentLayout?.[group.id];
    const expanded = pos && pos.w >= 3 && pos.h >= 3;
    if (expanded) return;
    if (!this._lpTimer) return;
    clearTimeout(this._lpTimer);
    this._lpTimer = null;
    this._lpOrigin = null;
    if (e.target.closest("button, input, select, ha-entity-toggle")) return;
    this._toggleGroup(group);
  }

  // ── Grid infrastructure ────────────────────────────────────

  _setupGridObserver() {
    if (this._gridRo) return;
    const grid = this.shadowRoot?.querySelector('.unified-grid');
    if (!grid) return;

    const TILE_MIN = 80;
    const TILE_MAX = 140;
    const GAP = 12;
    const PAD_X = 32; // 16px padding each side
    const PAD_Y = 24; // 12px padding top + bottom

    this._gridRo = new ResizeObserver(() => {
      const gridW = grid.clientWidth - PAD_X;
      const gridH = grid.clientHeight - PAD_Y;
      if (gridW < 1 || gridH < 1) return;

      // Compute cols — start with as many as fit at TILE_MIN, reduce if needed
      let cols = Math.max(3, Math.floor((gridW + GAP) / (TILE_MIN + GAP)));
      let cellW = (gridW - GAP * (cols - 1)) / cols;
      // If tiles exceed TILE_MAX, add columns
      while (cellW > TILE_MAX && cols < 20) {
        cols++;
        cellW = (gridW - GAP * (cols - 1)) / cols;
      }
      // If tiles are too small, remove columns until they fit
      while (cellW < TILE_MIN && cols > 3) {
        cols--;
        cellW = (gridW - GAP * (cols - 1)) / cols;
      }
      cellW = Math.round(cellW);

      // Rows: how many square cells fit vertically
      let rows = Math.max(3, Math.floor((gridH + GAP) / (cellW + GAP)));

      // Use the smaller of the two possible gaps so spacing is uniform
      const possibleColGap = cols > 1 ? (gridW - cols * cellW) / (cols - 1) : GAP;
      const possibleRowGap = rows > 1 ? (gridH - rows * cellW) / (rows - 1) : GAP;
      const gap = Math.max(GAP, Math.round(Math.min(possibleColGap, possibleRowGap)));

      grid.style.gridTemplateColumns = `repeat(${cols}, ${cellW}px)`;
      grid.style.gridTemplateRows = `repeat(${rows}, ${cellW}px)`;
      grid.style.gap = `${gap}px`;
      grid.style.setProperty('--smartvanio-grid-cell-w', `${cellW}px`);

      const oldKey = this._gridKey;
      this._gridCols = cols;
      this._gridRows = rows;
      this._gridCellW = cellW;
      this._gridGap = gap;
      this._gridKey = `${cols}x${rows}`;

      if (oldKey !== this._gridKey || !this._currentLayout) {
        this._applyLayoutForCurrentGrid();
      }
    });
    this._gridRo.observe(grid);
  }

  /** Default tile size for a given item (used when placing new items). */
  _tileSizeFor(item) {
    const sizes = this._allowedSizes(item);
    return { w: sizes[0][0], h: sizes[0][1] };
  }

  /** Resolve which layout to use for the current grid dimensions. */
  _applyLayoutForCurrentGrid() {
    const layouts = this._cardConfig?.slots?.layouts ?? {};
    const key = this._gridKey;
    const items = this._getAllTileItems();

    if (layouts[key]) {
      // Exact match — use it, but ensure new items are added
      this._currentLayout = this._mergeNewItems(structuredClone(layouts[key]), items);
    } else {
      // Find closest saved layout and reflow
      const bestKey = findClosestLayoutKey(layouts, this._gridCols, this._gridRows);
      if (bestKey && layouts[bestKey]) {
        this._currentLayout = this._mergeNewItems(
          reflowLayout(layouts[bestKey], this._gridCols),
          items
        );
      } else if (this._cardConfig?.slots?.tileOrder?.length) {
        // Migrate from old tileOrder format
        this._currentLayout = migrateFromTileOrder(
          this._cardConfig.slots.tileOrder,
          items,
          this._gridCols,
          (i) => this._tileSizeFor(i)
        );
      } else {
        // Fresh auto-pack
        this._currentLayout = autoPackLayout(items, this._gridCols, (i) => this._tileSizeFor(i));
      }
    }
    this.requestUpdate();
  }

  /** Get all tile items (groups, standalone lights, switches).
   *  Uses the same entity resolution as render(). */
  _getAllTileItems() {
    const slots = this._resolveSlots();
    const entities = this._entities();
    const safeEntities = entities ?? { lights: [], switches: [], sensors: [], binary_sensors: [], numbers: [], selects: [] };
    const mergeEntities = (slotItems, discovered) => {
      const slotMapped = (slotItems ?? []).map(({ entity, name }) => ({
        eid: entity,
        state: this.hass?.states?.[entity],
        _slotName: name,
      }));
      const slotIds = new Set(slotMapped.map((e) => e.eid));
      return [...slotMapped, ...discovered.filter((e) => !slotIds.has(e.eid))];
    };
    const lights = mergeEntities(slots?.lights, safeEntities.lights);
    const powerSwitches = mergeEntities(slots?.switches, this._powerSwitches?.(safeEntities.switches) ?? []);
    const groups = slots?.groups ?? [];
    return this._orderedTiles(groups, lights, powerSwitches, null);
  }

  /** Ensure any items not in the layout get auto-packed into it.
   *  Also removes stale layout entries for items that no longer exist. */
  _mergeNewItems(layout, items) {
    // Remove stale entries (e.g. dissolved groups)
    const validIds = new Set(items.filter(i => i.type !== 'spacer').map(i => i.id));
    for (const id of Object.keys(layout)) {
      if (!validIds.has(id)) delete layout[id];
    }
    const occ = rebuildOccupancy(layout, this._gridCols);
    for (const item of items) {
      if (layout[item.id]) continue;
      if (item.type === 'spacer') continue;
      const { w, h } = this._tileSizeFor(item);
      let placed = false;
      for (let row = 0; row < 200 && !placed; row++) {
        for (let col = 0; col <= this._gridCols - w && !placed; col++) {
          let empty = true;
          for (let r = row; r < row + h && empty; r++) {
            for (let c = col; c < col + w && empty; c++) {
              if (occ[r]?.[c] != null) empty = false;
            }
          }
          if (empty) {
            layout[item.id] = { col, row, w, h };
            for (let r = row; r < row + h; r++) {
              if (!occ[r]) occ[r] = new Array(this._gridCols).fill(null);
              for (let c = col; c < col + w; c++) occ[r][c] = item.id;
            }
            placed = true;
          }
        }
      }
    }
    return layout;
  }

  // ── Drag controller callbacks ──────────────────────────────

  onTileDragMove(itemId, col, row) {
    // Check if dragging over a mergeable tile
    const items = this._getAllTileItems();
    const draggedItem = items.find(i => i.id === itemId);
    const targetId = this._tileAtCell(col, row, itemId);
    const targetItem = targetId ? items.find(i => i.id === targetId) : null;

    if (draggedItem && targetItem && this._canMerge(draggedItem, targetItem)) {
      this._mergeTargetId = targetId;
      this._dragController.previewCol = col;
      this._dragController.previewRow = row;
    } else {
      this._mergeTargetId = null;
      // Compute where the tile would actually land (after push + compact)
      if (this._currentLayout) {
        const trial = applyMove(this._currentLayout, itemId, col, row, this._gridCols);
        const pos = trial[itemId];
        if (pos) {
          this._dragController.previewCol = pos.col;
          this._dragController.previewRow = pos.row;
        }
      }
    }
    this.requestUpdate();
  }

  onTileDragEnd(itemId, col, row) {
    this._mergeTargetId = null;
    if (!this._currentLayout) return;

    // Check if a light is dropped directly onto another light/group → merge
    const items = this._getAllTileItems();
    const draggedItem = items.find(i => i.id === itemId);

    if (draggedItem && (draggedItem.type === 'light' || draggedItem.type === 'group')) {
      const targetId = this._tileAtCell(col, row, itemId);
      const targetItem = targetId ? items.find(i => i.id === targetId) : null;

      if (targetItem && this._canMerge(draggedItem, targetItem)) {
        this._mergeIntoGroup(draggedItem, targetItem, col, row);
        return;
      }
    }

    this._currentLayout = applyMove(
      this._currentLayout,
      itemId,
      col,
      row,
      this._gridCols
    );
    this.requestUpdate();
  }

  /** Find which tile occupies a given cell, excluding excludeId. */
  _tileAtCell(col, row, excludeId) {
    if (!this._currentLayout) return null;
    for (const [id, pos] of Object.entries(this._currentLayout)) {
      if (id === excludeId) continue;
      if (col >= pos.col && col < pos.col + pos.w &&
          row >= pos.row && row < pos.row + pos.h) {
        return id;
      }
    }
    return null;
  }

  /** Check if two items can be merged into a group. */
  _canMerge(a, b) {
    // light + light → new group
    if (a.type === 'light' && b.type === 'light') return true;
    // light + group → add to group
    if (a.type === 'light' && b.type === 'group') return true;
    // group + light → add to group
    if (a.type === 'group' && b.type === 'light') return true;
    return false;
  }

  /** Merge two items into a group. */
  _mergeIntoGroup(dragged, target, col, row) {
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    const groups = [...(slots.groups ?? [])];

    // Collect entity IDs from both items
    const lightsFromItem = (item) => {
      if (item.type === 'light') return [item.id];
      if (item.type === 'group') return [...(item.data?.lights ?? [])];
      return [];
    };
    const draggedLights = lightsFromItem(dragged);
    const targetLights = lightsFromItem(target);
    const allLights = [...new Set([...targetLights, ...draggedLights])];

    let groupId;

    if (target.type === 'group') {
      // Add dragged light(s) to existing group
      groupId = target.id;
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx] = { ...groups[idx], lights: allLights };
      }
    } else if (dragged.type === 'group') {
      // Add target light to existing group
      groupId = dragged.id;
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx] = { ...groups[idx], lights: allLights };
      }
    } else {
      // Create new group from two lights
      groupId = `grp_${Date.now()}`;
      groups.push({
        id: groupId,
        name: 'New Group',
        lights: allLights,
        scenes: [],
      });
    }

    slots.groups = groups;
    this._cardConfig = { ...this._cardConfig, slots };

    // Update layout
    const layout = { ...this._currentLayout };
    const targetPos = layout[target.id];
    delete layout[dragged.id];

    if (target.type === 'group') {
      // Adding to existing group — keep group in place, just remove dragged tile
    } else if (dragged.type === 'group') {
      // Dragged group absorbs target light — keep group in place, remove target
      delete layout[target.id];
    } else {
      // New group from two lights — place at target's position as 3x3
      delete layout[target.id];
      const gCol = targetPos?.col ?? col;
      const gRow = targetPos?.row ?? row;
      layout[groupId] = { col: gCol, row: gRow, w: 3, h: 3 };
      this._currentLayout = applyMove(layout, groupId, gCol, gRow, this._gridCols);
      this.requestUpdate();
      return;
    }
    this._currentLayout = layout;

    this.requestUpdate();
  }

  _animateGridTransition(callback) {
    const grid = this.shadowRoot?.querySelector('.unified-grid');
    if (!grid) { callback(); return; }
    const tiles = [...grid.children];
    const firstRects = new Map();
    tiles.forEach(t => firstRects.set(t.dataset.tileId, t.getBoundingClientRect()));
    callback();
    this.updateComplete.then(() => {
      const newTiles = [...grid.children];
      newTiles.forEach(t => {
        const id = t.dataset.tileId;
        const first = firstRects.get(id);
        if (!first) return;
        const last = t.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sw = first.width / (last.width || 1);
        const sh = first.height / (last.height || 1);
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sw - 1) < 0.02) return;
        t.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`, transformOrigin: 'top left' },
          { transform: 'translate(0,0) scale(1,1)', transformOrigin: 'top left' }
        ], { duration: 280, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      });
    });
  }

  _orderedTiles(groups, lights, powerSwitches, tileOrder) {
    // Lights inside a group don't get standalone tiles
    const groupedLights = new Set(groups.flatMap(g => g.lights ?? []));
    const standaloneLights = lights.filter(l => !groupedLights.has(l.eid));

    const allItems = [];
    groups.forEach(g => allItems.push({ type: 'group', id: g.id, data: g }));
    standaloneLights.forEach(l => allItems.push({ type: 'light', id: l.eid, data: l }));
    powerSwitches.forEach(s => allItems.push({ type: 'switch', id: s.eid, data: s }));
    if (!tileOrder?.length) return allItems;
    const byId = new Map(allItems.map(item => [item.id, item]));
    const ordered = [];
    let spacerIdx = 0;
    for (const id of tileOrder) {
      if (id === null) {
        // Empty grid cell — render as spacer
        ordered.push({ type: 'spacer', id: `_spacer_${spacerIdx++}`, data: null });
      } else {
        const item = byId.get(id);
        if (item) { ordered.push(item); byId.delete(id); }
      }
    }
    // Append items not in tileOrder
    for (const item of byId.values()) ordered.push(item);
    return ordered;
  }

  _saveTileOrder(items) {
    const order = items.map(i => i.id);
    const slots = { ...(this._cardConfig?.slots ?? {}), tileOrder: order };
    this._cardConfig = { ...this._cardConfig, slots };
    this._saveMqttConfig();
  }

  // ── Drag light out of group to remove ──────────────────────
  _onGrpLightPointerDown(e, groupId, eid) {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.stopPropagation();

    const rowEl = e.currentTarget;
    const startX = e.clientX;
    const startY = e.clientY;
    let ghost = null;
    let dragging = false;
    let overGroup = false;

    const gridEl = this.shadowRoot?.querySelector('.unified-grid');
    if (!gridEl) return;
    gridEl.setPointerCapture(e.pointerId);

    // Find the group tile element for hit testing
    const groupTileEl = this.shadowRoot?.querySelector(`.grid-tile[data-tile-id="${groupId}"]`);

    // Build ghost content
    const state = this.hass?.states?.[eid];
    const isOn = state?.state === 'on';
    const rgb = state?.attributes?.rgb_color ?? [255, 200, 80];
    const name = this._label(eid);
    const cellW = this._gridCellW || 80;

    const makeTileGhost = () => {
      const el = document.createElement('div');
      el.innerHTML = `
        <ha-icon icon="mdi:lightbulb" style="--mdc-icon-size:22px;color:${isOn ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : '#9198a1'}"></ha-icon>
        <span style="font-size:10px;font-weight:500;color:${isOn ? '#f0f6fc' : '#9198a1'};text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${name}</span>
      `;
      el.style.cssText = `
        position:fixed; z-index:10000; pointer-events:none;
        width:${cellW}px; height:${cellW}px;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;
        border-radius:16px; padding:6px 4px; box-sizing:border-box;
        background:${isOn ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.12)` : 'rgba(22,27,34,0.85)'};
        box-shadow:0 8px 30px rgba(0,0,0,0.5);
        opacity:0.9; transition:width 0.15s,height 0.15s,border-radius 0.15s;
      `;
      return el;
    };

    const makeRowGhost = () => {
      const el = rowEl.cloneNode(true);
      el.style.cssText = `
        position:fixed; z-index:10000; pointer-events:none;
        width:${rowEl.offsetWidth}px; opacity:0.85;
        background:rgba(22,27,34,0.95); border-radius:8px; padding:6px 10px;
        box-shadow:0 4px 16px rgba(0,0,0,0.5);
        display:flex; align-items:center; gap:10px;
        transition:width 0.15s,height 0.15s,border-radius 0.15s;
      `;
      return el;
    };

    const isOverGroup = (clientX, clientY) => {
      if (!groupTileEl) return false;
      const r = groupTileEl.getBoundingClientRect();
      return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    };

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragging && Math.sqrt(dx * dx + dy * dy) > 10) {
        dragging = true;
        rowEl.style.opacity = '0.3';
      }
      if (!dragging) return;

      const nowOverGroup = isOverGroup(ev.clientX, ev.clientY);

      // Swap ghost shape when crossing group boundary
      if (!ghost || nowOverGroup !== overGroup) {
        if (ghost) ghost.remove();
        ghost = nowOverGroup ? makeRowGhost() : makeTileGhost();
        this.shadowRoot.appendChild(ghost);
        overGroup = nowOverGroup;
      }

      if (overGroup) {
        ghost.style.left = `${ev.clientX - rowEl.offsetWidth / 2}px`;
        ghost.style.top = `${ev.clientY - 16}px`;
      } else {
        ghost.style.left = `${ev.clientX - cellW / 2}px`;
        ghost.style.top = `${ev.clientY - cellW / 2}px`;
      }
    };

    const onUp = (ev) => {
      gridEl.removeEventListener('pointermove', onMove);
      gridEl.removeEventListener('pointerup', onUp);
      gridEl.removeEventListener('pointercancel', onUp);
      try { gridEl.releasePointerCapture(ev.pointerId); } catch (_) {}
      if (ghost) ghost.remove();
      rowEl.style.opacity = '';
      if (!dragging) return;

      // If dropped back over the group, cancel
      if (isOverGroup(ev.clientX, ev.clientY)) return;

      // Compute grid cell at drop position
      const gap = this._gridGap || 12;
      const gridRect = gridEl.getBoundingClientRect();
      const relX = ev.clientX - gridRect.left - 16;
      const relY = ev.clientY - gridRect.top - 12 + (gridEl.scrollTop || 0);
      const col = Math.max(0, Math.min(this._gridCols - 1, Math.round(relX / (cellW + gap))));
      const row = Math.max(0, Math.round(relY / (cellW + gap)));

      this._removeLightFromGroup(groupId, eid, col, row);
      this.requestUpdate();
    };

    gridEl.addEventListener('pointermove', onMove);
    gridEl.addEventListener('pointerup', onUp);
    gridEl.addEventListener('pointercancel', onUp);
  }

  _renameGroup(groupId, name) {
    if (!name?.trim()) return;
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    const groups = [...(slots.groups ?? [])];
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx === -1) return;
    groups[idx] = { ...groups[idx], name: name.trim() };
    slots.groups = groups;
    this._cardConfig = { ...this._cardConfig, slots };
    this._saveMqttConfig();
  }

  _removeLightFromGroup(groupId, eid, dropCol, dropRow) {
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    const groups = [...(slots.groups ?? [])];
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx === -1) return;

    const group = { ...groups[idx] };
    group.lights = group.lights.filter(l => l !== eid);

    // Only dissolve if completely empty
    if (group.lights.length === 0) {
      groups.splice(idx, 1);
    } else {
      groups[idx] = group;
    }

    slots.groups = groups;
    this._cardConfig = { ...this._cardConfig, slots };
    this._saveMqttConfig();

    // Update layout: place removed light as standalone tile
    if (this._currentLayout) {
      const layout = { ...this._currentLayout };
      if (group.lights.length === 0) {
        // Group dissolved — remove from layout
        delete layout[groupId];
      }
      // Place removed light at drop position or near the group
      if (dropCol != null && dropRow != null) {
        layout[eid] = { col: dropCol, row: dropRow, w: 1, h: 1 };
      } else {
        const groupPos = layout[groupId];
        const col = groupPos ? groupPos.col + groupPos.w : 0;
        const row = groupPos?.row ?? 0;
        layout[eid] = { col: Math.min(col, this._gridCols - 1), row, w: 1, h: 1 };
      }
      this._currentLayout = applyMove(layout, eid, layout[eid].col, layout[eid].row, this._gridCols);
    }
  }

  // ── Render: group tile body ──────────────────────────────────

  _renderGroupTileBody(group, isOn) {
    const lights = (group.lights ?? [])
      .map((eid) => ({ eid, state: this.hass.states[eid] }))
      .filter((l) => l.state);
    const scenes = (group.scenes ?? [])
      .map((eid) => ({
        eid,
        name:
          this.hass.states[eid]?.attributes?.friendly_name ??
          eid.split(".").pop(),
      }))
      .filter((s) => this.hass.states[s.eid]);

    return html`
      ${lights.length
        ? html`
            <div class="group-lights-list">
              ${lights.map(({ eid, state }) => {
                const on = state.state === "on";
                const rgb = state.attributes?.rgb_color ?? [255, 255, 255];
                const hexColor = `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
                const color = on
                  ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
                  : "#3a3a3c";
                const glow = on
                  ? `0 0 6px rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
                  : "none";
                const name = this._label(eid);
                const modes = state.attributes?.supported_color_modes ?? [];
                const supportsColor = modes.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m));
                return html`
                  <div class="grp-light-row ${on ? 'on' : ''}"
                    data-grp-light-eid=${eid}
                    data-grp-id=${group.id}
                    @click=${(e) => { e.stopPropagation(); this._toggleLight(eid); }}
                    @pointerdown=${this._dndMode ? (e) => this._onGrpLightPointerDown(e, group.id, eid) : null}>
                    <div class="grp-light-dot" style="background:${color};box-shadow:${glow}">
                      ${supportsColor ? html`
                        <input type="color" class="grp-light-color" .value=${hexColor}
                          @click=${(e) => e.stopPropagation()}
                          @pointerdown=${(e) => e.stopPropagation()}
                          @change=${(e) => {
                            e.stopPropagation();
                            const h = e.target.value;
                            this.hass.callService("light", "turn_on", {
                              entity_id: eid,
                              rgb_color: [
                                parseInt(h.slice(1, 3), 16),
                                parseInt(h.slice(3, 5), 16),
                                parseInt(h.slice(5, 7), 16),
                              ],
                            });
                          }}
                        />
                      ` : ''}
                    </div>
                    <span class="grp-light-name">${name}</span>
                    ${this._dndMode ? html`
                      <ha-icon class="grp-light-grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                    ` : ''}
                  </div>
                `;
              })}
            </div>
          `
        : ""}
      ${scenes.length
        ? html`
            <div class="group-scenes">
              ${scenes.map(
                ({ eid, name }) => html`
                  <button
                    class="scene-chip"
                    @click=${(e) => {
                      e.stopPropagation();
                      this._triggerScene(eid);
                    }}
                  >
                    ${name}
                  </button>
                `,
              )}
            </div>
          `
        : ""}
    `;
  }

  _renderGroupTile(group, pos) {
    const isOn = group.lights.some(
      (eid) => this.hass?.states?.[eid]?.state === "on",
    );
    const expanded = pos && pos.w >= 3 && pos.h >= 3;

    return html`
      <div
        class="gtile ${isOn ? "on" : ""} ${expanded ? "expanded" : ""}"
        data-tile-id=${group.id}
        @pointerdown=${(e) => this._onGroupPointerDown(e, group)}
        @pointermove=${(e) => this._onGroupPointerMove(e, group)}
        @pointerup=${(e) => this._onGroupPointerUp(e, group)}
        @pointerleave=${() => {
          clearTimeout(this._lpTimer);
          this._lpTimer = null;
        }}
      >
        <div class="gtile-hdr">
          <ha-icon
            class="gtile-icon ${isOn ? "on" : ""}"
            icon="mdi:apps"
          ></ha-icon>
          ${expanded && this._dndMode ? html`
            <input class="gtile-name-input" type="text"
              .value=${group.name}
              @click=${(e) => e.stopPropagation()}
              @pointerdown=${(e) => e.stopPropagation()}
              @change=${(e) => { e.stopPropagation(); this._renameGroup(group.id, e.target.value); }}
              @keydown=${(e) => { if (e.key === 'Enter') e.target.blur(); }}
            />
          ` : html`<span class="gtile-name">${group.name}</span>`}
          ${expanded ? html`
            <button class="gtile-toggle ${isOn ? 'on' : ''}"
              @click=${(e) => { e.stopPropagation(); this._toggleGroup(group); }}
              @pointerdown=${(e) => e.stopPropagation()}>
              <div class="gtile-toggle-thumb"></div>
            </button>
          ` : ''}
        </div>
        ${expanded ? html`
          <div class="gtile-brightness" @click=${(e) => e.stopPropagation()} @pointerdown=${(e) => e.stopPropagation()}>
            <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:14px;color:#9198a1;flex-shrink:0"></ha-icon>
            <input type="range" class="gtile-bri-slider" min="0" max="255" .value=${this._groupBrightness(group)}
              @input=${(e) => this._setGroupBrightness(group, parseInt(e.target.value))}
            />
          </div>
        ` : ''}

        ${!expanded ? html`
          <div class="gtile-dots">
            ${(group.lights ?? []).map(eid => {
              const st = this.hass?.states?.[eid];
              const on = st?.state === 'on';
              const rgb = st?.attributes?.rgb_color ?? [255, 255, 255];
              const col = on ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : '#3a3a3c';
              return html`<div class="gtile-dot" style="background:${col};${on ? `box-shadow:0 0 4px ${col}` : ''}"></div>`;
            })}
          </div>
        ` : ''}

        <div class="gtile-body">
          ${expanded ? this._renderGroupTileBody(group, isOn) : ""}
        </div>
      </div>
    `;
  }

  // ── Setup render: groups (right panel) ────────────────────

  _renderSetupGroups() {
    const ps = this._pendingSlots;
    const groups = ps.groups ?? [];
    // All available lights to assign to groups
    const allLights = (ps.lights ?? [])
      .map((l) => ({
        eid: l.entity,
        label: l.name || this._label(l.entity),
      }))
      .filter((l) => l.eid);

    return html`
      <div class="setup-list">
        ${groups.map(
          (g, gi) => html`
            <div class="group-edit-card">
              <div class="group-edit-hdr">
                <input
                  class="setup-name-input group-edit-name"
                  .value=${g.name ?? ""}
                  placeholder="Group name"
                  @change=${(e) =>
                    this._updatePSItem("groups", gi, "name", e.target.value)}
                />
                <button
                  class="setup-del"
                  @click=${() => {
                    this._removePSItem("groups", gi);
                  }}
                >
                  ✕
                </button>
              </div>

              <div class="group-edit-section-title">Lights</div>
              <div class="group-lights-grid">
                ${allLights.map(({ eid, label }) => {
                  const checked = (g.lights ?? []).includes(eid);
                  return html`
                    <label
                      class="group-light-chip ${checked ? "on" : ""}"
                      @click=${() => {
                        const lights = checked
                          ? (g.lights ?? []).filter((e) => e !== eid)
                          : [...(g.lights ?? []), eid];
                        this._updatePSItem("groups", gi, "lights", lights);
                      }}
                    >
                      ${label}
                    </label>
                  `;
                })}
                ${!allLights.length
                  ? html`<span class="group-edit-hint"
                      >Add lights in the Lighting section first.</span
                    >`
                  : ""}
              </div>

              <div class="group-edit-section-title">Scenes</div>
              ${(g.scenes ?? []).map(
                (eid, si) => html`
                  <div class="setup-row">
                    ${this._entitySelect(["scene"], eid, (v) => {
                      const scenes = [...(g.scenes ?? [])];
                      scenes[si] = v;
                      this._updatePSItem("groups", gi, "scenes", scenes);
                    })}
                    <button
                      class="setup-del"
                      @click=${() => {
                        const scenes = (g.scenes ?? []).filter(
                          (_, i) => i !== si,
                        );
                        this._updatePSItem("groups", gi, "scenes", scenes);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                `,
              )}
              <button
                class="setup-add"
                @click=${() => {
                  const scenes = [...(g.scenes ?? []), ""];
                  this._updatePSItem("groups", gi, "scenes", scenes);
                }}
              >
                + Add scene
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() =>
            this._addPSItem("groups", {
              id: `grp_${Date.now()}`,
              name: "New Group",
              lights: [],
              scenes: [],
            })}
        >
          + Add group
        </button>
      </div>
    `;
  }

  // ── Entity select helper ──────────────────────────────────
  // Renders a styled <select> filtered to the given HA domains.

  _entityOptions(domains) {
    if (!this.hass?.states) return [];
    return Object.entries(this.hass.states)
      .filter(([eid]) => domains.some((d) => eid.startsWith(d + ".")))
      .map(([eid, state]) => ({
        eid,
        label: state.attributes?.friendly_name ?? eid.split(".").pop(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  _entitySelect(domains, value, onChange) {
    const options = this._entityOptions(domains).map(({ eid, label }) => ({
      value: eid,
      label,
    }));
    return html`
      <smartvanio-select
        class="setup-entity-select"
        .value=${value ?? ""}
        .options=${options}
        placeholder="— choose —"
        @smartvanio-change=${(e) => onChange(e.detail.value || null)}
      >
      </smartvanio-select>
    `;
  }

  // ── Setup render: climate ─────────────────────────────────

  _renderSetupClimate() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-panel">
        <div class="setup-row">
          <span class="setup-label">Temperature</span>
          ${this._entitySelect(["sensor"], ps.temperature, (v) =>
            this._setPS("temperature", v),
          )}
        </div>
        <div class="setup-section-title">Fans</div>
        ${(ps.fans ?? []).map(
          (f, i) => html`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${f.name ?? ""}
                placeholder="Name"
                @change=${(e) =>
                  this._updatePSItem("fans", i, "name", e.target.value)}
              />
              ${this._entitySelect(["fan"], f.entity, (v) =>
                this._updatePSItem("fans", i, "entity", v),
              )}
              <button
                class="setup-del"
                @click=${() => this._removePSItem("fans", i)}
              >
                ✕
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() => this._addPSItem("fans", { entity: "", name: "" })}
        >
          + Add fan
        </button>
      </div>
    `;
  }

  // ── Setup render: level ───────────────────────────────────

  _renderSetupLevel() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-panel">
        <div class="setup-row">
          <span class="setup-label">Pitch</span>
          ${this._entitySelect(["sensor"], ps.pitch, (v) =>
            this._setPS("pitch", v),
          )}
        </div>
        <div class="setup-row">
          <span class="setup-label">Roll</span>
          ${this._entitySelect(["sensor"], ps.roll, (v) =>
            this._setPS("roll", v),
          )}
        </div>
      </div>
    `;
  }

  // ── Setup render: status sensors ──────────────────────────

  _renderSetupStatus() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-panel">
        ${(ps.status_sensors ?? []).map(
          (eid, i) => html`
            <div class="setup-row">
              ${this._entitySelect(
                ["sensor", "binary_sensor", "number"],
                eid,
                (v) => {
                  const arr = [...(ps.status_sensors ?? [])];
                  arr[i] = v;
                  this._setPS("status_sensors", arr);
                },
              )}
              <button
                class="setup-del"
                @click=${() => this._removePSItem("status_sensors", i)}
              >
                ✕
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() => this._addPSItem("status_sensors", "")}
        >
          + Add sensor
        </button>
      </div>
    `;
  }

  // ── Setup render: lighting (right panel) ──────────────────

  _renderSetupLighting() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-list">
        ${(ps.lights ?? []).map(
          (l, i) => html`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${l.name ?? ""}
                placeholder="Name"
                @change=${(e) =>
                  this._updatePSItem("lights", i, "name", e.target.value)}
              />
              ${this._entitySelect(["light"], l.entity, (v) =>
                this._updatePSItem("lights", i, "entity", v),
              )}
              <button
                class="setup-del"
                @click=${() => this._removePSItem("lights", i)}
              >
                ✕
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() => this._addPSItem("lights", { entity: "", name: "" })}
        >
          + Add light
        </button>
      </div>
    `;
  }

  // ── Setup render: switches (right panel) ──────────────────

  _renderSetupSwitches() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-list">
        ${(ps.switches ?? []).map(
          (s, i) => html`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${s.name ?? ""}
                placeholder="Name"
                @change=${(e) =>
                  this._updatePSItem("switches", i, "name", e.target.value)}
              />
              ${this._entitySelect(
                ["switch", "input_boolean", "button"],
                s.entity,
                (v) => this._updatePSItem("switches", i, "entity", v),
              )}
              <button
                class="setup-del"
                @click=${() => this._removePSItem("switches", i)}
              >
                ✕
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() => this._addPSItem("switches", { entity: "", name: "" })}
        >
          + Add switch
        </button>
      </div>
    `;
  }

  // ── Setup render: buttons ─────────────────────────────────

  _renderSetupButtons() {
    const ps = this._pendingSlots;
    return html`
      <div class="setup-list">
        ${(ps.buttons ?? []).map(
          (b, i) => html`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${b.name ?? ""}
                placeholder="Name"
                @change=${(e) =>
                  this._updatePSItem("buttons", i, "name", e.target.value)}
              />
              ${this._entitySelect(["binary_sensor"], b.entity, (v) =>
                this._updatePSItem("buttons", i, "entity", v),
              )}
              <button
                class="setup-del"
                @click=${() => this._removePSItem("buttons", i)}
              >
                ✕
              </button>
            </div>
          `,
        )}
        <button
          class="setup-add"
          @click=${() => this._addPSItem("buttons", { entity: "", name: "" })}
        >
          + Add button
        </button>
      </div>
    `;
  }

  // ── Render: button tile ────────────────────────────────────

  _renderButtonTile({ eid, state, _slotName = null }) {
    const pressed = state?.state === "on";
    const name    = this._label(eid, _slotName);
    return html`
      <div class="btile ${pressed ? "active" : ""} ${this._setupMode ? "editable" : ""}"
        @click=${() => this._setupMode ? this._openEditModal(eid) : undefined}>
        <ha-icon class="btile-icon"
          icon="${pressed ? "mdi:circle-slice-8" : "mdi:gesture-tap-button"}"></ha-icon>
        <span class="btile-name">${name}</span>
        <span class="btile-state">${this._setupMode ? "Edit automations" : pressed ? "Pressed" : "—"}</span>
      </div>
    `;
  }

  // ── Setup render: resources bar ───────────────────────────

  _renderSetupResources() {
    const ps = this._pendingSlots;
    const DEFAULT_COLORS = [
      "#5cacff",
      "#f0b72f",
      "#ff9492",
      "#2bd853",
      "#d3abff",
    ];
    return html`
      ${(ps.resources ?? []).map(
        (r, i) => html`
          <div class="setup-res-row">
            <input
              type="color"
              class="setup-color-swatch"
              .value=${r.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              @change=${(e) =>
                this._updatePSItem("resources", i, "color", e.target.value)}
            />
            <input
              class="setup-name-input"
              .value=${r.name ?? ""}
              placeholder="Label"
              @change=${(e) =>
                this._updatePSItem("resources", i, "name", e.target.value)}
            />
            ${this._entitySelect(["sensor"], r.entity, (v) =>
              this._updatePSItem("resources", i, "entity", v),
            )}
            <button
              class="setup-del"
              @click=${() => this._removePSItem("resources", i)}
            >
              ✕
            </button>
          </div>
        `,
      )}
      <button
        class="setup-add setup-res-add"
        @click=${() =>
          this._addPSItem("resources", {
            entity: "",
            name: "",
            color:
              DEFAULT_COLORS[
                (ps.resources?.length ?? 0) % DEFAULT_COLORS.length
              ],
          })}
      >
        + Add
      </button>
    `;
  }

  // ── Pinned actions ────────────────────────────────────────

  _isPinned(id) {
    return (this._cardConfig.pinnedActions ?? []).some((a) => a.id === id);
  }

  _addPinnedAction(id, label) {
    if (this._isPinned(id)) return;
    const pinnedActions = [
      ...(this._cardConfig.pinnedActions ?? []),
      { id, label },
    ];
    this._cardConfig = { ...this._cardConfig, pinnedActions };
    this._saveMqttConfig();
  }

  _removePinnedAction(id) {
    const pinnedActions = (this._cardConfig.pinnedActions ?? []).filter(
      (a) => a.id !== id,
    );
    this._cardConfig = { ...this._cardConfig, pinnedActions };
    this._saveMqttConfig();
  }

  // Activate a scene, or turn off all its lights if current state already matches.
  _triggerScene(eid) {
    const sceneLights = this.hass.states[eid]?.attributes?.lights ?? [];
    if (!sceneLights.length) {
      return this.hass.callService("scene", "turn_on", { entity_id: eid });
    }

    const allMatch = sceneLights.every(
      ({ entity_id, state = "ON", brightness, rgb_color }) => {
        const cur = this.hass.states[entity_id];
        if (!cur) return false;
        if (cur.state.toUpperCase() !== state.toUpperCase()) return false;
        if (state.toUpperCase() === "OFF") return true;
        // brightness: allow ±6 tolerance (HA rounds to nearest integer)
        if (
          brightness !== undefined &&
          Math.abs((cur.attributes.brightness ?? 0) - brightness) > 6
        )
          return false;
        // rgb: allow ±8 tolerance per channel
        if (rgb_color) {
          const [r, g, b] = rgb_color;
          const [cr, cg, cb] = cur.attributes.rgb_color ?? [0, 0, 0];
          if (
            Math.abs(cr - r) > 8 ||
            Math.abs(cg - g) > 8 ||
            Math.abs(cb - b) > 8
          )
            return false;
        }
        return true;
      },
    );

    if (allMatch) {
      // Scene is already active — turn off all lights in the scene
      const entityIds = sceneLights.map((l) => l.entity_id).filter(Boolean);
      return this.hass.callService("light", "turn_off", {
        entity_id: entityIds,
      });
    }

    return this.hass.callService("scene", "turn_on", { entity_id: eid });
  }

  _runAction(id) {
    const domain = id.split(".")[0];
    if (domain === "scene") return this._triggerScene(id);
    if (domain === "script")
      return this.hass.callService("script", "turn_on", { entity_id: id });
    if (domain === "switch") {
      const on = this.hass.states[id]?.state === "on";
      return this.hass.callService("switch", on ? "turn_off" : "turn_on", {
        entity_id: id,
      });
    }
    if (domain === "light")
      return this.hass.callService("light", "toggle", { entity_id: id });
  }

  // ── Device / entity helpers ───────────────────────────────

  _haDevice() {
    if (!this._selectedId || !this.hass) return null;
    return (
      Object.values(this.hass.devices ?? {}).find((d) =>
        d.identifiers?.some(
          ([dom, id]) => dom === "smartvanio" && id === this._selectedId,
        ),
      ) ?? null
    );
  }

  _entities() {
    const dev = this._haDevice();
    if (!dev) return null;
    const out = {
      lights: [],
      switches: [],
      sensors: [],
      binary_sensors: [],
      numbers: [],
      selects: [],
    };
    for (const [eid, entry] of Object.entries(this.hass.entities ?? {})) {
      if (entry.device_id !== dev.id) continue;
      const state = this.hass.states[eid];
      if (!state) continue;
      const domain = eid.split(".")[0];
      if (domain === "light" && !state.attributes?.smartvanio_parent_entity_id)
        out.lights.push({ eid, state });
      else if (domain === "switch") out.switches.push({ eid, state });
      else if (domain === "sensor") out.sensors.push({ eid, state });
      else if (domain === "binary_sensor")
        out.binary_sensors.push({ eid, state });
      else if (domain === "number") out.numbers.push({ eid, state });
      else if (domain === "select") out.selects.push({ eid, state });
    }
    return out;
  }

  _levelEntities(slots = null) {
    if (!this.hass) return null;
    if (slots) {
      const pitch = slots.pitch ? this.hass.states[slots.pitch] : null;
      const roll = slots.roll ? this.hass.states[slots.roll] : null;
      return pitch || roll ? { pitch, roll } : null;
    }
    const all = Object.values(this.hass.states);
    const isAngle = (s) => s.attributes?.unit_of_measurement === "°";
    const pitch =
      all.find(
        (s) =>
          isAngle(s) && /adjusted.*pitch|pitch.*adjusted/i.test(s.entity_id),
      ) ?? all.find((s) => isAngle(s) && /pitch/i.test(s.entity_id));
    const roll =
      all.find(
        (s) => isAngle(s) && /adjusted.*roll|roll.*adjusted/i.test(s.entity_id),
      ) ?? all.find((s) => isAngle(s) && /roll/i.test(s.entity_id));
    return pitch || roll ? { pitch, roll } : null;
  }

  _deviceScenes() {
    const dev = this._haDevice();
    if (!dev) return [];
    return Object.entries(this.hass.entities ?? {})
      .filter(([eid, e]) => eid.startsWith("scene.") && e.device_id === dev.id)
      .map(([eid]) => ({ eid, state: this.hass.states[eid] }))
      .filter(({ state }) => state)
      .sort((a, b) => a.eid.localeCompare(b.eid));
  }

  _allActions() {
    const out = [];
    for (const [eid, state] of Object.entries(this.hass.states ?? {})) {
      const domain = eid.split(".")[0];
      if (domain === "scene" || domain === "script") {
        const label = state.attributes?.friendly_name ?? eid.split(".").pop();
        out.push({ id: eid, label, domain });
      }
    }
    return out.sort((a, b) => a.label.localeCompare(b.label));
  }

  _label(eid, slotName = null) {
    if (slotName) return slotName;
    const override = this.hass.entities?.[eid]?.name;
    if (override) return override;
    const friendly = this.hass.states[eid]?.attributes?.friendly_name ?? "";
    const devName =
      this._haDevice()?.name_by_user ?? this._haDevice()?.name ?? "";
    return devName && friendly.startsWith(devName + " ")
      ? friendly.slice(devName.length + 1)
      : friendly || eid.split(".").pop();
  }

  // Returns the vanctl device_id for an entity (e.g. "smartvanio_inclinometer"),
  // or null if the entity doesn't belong to a vanctl device.
  _smartvanioDeviceId(eid) {
    const haDeviceId = this.hass?.entities?.[eid]?.device_id;
    if (!haDeviceId) return null;
    const device = this.hass?.devices?.[haDeviceId];
    const id = device?.identifiers?.find(([domain]) => domain === "smartvanio");
    return id?.[1] ?? null;
  }

  _powerSwitches(switches) {
    return switches.filter(
      ({ eid }) => !/heater|water_pump|inclinometer/i.test(eid),
    );
  }

  _buttonEntities(binary_sensors) {
    return binary_sensors.filter(
      ({ eid, state }) =>
        state?.attributes?.device_class !== "door" && !/door/i.test(eid),
    );
  }

  // ── Automation helpers ────────────────────────────────────

  _channelFromEntity(entity_id) {
    const dev = this._haDevice();
    const slug = dev
      ? dev.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/, "")
      : this._selectedId;
    return entity_id.split(".")[1].replace(slug + "_", "");
  }

  _automationId(entity_id, gesture) {
    const channel = this._channelFromEntity(entity_id);
    return `smartvanio_${this._selectedId}_${channel}_${gesture}`;
  }

  _getTargetEntities() {
    const slots = this._resolveSlots();
    if (!slots) return [];
    const groups = [];

    const lights = (slots.lights ?? []).map(({ entity, name }) => ({
      entity_id: entity,
      label: name || this._label(entity),
      domain: "light",
    }));
    if (lights.length) groups.push({ label: "Lights", entities: lights });

    const relays = (slots.switches ?? [])
      .filter(({ entity }) => !/fan/i.test(entity))
      .map(({ entity, name }) => ({
        entity_id: entity,
        label: name || this._label(entity),
        domain: "switch",
      }));
    if (relays.length) groups.push({ label: "Relays", entities: relays });

    const fan = (slots.switches ?? []).find(({ entity }) =>
      /fan/i.test(entity),
    );
    if (fan)
      groups.push({
        label: "Climate",
        entities: [
          {
            entity_id: fan.entity,
            label: fan.name || this._label(fan.entity),
            domain: "switch",
          },
        ],
      });

    // Scenes — discovered from HA state registry, associated with this device
    const dev = this._haDevice();
    const sceneEntities = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith("scene."))
      .filter(
        ([eid, s]) =>
          !dev ||
          s.attributes?.device_id === dev.id ||
          Object.values(this.hass.entities ?? {}).find(
            (e) => e.entity_id === eid && e.device_id === dev.id,
          ),
      )
      .map(([eid, s]) => ({
        entity_id: eid,
        label:
          this.hass.entities?.[eid]?.name ||
          s.attributes?.friendly_name ||
          eid.split(".")[1],
        domain: "scene",
      }));
    // Fallback: show all scenes if none are device-associated
    const allScenes = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith("scene."))
      .map(([eid, s]) => ({
        entity_id: eid,
        label:
          this.hass.entities?.[eid]?.name ||
          s.attributes?.friendly_name ||
          eid.split(".")[1],
        domain: "scene",
      }));
    const scenes = sceneEntities.length ? sceneEntities : allScenes;
    if (scenes.length) groups.push({ label: "Scenes", entities: scenes });

    return groups;
  }

  _buildAutomationConfig(entity_id, gesture, target_entity_id, action) {
    const domain = target_entity_id.split(".")[0];
    const label = this._label(entity_id);
    const gestureName =
      { press: "Press", double_press: "Double Press", hold: "Hold" }[gesture] ??
      gesture;
    const description = JSON.stringify({
      smartvanio: true,
      entity_id,
      gesture,
      target_entity_id,
      action,
    });
    const svcAction = {
      action: `${domain}.${action}`,
      target: { entity_id: target_entity_id },
    };
    const base = {
      alias: `[VanCtl] ${label} — ${gestureName}`,
      description,
      initial_state: true,
      conditions: [],
      mode: "single",
    };

    if (gesture === "press") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, to: "on" }],
        actions: [svcAction],
      };
    }
    if (gesture === "hold") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, to: "on", for: "0:00:02" }],
        actions: [svcAction],
      };
    }
    if (gesture === "double_press") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, to: "on" }],
        actions: [
          {
            wait_for_trigger: [{ trigger: "state", entity_id, to: "on" }],
            timeout: "0:00:00.500",
            continue_on_timeout: false,
          },
          svcAction,
        ],
      };
    }
    return { ...base, triggers: [], actions: [svcAction] };
  }

  // ── Add-Action modal helpers ─────────────────────────────

  _getSourceEntities() {
    const slots = this._resolveSlots();
    const discovered = this._entities();
    const groups = [];

    // Buttons: from slots.buttons (setup-mode defined) or discovered binary_sensors
    const rawButtons = slots?.buttons?.length
      ? slots.buttons.map(({ entity, name }) => ({
          entity_id: entity,
          label: name || this._label(entity),
        }))
      : this._buttonEntities(discovered?.binary_sensors ?? []).map(
          ({ eid, _slotName }) => ({
            entity_id: eid,
            label: _slotName || this._label(eid),
          }),
        );
    if (rawButtons.length)
      groups.push({ label: "Buttons", entities: rawButtons });

    // Switches: from slots or discovered
    const rawSwitches = (
      slots?.switches?.length
        ? slots.switches
        : (discovered?.switches ?? []).map(({ eid, _slotName }) => ({
            entity: eid,
            name: _slotName,
          }))
    ).map(({ entity, name, eid }) => ({
      entity_id: entity ?? eid,
      label: name || this._label(entity ?? eid),
    }));
    if (rawSwitches.length)
      groups.push({ label: "Switches", entities: rawSwitches });

    return groups;
  }

  _eventsForSource(eid) {
    const domain = eid?.split(".")?.[0];
    if (domain === "binary_sensor") {
      return [
        { value: "press", label: "Press" },
        { value: "double_press", label: "Double Press" },
        { value: "hold", label: "Press & Hold" },
      ];
    }
    if (domain === "switch") {
      return [
        { value: "off_to_on", label: "Off → On" },
        { value: "on_to_off", label: "On → Off" },
      ];
    }
    return [];
  }

  _actionsForTarget(eid) {
    const domain = eid?.split(".")?.[0];
    if (domain === "scene") return [{ value: "turn_on", label: "Activate" }];
    if (domain === "light")
      return [
        { value: "toggle", label: "Toggle" },
        { value: "turn_on", label: "Turn On" },
        { value: "turn_off", label: "Turn Off" },
      ];
    if (domain === "switch")
      return [
        { value: "toggle", label: "Toggle" },
        { value: "turn_on", label: "Turn On" },
        { value: "turn_off", label: "Turn Off" },
      ];
    return [{ value: "toggle", label: "Toggle" }];
  }

  _eventLabel(event) {
    return (
      {
        press: "Press",
        double_press: "Double Press",
        hold: "Press & Hold",
        off_to_on: "Off → On",
        on_to_off: "On → Off",
      }[event] ?? event
    );
  }

  _buildAutoFromModal(source, event, target, action) {
    const configKey = `smartvanio_${this._selectedId}_${this._channelFromEntity(source)}_${event}`;
    const srcLabel = this._label(source);
    const evtLabel = this._eventLabel(event);
    const targetLabel = this._label(target);
    const domain = target.split(".")[0];
    const description = JSON.stringify({
      smartvanio: true,
      configKey,
      entity_id: source,
      event,
      target_entity_id: target,
      action,
    });
    const svcAction = {
      action: `${domain}.${action}`,
      target: { entity_id: target },
    };
    const base = {
      alias: `[VanCtl] ${srcLabel} — ${evtLabel} — ${targetLabel}`,
      description,
      initial_state: true,
      conditions: [],
      mode: "single",
    };

    if (event === "press") {
      return {
        ...base,
        configKey,
        triggers: [{ trigger: "state", entity_id: source, to: "on" }],
        actions: [svcAction],
      };
    }
    if (event === "hold") {
      return {
        ...base,
        configKey,
        triggers: [
          { trigger: "state", entity_id: source, to: "on", for: "0:00:02" },
        ],
        actions: [svcAction],
      };
    }
    if (event === "double_press") {
      return {
        ...base,
        configKey,
        triggers: [{ trigger: "state", entity_id: source, to: "on" }],
        actions: [
          {
            wait_for_trigger: [
              { trigger: "state", entity_id: source, to: "on" },
            ],
            timeout: "0:00:00.500",
            continue_on_timeout: false,
          },
          svcAction,
        ],
      };
    }
    if (event === "off_to_on") {
      return {
        ...base,
        configKey,
        triggers: [
          { trigger: "state", entity_id: source, from: "off", to: "on" },
        ],
        actions: [svcAction],
      };
    }
    if (event === "on_to_off") {
      return {
        ...base,
        configKey,
        triggers: [
          { trigger: "state", entity_id: source, from: "on", to: "off" },
        ],
        actions: [svcAction],
      };
    }
    return { ...base, configKey, triggers: [], actions: [svcAction] };
  }

  _listVanctlAutomations() {
    return Object.entries(this.hass?.states ?? {})
      .filter(
        ([eid, s]) =>
          eid.startsWith("automation.") &&
          s.attributes?.friendly_name?.startsWith("[VanCtl]"),
      )
      .map(([eid, s]) => ({ eid, alias: s.attributes.friendly_name }))
      .sort((a, b) => a.alias.localeCompare(b.alias));
  }

  async _deleteAuto(autoItem) {
    // unique_id in the entity registry is the config key used when the automation was created
    const configKey = this.hass.entities?.[autoItem.eid]?.unique_id;
    if (!configKey) {
      console.error("[VanCtl] cannot delete: no unique_id for", autoItem.eid);
      return;
    }
    try {
      await this.hass.callApi(
        "DELETE",
        `config/automation/config/${configKey}`,
      );
      await this.hass.callService("automation", "reload", {});
    } catch (err) {
      console.error("[VanCtl] delete automation failed", err);
    }
  }

  _openAutoModal() {
    this._autoModal = {
      source: "",
      event: "",
      target: "",
      action: "",
      saving: false,
      error: null,
    };
  }

  _updateAutoModal(patch) {
    this._autoModal = { ...this._autoModal, ...patch };
  }

  async _saveAutoModal() {
    const { source, event, target, action } = this._autoModal;
    if (!source || !event || !target || !action) {
      this._updateAutoModal({ error: "Please fill in all fields." });
      return;
    }
    this._updateAutoModal({ saving: true, error: null });
    try {
      const cfg = this._buildAutoFromModal(source, event, target, action);
      const { configKey, ...cfgPayload } = cfg;
      await this.hass.callApi(
        "POST",
        `config/automation/config/${configKey}`,
        cfgPayload,
      );
      await this.hass.callService("automation", "reload", {});
      this._autoModal = null;
    } catch (err) {
      this._updateAutoModal({
        saving: false,
        error: "Save failed: " + (err.message || JSON.stringify(err)),
      });
    }
  }

  // ── Add-Action modal render ──────────────────────────────

  _renderAutoModal() {
    if (!this._autoModal) return html``;
    const m = this._autoModal;
    const sourceGroups = this._getSourceEntities();
    const sourceOptions = sourceGroups.map((g) => ({
      groupLabel: g.label,
      options: g.entities.map((e) => ({ value: e.entity_id, label: e.label })),
    }));
    const eventOptions = m.source
      ? this._eventsForSource(m.source).map((e) => ({
          value: e.value,
          label: e.label,
        }))
      : [];
    const targetGroups = this._getTargetEntities();
    const targetOptions = targetGroups.map((g) => ({
      groupLabel: g.label,
      options: g.entities.map((e) => ({ value: e.entity_id, label: e.label })),
    }));
    const actionOptions = m.target
      ? this._actionsForTarget(m.target).map((a) => ({
          value: a.value,
          label: a.label,
        }))
      : [];

    return html`
      <div
        class="auto-modal-overlay"
        @click=${(e) => {
          if (e.target === e.currentTarget) this._autoModal = null;
        }}
      >
        <div class="auto-modal">
          <div class="auto-modal-header">
            <span class="auto-modal-title">Add Action</span>
            <button
              class="auto-modal-close"
              @click=${() => {
                this._autoModal = null;
              }}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="auto-modal-body">
            <div class="auto-field">
              <label class="auto-label">When this</label>
              <smartvanio-select
                .value=${m.source}
                .options=${sourceOptions}
                placeholder="— Select trigger —"
                @smartvanio-change=${(e) =>
                  this._updateAutoModal({
                    source: e.detail.value,
                    event: "",
                    action: "",
                  })}
              ></smartvanio-select>
            </div>
            <div class="auto-field">
              <label class="auto-label">Does this</label>
              <smartvanio-select
                .value=${m.event}
                .options=${eventOptions}
                placeholder="— Select event —"
                ?disabled=${!m.source}
                @smartvanio-change=${(e) =>
                  this._updateAutoModal({ event: e.detail.value })}
              ></smartvanio-select>
            </div>
            <div class="auto-field-sep">then</div>
            <div class="auto-field">
              <label class="auto-label">On this</label>
              <smartvanio-select
                .value=${m.target}
                .options=${targetOptions}
                placeholder="— Select target —"
                @smartvanio-change=${(e) =>
                  this._updateAutoModal({ target: e.detail.value, action: "" })}
              ></smartvanio-select>
            </div>
            <div class="auto-field">
              <label class="auto-label">Do this</label>
              <smartvanio-select
                .value=${m.action}
                .options=${actionOptions}
                placeholder="— Select action —"
                ?disabled=${!m.target}
                @smartvanio-change=${(e) =>
                  this._updateAutoModal({ action: e.detail.value })}
              ></smartvanio-select>
            </div>
            ${m.error
              ? html`<div class="auto-modal-error">${m.error}</div>`
              : ""}
          </div>
          <div class="auto-modal-footer">
            <button
              class="auto-btn cancel"
              @click=${() => {
                this._autoModal = null;
              }}
            >
              Cancel
            </button>
            <button
              class="auto-btn save"
              ?disabled=${m.saving}
              @click=${() => this._saveAutoModal()}
            >
              ${m.saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async _openEditModal(entity_id) {
    this._editingEntity = entity_id;
    this._editName = this._label(entity_id);
    this._editRows = [];
    this._editOriginalIds = {};
    this._editLoading = true;
    this._editSaving = false;
    this._saveError = null;

    try {
      const rows = [];
      for (const gesture of ["press", "double_press", "hold"]) {
        const configKey = this._automationId(entity_id, gesture);
        try {
          const cfg = await this.hass.callApi(
            "GET",
            `config/automation/config/${configKey}`,
          );
          const meta = JSON.parse(cfg.description ?? "{}");
          if (meta.smartvanio) {
            rows.push({
              id: configKey,
              gesture: meta.gesture ?? gesture,
              target_entity_id: meta.target_entity_id ?? "",
              action: meta.action ?? "",
            });
          }
        } catch {} // 404 = no automation yet
      }
      this._editRows = rows;
      this._editOriginalIds = Object.fromEntries(
        rows.map((r) => [r.gesture, r.id]),
      );
    } catch (err) {
      console.error("VanCtl: failed to load automations", err);
    } finally {
      this._editLoading = false;
    }
  }

  async _saveEdit({ entity_id, name, rows }) {
    this._editSaving = true;
    this._saveError = null;
    try {
      // Rename entity if changed
      const currentName = this.hass.entities?.[entity_id]?.name;
      const newName = name?.trim();
      if ((newName || null) !== (currentName || null)) {
        await this.hass.callWS({
          type: "config/entity_registry/update",
          entity_id,
          name: newName || null,
        });
      }

      // Save / create automations
      const saved = new Set();
      for (const row of rows) {
        if (!row.gesture || !row.target_entity_id || !row.action) continue;
        const configKey = this._automationId(entity_id, row.gesture);
        const cfg = this._buildAutomationConfig(
          entity_id,
          row.gesture,
          row.target_entity_id,
          row.action,
        );
        await this.hass.callApi(
          "POST",
          `config/automation/config/${configKey}`,
          cfg,
        );
        saved.add(row.gesture);
      }

      // Delete removed gestures
      for (const gesture of Object.keys(this._editOriginalIds)) {
        if (!saved.has(gesture)) {
          await this.hass.callApi(
            "DELETE",
            `config/automation/config/${this._automationId(entity_id, gesture)}`,
          );
        }
      }

      await this.hass.callService("automation", "reload", {});
      this._editingEntity = null;
    } catch (err) {
      this._saveError =
        "Save failed: " + (err.message || err.error || JSON.stringify(err));
    } finally {
      this._editSaving = false;
    }
  }

  _toggleSection(name) {
    this._openSections = {
      ...this._openSections,
      [name]: !this._openSections[name],
    };
  }

  // ── Brightness helpers ────────────────────────────────────

  _bri(eid) {
    const drag = this._dragState.get(eid);
    if (drag?.active) return drag.brightness;
    const stored = parseFloat(localStorage.getItem(`smartvanio_bri_${eid}`));
    if (!isNaN(stored)) return stored;
    const s = this.hass.states[eid];
    return s?.attributes?.brightness ?? s?.attributes?.last_brightness ?? 255;
  }

  // ── Service calls ──────────────────────────────────────────

  _toggleLight(eid) {
    this.hass.callService("light", "toggle", { entity_id: eid });
  }
  _setBri(eid, v) {
    this.hass.callService("light", "turn_on", {
      entity_id: eid,
      brightness: Math.round(v),
    });
  }
  _toggleSwitch(eid) {
    const on = this.hass.states[eid]?.state === "on";
    this.hass.callService("switch", on ? "turn_off" : "turn_on", {
      entity_id: eid,
    });
  }

  // ── Climate arc drag ───────────────────────────────────────

  _onClimatePointerDown(e, tEid) {
    const svg = this.shadowRoot.querySelector(".climate-svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 200 / rect.width;
    const svgX = (e.clientX - rect.left) * scale;
    const svgY = (e.clientY - rect.top) * scale;
    const dx = svgX - C_CX,
      dy = svgY - C_CY;
    if (Math.abs(Math.sqrt(dx * dx + dy * dy) - C_TR) > 20) return;
    e.preventDefault();
    this._climateDragging = true;
    this._climateTargetEid = tEid;
    this._climateSvgRect = rect;
    window.addEventListener("pointermove", this._cmMove);
    window.addEventListener("pointerup", this._cmUp);
  }

  _onClimatePointerMove(e) {
    if (!this._climateDragging) return;
    const rect = this._climateSvgRect;
    const scale = 200 / rect.width;
    const svgX = (e.clientX - rect.left) * scale;
    const svgY = (e.clientY - rect.top) * scale;
    const dx = svgX - C_CX,
      dy = svgY - C_CY;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    let pos = angle - C_START;
    if (pos < 0) pos += 360;
    if (pos > C_SWEEP) pos = pos > C_SWEEP + (360 - C_SWEEP) / 2 ? 0 : C_SWEEP;
    const temp = 16 + (pos / C_SWEEP) * 12;
    this._pendingTargetTemp = Math.round(temp * 2) / 2;
  }

  _onClimatePointerUp() {
    if (!this._climateDragging) return;
    this._climateDragging = false;
    if (this._pendingTargetTemp !== null && this._climateTargetEid) {
      this.hass.callService("number", "set_value", {
        entity_id: this._climateTargetEid,
        value: this._pendingTargetTemp,
      });
    }
    this._pendingTargetTemp = null;
    window.removeEventListener("pointermove", this._cmMove);
    window.removeEventListener("pointerup", this._cmUp);
  }

  // ── Render: tab bar ────────────────────────────────────────

  _renderTabBar() {
    return html`
      <div class="tab-bar">
        ${TABS.map(
          (tab) => html`
            <div
              class="tab-btn ${this._activeTab === tab.id ? "active" : ""}"
              @click=${() => {
                this._activeTab = tab.id;
              }}
            >
              <ha-icon class="tab-icon" .icon=${tab.icon}></ha-icon>
              <span class="tab-label">${tab.label}</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  // ── Render: left panel dispatcher ─────────────────────────

  _renderLeftPanel(entities, level, slots = null) {
    if (this._setupMode) {
      switch (this._activeTab) {
        case "climate":
          return this._renderSetupClimate();
        case "scenes":
          return this._renderScenesPanel();
        case "actions":
          return this._renderActionsPanel();
        case "level":
          return this._renderSetupLevel();
        case "status":
          return this._renderSetupStatus();
        default:
          return html`<div class="panel-empty">No settings for this tab.</div>`;
      }
    }
    switch (this._activeTab) {
      case "climate":
        return this._renderClimatePanel(entities, slots);
      case "scenes":
        return this._renderScenesPanel();
      case "actions":
        return this._renderActionsPanel();
      case "level":
        return this._renderLevelPanel(level);
      case "status":
        return this._renderStatusPanel(entities, slots);
      default:
        return html``;
    }
  }

  // ── Render: climate panel ──────────────────────────────────

  _renderClimatePanel(entities, slots = null) {
    const wEid =
      slots?.water_temp ??
      entities.sensors.find(({ eid }) => /heater_water_temp/.test(eid))?.eid;
    const cEid =
      slots?.temperature ??
      entities.sensors.find(
        ({ eid }) => /temperature/.test(eid) && !/heater/.test(eid),
      )?.eid;
    const tEid =
      slots?.target_temp ??
      entities.numbers.find(({ eid }) => /target_temp/.test(eid))?.eid;
    const fEid =
      slots?.fan_speed ??
      entities.selects.find(({ eid }) => /fan_speed/.test(eid))?.eid;
    const mEid =
      slots?.climate_mode ??
      entities.selects.find(({ eid }) => /climate_mode/.test(eid))?.eid;
    const hEid =
      slots?.heater ??
      entities.switches.find(
        ({ eid }) => /\bheater\b/.test(eid) && !/water/.test(eid),
      )?.eid;
    const wpEid =
      slots?.water_pump ??
      entities.switches.find(({ eid }) => /water_pump/.test(eid))?.eid;

    const waterTemp = wEid ? parseFloat(this.hass.states[wEid]?.state) || 0 : 0;
    const cabinTemp = cEid
      ? parseFloat(this.hass.states[cEid]?.state) || null
      : null;
    const targetTemp =
      this._pendingTargetTemp ??
      (tEid ? parseFloat(this.hass.states[tEid]?.state) || 20 : 20);
    const fanSpeed = fEid ? (this.hass.states[fEid]?.state ?? "Off") : "Off";
    const climMode = mEid ? (this.hass.states[mEid]?.state ?? "Off") : "Off";
    const heaterOn = hEid ? this.hass.states[hEid]?.state === "on" : false;
    const pumpOn = wpEid ? this.hass.states[wpEid]?.state === "on" : false;

    const wPct = Math.max(0, Math.min(85, waterTemp)) / 85;
    const tPct = Math.max(0, Math.min(12, targetTemp - 16)) / 12;
    const wFill = C_WL * wPct;
    const tFill = C_TL * tPct;

    const thumbDeg = C_START + tPct * C_SWEEP;
    const [thumbX, thumbY] = polarXY(C_CX, C_CY, C_TR, thumbDeg);
    const wColor = waterTempColor(waterTemp);
    const modeIcon = { Off: "○", "Fan Only": "⊙", Cooling: "❄", Heating: "🔥" };

    return html`
      <div class="panel-climate">
        <svg
          class="climate-svg"
          viewBox="0 0 200 200"
          @pointerdown=${(e) => this._onClimatePointerDown(e, tEid)}
          style="touch-action:none"
        >
          <!-- tracks -->
          <path
            d="${arcPath(C_WR)}"
            fill="none"
            stroke="#151b23"
            stroke-width="14"
            stroke-linecap="butt"
          />
          <path
            d="${arcPath(C_TR)}"
            fill="none"
            stroke="#151b23"
            stroke-width="14"
            stroke-linecap="butt"
          />

          <!-- water temp fill (outer) -->
          <path
            d="${arcPath(C_WR)}"
            fill="none"
            stroke="${wColor}"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${wFill.toFixed(1)} ${(C_WL + 20).toFixed(1)}"
            style="transition:stroke-dasharray 1s ease,stroke 0.6s ease"
          />

          <!-- target temp fill (inner) -->
          <path
            d="${arcPath(C_TR)}"
            fill="none"
            stroke="#5cacff"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${tFill.toFixed(1)} ${(C_TL + 20).toFixed(1)}"
            style="transition:stroke-dasharray 0.15s ease"
          />

          <!-- arc labels -->
          <text x="24" y="155" text-anchor="middle" class="c-arc-tag">
            WATER
          </text>
          <text
            x="24"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:${wColor}"
          >
            ${Math.round(waterTemp)}°
          </text>
          <text x="176" y="155" text-anchor="middle" class="c-arc-tag">
            SET
          </text>
          <text
            x="176"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:#5cacff"
          >
            ${targetTemp.toFixed(1)}°
          </text>

          <!-- drag thumb -->
          <circle
            cx="${thumbX.toFixed(1)}"
            cy="${thumbY.toFixed(1)}"
            r="11"
            fill="#409eff"
            stroke="#010409"
            stroke-width="2.5"
            style="cursor:grab;filter:drop-shadow(0 0 7px rgba(92,172,255,0.7))"
          />
          <circle
            cx="${thumbX.toFixed(1)}"
            cy="${thumbY.toFixed(1)}"
            r="4"
            fill="#71b7ff"
            pointer-events="none"
          />

          <!-- cabin temp centre -->
          <text
            x="${C_CX}"
            y="${C_CY - 14}"
            text-anchor="middle"
            class="c-main-val"
          >
            ${cabinTemp !== null ? cabinTemp.toFixed(1) : "--"}
          </text>
          <text
            x="${C_CX}"
            y="${C_CY + 6}"
            text-anchor="middle"
            class="c-main-unit"
          >
            °C CABIN
          </text>

          <!-- heater toggle -->
          <g
            style="cursor:pointer"
            @click=${() => hEid && this._toggleSwitch(hEid)}
          >
            <circle
              cx="${C_CX - 18}"
              cy="${C_CY + 28}"
              r="13"
              fill="${heaterOn ? "#7a2a00" : "#151b23"}"
              stroke="${heaterOn ? "#f0b72f" : "#212830"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${heaterOn
                ? "drop-shadow(0 0 5px #f0b72f88)"
                : "none"}"
            />
            <text
              x="${C_CX - 18}"
              y="${C_CY + 33}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              🔥
            </text>
          </g>
          <text
            x="${C_CX - 18}"
            y="${C_CY + 50}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${heaterOn ? "ON" : "OFF"}
          </text>

          <!-- pump toggle -->
          <g
            style="cursor:pointer"
            @click=${() => wpEid && this._toggleSwitch(wpEid)}
          >
            <circle
              cx="${C_CX + 18}"
              cy="${C_CY + 28}"
              r="13"
              fill="${pumpOn ? "#1e1b4b" : "#151b23"}"
              stroke="${pumpOn ? "#5cacff" : "#212830"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${pumpOn
                ? "drop-shadow(0 0 5px #5cacff88)"
                : "none"}"
            />
            <text
              x="${C_CX + 18}"
              y="${C_CY + 33}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              💧
            </text>
          </g>
          <text
            x="${C_CX + 18}"
            y="${C_CY + 50}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${pumpOn ? "ON" : "OFF"}
          </text>
        </svg>

        <!-- fan speed -->
        <div class="fan-row">
          ${["Off", "Low", "Medium", "High"].map(
            (s) => html`
              <div
                class="fan-btn ${fanSpeed === s ? "active" : ""}"
                @click=${() =>
                  fEid &&
                  this.hass.callService("select", "select_option", {
                    entity_id: fEid,
                    option: s,
                  })}
              >
                ${s}
              </div>
            `,
          )}
        </div>

        <!-- climate mode -->
        <div class="mode-row">
          ${["Off", "Fan Only", "Cooling", "Heating"].map(
            (m) => html`
              <div
                class="mode-btn ${climMode === m ? "active" : ""}"
                @click=${() =>
                  mEid &&
                  this.hass.callService("select", "select_option", {
                    entity_id: mEid,
                    option: m,
                  })}
              >
                <span class="mode-icon">${modeIcon[m]}</span>
                <span class="mode-lbl">${m}</span>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  // ── Render: scenes panel ───────────────────────────────────

  // ── Scene edit ────────────────────────────────────────────

  _getSceneLightOptions() {
    if (!this._selectedId || !this.hass) return [];
    const dev = this._haDevice();
    if (!dev) return [];

    const parents = [];
    const segsByParent = {};

    for (const [entity_id, entry] of Object.entries(this.hass.entities ?? {})) {
      if (!entity_id.startsWith("light.")) continue;
      if (entry.device_id !== dev.id) continue;
      const state = this.hass.states[entity_id];
      if (!state) continue;
      const parentId = state.attributes?.smartvanio_parent_entity_id;
      if (parentId) {
        (segsByParent[parentId] ??= []).push(entity_id);
      } else {
        parents.push(entity_id);
      }
    }

    for (const segs of Object.values(segsByParent)) {
      segs.sort(
        (a, b) =>
          (this.hass.states[a]?.attributes?.segment_start ?? 0) -
          (this.hass.states[b]?.attributes?.segment_start ?? 0),
      );
    }

    return parents.map((eid) => {
      const segs = segsByParent[eid] ?? [];
      const parentLabel = this._label(eid);
      if (segs.length) {
        return {
          groupLabel: parentLabel,
          options: [
            { value: eid, label: `${parentLabel} (all LEDs)` },
            ...segs.map((seid) => ({ value: seid, label: this._label(seid) })),
          ],
        };
      }
      return { groupLabel: null, options: [{ value: eid, label: parentLabel }] };
    });
  }

  _openSceneModal(eid) {
    const state = this.hass.states[eid];
    this._editingScene    = eid;
    this._sceneEditName   = this._label(eid);
    this._sceneEditSaving = false;
    this._sceneEditLights = (state?.attributes?.lights ?? []).map((l) => ({ ...l }));
  }

  _openNewSceneModal() {
    this._editingScene    = "new";
    this._sceneEditName   = "";
    this._sceneEditSaving = false;
    this._sceneEditLights = [];
  }

  _addSceneLight(eid) {
    if (!eid || this._sceneEditLights.find((l) => l.entity_id === eid)) return;
    const s = this.hass.states[eid];
    const isOn = s?.state === "on";
    this._sceneEditLights = [
      ...this._sceneEditLights,
      {
        entity_id: eid,
        state: isOn ? "ON" : "OFF",
        brightness: s?.attributes?.brightness ?? 255,
        rgb_color: s?.attributes?.rgb_color ?? null,
      },
    ];
  }

  _removeSceneLight(eid) {
    this._sceneEditLights = this._sceneEditLights.filter((l) => l.entity_id !== eid);
  }

  _updateSceneLight(eid, field, value) {
    this._sceneEditLights = this._sceneEditLights.map((l) =>
      l.entity_id === eid ? { ...l, [field]: value } : l,
    );
  }

  _captureSceneState() {
    this._sceneEditLights = this._sceneEditLights.map((l) => {
      const s = this.hass.states[l.entity_id];
      return {
        ...l,
        state: s?.state?.toUpperCase() ?? l.state,
        brightness: s?.attributes?.brightness ?? l.brightness,
        rgb_color: s?.attributes?.rgb_color ?? l.rgb_color,
      };
    });
  }

  async _saveScene() {
    this._sceneEditSaving = true;
    try {
      const allScenes = this._deviceScenes().map(({ eid, state }) => ({
        id: state.attributes.scene_id,
        name: this._label(eid),
        lights: state.attributes.lights ?? [],
      }));

      const sceneId =
        this._editingScene === "new"
          ? `scene_${Date.now()}`
          : this.hass.states[this._editingScene]?.attributes?.scene_id;

      const lights = this._sceneEditLights.map((l) => {
        const entry = { entity_id: l.entity_id, state: l.state ?? "ON" };
        if (l.brightness != null) entry.brightness = l.brightness;
        if (l.rgb_color != null) entry.rgb_color = l.rgb_color;
        return entry;
      });

      const updated = { id: sceneId, name: this._sceneEditName.trim() || "Unnamed Scene", lights };
      const idx = allScenes.findIndex((s) => s.id === sceneId);
      if (idx >= 0) allScenes[idx] = updated;
      else allScenes.push(updated);

      await this.hass.callService("mqtt", "publish", {
        topic: `smartvanio/${this._selectedId}/scenes`,
        payload: JSON.stringify(allScenes),
        retain: true,
      });
      this._editingScene = null;
    } catch (err) {
      console.error("VanCtl: save scene failed:", err);
    } finally {
      this._sceneEditSaving = false;
    }
  }

  async _deleteScene() {
    const sceneId = this.hass.states[this._editingScene]?.attributes?.scene_id;
    const remaining = this._deviceScenes()
      .map(({ eid, state }) => ({
        id: state.attributes.scene_id,
        name: this._label(eid),
        lights: state.attributes.lights ?? [],
      }))
      .filter((s) => s.id !== sceneId);

    await this.hass.callService("mqtt", "publish", {
      topic: `smartvanio/${this._selectedId}/scenes`,
      payload: JSON.stringify(remaining),
      retain: true,
    });
    this._editingScene = null;
  }

  _renderScenesPanel() {
    const scenes = this._deviceScenes();
    const scripts = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith("script."))
      .map(([eid, s]) => ({
        eid,
        label: s.attributes?.friendly_name ?? eid.split(".").pop(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (!scenes.length && !scripts.length) {
      return html`<div class="panel-empty">No scenes or scripts configured.</div>`;
    }

    if (this._setupMode) {
      return html`
        <div class="panel-actions">
          ${scenes.map(({ eid }) => html`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:palette"></ha-icon>
              <span class="auto-row-label">${this._label(eid)}</span>
              <button class="auto-row-edit" title="Edit" @click=${() => this._openSceneModal(eid)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>
              </button>
            </div>
          `)}
          ${scripts.map(({ eid, label }) => html`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:play-circle-outline" style="color:#5cacff"></ha-icon>
              <span class="auto-row-label">${label}</span>
            </div>
          `)}
          <button class="add-action-btn-full" @click=${() => this._openNewSceneModal()}>
            + New Scene
          </button>
        </div>
      `;
    }

    return html`
      <div class="panel-scenes">
        ${scenes.map(({ eid }) => html`
          <div class="scene-tile" @click=${() => this._triggerScene(eid)}>
            <ha-icon class="scene-icon" icon="mdi:palette"></ha-icon>
            <span class="scene-name">${this._label(eid)}</span>
          </div>
        `)}
        ${scripts.map(({ eid, label }) => html`
          <div class="scene-tile scene-tile--script" @click=${() => this._runAction(eid)}>
            <ha-icon class="scene-icon" icon="mdi:play-circle-outline"></ha-icon>
            <span class="scene-name">${label}</span>
          </div>
        `)}
      </div>
    `;
  }

  // ── Render: actions panel ──────────────────────────────────

  _renderActionsPanel() {
    const automations = this._listVanctlAutomations();
    return html`
      <div class="panel-actions">
        ${automations.length
          ? automations.map(
              (auto) => html`
                <div class="auto-row">
                  <ha-icon
                    class="auto-row-icon"
                    icon="mdi:lightning-bolt"
                  ></ha-icon>
                  <span class="auto-row-label"
                    >${auto.alias
                      .replace(/^\[VanCtl\]\s*/, "")
                      .replace(/\s*—\s*/g, " · ")}</span
                  >
                  ${this._setupMode
                    ? html`
                        <button
                          class="auto-row-delete"
                          title="Delete"
                          @click=${() => this._deleteAuto(auto)}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>
                      `
                    : ""}
                </div>
              `,
            )
          : html`<div class="panel-empty">No automations configured .</div>`}
        ${this._setupMode
          ? html`
              <button
                class="add-action-btn-full"
                @click=${() => this._openAutoModal()}
              >
                <ha-icon icon="mdi:plus"></ha-icon> Add Action
              </button>
            `
          : ""}
      </div>
    `;
  }

  // ── Render: level panel ────────────────────────────────────

  _renderLevelPanel(level) {
    const pitchVal = parseFloat(level?.pitch?.state) || 0;
    const rollVal = parseFloat(level?.roll?.state) || 0;
    const ARENA_R = 70;
    const BUBBLE_R = 14;
    const MAX_DEG = 15;
    const maxOff = ARENA_R - BUBBLE_R - 4;
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const bx = clamp(rollVal / MAX_DEG) * maxOff;
    const by = clamp(-pitchVal / MAX_DEG) * maxOff;
    const totalTilt = Math.sqrt(pitchVal ** 2 + rollVal ** 2);
    const col =
      totalTilt < 1.5 ? "#2bd853" : totalTilt < 5 ? "#f0b72f" : "#ff9492";
    const levelOk = totalTilt < 1.5;
    const vb = `${-ARENA_R - 14} ${-ARENA_R - 14} ${(ARENA_R + 14) * 2} ${(ARENA_R + 14) * 2}`;

    return html`
      <div class="panel-level">
        <svg class="bubble-lg" viewBox="${vb}">
          <circle
            r="${ARENA_R}"
            fill="#010409"
            stroke="${col}"
            stroke-width="2"
            style="transition:stroke 0.4s ease"
          />
          <circle
            r="${ARENA_R * 0.6}"
            fill="none"
            stroke="#212830"
            stroke-width="1"
          />
          <circle
            r="${ARENA_R * 0.3}"
            fill="none"
            stroke="#212830"
            stroke-width="0.8"
          />
          <line
            x1="${-ARENA_R}"
            y1="0"
            x2="${ARENA_R}"
            y2="0"
            stroke="#212830"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="${-ARENA_R}"
            x2="0"
            y2="${ARENA_R}"
            stroke="#212830"
            stroke-width="1"
          />
          <circle
            r="${BUBBLE_R}"
            fill="${col}"
            opacity="0.9"
            style="transform:translate(${bx.toFixed(1)}px,${by.toFixed(1)}px);
                   transition:transform 0.55s ease,fill 0.4s ease;
                   filter:drop-shadow(0 0 7px ${col}88)"
          />
          <circle r="3" fill="none" stroke="#212830" stroke-width="1" />
        </svg>

        <div class="level-stats">
          <div class="lstat">
            <span class="lstat-label">PITCH</span>
            <span class="lstat-val ${Math.abs(pitchVal) > 5 ? "warn" : ""}">
              ${pitchVal >= 0 ? "+" : ""}${pitchVal.toFixed(1)}°
            </span>
          </div>
          <div class="lstat">
            <span class="lstat-label">ROLL</span>
            <span class="lstat-val ${Math.abs(rollVal) > 5 ? "warn" : ""}">
              ${rollVal >= 0 ? "+" : ""}${rollVal.toFixed(1)}°
            </span>
          </div>
          <div class="lstat">
            <span class="lstat-label">STATUS</span>
            <span class="lstat-val ${levelOk ? "ok" : "warn"}"
              >${levelOk ? "Level" : "Tilted"}</span
            >
          </div>
        </div>
      </div>
    `;
  }

  // ── Render: status panel ───────────────────────────────────

  _renderStatusPanel(entities, slots = null) {
    const eids = slots?.status_sensors ?? [];

    const DOMAIN_LABELS = {
      sensor: "Sensors",
      binary_sensor: "Binary Sensors",
      number: "Numbers",
      select: "Settings",
      input_boolean: "Toggles",
    };

    // ── Boards section ────────────────────────────────────────
    const boardEntries = Object.entries(this._knownDevices);
    const boardsSection = boardEntries.length
      ? html`
          <div class="sstat-group-label">Boards</div>
          ${boardEntries.map(([did, dev]) => {
            const status = this._deviceStatuses[did];
            const online = status === "online";
            const offline = status === "offline";
            return html`
              <div class="sstat-row">
                <span class="sstat-row-name">${dev.name ?? did}</span>
                <span
                  class="board-dot ${online
                    ? "online"
                    : offline
                      ? "offline"
                      : "unknown"}"
                  title="${online ? "Online" : offline ? "Offline" : "Unknown"}"
                >
                </span>
              </div>
            `;
          })}
        `
      : "";

    if (!eids.length)
      return html` <div class="panel-status">
        ${boardsSection}
        ${!boardEntries.length
          ? html`
              <div class="panel-empty">
                No status sensors configured.<br />Tap ⚙ → Status to add some.
              </div>
            `
          : html`
              <div class="sstat-group-label" style="margin-top:10px">
                Sensors
              </div>
              <div class="sstat-hint">Tap ⚙ → Status to add sensors.</div>
            `}
      </div>`;

    // Group by domain, preserving order within each group
    const groups = new Map();
    for (const eid of eids) {
      const domain = eid.split(".")[0];
      if (!groups.has(domain)) groups.set(domain, []);
      groups.get(domain).push(eid);
    }

    return html`
      <div class="panel-status">
        ${boardsSection}
        ${[...groups.entries()].map(
          ([domain, domainEids]) => html`
            ${groups.size > 1 || boardEntries.length
              ? html`
                  <div class="sstat-group-label">
                    ${DOMAIN_LABELS[domain] ?? domain}
                  </div>
                `
              : ""}
            ${domainEids.map((eid) => {
              const state = this.hass.states[eid];
              const val = state?.state ?? null;
              const unit = state?.attributes?.unit_of_measurement ?? "";
              const vid = this._smartvanioDeviceId(eid);
              const offline = vid && this._deviceStatuses[vid] === "offline";
              return html`
                <div class="sstat-row">
                  <span class="sstat-row-name">
                    ${offline
                      ? html`<span
                          class="board-dot offline"
                          title="Board offline"
                        ></span>`
                      : ""}
                    ${this._label(eid)}
                  </span>
                  <span class="sstat-row-val ${offline ? "val-offline" : ""}">
                    ${val !== null ? val + (unit ? "\u202f" + unit : "") : "—"}
                  </span>
                </div>
              `;
            })}
          `,
        )}
      </div>
    `;
  }

  // ── Render: pinned actions strip ───────────────────────────

  _renderPinnedActions() {
    const pinned = this._cardConfig?.pinnedActions ?? [];
    if (!pinned.length && !this._setupMode) return html``;
    return html`
      <div class="pinned-strip">
        ${pinned.map(
          (action) => html`
            <div
              class="pinned-btn"
              @click=${() =>
                this._setupMode
                  ? this._removePinnedAction(action.id)
                  : this._runAction(action.id)}
            >
              <span class="pinned-lbl">${action.label}</span>
              ${this._setupMode ? html`<span class="pinned-x">✕</span>` : ""}
            </div>
          `,
        )}
        ${this._setupMode
          ? html`
              <div
                class="pinned-add"
                @click=${() => {
                  this._activeTab = "actions";
                }}
              >
                + Add
              </div>
            `
          : ""}
      </div>
    `;
  }

  // ── Render: light tile (CarPlay style) ─────────────────────

  _lightIcon(eid) {
    if (/strip/i.test(eid)) return 'mdi:led-strip-variant';
    if (/spot/i.test(eid)) return 'mdi:spotlight-beam';
    if (/main/i.test(eid)) return 'mdi:lightbulb';
    return 'mdi:lightbulb-outline';
  }

  // ── Tile long-press → popover ────────────────────────────

  _onTilePointerDown(e, eid) {
    if (this._dndMode) return; // Let Swapy handle all pointer events in DnD mode
    if (e.button !== 0 && e.pointerType !== "touch") return;
    this._tileLpOrigin = { x: e.clientX, y: e.clientY };
    this._tileLpTimer = setTimeout(() => {
      this._tileLpTimer = null;
      this._tileLpOrigin = null;
      const rect = e.currentTarget.getBoundingClientRect();
      this._tilePopover = { eid, x: rect.left + rect.width / 2, y: rect.top };
    }, 400);
  }

  _onTilePointerMove(e) {
    if (this._dndMode) return;
    if (!this._tileLpTimer || !this._tileLpOrigin) return;
    const dx = e.clientX - this._tileLpOrigin.x;
    const dy = e.clientY - this._tileLpOrigin.y;
    if (Math.sqrt(dx * dx + dy * dy) > 8) {
      clearTimeout(this._tileLpTimer);
      this._tileLpTimer = null;
      this._tileLpOrigin = null;
    }
  }

  _onTilePointerUp(e, eid) {
    if (this._dndMode) return;
    if (!this._tileLpTimer) return; // long-press already fired or cancelled
    clearTimeout(this._tileLpTimer);
    this._tileLpTimer = null;
    this._tileLpOrigin = null;
    this._toggleLight(eid);
  }

  _renderTilePopover() {
    const p = this._tilePopover;
    if (!p) return html``;
    const eid = p.eid;
    const state = this.hass.states[eid];
    const isOn = state?.state === 'on';
    const bri = this._bri(eid);
    const briPct = Math.round((bri / 255) * 100);
    const rgb = state?.attributes?.rgb_color ?? [255, 200, 80];
    const [r, g, b] = rgb;
    const modes = state?.attributes?.supported_color_modes ?? [];
    const supportsColor = modes.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m));
    const hexColor = '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
    const sliderColor = isOn ? `rgb(${r},${g},${b})` : '#48484a';
    const sliderBg = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${briPct}%, rgba(255,255,255,0.08) ${briPct}%, rgba(255,255,255,0.08) 100%)`;

    return html`
      <div class="popover-overlay" @click=${() => { this._tilePopover = null; }}>
        <div
          class="popover"
          style="left:${p.x}px; top:${p.y}px"
          @click=${(e) => e.stopPropagation()}
        >
          <div class="popover-hdr">
            <span class="popover-name">${this._label(eid)}</span>
            <button class="popover-toggle ${isOn ? 'on' : ''}" @click=${() => this._toggleLight(eid)}>
              ${isOn ? 'ON' : 'OFF'}
            </button>
          </div>
          <div class="popover-body">
            <div class="popover-row">
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:16px; color:#9198a1"></ha-icon>
              <input
                type="range" min="1" max="255"
                .value=${bri}
                class="popover-slider"
                style="background:${sliderBg}"
                @input=${(e) => {
                  this._dragState = new Map(this._dragState).set(eid, { active: true, brightness: +e.target.value });
                }}
                @change=${(e) => {
                  const v = +e.target.value;
                  this._setBri(eid, v);
                  localStorage.setItem(`smartvanio_bri_${eid}`, v);
                  this._dragState = new Map(this._dragState).set(eid, { active: false, brightness: v });
                }}
              />
              <span class="popover-pct">${briPct}%</span>
            </div>
            ${supportsColor ? html`
              <div class="popover-row">
                <ha-icon icon="mdi:palette" style="--mdc-icon-size:16px; color:#9198a1"></ha-icon>
                <input
                  type="color"
                  class="popover-color"
                  .value=${hexColor}
                  @change=${(e) => {
                    const h = e.target.value;
                    this.hass.callService("light", "turn_on", {
                      entity_id: eid,
                      rgb_color: [
                        parseInt(h.slice(1, 3), 16),
                        parseInt(h.slice(3, 5), 16),
                        parseInt(h.slice(5, 7), 16),
                      ],
                    });
                  }}
                />
                <div class="popover-swatch" style="background:${hexColor}"
                  @click=${(e) => e.target.previousElementSibling.click()}></div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  _renderLightTile({ eid, state, _slotName = null }) {
    const isOn = state?.state === 'on';
    const bri = this._bri(eid);
    const briPct = Math.round((bri / 255) * 100);
    const rgb = state?.attributes?.rgb_color ?? [255, 200, 80];
    const [r, g, b] = rgb;
    const bgStyle = isOn
      ? `background: rgba(${r},${g},${b},${0.12 + 0.22 * (bri / 255)})`
      : 'background: rgba(28,28,30,0.65)';
    const iconColor = isOn ? `rgb(${r},${g},${b})` : '#48484a';
    const icon = this._lightIcon(eid);
    const name = this._label(eid, _slotName);

    return html`
      <div
        class="ltile ${isOn ? 'on' : ''}"
        style="${bgStyle}"
        data-tile-id=${eid}
        @pointerdown=${(e) => this._onTilePointerDown(e, eid)}
        @pointermove=${(e) => this._onTilePointerMove(e)}
        @pointerup=${(e) => this._onTilePointerUp(e, eid)}
        @contextmenu=${(e) => e.preventDefault()}
      >
        <ha-icon
          class="ltile-icon"
          icon=${icon}
          style="color:${iconColor}"
        ></ha-icon>
        <span class="ltile-name">${name}</span>
        ${isOn ? html`<span class="ltile-bri">${briPct}%</span>` : ''}
      </div>
    `;
  }

  // ── Render: unified tile grid (groups + lights + switches) ──

  _renderUnifiedGrid(slots, lights, powerSwitches) {
    const groups = slots?.groups ?? [];
    const tileOrder = slots?.tileOrder ?? null;
    const items = this._orderedTiles(groups, lights, powerSwitches, tileOrder);

    // Build layout if needed
    if (!this._currentLayout) {
      if (this._cardConfig?.slots?.layouts?.[this._gridKey]) {
        this._currentLayout = this._mergeNewItems(
          structuredClone(this._cardConfig.slots.layouts[this._gridKey]),
          items
        );
      } else if (tileOrder?.length) {
        this._currentLayout = migrateFromTileOrder(
          tileOrder, items, this._gridCols, (i) => this._tileSizeFor(i)
        );
      } else {
        this._currentLayout = autoPackLayout(items, this._gridCols, (i) => this._tileSizeFor(i));
      }
    }

    // Prune stale layout entries (e.g. dissolved groups)
    const itemIds = new Set(items.filter(i => i.type !== 'spacer').map(i => i.id));
    if (this._currentLayout) {
      for (const id of Object.keys(this._currentLayout)) {
        if (!itemIds.has(id)) delete this._currentLayout[id];
      }
    }

    const layout = this._currentLayout ?? {};
    const dc = this._dragController;

    return html`
      <div class="unified-grid-wrap">
        <div class="unified-grid-hdr">
          <span class="section-label">Controls</span>
          ${this._dndMode
            ? html`
                <span class="dnd-hint">Hold &amp; drag to reorder</span>
                <button class="dnd-done-btn" @click=${() => this._exitDndMode()}>Done</button>
              `
            : html`
                <button class="dnd-toggle-btn" @click=${() => { this._enterDndMode(); }}
                  title="Reorder tiles">
                  <ha-icon icon="mdi:drag"></ha-icon>
                </button>
              `}
        </div>
        <div class="unified-grid ${this._dndMode ? 'dnd-mode' : ''}"
             @pointerdown=${this._dndMode ? (e) => this._dragController.start(e) : null}>
          ${items.filter(i => i.type !== 'spacer').map(i => {
            const pos = layout[i.id];
            if (!pos) return '';
            const isMergeTarget = this._mergeTargetId === i.id;
            const style = `grid-column: ${pos.col + 1} / span ${pos.w}; grid-row: ${pos.row + 1} / span ${pos.h};`;
            return html`
              <div class="grid-tile ${isMergeTarget ? 'merge-target' : ''}" data-tile-id=${i.id}
                   data-tile-w=${pos.w} data-tile-h=${pos.h}
                   data-tile-col=${pos.col} data-tile-row=${pos.row}
                   style=${style}>
                ${this._dndMode && this._allowedSizes(i).length > 1 ? html`
                  <button class="resize-btn" @click=${(e) => { e.stopPropagation(); this._cycleTileSize(i.id, i); }}
                    title="Resize tile">
                    <ha-icon icon="mdi:resize"></ha-icon>
                  </button>
                ` : ''}
                ${i.type === 'group' ? this._renderGroupTile(i.data, pos)
                : i.type === 'light' ? this._renderLightTile(i.data)
                : i.type === 'switch' ? this._renderSwitchTile(i.data)
                : ''}
              </div>
            `;
          })}
          ${this._dndMode ? this._renderEmptyCells(layout) : ''}
          ${dc.dragging && !this._mergeTargetId ? html`
            <div class="drop-preview"
                 style="grid-column: ${dc.previewCol + 1} / span ${dc.w}; grid-row: ${dc.previewRow + 1} / span ${dc.h};">
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _renderEmptyCells(layout) {
    const occ = rebuildOccupancy(layout, this._gridCols);
    // Only show empty cells within the existing content bounds (no extra rows)
    let maxRow = 0;
    for (const pos of Object.values(layout)) {
      maxRow = Math.max(maxRow, pos.row + pos.h);
    }
    const totalRows = Math.max(maxRow, this._gridRows || 4);
    const cells = [];
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < this._gridCols; c++) {
        if (!occ[r]?.[c]) {
          cells.push(html`
            <div class="empty-cell"
                 style="grid-column: ${c + 1}; grid-row: ${r + 1};">
            </div>
          `);
        }
      }
    }
    return cells;
  }

  // ── Render: light row ──────────────────────────────────────

  _renderLightRow({ eid, state, _slotName = null }) {
    const isOn = state?.state === "on";
    const bri = this._bri(eid);
    const pct = Math.round((bri / 255) * 100);
    const rgb = state?.attributes?.rgb_color ?? [255, 255, 255];
    const dotCol = isOn ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "#212830";
    const glowOn = isOn ? `0 0 9px rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "none";
    const sliderPct = isOn ? pct : 0;
    const sliderBg = `linear-gradient(to right, #5cacff ${sliderPct}%, #151b23 ${sliderPct}%)`;

    const modes = state?.attributes?.supported_color_modes ?? [];
    const supportsColor = modes.some((m) =>
      ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m),
    );
    const hexColor =
      "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

    return html`
      <div
        class="lrow ${isOn ? "on" : ""}"
        @click=${() => this._toggleLight(eid)}
      >
        <div
          class="ldot"
          style="background:${dotCol};box-shadow:${glowOn}"
        ></div>
        <span class="lname">${this._label(eid, _slotName)}</span>
        <div class="lright" @click=${(e) => e.stopPropagation()}>
          ${supportsColor
            ? html`
                <label
                  class="color-swatch"
                  style="background:${isOn ? hexColor : "#212830"}"
                >
                  <input
                    type="color"
                    class="color-input"
                    .value=${hexColor}
                    @change=${(e) => {
                      const h = e.target.value;
                      this.hass.callService("light", "turn_on", {
                        entity_id: eid,
                        rgb_color: [
                          parseInt(h.slice(1, 3), 16),
                          parseInt(h.slice(3, 5), 16),
                          parseInt(h.slice(5, 7), 16),
                        ],
                      });
                    }}
                  />
                </label>
              `
            : ""}
          <input
            type="range"
            min="1"
            max="255"
            .value=${bri}
            class="lslider"
            style="background:${sliderBg}"
            @input=${(e) => {
              const v = +e.target.value;
              this._dragState = new Map(this._dragState).set(eid, {
                active: true,
                brightness: v,
              });
            }}
            @change=${(e) => {
              const v = +e.target.value;
              this._setBri(eid, v);
              localStorage.setItem(`smartvanio_bri_${eid}`, v);
              this._dragState = new Map(this._dragState).set(eid, {
                active: false,
                brightness: v,
              });
            }}
          />
          <span class="lpct">${isOn ? pct + "%" : "—"}</span>
        </div>
      </div>
    `;
  }

  // ── Render: switch tile ────────────────────────────────────

  _renderSwitchTile({ eid, state, _slotName = null }) {
    const isOn = state?.state === "on";
    const isFan = eid.includes("fan");
    const icon = isFan ? "mdi:fan" : "mdi:power-plug";
    return html`
      <div
        class="stile ${isOn ? "on" : ""}"
        data-tile-id=${eid}
        @click=${() => { if (!this._dndMode) this.hass.callService(eid.split(".")[0], "toggle", {}, { entity_id: eid }); }}
      >
        <ha-icon class="stile-icon" icon=${icon}></ha-icon>
        <span class="stile-name">${this._label(eid, _slotName)}</span>
        <span class="stile-badge">${isOn ? "ON" : "OFF"}</span>
      </div>
    `;
  }

  // ── Render: resources bar ──────────────────────────────────

  _renderResources(entities, slots = null) {
    const { sensors } = entities;
    const find = (pat) => sensors.find(({ eid }) => pat.test(eid))?.eid;

    // Slot-configured resources come first; append device-discovered ones not already covered
    const slotIds = new Set((slots?.resources ?? []).map((r) => r.entity));
    const discovered = [
      { eid: find(/water_tank$/), label: "Water", color: "#5cacff" },
      { eid: find(/gas_tank$/), label: "Gas", color: "#f0b72f" },
      { eid: find(/waste_tank$/), label: "Waste", color: "#ff9492" },
      { eid: find(/fuel_level/), label: "Fuel", color: "#2bd853" },
    ].filter(({ eid }) => eid && !slotIds.has(eid));

    const slotItems = (slots?.resources ?? []).map(
      ({ entity, name, color }) => ({
        eid: entity,
        label: name ?? entity.split(".").pop(),
        color: color ?? "#5cacff",
      }),
    );

    const allItems = [...slotItems, ...discovered];

    // Battery from slots or device discovery
    const battSlot = slots?.resources?.find((r) =>
      /battery|soc/i.test(r.entity),
    );
    const battEid = battSlot ? null : find(/battery/); // skip if already in slot items
    const battV = battEid ? parseFloat(this.hass.states[battEid]?.state) : null;
    const battPct =
      battV !== null
        ? Math.max(0, Math.min(100, ((battV - 11.5) / 1.7) * 100))
        : 0;
    const battCol =
      battV === null
        ? "#9198a1"
        : battPct > 50
          ? "#2bd853"
          : battPct > 20
            ? "#f0b72f"
            : "#ff9492";

    if (!allItems.length && !battEid) {
      // Nothing to show — skip render (avoids blank bar on first load before discovery)
      return html``;
    }

    return html`
      ${allItems.map(({ eid, label, color }) => {
        const val = eid ? parseFloat(this.hass.states[eid]?.state) || 0 : 0;
        const pct = Math.max(0, Math.min(100, val));
        return html`
          <div class="res-item">
            <span class="res-label">${label}</span>
            <div class="res-bar-wrap">
              <div
                class="res-bar-fill"
                style="width:${pct.toFixed(1)}%;background:${color}"
              ></div>
            </div>
            <span class="res-val" style="color:${color}"
              >${Math.round(val)}%</span
            >
          </div>
        `;
      })}
      ${battEid
        ? html`
            <div class="res-item">
              <span class="res-label">Battery</span>
              <div class="res-bar-wrap">
                <div
                  class="res-bar-fill"
                  style="width:${battPct.toFixed(1)}%;background:${battCol}"
                ></div>
              </div>
              <span class="res-val" style="color:${battCol}">
                ${battV !== null ? battV.toFixed(1) + "V" : "—"}
              </span>
            </div>
          `
        : ""}
    `;
  }

  // ── Render: device picker ──────────────────────────────────

  _renderPicker() {
    const devices = Object.values(this.hass.devices ?? {})
      .filter((d) => d.identifiers?.some(([dom]) => dom === "smartvanio"))
      .map((d) => ({
        id: d.identifiers.find(([dom]) => dom === "smartvanio")[1],
        name: d.name_by_user ?? d.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return html`
      <div class="picker">
        <div class="picker-title">VanCtl HMI</div>
        <div class="picker-sub">Select a device</div>
        ${devices.map(
          (d) => html`
            <div
              class="picker-row"
              @click=${() => {
                this._selectedId = d.id;
              }}
            >
              <span class="picker-name">${d.name}</span>
              <span class="picker-id">${d.id}</span>
            </div>
          `,
        )}
        ${!devices.length
          ? html`<div class="picker-empty">No VanCtl devices found.</div>`
          : ""}
      </div>
    `;
  }

  // ── Main render ────────────────────────────────────────────

  render() {
    if (!this.hass) return html``;

    const slots = this._resolveSlots();
    const entities = this._entities();

    // Require device selection only in legacy (no-slots) mode
    if (!slots && (!this._selectedId || !entities)) return this._renderPicker();

    const safeEntities = entities ?? {
      lights: [],
      switches: [],
      sensors: [],
      binary_sensors: [],
      numbers: [],
      selects: [],
    };
    const level = this._levelEntities(slots);

    // Merge slot-configured entities with device-discovered ones.
    // Slot entries come first (preserving name overrides), then any
    // device-discovered entities not already covered by a slot.
    const mergeEntities = (slotItems, discovered) => {
      const slotMapped = (slotItems ?? []).map(({ entity, name }) => ({
        eid: entity,
        state: this.hass.states[entity],
        _slotName: name,
      }));
      const slotIds = new Set(slotMapped.map((e) => e.eid));
      return [...slotMapped, ...discovered.filter((e) => !slotIds.has(e.eid))];
    };

    const lights = mergeEntities(slots?.lights, safeEntities.lights);
    const powerSwitches = mergeEntities(
      slots?.switches,
      this._powerSwitches(safeEntities.switches),
    );
    return html`
      <div class="hmi">
        <div class="main-row">
          <!-- Left: tabbed cluster panel -->
          <div class="cluster">
            ${this._renderTabBar()}
            <div class="tab-content">
              ${this._renderLeftPanel(safeEntities, level, slots)}
            </div>
          </div>

          <!-- Right: controls / setup -->
          <div class="list">
            <div class="list-topbar">
              ${this._setupMode
                ? html`
                    <span class="list-title setup-title">Setup</span>
                    <div class="setup-actions">
                      <button
                        class="setup-cancel-btn"
                        @click=${() => this._cancelSetupMode()}
                      >
                        Cancel
                      </button>
                      <button
                        class="setup-save-btn"
                        @click=${() => this._saveSetupMode()}
                      >
                        Save
                      </button>
                    </div>
                  `
                : html`
                    <span class="list-title">Controls</span>
                    <div class="cfg-btn" @click=${() => this._enterSetupMode()}>
                      ⚙
                    </div>
                  `}
            </div>

            ${this._setupMode ? "" : this._renderPinnedActions()}

            ${this._setupMode
              ? html`
                  <div class="acc-scroll">
                    <div class="acc-section">
                      <div
                        class="acc-hdr"
                        @click=${() => this._toggleSection("groups")}
                      >
                        <span class="acc-title">Groups</span>
                        <span class="acc-chevron ${this._openSections.groups ? "open" : ""}">›</span>
                      </div>
                      ${this._openSections.groups ? this._renderSetupGroups() : ""}
                    </div>
                    <div class="acc-section">
                      <div class="acc-hdr" style="cursor:default">
                        <span class="acc-title">Lighting</span>
                      </div>
                      <div class="lights">${this._renderSetupLighting()}</div>
                    </div>
                    <div class="acc-section">
                      <div class="acc-hdr" style="cursor:default">
                        <span class="acc-title">Switches</span>
                      </div>
                      <div class="switch-grid">${this._renderSetupSwitches()}</div>
                    </div>
                  </div>
                `
              : this._renderUnifiedGrid(slots, lights, powerSwitches)}
          </div>
        </div>

        ${this._renderAutoModal()}
        ${this._renderTilePopover()}
        ${this._editingScene ? html`
          <smartvanio-modal-scene
            .hass=${this.hass}
            editing-scene=${this._editingScene}
            .sceneEditName=${this._sceneEditName}
            .sceneEditLights=${this._sceneEditLights}
            ?scene-edit-saving=${this._sceneEditSaving}
            device-id=${this._selectedId}
            .lightOptions=${this._getSceneLightOptions()}
            .allScenes=${this._deviceScenes().map(({ eid, state }) => ({
              id: state.attributes.scene_id,
              name: this._label(eid),
            }))}
            @smartvanio-modal-close=${() => { this._editingScene = null; }}
            @smartvanio-update-scene-name=${(e) => { this._sceneEditName = e.detail.value; }}
            @smartvanio-capture-scene-state=${() => this._captureSceneState()}
            @smartvanio-add-scene-light=${(e) => this._addSceneLight(e.detail.entity_id)}
            @smartvanio-remove-scene-light=${(e) => this._removeSceneLight(e.detail.entity_id)}
            @smartvanio-update-scene-light=${(e) => this._updateSceneLight(e.detail.entity_id, e.detail.field, e.detail.value)}
            @smartvanio-save-scene=${() => this._saveScene()}
            @smartvanio-delete-scene=${() => this._deleteScene()}
          ></smartvanio-modal-scene>
        ` : ""}
        ${this._editingEntity
          ? html`
              <smartvanio-modal-edit
                .hass=${this.hass}
                entity-id=${this._editingEntity}
                edit-name=${this._editName}
                .editRows=${this._editRows}
                ?edit-saving=${this._editSaving}
                ?edit-loading=${this._editLoading}
                ?is-button=${true}
                .targetEntities=${this._getTargetEntities()}
                save-error=${this._saveError ?? ""}
                @smartvanio-modal-close=${() => {
                  this._editingEntity = null;
                  this._saveError = null;
                }}
                @smartvanio-update-edit-name=${(e) => {
                  this._editName = e.detail.value;
                }}
                @smartvanio-add-edit-row=${() => {
                  this._editRows = [
                    ...this._editRows,
                    { id: null, gesture: "", target_entity_id: "", action: "" },
                  ];
                }}
                @smartvanio-remove-edit-row=${(e) => {
                  this._editRows = this._editRows.filter(
                    (_, i) => i !== e.detail.id,
                  );
                }}
                @smartvanio-update-edit-row=${(e) => {
                  const { id, field, value } = e.detail;
                  this._editRows = this._editRows.map((r, i) => {
                    if (i !== id) return r;
                    const updated = { ...r, [field]: value };
                    if (field === "target_entity_id") updated.action = "";
                    return updated;
                  });
                }}
                @smartvanio-save-edit=${(e) => this._saveEdit(e.detail)}
              ></smartvanio-modal-edit>
            `
          : ""}

        <!-- Bottom: resources bar — always pinned -->
        <div class="resources ${this._setupMode ? "resources-setup" : ""}">
          ${this._setupMode
            ? this._renderSetupResources()
            : this._renderResources(safeEntities, slots)}
          <div
            class="res-item"
            style="flex:0 0 auto;align-items:center;justify-content:center;border-right:none;padding:0 0 0 16px;"
          >
            <button
              class="kiosk-toggle-btn"
              title="Toggle kiosk mode"
              @click=${() => {
                const u = new URL(window.location.href);
                if (u.searchParams.has("disable_km")) {
                  u.searchParams.delete("disable_km");
                } else {
                  u.searchParams.set("disable_km", "");
                }
                window.location.href = u.toString();
              }}
            >
              <ha-icon icon="mdi:home-assistant"></ha-icon>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Styles ─────────────────────────────────────────────────

  static get styles() {
    return css`
      :host {
        display: block;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
        /* height is set dynamically to parentElement.clientHeight via ResizeObserver */
        background:
          radial-gradient(ellipse at 15% 20%, rgba(124,131,255,0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 15%, rgba(34,211,238,0.10) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 75%, rgba(244,114,182,0.08) 0%, transparent 45%),
          radial-gradient(ellipse at 30% 65%, rgba(99,102,241,0.14) 0%, transparent 38%),
          radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.05) 0%, transparent 55%),
          #0A0E1A;
        /* Dark theme CSS vars — cascade into nested shadow roots (smartvanio-modal-edit etc.) */
        --primary-color: #5cacff;
        --primary-text-color: #f0f6fc;
        --secondary-text-color: #9198a1;
        --secondary-background-color: #151b23;
        --card-background-color: #151b23;
        --divider-color: #30363d;
        --error-color: #ff9492;
        --warning-color: #f0b72f;
      }

      /* ── Layout ─────────────────────────────────────────── */

      .hmi {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 500px;
        background: transparent;
        border-radius: 14px;
        overflow: hidden;
        color: #f0f6fc;
      }

      /* main-row fills all space above the resources footer */
      .main-row {
        flex: 1;
        min-height: 0;
        display: flex;
        overflow: hidden;
      }

      .cluster {
        flex: 0 0 clamp(240px, 28%, 340px);
        border-right: 1px solid #30363d;
        display: flex;
        flex-direction: column;
        background: rgba(10,14,26,0.65);
        overflow: hidden;
        min-height: 0;
      }

      .list {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .resources {
        flex-shrink: 0;
        height: 56px;
        border-top: 1px solid #30363d;
        display: flex;
        align-items: center;
        padding: 0 16px;
        background: rgba(10,14,26,0.7);
        overflow: hidden;
        position: relative;
      }

      /* ── Tab bar ────────────────────────────────────────── */

      .tab-bar {
        display: flex;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
        background: rgba(10,14,26,0.5);
      }

      .tab-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 8px 4px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition:
          border-color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .tab-btn:hover {
        background: rgba(92, 172, 255, 0.08);
      }

      .tab-btn.active {
        border-bottom-color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }

      .tab-icon {
        --mdc-icon-size: 18px;
        color: #9198a1;
        transition: color 0.2s;
      }

      .tab-btn.active .tab-icon {
        color: #5cacff;
      }

      .tab-label {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #9198a1;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .tab-btn.active .tab-label {
        color: #5cacff;
      }

      /* ── Tab content ────────────────────────────────────── */

      .tab-content {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      /* ── Panel: empty state ─────────────────────────────── */

      .panel-empty {
        padding: 40px 20px;
        text-align: center;
        font-size: 14px;
        color: #9198a1;
      }

      /* ── Panel: climate ─────────────────────────────────── */

      .panel-climate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 12px;
        box-sizing: border-box;
      }

      .climate-svg {
        display: block;
        width: 100%;
        max-width: min(260px, 100%);
        height: auto;
        overflow: visible;
      }

      .c-main-val {
        fill: #f0f6fc;
        font-size: 34px;
        font-weight: 200;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.03em;
      }

      .c-main-unit {
        fill: #9198a1;
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.18em;
      }

      .c-arc-tag {
        fill: #9198a1;
        font-size: 8px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.15em;
      }

      .c-arc-val {
        font-size: 14px;
        font-weight: 600;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
      }

      .c-btn-label {
        fill: #9198a1;
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.12em;
      }

      .fan-row,
      .mode-row {
        display: flex;
        gap: 5px;
        width: 100%;
        max-width: min(260px, 100%);
      }

      .fan-btn {
        flex: 1;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #9198a1;
        padding: 7px 0;
        border: 1px solid #30363d;
        border-radius: 6px;
        background: #151b23;
        cursor: pointer;
        transition:
          border-color 0.2s,
          color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .fan-btn.active {
        border-color: #5cacff;
        color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }
      .fan-btn:hover:not(.active) {
        border-color: #b7bdc8;
        color: #d1d7e0;
      }

      .mode-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 7px 4px;
        border: 1px solid #30363d;
        border-radius: 8px;
        background: #151b23;
        cursor: pointer;
        transition:
          border-color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .mode-btn.active {
        border-color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }
      .mode-btn:hover:not(.active) {
        border-color: #b7bdc8;
      }

      .mode-icon {
        font-size: 15px;
        line-height: 1;
      }

      .mode-lbl {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #9198a1;
        white-space: nowrap;
      }

      .mode-btn.active .mode-lbl {
        color: #71b7ff;
      }

      /* ── Panel: scenes ──────────────────────────────────── */

      .panel-scenes {
        padding: 10px 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        align-content: start;
      }

      .scene-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 14px 8px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .scene-tile:hover {
        border-color: #5cacff;
        background: rgba(92, 172, 255, 0.12);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }
      .scene-tile:active {
        transform: scale(0.97);
      }
      .scene-tile--script .scene-icon {
        color: #5cacff;
      }

      .scene-icon {
        --mdc-icon-size: 22px;
        color: #9198a1;
      }

      .scene-name {
        font-size: 12px;
        font-weight: 600;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      /* ── Panel: actions ─────────────────────────────────── */

      .panel-actions {
        display: flex;
        flex-direction: column;
      }

      .actions-hint {
        padding: 8px 14px 4px;
        flex-shrink: 0;
      }

      .hint-text {
        font-size: 10px;
        color: #9198a1;
      }

      .hint-link {
        color: #5cacff;
        cursor: pointer;
        text-decoration: underline;
      }

      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid #151b23;
        cursor: pointer;
        transition: background 0.15s;
        user-select: none;
      }

      .action-row:hover {
        background: rgba(92, 172, 255, 0.08);
      }
      .action-row.pinned {
        background: rgba(92, 172, 255, 0.15);
      }

      .action-domain {
        --mdc-icon-size: 16px;
        color: #9198a1;
        flex-shrink: 0;
      }

      .action-label {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .action-run {
        font-size: 12px;
        color: #656c76;
        flex-shrink: 0;
      }

      .action-pin {
        font-size: 18px;
        color: #656c76;
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .action-pin.pinned {
        color: #5cacff;
      }

      /* ── Actions sub-sections ───────────────────────────── */

      .actions-sub-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 6px;
        border-bottom: 1px solid #21262d;
      }

      .actions-sub-title {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9198a1;
      }

      .add-action-btn-full {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: calc(100% - 28px);
        margin: 8px 14px;
        padding: 9px 0;
        background: none;
        border: 1px dashed #30363d;
        border-radius: 8px;
        color: #9198a1;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s;
        --mdc-icon-size: 14px;
      }
      .add-action-btn-full:hover {
        border-color: #5cacff;
        color: #5cacff;
      }
      .add-action-btn-full ha-icon {
        --mdc-icon-size: 14px;
      }

      .actions-empty-hint {
        padding: 10px 14px;
        font-size: 12px;
        color: #656c76;
        font-style: italic;
      }

      .auto-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid #151b23;
      }

      .auto-row-icon {
        --mdc-icon-size: 15px;
        color: #5cacff;
        flex-shrink: 0;
      }

      .auto-row-label {
        flex: 1;
        font-size: 13px;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .auto-row-delete {
        background: none;
        border: none;
        cursor: pointer;
        color: #656c76;
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
        --mdc-icon-size: 16px;
      }
      .auto-row-delete:hover {
        color: #ff9492;
      }
      .auto-row-delete ha-icon {
        --mdc-icon-size: 16px;
      }

      .auto-row-edit {
        background: none;
        border: none;
        cursor: pointer;
        color: #656c76;
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
      }
      .auto-row-edit:hover { color: #5cacff; }
      .auto-row-edit ha-icon { --mdc-icon-size: 16px; }

      .scene-name-input {
        width: 100%;
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 8px;
        color: #f0f6fc;
        font-size: 14px;
        padding: 9px 12px;
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .scene-name-input:focus { border-color: #5cacff; }

      /* ── Add-Action modal ───────────────────────────────── */

      .auto-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        padding: 16px;
      }

      .auto-modal {
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 14px;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        overflow: hidden;
      }

      .auto-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px 12px;
        border-bottom: 1px solid #21262d;
      }

      .auto-modal-title {
        font-size: 15px;
        font-weight: 600;
        color: #f0f6fc;
      }

      .auto-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #9198a1;
        padding: 0;
        line-height: 1;
        --mdc-icon-size: 18px;
      }
      .auto-modal-close:hover {
        color: #f0f6fc;
      }

      .auto-modal-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        overflow-y: auto;
      }

      .auto-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .auto-label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #9198a1;
      }

      .auto-field-sep {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #656c76;
        text-align: center;
        padding: 0 0 4px;
      }

      .auto-modal-error {
        font-size: 12px;
        color: #ff9492;
        padding: 6px 10px;
        background: rgba(255, 148, 146, 0.1);
        border-radius: 6px;
        border: 1px solid rgba(255, 148, 146, 0.25);
      }

      .auto-modal-footer {
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        border-top: 1px solid #21262d;
        justify-content: flex-end;
      }

      .auto-btn {
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition:
          background 0.15s,
          opacity 0.15s;
      }
      .auto-btn.cancel {
        background: #21262d;
        border-color: #30363d;
        color: #9198a1;
      }
      .auto-btn.cancel:hover {
        background: #2d333b;
      }
      .auto-btn.save {
        background: #5cacff;
        color: #010409;
        font-weight: 600;
      }
      .auto-btn.save:hover {
        background: #79bdff;
      }
      .auto-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ── Panel: level ───────────────────────────────────── */

      .panel-level {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 16px 12px;
        flex: 1;
      }

      .bubble-lg {
        display: block;
        width: 100%;
        max-width: min(220px, 100%);
        height: auto;
        overflow: visible;
      }

      .level-stats {
        display: flex;
        gap: 24px;
        justify-content: center;
      }

      .lstat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .lstat-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .lstat-val {
        font-size: 22px;
        font-weight: 200;
        color: #d1d7e0;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        transition: color 0.4s;
      }

      .lstat-val.warn {
        color: #f0b72f;
      }
      .lstat-val.ok {
        color: #2bd853;
      }

      /* ── Panel: status ──────────────────────────────────── */

      .panel-status {
        display: flex;
        flex-direction: column;
        padding: 8px 14px;
        gap: 0;
        padding: 12px 14px;
      }

      .sstat-group-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #9198a1;
        padding: 10px 0 4px;
      }

      .sstat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #151b23;
      }

      .sstat-row:last-child {
        border-bottom: none;
      }

      .sstat-row-name {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #d1d7e0;
      }

      .sstat-row-val {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #f0f6fc;
      }

      .val-offline {
        color: #656c76;
      }

      .sstat-hint {
        font-size: 11px;
        color: #9198a1;
        padding: 4px 0 8px;
      }

      /* ── Board status dot ──────────────────────────────────── */

      .board-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .board-dot.online {
        background: #2bd853;
        box-shadow: 0 0 5px #2bd85388;
      }
      .board-dot.offline {
        background: #ff9492;
        box-shadow: 0 0 5px #ff949288;
      }
      .board-dot.unknown {
        background: #262c36;
      }

      .door-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .door-list-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        color: #9198a1;
        text-transform: uppercase;
        padding: 0 2px;
      }

      .dstat {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 8px;
        font-size: 14px;
        color: #d1d7e0;
        transition: border-color 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .dstat.open {
        border-color: #f0b72f;
      }

      .dstat-name {
        flex: 1;
        font-size: 13px;
        color: #d1d7e0;
      }

      .dstat-state {
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
      }

      .dstat.open .dstat-state {
        color: #f0b72f;
      }

      /* ── Right panel top bar ────────────────────────────── */

      .list-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
        background: #010409;
      }

      .list-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .cfg-btn {
        font-size: 18px;
        color: #9198a1;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition:
          color 0.2s,
          background 0.2s;
        user-select: none;
        line-height: 1;
      }

      .cfg-btn:hover {
        color: #f0f6fc;
        background: rgba(92, 172, 255, 0.12);
      }
      .cfg-btn.active {
        color: #5cacff;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.06em;
      }

      /* ── Pinned actions strip ───────────────────────────── */

      .pinned-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 14px;
        border-bottom: 1px solid #30363d;
        background: #151b23;
        flex-shrink: 0;
      }

      .pinned-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border: 1px solid #b7bdc8;
        border-radius: 20px;
        background: #212830;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: #d1d7e0;
        transition:
          border-color 0.2s,
          background 0.2s,
          color 0.2s,
          box-shadow 0.2s;
        user-select: none;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      }

      .pinned-btn:hover {
        border-color: #5cacff;
        color: #f0f6fc;
        background: rgba(92, 172, 255, 0.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .pinned-x {
        font-size: 10px;
        color: #ff9492;
        font-weight: 700;
      }

      .pinned-add {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border: 1px dashed #30363d;
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
        transition:
          border-color 0.2s,
          color 0.2s;
        user-select: none;
      }

      .pinned-add:hover {
        border-color: #5cacff;
        color: #5cacff;
      }

      /* ── Accordion scroll wrapper ──────────────────────── */

      .acc-scroll {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      .acc-scroll::-webkit-scrollbar {
        width: 3px;
      }
      .acc-scroll::-webkit-scrollbar-thumb {
        background: #262c36;
        border-radius: 2px;
      }
      .acc-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Accordion ──────────────────────────────────────── */

      .acc-section {
        border-bottom: 1px solid #30363d;
        display: flex;
        flex-direction: column;
      }

      .acc-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        cursor: pointer;
        user-select: none;
        flex-shrink: 0;
        transition: background 0.15s;
      }

      .acc-hdr:hover {
        background: rgba(92, 172, 255, 0.08);
      }

      .acc-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #5cacff;
        text-transform: uppercase;
      }

      .acc-chevron {
        font-size: 22px;
        color: #656c76;
        line-height: 1;
        transform: rotate(90deg);
        transition:
          transform 0.2s ease,
          color 0.2s;
        display: inline-block;
      }

      .acc-chevron.open {
        transform: rotate(-90deg);
        color: #5cacff;
      }

      /* ── Light rows ─────────────────────────────────────── */

      .lights {
        overflow-y: auto;
      }

      .lrow {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 56px;
        padding: 0 22px;
        border-bottom: 1px solid #151b23;
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }

      .lrow:hover {
        background: rgba(92, 172, 255, 0.08);
      }
      .lrow:last-child {
        border-bottom: none;
      }

      .ldot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        transition:
          background 0.3s,
          box-shadow 0.3s;
      }

      .lname {
        flex: 1;
        font-size: 15px;
        font-weight: 400;
        color: #9198a1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
        min-width: 0;
      }

      .lrow.on .lname {
        color: #f0f6fc;
      }

      .lright {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      /* ── Color swatch ───────────────────────────────────── */

      .color-swatch {
        display: block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid #b7bdc8;
        cursor: pointer;
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.2s;
      }

      .color-swatch:hover {
        border-color: #f0f6fc;
      }

      .color-input {
        opacity: 0;
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
      }

      /* ── Light slider ───────────────────────────────────── */

      .lslider {
        -webkit-appearance: none;
        appearance: none;
        width: 96px;
        height: 5px;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
      }

      .lslider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #5cacff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 7px rgba(92, 172, 255, 0.5);
      }

      .lslider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #5cacff;
        cursor: pointer;
        border: none;
      }

      .lpct {
        font-size: 13px;
        color: #9198a1;
        width: 32px;
        text-align: right;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }

      .lrow.on .lpct {
        color: #5cacff;
      }

      /* ── CarPlay tile shared ────────────────────────────── */

      .section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #5cacff;
      }

      .dnd-hint {
        font-size: 10px;
        color: #5cacff;
        opacity: 0.7;
        font-style: italic;
      }

      .dnd-toggle-btn {
        background: none;
        border: none;
        color: #9198a1;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        transition: color 0.15s, background 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .dnd-toggle-btn:hover { color: #f0f6fc; background: rgba(255,255,255,0.06); }
      .dnd-toggle-btn ha-icon { --mdc-icon-size: 18px; }

      .dnd-done-btn {
        background: #5cacff;
        border: none;
        color: #010409;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 10px;
        cursor: pointer;
        font-family: inherit;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }
      .dnd-done-btn:hover { background: #79baff; }

      /* In DnD mode, remove overflow clipping from ancestors above
         the grid so the ghost can move freely. Keep .unified-grid
         overflow intact to avoid scrollbar-width layout shift. */
      :host(.dnd-active) .hmi-card,
      :host(.dnd-active) .main-row,
      :host(.dnd-active) .list,
      :host(.dnd-active) .cluster,
      :host(.dnd-active) .unified-grid-wrap {
        overflow: visible !important;
      }

      .unified-grid.dnd-mode {
        touch-action: none;
      }

      /* ── Grid tiles (positioned via grid-column/grid-row) ── */
      .grid-tile {
        position: relative;
        min-width: 0;
        min-height: 0;
        box-sizing: border-box;
      }

      /* In DnD mode, tiles are draggable from anywhere */
      .unified-grid.dnd-mode .grid-tile {
        cursor: grab;
        touch-action: none;
      }
      .unified-grid.dnd-mode .grid-tile:active {
        cursor: grabbing;
      }

      /* Tiles must fill their grid cell */
      .grid-tile .gtile,
      .grid-tile .ltile,
      .grid-tile .stile {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      /* Merge target highlight — bright border when dragging over a compatible tile */
      .grid-tile.merge-target {
        outline: 3px solid rgba(92,172,255,0.8);
        outline-offset: -3px;
        border-radius: 16px;
        animation: merge-pulse 0.6s ease-in-out infinite alternate;
      }
      /* Stop jiggle on merge target */
      .unified-grid.dnd-mode .grid-tile.merge-target {
        animation: merge-pulse 0.6s ease-in-out infinite alternate;
      }
      @keyframes merge-pulse {
        from { outline-color: rgba(92,172,255,0.5); box-shadow: 0 0 8px rgba(92,172,255,0.1); }
        to   { outline-color: rgba(92,172,255,1); box-shadow: 0 0 16px rgba(92,172,255,0.3); }
      }

      /* Resize button — bottom-right of tile in DnD mode */
      .resize-btn {
        position: absolute;
        bottom: 2px;
        right: 2px;
        z-index: 5;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: rgba(92,172,255,0.15);
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .resize-btn ha-icon {
        --mdc-icon-size: 14px;
        color: rgba(92,172,255,0.7);
      }

      /* Drop preview — shows where the tile will land */
      .drop-preview {
        border: 2px dashed rgba(92,172,255,0.5);
        border-radius: 16px;
        background: rgba(92,172,255,0.08);
        pointer-events: none;
        z-index: 1;
        box-sizing: border-box;
      }

      /* Jiggle animation for DnD mode */
      @keyframes tile-jiggle {
        0%   { transform: rotate(-0.7deg); }
        50%  { transform: rotate(0.7deg); }
        100% { transform: rotate(-0.7deg); }
      }

      /* DnD mode tile styling */
      .unified-grid.dnd-mode .grid-tile {
        animation: tile-jiggle 0.25s ease-in-out infinite;
      }
      /* Stagger the jiggle so tiles don't all move in sync */
      .unified-grid.dnd-mode .grid-tile:nth-child(2n) {
        animation-delay: 0.12s;
      }

      .unified-grid.dnd-mode .gtile,
      .unified-grid.dnd-mode .ltile,
      .unified-grid.dnd-mode .stile {
        transition: background 0.2s !important;
        overflow: visible;
      }

      /* ── Unified grid (iOS homescreen layout) ──────────── */

      .unified-grid-wrap {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .unified-grid-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 16px 4px;
        flex-shrink: 0;
      }

      .unified-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        /* grid-template-columns/rows and gaps set dynamically by ResizeObserver */
        grid-template-columns: repeat(4, 80px);
        grid-template-rows: repeat(4, 80px);
        gap: 12px;
        padding: 12px 16px;
        overflow-y: auto;
        align-content: start;
        position: relative;
      }

      .unified-grid::-webkit-scrollbar { width: 3px; }
      .unified-grid::-webkit-scrollbar-thumb { background: #262c36; border-radius: 2px; }
      .unified-grid::-webkit-scrollbar-track { background: transparent; }

      /* Empty cells — faded tile placeholders in DnD mode */
      .empty-cell {
        border: 1px dashed rgba(92,172,255,0.15);
        border-radius: 16px;
        background: rgba(92,172,255,0.03);
        box-sizing: border-box;
      }

      /* Drag ghost — appended to shadow root by controller */
      .drag-ghost {
        pointer-events: none;
      }

      /* ── Group tiles (.gtile) ──────────────────────────── */

      .gtile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        padding: 6px 4px;
        background: rgba(28,28,30,0.65);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        transition: background 0.2s, transform 0.1s;
        will-change: transform;
        transform-origin: top left;
      }

      
      .gtile.on {
        background: rgba(92,172,255,0.15);
      }

      .gtile.expanded {
        aspect-ratio: auto;
        width: 100%;
        height: 100%;
        border-radius: 14px;
        padding: 10px;
        align-items: stretch;
        justify-content: flex-start;
        background: rgba(22,27,34,0.85);
        box-shadow:
          0 4px 20px rgba(92,172,255,0.12),
          0 4px 12px rgba(0,0,0,0.5);
      }

      .gtile-hdr {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .gtile:not(.expanded) .gtile-hdr {
        flex-direction: column;
        gap: 3px;
      }

      .gtile-icon {
        --mdc-icon-size: 22px;
        color: #48484a;
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .gtile-icon.on {
        color: #5cacff;
        filter: drop-shadow(0 0 4px rgba(92,172,255,0.5));
      }

      .gtile.expanded .gtile-icon {
        --mdc-icon-size: 16px;
      }

      .gtile-name {
        font-size: 10px;
        font-weight: 500;
        color: #9198a1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        transition: color 0.2s;
      }

      .gtile.on .gtile-name { color: #f0f6fc; }

      .gtile.expanded .gtile-name {
        font-size: 13px;
        font-weight: 600;
        color: #f0f6fc;
        text-align: left;
        flex: 1;
      }

      .gtile-name-input {
        flex: 1;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(92,172,255,0.25);
        border-radius: 6px;
        color: #f0f6fc;
        font-size: 13px;
        font-weight: 600;
        padding: 2px 6px;
        outline: none;
        min-width: 0;
      }
      .gtile-name-input:focus {
        border-color: rgba(92,172,255,0.5);
      }

      /* Group toggle switch */
      .gtile-toggle {
        flex-shrink: 0;
        width: 36px;
        height: 20px;
        border-radius: 10px;
        border: none;
        background: #30363d;
        padding: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .gtile-toggle.on {
        background: rgba(92,172,255,0.6);
      }
      .gtile-toggle-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      .gtile-toggle.on .gtile-toggle-thumb {
        transform: translateX(16px);
      }

      /* Group brightness slider */
      .gtile-brightness {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0 4px;
      }
      .gtile-bri-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: #30363d;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }
      .gtile-bri-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }
      .gtile-bri-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }

      .gtile-collapse-btn {
        flex-shrink: 0;
        margin-left: auto;
        background: none;
        border: none;
        color: #9198a1;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        transition: color 0.2s;
      }
      .gtile-collapse-btn:hover { color: #d1d7e0; }
      .gtile-collapse-btn ha-icon { --mdc-icon-size: 16px; }

      .gtile-dots {
        display: flex;
        gap: 4px;
        justify-content: center;
        padding: 2px 0 0;
      }

      .gtile-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        transition: background 0.3s, box-shadow 0.3s;
      }

      .gtile-body {
        overflow: hidden;
      }

      .gtile:not(.expanded) .gtile-body {
        display: none;
      }

      .gtile.expanded .gtile-body {
        padding-top: 8px;
      }

      .ltile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.2s, transform 0.1s;
        padding: 6px 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        will-change: transform;
        transform-origin: top left;
      }

      
      .ltile-icon {
        --mdc-icon-size: 22px;
        transition: color 0.2s;
        flex-shrink: 0;
      }

      .ltile-name {
        font-size: 10px;
        font-weight: 500;
        color: #9198a1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .ltile.on .ltile-name { color: #f0f6fc; }

      .ltile-bri {
        font-size: 9px;
        font-weight: 600;
        color: rgba(255,255,255,0.55);
        line-height: 1;
      }

      /* ── Tile popover ─────────────────────────────────────── */

      .popover-overlay {
        position: fixed;
        inset: 0;
        z-index: 500;
      }

      .popover {
        position: fixed;
        transform: translate(-50%, -100%) translateY(-10px);
        background: rgba(22,27,34,0.96);
        border: 1px solid #30363d;
        border-radius: 14px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.6);
        padding: 12px 14px;
        min-width: 210px;
        max-width: 260px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 501;
      }

      .popover-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .popover-name {
        font-size: 13px;
        font-weight: 600;
        color: #f0f6fc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .popover-toggle {
        padding: 3px 10px;
        border-radius: 10px;
        border: 1px solid #30363d;
        background: rgba(255,255,255,0.06);
        color: #9198a1;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .popover-toggle.on {
        background: rgba(92,172,255,0.15);
        border-color: #5cacff;
        color: #5cacff;
      }

      .popover-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .popover-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .popover-slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
      }
      .popover-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      .popover-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }

      .popover-pct {
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
        width: 36px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .popover-color {
        width: 0;
        height: 0;
        padding: 0;
        border: none;
        opacity: 0;
        position: absolute;
      }

      .popover-swatch {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.15);
        cursor: pointer;
        flex-shrink: 0;
        transition: border-color 0.15s;
      }
      .popover-swatch:hover {
        border-color: rgba(255,255,255,0.4);
      }

      /* (switches-panel removed — switches now in unified grid) */

      /* ── Switch grid (setup mode only) ──────────────────── */

      .switch-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: #1c2128;
      }

      /* ── Switch tiles (matches .ltile) ──────────────────── */

      .stile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 6px 4px;
        background: rgba(28,28,30,0.65);
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s, transform 0.1s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        will-change: transform;
        transform-origin: top left;
      }

      
      .stile.on {
        background: rgba(255,255,255,0.92);
      }

      .stile-icon {
        --mdc-icon-size: 22px;
        color: #48484a;
        transition: color 0.2s;
      }

      .stile.on .stile-icon {
        color: #1C1C1E;
      }

      .stile-name {
        font-size: 10px;
        font-weight: 500;
        color: #9198a1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .stile.on .stile-name {
        color: #1C1C1E;
        font-weight: 600;
      }

      .stile-badge {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: rgba(255,255,255,0.35);
        transition: color 0.2s;
      }

      .stile.on .stile-badge {
        color: #48484a;
      }

      /* ── Button tiles ───────────────────────────────────── */

      .btile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: #010409;
        min-height: 52px;
        cursor: default;
        user-select: none;
        transition:
          background 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .btile:hover {
        background: #151b23;
      }

      .btile.active {
        background: #151b23;
      }

      .btile.editable {
        cursor: pointer;
      }
      .btile.editable:hover {
        background: rgba(92, 172, 255, 0.08);
      }

      .btile-icon {
        --mdc-icon-size: 20px;
        color: #9198a1;
        flex-shrink: 0;
        transition: color 0.15s;
      }

      .btile.active .btile-icon {
        color: #5cacff;
      }
      .btile.editable .btile-icon {
        color: #5cacff;
      }

      .btile-name {
        font-size: 13px;
        font-weight: 500;
        color: #9198a1;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }

      .btile.active .btile-name {
        color: #f0f6fc;
      }

      .btile-state {
        font-size: 11px;
        color: #656c76;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .btile.active .btile-state {
        color: #5cacff;
      }
      .btile.editable .btile-state {
        color: #5cacff;
        font-size: 11px;
      }

      /* ── Resources bar ──────────────────────────────────── */

      .res-item {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        padding: 0 10px;
        border-right: 1px solid #30363d;
      }

      .res-item:last-child {
        border-right: none;
      }

      .res-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .res-bar-wrap {
        height: 5px;
        background: #212830;
        border-radius: 3px;
        overflow: hidden;
      }

      .res-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 1s ease;
      }

      .res-val {
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .kiosk-toggle-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: none;
        border: none;
        color: #9198a1;
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
      }
      .kiosk-toggle-btn:hover {
        color: #d1d7e0;
      }
      .kiosk-toggle-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      /* ── Device picker ──────────────────────────────────── */

      .picker {
        padding: 40px 28px;
        background: #010409;
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        min-height: 260px;
        justify-content: center;
      }

      .picker-title {
        font-size: 22px;
        font-weight: 200;
        color: #d1d7e0;
        letter-spacing: 0.06em;
      }
      .picker-sub {
        font-size: 12px;
        color: #9198a1;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .picker-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 16px 32px;
        border: 1px solid #b7bdc8;
        border-radius: 10px;
        cursor: pointer;
        min-width: 240px;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .picker-row:hover {
        border-color: #5cacff;
        background: #151b23;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }

      .picker-name {
        font-size: 16px;
        color: #d1d7e0;
      }
      .picker-id {
        font-size: 12px;
        color: #9198a1;
      }
      .picker-empty {
        font-size: 14px;
        color: #9198a1;
        text-align: center;
      }

      /* ── Group tile body content (scenes, lights list) ─── */

      .group-scenes {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        overflow-x: auto;
        min-width: 0;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding-bottom: 2px;
      }
      .group-scenes::-webkit-scrollbar {
        display: none;
      }

      .scene-chip {
        background: #010409;
        border: 1px solid #30363d;
        border-radius: 5px;
        color: #d1d7e0;
        font-size: 11px;
        padding: 5px 10px;
        cursor: pointer;
        font-family: inherit;
        white-space: nowrap;
        transition:
          border-color 0.15s,
          color 0.15s;
      }

      .scene-chip:hover {
        border-color: #5cacff;
        color: #5cacff;
      }

      .group-no-scenes {
        font-size: 11px;
        color: #9198a1;
        font-style: italic;
      }

      .group-lights-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px 0;
        flex: 1;
        overflow-y: auto;
      }

      .grp-light-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        cursor: pointer;
        border-radius: 8px;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }
      .grp-light-row:hover {
        background: rgba(255,255,255,0.04);
      }

      .grp-light-dot {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;
        transition: background 0.3s, box-shadow 0.3s;
      }

      .grp-light-color {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        border: none;
        padding: 0;
        border-radius: 50%;
      }

      .grp-light-name {
        flex: 1;
        font-size: 13px;
        color: #9198a1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }
      .grp-light-row.on .grp-light-name {
        color: #f0f6fc;
      }

      .grp-light-grip {
        flex-shrink: 0;
        --mdc-icon-size: 16px;
        color: rgba(92,172,255,0.5);
        cursor: grab;
      }

      .grp-light-bar-wrap {
        height: 3px;
        background: #010409;
        border-radius: 2px;
        overflow: hidden;
        margin-top: -4px;
      }

      .grp-light-bar {
        height: 100%;
        border-radius: 2px;
        transition:
          width 0.4s ease,
          background 0.3s ease;
        opacity: 0.7;
      }

      /* ── Group setup editor ──────────────────────────────── */

      .group-edit-card {
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 10px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .group-edit-hdr {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .group-edit-name {
        flex: 1;
      }

      .group-edit-section-title {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #9198a1;
        margin-top: 4px;
      }

      .group-lights-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .group-light-chip {
        background: #010409;
        border: 1px solid #30363d;
        border-radius: 6px;
        color: #9198a1;
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        transition: all 0.15s;
      }

      .group-light-chip.on {
        border-color: #5cacff;
        color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }

      .group-edit-hint {
        font-size: 11px;
        color: #9198a1;
        font-style: italic;
      }

      /* ── Setup mode ─────────────────────────────────────── */

      .setup-title {
        color: #5cacff;
      }

      .setup-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .setup-save-btn,
      .setup-cancel-btn {
        border: none;
        border-radius: 6px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }

      .setup-save-btn {
        background: #5cacff;
        color: #f0f6fc;
      }

      .setup-save-btn:hover {
        background: #409eff;
      }

      .setup-cancel-btn {
        background: #212830;
        color: #d1d7e0;
      }

      .setup-cancel-btn:hover {
        background: #262c36;
      }

      .setup-panel,
      .setup-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 12px;
      }

      .setup-section-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #9198a1;
        margin-top: 4px;
      }

      .setup-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-label {
        font-size: 12px;
        color: #d1d7e0;
        flex: 0 0 64px;
        white-space: nowrap;
      }

      /* Theme smartvanio-select to match the HMI dark palette */
      .setup-entity-select {
        flex: 1;
        min-width: 0;
        --primary-text-color: #f0f6fc;
        --secondary-background-color: #151b23;
        --divider-color: #30363d;
        --primary-color: #5cacff;
        --card-background-color: #151b23;
      }

      .setup-name-input {
        flex: 0 0 90px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 6px;
        color: #f0f6fc;
        font-size: 13px;
        padding: 6px 8px;
        font-family: inherit;
        outline: none;
      }

      .setup-name-input:focus {
        border-color: #5cacff;
      }

      .setup-del {
        flex-shrink: 0;
        background: none;
        border: none;
        color: #9198a1;
        font-size: 14px;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        line-height: 1;
      }

      .setup-del:hover {
        color: #ff9492;
        background: rgba(255, 148, 146, 0.1);
      }

      .setup-add {
        background: none;
        border: 1px dashed #30363d;
        border-radius: 6px;
        color: #9198a1;
        font-size: 12px;
        padding: 6px 12px;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
        transition:
          border-color 0.2s,
          color 0.2s;
      }

      .setup-add:hover {
        border-color: #5cacff;
        color: #5cacff;
      }

      /* Resources bar in setup mode — expands to show rows */

      .resources-setup {
        height: auto !important;
        flex-direction: column !important;
        align-items: stretch !important;
        padding: 10px 16px !important;
        gap: 6px;
        max-height: 180px;
        overflow-y: auto;
      }

      .setup-res-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-color-swatch {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        padding: 2px;
        border: 1px solid #30363d;
        border-radius: 6px;
        background: #151b23;
        cursor: pointer;
      }

      .setup-res-row .setup-name-input {
        flex: 0 0 70px;
      }

      .setup-res-add {
        align-self: flex-start;
        margin-top: 2px;
      }

      /* ── Scrollbars ─────────────────────────────────────── */

      .tab-content::-webkit-scrollbar,
      .lights::-webkit-scrollbar,
      .list::-webkit-scrollbar {
        width: 3px;
      }

      .tab-content::-webkit-scrollbar-thumb,
      .lights::-webkit-scrollbar-thumb,
      .list::-webkit-scrollbar-thumb {
        background: #262c36;
        border-radius: 2px;
      }

      .tab-content::-webkit-scrollbar-track,
      .lights::-webkit-scrollbar-track,
      .list::-webkit-scrollbar-track {
        background: transparent;
      }
    `;
  }
}

customElements.define("smartvanio-main-card", VanCtlHmiCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "smartvanio-hmi-card",
  name: "VanCtl HMI",
  description:
    "Instrument-cluster dashboard — tabbed cluster, climate arc, pinned quick actions",
  preview: true,
});
