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
import { animate } from "motion";
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
import "./components/smartvanio-entity-picker.js";
import "./components/smartvanio-icon-picker.js";
import "./components/smartvanio-modal-edit.js";
import "./components/smartvanio-modal-scene.js";
import "./components/smartvanio-modal-device.js";
import "./components/smartvanio-tile-light.js";
import "./components/smartvanio-tile-switch.js";
import "./components/smartvanio-tile-tank.js";
import "./components/smartvanio-tile-binary-sensor.js";
import "./components/smartvanio-tile-inclinometer.js";
import "./components/smartvanio-tile-scene.js";
import Swiper from "swiper";
import { Pagination } from "swiper/modules";


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
      _editArea: { type: String },
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
      // _dndMode removed — merged into _setupMode
      _lightSegments:   { type: Array },
      _lightPatterns:   { type: Object },
      _maxLeds:         { type: Number },
      _footerModal:     { type: Object },  // { key, idx, item, type } or null
      _footerAddMenu:   { type: Boolean },
      _lightModal:      { type: Object },  // { item, isNew } or null — add/edit light modal
      _activePatterns:  { type: Object },  // Map<entity_id, patternName> of currently applied patterns
      _layoutMode:      { type: Boolean },
      _layoutDrag:      { type: Object },  // { type, fromIdx, overIdx } or null
      _page:            { type: String },   // 'dashboard' | 'devices'
      _deviceModal:     { type: Object },   // { device, deviceId, entities, inCardEids } or null
      _theme:           { type: String },
    };
  }

  constructor() {
    super();
    this._theme = localStorage.getItem('smartvanio-theme') || 'dark';
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
    this._patternsUnsub = null;
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
    this._lightSegments   = [];
    this._lightPatterns   = {};
    this._maxLeds         = 0;
    this._sceneEditSaving = false;
    this._footerModal     = null;
    this._footerAddMenu   = false;
    this._lightModal       = null;
    this._tankLpTimer     = null;
    this._layoutMode      = false;
    this._layoutDrag      = null;
    this._page            = 'dashboard';
    this._deviceModal     = null;
    this._sceneConfigs    = {};  // { configId: { entities: {...} } }
    this._sceneConfigsLoaded = false;
    this._entityPatterns  = {};  // { "light.foo": { "Sunset": [{pos,r,g,b}, ...] } }
    this._gridRo = null;
    this._gridCols = 4;
    this._gridRows = 4;
    this._gridCellW = 72;
    this._gridKey = "4";
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

    // Clean background: remove any lingering nebula styles from previous loads
    this._cleanupNebulaBg();
  }

  setConfig(config) {
    if (!config) throw new Error("smartvanio-main-card: config required");
    this.config = config;
    if (config.device_id) this._selectedId = config.device_id;
    if (config.theme) this._theme = config.theme;
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
    // Pattern subscriptions are now per-device, triggered from _subscribeAllBoardConfigs

    // Load scene configs for gradient colors
    if (this.hass && !this._sceneConfigsLoaded) this._loadSceneConfigs();

    // Setup grid ResizeObserver for square cells + layout resolution
    this._setupGridObserver();

    // Toggle DnD overflow class (edit mode enables drag)
    if (changedProps.has('_setupMode')) {
      this.classList.toggle('dnd-active', this._setupMode);
    }

    // Sync theme attribute for CSS selector
    if (changedProps.has('_theme')) {
      this.setAttribute('theme', this._theme);
    }

    // Initialize Swiper after render
    this._initSwiper();

  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroySwiper();
    this._cleanupNebulaBg();
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
    if (this._patternsUnsub) {
      this._patternsUnsub();
      this._patternsUnsub = null;
    }
    window.removeEventListener("pointermove", this._cmMove);
    window.removeEventListener("pointerup", this._cmUp);
  }

  _cleanupNebulaBg() {
    // Remove any nebula styles injected into HA's shadow DOM by previous versions
    const CSS_ID = 'smartvanio-nebula';
    document.documentElement.style.removeProperty('background');
    document.body.style.removeProperty('background');

    let node = this;
    while (node) {
      const root = node.getRootNode();
      if (root instanceof ShadowRoot) {
        const old = root.getElementById(CSS_ID);
        if (old) old.remove();
        root.host.style.removeProperty('background');
        node = root.host;
      } else if (node.parentElement) {
        node.style.removeProperty('background');
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
          // Skip MQTT echo while in edit mode or right after saving
          if (this._setupMode || this._mqttSaveGuard) return;
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
                entities: cfg.entities ?? [],
              },
            };
            // Keep single-device config in sync for setup mode auto-populate
            if (cfg.device_id === this._selectedId)
              this._mqttDeviceConfig = cfg;
            // Subscribe to patterns for this device
            this._subscribeDevicePatterns(cfg.device_id);
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

  _subscribeDevicePatterns(deviceId) {
    if (!this.hass || !deviceId) return;
    const subKey = `_patSub_${deviceId}`;
    if (this[subKey]) return; // already subscribed
    this.hass.connection.subscribeMessage(
      (msg) => {
        if (!msg?.topic || !msg?.payload) return;
        try {
          const data = JSON.parse(msg.payload);
          if (typeof data !== 'object' || data === null || Array.isArray(data)) return;
          const parts = msg.topic.split('/');
          const channel = parts[3];
          const key = `${deviceId}/${channel}`;
          this._entityPatterns = { ...this._entityPatterns, [key]: data };
          this.requestUpdate();
        } catch {}
      },
      { type: 'mqtt/subscribe', topic: `smartvanio/${deviceId}/light/+/patterns` },
    ).then(unsub => { this[subKey] = unsub; })
     .catch(err => console.warn('[VanCtl] pattern sub failed for', deviceId, err));
  }

  _getEntityPatterns(eid) {
    const info = this._resolveEntityTopic(eid);
    if (!info) return {};
    // For segment entities, strip the _seg_* suffix to get the parent strip channel
    const channel = info.channel.replace(/_seg_.*$/, '');
    const key = `${info.deviceId}/${channel}`;
    return this._entityPatterns[key] ?? {};
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

  // ── Slot resolution ───────────────────────────────────────
  // Returns a normalised slot map when config.slots is present (or MQTT
  // device manifest has slot annotations). Returns null to fall back to
  // legacy device-id auto-discovery mode.

  _resolveSlots() {
    // In setup mode, use pending slots (which includes unsaved group changes)
    if (this._setupMode && this._pendingSlots) {
      const ps = this._pendingSlots;
      const norm = (arr) =>
        (arr ?? []).map((item) =>
          typeof item === "string" ? { entity: item } : { ...item },
        );
      return {
        resources: norm(ps.resources),
        pitch: ps.pitch ?? null,
        roll: ps.roll ?? null,
        temperature: ps.temperature ?? null,
        fans: norm(ps.fans),
        lights: norm(ps.lights),
        switches: norm(ps.switches),
        status_sensors: ps.status_sensors ?? [],
        water_temp: ps.water_temp ?? null,
        target_temp: ps.target_temp ?? null,
        fan_speed: ps.fan_speed ?? null,
        climate_mode: ps.climate_mode ?? null,
        heater: ps.heater ?? null,
        water_pump: ps.water_pump ?? null,
        water_mode: ps.water_mode ?? null,
        heating_active: ps.heating_active ?? null,
        groups: (ps.groups ?? []).map((g) => ({
          id: g.id ?? `grp_${Math.random().toString(36).slice(2)}`,
          name: g.name ?? "Group",
          lights: g.lights ?? [],
          scenes: g.scenes ?? [],
        })),
        tileOrder: ps.tileOrder ?? null,
        layouts: ps.layouts ?? null,
        buttons: norm(ps.buttons ?? []),
        footerSwitches: norm(ps.footerSwitches ?? []),
        power: ps.power ?? null,
        topbarStats: norm(ps.topbarStats ?? []),
        sceneOrder: ps.sceneOrder ?? [],
        hiddenScenes: ps.hiddenScenes ?? [],
        lightOrder: ps.lightOrder ?? [],
        hiddenLights: ps.hiddenLights ?? [],
      };
    }

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
      water_mode: cfgSlots.water_mode ?? null,
      heating_active: cfgSlots.heating_active ?? null,
      groups: (cfgSlots.groups ?? []).map((g) => ({
        id: g.id ?? `grp_${Math.random().toString(36).slice(2)}`,
        name: g.name ?? "Group",
        lights: g.lights ?? [],
        scenes: g.scenes ?? [],
      })),
      tileOrder: cfgSlots.tileOrder ?? null,
      footerSwitches: norm(cfgSlots.footerSwitches ?? []),
      power: cfgSlots.power ?? null,
      topbarStats: norm(cfgSlots.topbarStats ?? []),
      sceneOrder: cfgSlots.sceneOrder ?? [],
      hiddenScenes: cfgSlots.hiddenScenes ?? [],
      lightOrder: cfgSlots.lightOrder ?? [],
      hiddenLights: cfgSlots.hiddenLights ?? [],
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
      footerSwitches: [],
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

  _saveCardConfig(cfg) {
    this._cardConfig = cfg;
    this._saveMqttConfig();
    this.requestUpdate();
  }

  // ── Setup mode ────────────────────────────────────────────

  _enterSetupMode() {
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
      power: null,
      topbarStats: [],
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

    // Carry over layouts, footer switches, and power config from saved config
    pending.layouts = structuredClone(this._cardConfig?.slots?.layouts ?? {});
    if (!pending.footerSwitches) {
      pending.footerSwitches = structuredClone(this._cardConfig?.slots?.footerSwitches ?? []);
    }
    pending.power = structuredClone(this._cardConfig?.slots?.power ?? null);
    if (!pending.topbarStats?.length) {
      pending.topbarStats = structuredClone(this._cardConfig?.slots?.topbarStats ?? []);
    }

    this._pendingSlots = pending;
    this._setupMode = true;
    // Setup mode — lights panel already visible in the new layout
  }

  _cancelSetupMode() {
    this._setupMode = false;
    this._pendingSlots = null;
  }

  _saveSetupMode() {
    // Save layout (previously in _exitDndMode)
    if (this._currentLayout) {
      const layouts = { ...(this._pendingSlots?.layouts ?? {}) };
      layouts[this._gridKey] = structuredClone(this._currentLayout);
      const items = Object.entries(this._currentLayout)
        .sort(([, a], [, b]) => a.row - b.row || a.col - b.col)
        .map(([id]) => id);
      this._pendingSlots = {
        ...this._pendingSlots,
        layouts,
        tileOrder: items,
      };
    }
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
    if (this._setupMode) {
      update();
      this.requestUpdate();
    } else {
      this._animateGridTransition(update);
    }
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
      this._gridKey = `${cols}`;

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

    // Check for exact match or legacy "NxM" key where N matches columns
    let matchKey = layouts[key] ? key : null;
    if (!matchKey) {
      for (const k of Object.keys(layouts)) {
        if (k.startsWith(key + "x")) { matchKey = k; break; }
      }
    }
    if (matchKey) {
      this._currentLayout = this._mergeNewItems(structuredClone(layouts[matchKey]), items);
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
      })).filter((e) => e.eid && this.hass?.states?.[e.eid]);  // filter removed/missing entities
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

  onTileTap(itemId) {
    if (this._setupMode) {
      this._openEditModal(itemId);
    }
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
  _activeSlots() {
    return this._setupMode && this._pendingSlots
      ? this._pendingSlots
      : (this._cardConfig?.slots ?? {});
  }

  _writeSlots(slots) {
    if (this._setupMode) {
      this._pendingSlots = slots;
    } else {
      this._cardConfig = { ...this._cardConfig, slots };
      this._saveMqttConfig();
    }
  }

  _mergeIntoGroup(dragged, target, col, row) {
    const slots = { ...this._activeSlots() };
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
      groupId = target.id;
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx] = { ...groups[idx], lights: allLights };
      }
    } else if (dragged.type === 'group') {
      groupId = dragged.id;
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx] = { ...groups[idx], lights: allLights };
      }
    } else {
      groupId = `grp_${Date.now()}`;
      groups.push({
        id: groupId,
        name: 'New Group',
        lights: allLights,
        scenes: [],
      });
    }

    slots.groups = groups;
    this._writeSlots(slots);

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
        <ha-icon icon="mdi:lightbulb" style="--mdc-icon-size:22px;color:${isOn ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : 'var(--sv-text-secondary)'}"></ha-icon>
        <span style="font-size:10px;font-weight:500;color:${isOn ? 'var(--sv-text-heading)' : 'var(--sv-text-secondary)'};text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${name}</span>
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
    const slots = { ...this._activeSlots() };
    const groups = [...(slots.groups ?? [])];
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx === -1) return;
    groups[idx] = { ...groups[idx], name: name.trim() };
    slots.groups = groups;
    this._writeSlots(slots);
  }

  _removeLightFromGroup(groupId, eid, dropCol, dropRow) {
    const slots = { ...this._activeSlots() };
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
    this._writeSlots(slots);

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
                  : "var(--sv-text-disabled)";
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
                    @pointerdown=${this._setupMode ? (e) => this._onGrpLightPointerDown(e, group.id, eid) : null}>
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
                    ${this._setupMode ? html`
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
          ${expanded && this._setupMode ? html`
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
            <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:14px;color:var(--sv-text-secondary);flex-shrink:0"></ha-icon>
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
              const col = on ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : 'var(--sv-text-disabled)';
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
          <span class="setup-label">Cabin Temperature</span>
          ${this._entitySelect(["sensor"], ps.temperature, (v) =>
            this._setPS("temperature", v),
          )}
        </div>
        <div class="setup-row">
          <span class="setup-label">Target Setpoint</span>
          ${this._entitySelect(["number"], ps.target_temp, (v) =>
            this._setPS("target_temp", v),
          )}
        </div>
        <div class="setup-row">
          <span class="setup-label">Fan Mode</span>
          ${this._entitySelect(["select"], ps.fan_speed, (v) =>
            this._setPS("fan_speed", v),
          )}
        </div>
        <div class="setup-row">
          <span class="setup-label">Water Mode</span>
          ${this._entitySelect(["select"], ps.water_mode, (v) =>
            this._setPS("water_mode", v),
          )}
        </div>
        <div class="setup-row">
          <span class="setup-label">Heating Active</span>
          ${this._entitySelect(["binary_sensor"], ps.heating_active, (v) =>
            this._setPS("heating_active", v),
          )}
        </div>
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
      "var(--sv-accent)",
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
    if (this._isSceneActive(eid)) {
      const cfg = this._sceneConfigs[eid];
      if (cfg?.entities) {
        const lightIds = Object.keys(cfg.entities).filter(e => e.startsWith('light.'));
        if (lightIds.length) {
          return this.hass.callService("light", "turn_off", { entity_id: lightIds });
        }
      }
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

  _allSmartvanioDeviceIds() {
    if (!this.hass) return new Set();
    return new Set(
      Object.values(this.hass.devices ?? {})
        .filter((d) => d.identifiers?.some(([dom]) => dom === "smartvanio"))
        .map((d) => d.id)
    );
  }

  _entities() {
    if (!this.hass) return null;
    const deviceIds = this._allSmartvanioDeviceIds();
    if (!deviceIds.size) return null;
    const out = {
      lights: [],
      switches: [],
      sensors: [],
      binary_sensors: [],
      numbers: [],
      selects: [],
    };
    for (const [eid, entry] of Object.entries(this.hass.entities ?? {})) {
      if (!deviceIds.has(entry.device_id)) continue;
      const state = this.hass.states[eid];
      if (!state) continue;
      const domain = eid.split(".")[0];
      if (domain === "light")
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
    const deviceIds = this._allSmartvanioDeviceIds();
    if (!deviceIds.size) return [];
    return Object.entries(this.hass.entities ?? {})
      .filter(([eid, e]) => eid.startsWith("scene.") && deviceIds.has(e.device_id))
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
    const haDeviceId = this.hass.entities?.[eid]?.device_id;
    const dev = haDeviceId ? this.hass.devices?.[haDeviceId] : null;
    const devName = dev?.name_by_user ?? dev?.name ?? "";
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

  // Find the HA entity_id for a known device's channel.
  // Looks up _knownDevices by model, then matches the channel suffix in HA entity IDs.
  _entityByChannel(model, domain, channel) {
    for (const [devId, cfg] of Object.entries(this._knownDevices)) {
      if (cfg.model !== model) continue;
      // devId is the MQTT device name e.g. "smartvanio-truma-987564"
      // HA entity_id is "{domain}.{devId_underscored}_{channel}"
      const slug = devId.replace(/-/g, "_");
      const eid = `${domain}.${slug}_${channel}`;
      if (this.hass.states[eid]) return eid;
    }
    return null;
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
    const haDeviceId = this.hass.entities?.[entity_id]?.device_id;
    const dev = haDeviceId ? this.hass.devices?.[haDeviceId] : null;
    const slug = dev
      ? (dev.name_by_user ?? dev.name ?? "")
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
    const groups = [];
    const seen = new Set();

    // SmartVan.io lights first
    const svLights = (slots?.lights ?? []).map(({ entity, name }) => ({
      entity_id: entity,
      label: name || this._label(entity),
      domain: "light",
    }));
    if (svLights.length) {
      groups.push({ label: "SmartVan.io Lights", entities: svLights });
      svLights.forEach(e => seen.add(e.entity_id));
    }

    // SmartVan.io switches
    const svSwitches = (slots?.switches ?? []).map(({ entity, name }) => ({
      entity_id: entity,
      label: name || this._label(entity),
      domain: "switch",
    }));
    if (svSwitches.length) {
      groups.push({ label: "SmartVan.io Switches", entities: svSwitches });
      svSwitches.forEach(e => seen.add(e.entity_id));
    }

    // SmartVan.io scenes
    const deviceIds = this._allSmartvanioDeviceIds();
    const svScenes = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith("scene."))
      .filter(([eid]) =>
        deviceIds.size &&
        Object.values(this.hass.entities ?? {}).find(
          (e) => e.entity_id === eid && deviceIds.has(e.device_id),
        ),
      )
      .map(([eid, s]) => ({
        entity_id: eid,
        label: this.hass.entities?.[eid]?.name || s.attributes?.friendly_name || eid.split(".")[1],
        domain: "scene",
      }));
    if (svScenes.length) {
      groups.push({ label: "SmartVan.io Scenes", entities: svScenes });
      svScenes.forEach(e => seen.add(e.entity_id));
    }

    // Helper to collect non-SmartVan.io entities by domain
    const _otherEntities = (domain, label) => {
      const entities = Object.entries(this.hass.states ?? {})
        .filter(([eid]) => {
          if (seen.has(eid)) return false;
          if (!eid.startsWith(domain + ".")) return false;
          const entry = this.hass.entities?.[eid];
          if (entry?.entity_category) return false;
          return true;
        })
        .map(([eid, s]) => ({
          entity_id: eid,
          label: this._label(eid),
          domain,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      if (entities.length) groups.push({ label, entities });
    };

    _otherEntities("light", "Other Lights");
    _otherEntities("switch", "Other Switches");
    _otherEntities("fan", "Fans");
    _otherEntities("cover", "Covers");
    _otherEntities("lock", "Locks");

    // All scenes (non-SmartVan.io)
    const otherScenes = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith("scene.") && !seen.has(eid))
      .map(([eid, s]) => ({
        entity_id: eid,
        label: this.hass.entities?.[eid]?.name || s.attributes?.friendly_name || eid.split(".")[1],
        domain: "scene",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (otherScenes.length) groups.push({ label: "Other Scenes", entities: otherScenes });

    return groups;
  }

  _buildAutomationConfig(entity_id, gesture, target_entity_id, action, extra = {}) {
    const domain = target_entity_id.split(".")[0];
    const label = this._label(entity_id);
    const gestureName =
      { press: "Press", double_press: "Double Press", hold: "Hold", above: `Above ${extra.threshold ?? ''}`, below: `Below ${extra.threshold ?? ''}` }[gesture] ??
      gesture;
    const description = JSON.stringify({
      smartvanio: true,
      entity_id,
      gesture,
      target_entity_id,
      action,
      ...extra,
    });

    // Build the action sequence based on the action type
    let svcActions;
    if (action === "turn_on_for") {
      const minutes = parseInt(extra.duration ?? 5, 10);
      svcActions = [
        { action: `${domain}.turn_on`, target: { entity_id: target_entity_id } },
        { delay: { minutes } },
        { action: `${domain}.turn_off`, target: { entity_id: target_entity_id } },
      ];
    } else if (action === "set_brightness") {
      const pct = parseInt(extra.brightness_pct ?? 50, 10);
      svcActions = [
        { action: "light.turn_on", target: { entity_id: target_entity_id }, data: { brightness_pct: pct } },
      ];
    } else {
      // Map custom action names to HA service calls
      const svcName = {
        lock: "lock.lock",
        unlock: "lock.unlock",
        open_cover: "cover.open_cover",
        close_cover: "cover.close_cover",
        stop_cover: "cover.stop_cover",
      }[action] ?? `${domain}.${action}`;
      svcActions = [
        { action: svcName, target: { entity_id: target_entity_id } },
      ];
    }

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
        triggers: [{ trigger: "state", entity_id, from: "off", to: "on" }],
        actions: svcActions,
      };
    }
    if (gesture === "hold") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, from: "off", to: "on", for: "0:00:02" }],
        actions: svcActions,
      };
    }
    if (gesture === "double_press") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, from: "off", to: "on" }],
        actions: [
          {
            wait_for_trigger: [{ trigger: "state", entity_id, from: "off", to: "on" }],
            timeout: "0:00:00.500",
            continue_on_timeout: false,
          },
          ...svcActions,
        ],
      };
    }
    if (gesture === "off_to_on") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, from: "off", to: "on" }],
        actions: svcActions,
      };
    }
    if (gesture === "on_to_off") {
      return {
        ...base,
        triggers: [{ trigger: "state", entity_id, from: "on", to: "off" }],
        actions: svcActions,
      };
    }
    if (gesture === "above") {
      return {
        ...base,
        triggers: [{ trigger: "numeric_state", entity_id, above: parseFloat(extra.threshold ?? 0) }],
        actions: svcActions,
      };
    }
    if (gesture === "below") {
      return {
        ...base,
        triggers: [{ trigger: "numeric_state", entity_id, below: parseFloat(extra.threshold ?? 0) }],
        actions: svcActions,
      };
    }
    return { ...base, triggers: [], actions: svcActions };
  }

  // ── Add-Action modal helpers ─────────────────────────────

  _getSourceEntities() {
    const svDeviceIds = this._allSmartvanioDeviceIds();
    const groups = [];
    const seen = new Set();

    // SmartVan.io buttons first
    const slots = this._resolveSlots();
    const discovered = this._entities();
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
    if (rawButtons.length) {
      groups.push({ label: "SmartVan.io Buttons", entities: rawButtons });
      rawButtons.forEach(e => seen.add(e.entity_id));
    }

    // SmartVan.io switches
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
    if (rawSwitches.length) {
      groups.push({ label: "SmartVan.io Switches", entities: rawSwitches });
      rawSwitches.forEach(e => seen.add(e.entity_id));
    }

    // All other HA buttons/binary_sensors (non-SmartVan.io)
    const otherButtons = Object.entries(this.hass.states ?? {})
      .filter(([eid, s]) => {
        if (seen.has(eid)) return false;
        const domain = eid.split(".")[0];
        if (domain !== "binary_sensor" && domain !== "button") return false;
        if (s.attributes?.device_class === "door" || /door/i.test(eid)) return false;
        // Skip internal/diagnostic entities
        const entry = this.hass.entities?.[eid];
        if (entry?.entity_category) return false;
        return true;
      })
      .map(([eid, s]) => ({
        entity_id: eid,
        label: this._label(eid),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (otherButtons.length)
      groups.push({ label: "Other Buttons", entities: otherButtons });

    // All other HA switches (non-SmartVan.io)
    const otherSwitches = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => {
        if (seen.has(eid)) return false;
        if (!eid.startsWith("switch.")) return false;
        const entry = this.hass.entities?.[eid];
        if (entry?.entity_category) return false;
        return true;
      })
      .map(([eid]) => ({
        entity_id: eid,
        label: this._label(eid),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (otherSwitches.length)
      groups.push({ label: "Other Switches", entities: otherSwitches });

    return groups;
  }

  _eventsForSource(eid) {
    const domain = eid?.split(".")?.[0];
    if (domain === "binary_sensor" || domain === "button") {
      return [
        { value: "press", label: "Press" },
        { value: "double_press", label: "Double Press" },
        { value: "hold", label: "Press & Hold" },
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
        { value: "turn_on_for", label: "Turn On for…" },
        { value: "set_brightness", label: "Set Brightness…" },
      ];
    if (domain === "switch" || domain === "fan")
      return [
        { value: "toggle", label: "Toggle" },
        { value: "turn_on", label: "Turn On" },
        { value: "turn_off", label: "Turn Off" },
        { value: "turn_on_for", label: "Turn On for…" },
      ];
    if (domain === "lock")
      return [
        { value: "lock", label: "Lock" },
        { value: "unlock", label: "Unlock" },
      ];
    if (domain === "cover")
      return [
        { value: "open_cover", label: "Open" },
        { value: "close_cover", label: "Close" },
        { value: "stop_cover", label: "Stop" },
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
        triggers: [{ trigger: "state", entity_id: source, from: "off", to: "on" }],
        actions: [svcAction],
      };
    }
    if (event === "hold") {
      return {
        ...base,
        configKey,
        triggers: [
          { trigger: "state", entity_id: source, from: "off", to: "on", for: "0:00:02" },
        ],
        actions: [svcAction],
      };
    }
    if (event === "double_press") {
      return {
        ...base,
        configKey,
        triggers: [{ trigger: "state", entity_id: source, from: "off", to: "on" }],
        actions: [
          {
            wait_for_trigger: [
              { trigger: "state", entity_id: source, from: "off", to: "on" },
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
    this._editArea = (this._cardConfig?.slots?.lights ?? []).find(l => l.entity === entity_id)?.area ?? '';
    this._editRows = [];
    this._editOriginalIds = {};
    this._lightSegments = [];
    this._maxLeds = 0;
    this._editLoading = true;
    this._editSaving = false;
    this._saveError = null;

    const domain = entity_id.split(".")[0];

    try {
      // Load automations — scan all [VanCtl] automations that reference this entity
      {
        const rows = [];
        const origIds = {};
        // Check for automations where this entity is the source (trigger)
        const allAutomations = Object.entries(this.hass?.states ?? {})
          .filter(([eid, s]) =>
            eid.startsWith("automation.") &&
            s.attributes?.friendly_name?.startsWith("[VanCtl]"),
          );
        for (const [autoEid, autoState] of allAutomations) {
          try {
            // Try unique_id from entity registry, then id from state attributes
            const configKey = this.hass.entities?.[autoEid]?.unique_id
              || autoState.attributes?.id;
            if (!configKey) continue;
            const cfg = await this.hass.callApi("GET", `config/automation/config/${configKey}`);
            const meta = JSON.parse(cfg.description ?? "{}");
            if (!meta.smartvanio) continue;
            // Match automations where this entity is either the source or the target
            if (meta.entity_id === entity_id || meta.target_entity_id === entity_id) {
              rows.push({
                id: configKey,
                source_entity_id: meta.entity_id ?? "",
                gesture: meta.gesture ?? meta.event ?? "",
                target_entity_id: meta.target_entity_id ?? "",
                action: meta.action ?? "",
                duration: meta.duration ?? "",
                brightness_pct: meta.brightness_pct ?? "",
                threshold: meta.threshold ?? "",
              });
              origIds[configKey] = configKey;
            }
          } catch {} // 404 or parse error
        }
        // For buttons/switches with no existing automations, add a starter row
        // with the trigger pre-filled so the user can jump straight to configuring
        if (!rows.length) {
          const dom = entity_id.split(".")[0];
          const isTriggerType = dom === "binary_sensor" || dom === "button" || dom === "switch";
          if (isTriggerType) {
            rows.push({
              id: null,
              source_entity_id: entity_id,
              gesture: dom === "switch" ? "off_to_on" : "press",
              target_entity_id: "",
              action: "",
              duration: "",
              brightness_pct: "",
            });
          }
        }
        this._editRows = rows;
        this._editOriginalIds = origIds;
      }

      // Load segments for smartvanio lights only (non-smartvanio lights don't support segments)
      if (domain === "light" && this._isSmartvanioLight(entity_id)) {
        const state = this.hass.states[entity_id];
        this._maxLeds = parseInt(state?.attributes?.max_leds ?? 0, 10);

        // Find existing segment entities for this light
        const segEntities = Object.values(this.hass.states).filter(
          (s) => s.attributes?.smartvanio_parent_entity_id === entity_id,
        );
        // Store original segment IDs + entity_ids for delete detection
        this._originalSegments = segEntities.map((s) => ({
          id: s.attributes.segment_id ?? `seg_${s.attributes.segment_start}_${s.attributes.segment_end}`,
          entity_id: s.entity_id,
        }));
        this._lightSegments = segEntities
          .map((s) => ({
            id: s.attributes.segment_id ?? `seg_${s.attributes.segment_start}_${s.attributes.segment_end}`,
            name: this._label(s.entity_id),
            start: parseInt(s.attributes.segment_start ?? 0, 10),
            end: parseInt(s.attributes.segment_end ?? 0, 10),
            r: s.attributes.rgb_color?.[0] ?? 255,
            g: s.attributes.rgb_color?.[1] ?? 255,
            b: s.attributes.rgb_color?.[2] ?? 255,
            brightness: Math.round((parseInt(s.attributes.brightness ?? 255, 10) / 255) * 100),
            parent_entity_id: entity_id,
          }))
          .sort((a, b) => a.start - b.start);
        this._initialSegments = this._lightSegments.map(s => ({ ...s }));
        this._previewTurnedOn = false;
        this._patternPreviewActive = false;

        // Snapshot light state for revert on cancel
        const st = this.hass.states[entity_id];
        this._modalOpenState = {
          state: st?.state,
          brightness: st?.attributes?.brightness,
          rgb_color: st?.attributes?.rgb_color ? [...st.attributes.rgb_color] : null,
          effect: this._getActivePatternName(entity_id),
        };
        this._stripTouched = false;

        // Load saved patterns from retained MQTT
        const info = this._resolveSegmentTopic();
        if (info) {
          try {
            const unsub = await this.hass.connection.subscribeMessage(
              (msg) => {
                try {
                  const data = JSON.parse(msg.payload);
                  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                    this._lightPatterns = data;
                  }
                } catch {}
                unsub();
              },
              { type: 'mqtt/subscribe', topic: `smartvanio/${info.deviceId}/light/${info.channel}/patterns` },
            );
            // Auto-unsub after 2s if no retained message
            setTimeout(() => { try { unsub(); } catch {} }, 2000);
          } catch {}
        }
      }
    } catch (err) {
      console.error("VanCtl: failed to load edit data", err);
    } finally {
      this._editLoading = false;
    }
  }

  async _saveEdit({ entity_id, name, area, rows, lightSegments, maxLeds }) {
    this._editSaving = true;
    this._saveError = null;
    this._initialSegments = null; // Don't restore on close after save
    this._previewTurnedOn = false; // Don't turn off after save

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

      // Persist area to hmi_config slots
      if (area !== undefined) {
        const slots = { ...(this._cardConfig?.slots ?? {}) };
        const lights = [...(slots.lights ?? [])];
        const idx = lights.findIndex(l => l.entity === entity_id);
        if (idx >= 0) {
          lights[idx] = { ...lights[idx], area: area?.trim() || '' };
        } else {
          lights.push({ entity: entity_id, name: name || '', area: area?.trim() || '' });
        }
        slots.lights = lights;
        this._cardConfig = { ...this._cardConfig, slots };
        this._saveMqttConfig();
      }

      const domain = entity_id.split(".")[0];

      // Save automations
      if (rows?.length || Object.keys(this._editOriginalIds ?? {}).length) {
        const savedKeys = new Set();
        for (const row of (rows ?? [])) {
          const isSensorRow = domain === "sensor";
          // For sensors, auto-set the source entity to the entity being edited
          if (isSensorRow) {
            row.source_entity_id = entity_id;
            if (!row.gesture) row.gesture = "above";
          }
          // Auto-default gesture for buttons if not set
          if (!isSensorRow && row.source_entity_id && !row.gesture) {
            const srcDomain = row.source_entity_id.split(".")[0];
            if (srcDomain === "binary_sensor" || srcDomain === "button") row.gesture = "press";
            else if (srcDomain === "switch" || srcDomain === "light" || srcDomain === "fan") row.gesture = "off_to_on";
          }
          const missing = [];
          if (!row.source_entity_id) missing.push("trigger");
          if (!row.gesture) missing.push("event");
          if (isSensorRow && (row.threshold === undefined || row.threshold === '')) missing.push("threshold value");
          if (!row.target_entity_id) missing.push("target");
          if (!row.action) missing.push("action");
          if (missing.length) {
            this._saveError = `Incomplete automation row — please fill in: ${missing.join(", ")}`;
            this._editSaving = false;
            return;
          }
          const srcSlug = row.source_entity_id.split(".")[1] ?? "unknown";
          const tgtSlug = row.target_entity_id.split(".")[1] ?? "unknown";
          const configKey = `smartvanio_${srcSlug}_${row.gesture}_${tgtSlug}`;
          const extra = {};
          if (row.duration) extra.duration = row.duration;
          if (row.brightness_pct) extra.brightness_pct = row.brightness_pct;
          if (row.threshold !== undefined) extra.threshold = row.threshold;
          const cfg = this._buildAutomationConfig(
            row.source_entity_id,
            row.gesture,
            row.target_entity_id,
            row.action,
            extra,
          );

          try {
            await this.hass.callApi(
              "POST",
              `config/automation/config/${configKey}`,
              cfg,
            );

          } catch (saveErr) {

            this._saveError = "Failed to save automation: " + (saveErr.message || JSON.stringify(saveErr));
          }
          savedKeys.add(configKey);
        }
        // Delete removed automations
        for (const origKey of Object.keys(this._editOriginalIds ?? {})) {
          if (!savedKeys.has(origKey)) {
            try {
              await this.hass.callApi("DELETE", `config/automation/config/${origKey}`);
            } catch {}
          }
        }
        await this.hass.callService("automation", "reload", {});

      } else {

      }

      // Save segments (lights)
      if (domain === "light" && lightSegments) {
        // Resolve smartvanio device_id and channel from HA device registry
        const haDeviceId = this.hass.entities?.[entity_id]?.device_id;
        const haDevice = haDeviceId ? this.hass.devices?.[haDeviceId] : null;
        const svIdent = haDevice?.identifiers?.find(([dom]) => dom === "smartvanio");
        const deviceId = svIdent?.[1] ?? "";

        // Match channel by finding which knownDevices entity name matches
        let channel = "";
        if (deviceId && this._knownDevices[deviceId]) {
          const cfg = this._knownDevices[deviceId];
          const friendlyName = this.hass.states[entity_id]?.attributes?.friendly_name ?? "";
          for (const ent of cfg.entities ?? []) {
            if (ent.type !== "light") continue;
            // Match by entity name suffix or channel in entity_id
            if (entity_id.includes(ent.channel) || friendlyName.includes(ent.name)) {
              channel = ent.channel;
              break;
            }
          }
        }

        if (!deviceId || !channel) {
          console.warn("[smartvanio] Could not resolve device/channel for", entity_id, "haDeviceId=", haDeviceId, "deviceId=", deviceId, "knownDevices=", this._knownDevices);
        }
        if (deviceId && channel) {
          const segPayload = {
            max_leds: maxLeds || 0,
            segments: (lightSegments ?? []).map((seg) => ({
              id: seg.id || `seg_${seg.start}_${seg.end}`,
              name: seg.name || `Segment ${seg.start}-${seg.end}`,
              start: seg.start,
              end: seg.end,
              r: seg.r ?? 255,
              g: seg.g ?? 255,
              b: seg.b ?? 255,
              brightness: seg.brightness ?? 100,
              parent_entity_id: entity_id,
            })),
          };
          await this.hass.callService("mqtt", "publish", {
            topic: `smartvanio/${deviceId}/light/${channel}/segments`,
            payload: JSON.stringify(segPayload),
            retain: true,
          });

          // Segments saved to MQTT — revert the physical strip to its pre-modal state
          this._initialSegments = (lightSegments ?? []).map(s => ({ ...s }));
          this._lightSegments = (lightSegments ?? []).map(s => ({ ...s }));
          this._restoreOnCancel();

          // Delete removed segment entities from HA registry
          const remainingIds = new Set((lightSegments ?? []).map((s) =>
            s.id || `seg_${s.start}_${s.end}`));
          for (const orig of (this._originalSegments ?? [])) {
            if (!remainingIds.has(orig.id)) {
              try {
                await this.hass.callWS({
                  type: "config/entity_registry/remove",
                  entity_id: orig.entity_id,
                });
              } catch (e) {
                console.warn("[smartvanio] Failed to remove segment entity", orig.entity_id, e);
              }
            }
          }
        }
      }

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
    if (this._swiperInstance) this._swiperInstance.allowTouchMove = false;
    this._climateSvgRect = rect;
    // Store the number entity's range for drag calculations
    const tState = tEid ? this.hass.states[tEid] : null;
    this._climateTempMin = parseFloat(tState?.attributes?.min ?? 0);
    this._climateTempMax = parseFloat(tState?.attributes?.max ?? 30);
    this._climateTempStep = parseFloat(tState?.attributes?.step ?? 1);
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
    const tMin = this._climateTempMin ?? 0;
    const tMax = this._climateTempMax ?? 30;
    const step = this._climateTempStep ?? 1;
    const temp = tMin + (pos / C_SWEEP) * (tMax - tMin);
    this._pendingTargetTemp = Math.round(temp / step) * step;
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
    if (this._swiperInstance) this._swiperInstance.allowTouchMove = true;
    window.removeEventListener("pointermove", this._cmMove);
    window.removeEventListener("pointerup", this._cmUp);
  }

  // ── Render: tab bar ────────────────────────────────────────


  // ── Scene carousel ──────────────────────────────────────────

  async _loadSceneConfigs() {
    this._sceneConfigsLoaded = true;
    const scenes = Object.entries(this.hass.states ?? {})
      .filter(([k]) => k.startsWith('scene.'));
    const configs = {};
    for (const [eid, state] of scenes) {
      const configId = state.attributes?.id;
      if (!configId) continue;
      try {
        const cfg = await this.hass.callApi("GET", `config/scene/config/${configId}`);
        configs[eid] = cfg;
      } catch (e) { /* skip scenes whose config can't be fetched */ }
    }
    this._sceneConfigs = configs;
    this.requestUpdate();
  }

  _resolveEntityTopic(entityId) {
    // Derive device_id and channel from unique_id in entity registry
    // unique_id format: "smartvanio-led-644294_led_strip_1"
    const uniqueId = this.hass.entities?.[entityId]?.unique_id;
    if (uniqueId) {
      const m = uniqueId.match(/^(smartvanio-[^_]+-[^_]+)_(.+)$/);
      if (m) return { deviceId: m[1], channel: m[2] };
    }
    // Fallback: parse from entity_id (light.smartvanio_led_644294_led_strip_1)
    // Convert underscores back to hyphens for the device portion
    const bare = entityId.replace(/^light\./, '');
    const m2 = bare.match(/^(smartvanio_[a-z]+_[a-f0-9]+)_(.+)$/);
    if (!m2) return null;
    const deviceId = m2[1].replace(/_/g, '-');
    return { deviceId, channel: m2[2] };
  }

  _getSceneColors(eid) {
    const cfg = this._sceneConfigs[eid];
    if (!cfg?.entities) return [];
    const colors = [];
    for (const [entityId, v] of Object.entries(cfg.entities)) {
      if (v.state !== 'on') continue;
      if (v.effect) {
        const patterns = this._getEntityPatterns(entityId);
        const stops = patterns[v.effect];
        if (stops?.length) {
          for (const s of stops) colors.push([s.r, s.g, s.b]);
          continue;
        }
      }
      if (v.rgb_color) colors.push(v.rgb_color);
    }
    return colors;
  }

  _isSceneActive(eid) {
    const cfg = this._sceneConfigs[eid];
    if (!cfg?.entities) return false;
    const entries = Object.entries(cfg.entities).filter(([k]) => k.startsWith('light.'));
    if (!entries.length) return false;
    for (const [entityId, desired] of entries) {
      const current = this.hass.states[entityId];
      if (!current) return false;
      if (desired.state === 'on') {
        if (current.state !== 'on') return false;
        // Check color similarity if both have rgb_color
        if (desired.rgb_color && current.attributes?.rgb_color) {
          const [dr, dg, db] = desired.rgb_color;
          const [cr, cg, cb] = current.attributes.rgb_color;
          const diff = Math.abs(dr - cr) + Math.abs(dg - cg) + Math.abs(db - cb);
          if (diff > 60) return false;  // allow some tolerance
        }
        // Check brightness similarity if defined
        if (desired.brightness != null && current.attributes?.brightness != null) {
          if (Math.abs(desired.brightness - current.attributes.brightness) > 30) return false;
        }
      } else {
        if (current.state !== 'off') return false;
      }
    }
    return true;
  }

  _sceneCardGradient(eid) {
    if (!this._isSceneActive(eid)) return 'linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface))';
    const colors = this._getSceneColors(eid);
    if (!colors.length) return 'linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface))';

    const vivid = colors.map(([r, g, b]) =>
      `rgb(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)})`);
    if (vivid.length === 1) return `linear-gradient(135deg, ${vivid[0]}, var(--sv-bg-surface))`;
    return `linear-gradient(135deg, ${vivid.join(', ')})`;
  }

  _renderSceneCarousel() {
    // Collect all HA scenes
    let allScenes = Object.entries(this.hass.states ?? {})
      .filter(([eid]) => eid.startsWith('scene.'))
      .map(([eid, state]) => ({ eid, state }));

    const slots = this._resolveSlots() ?? {};
    const hiddenSet = this._layoutMode ? this._layoutHiddenScenes : new Set(slots.hiddenScenes ?? []);

    // Apply ordering
    if (this._layoutMode) {
      this._syncOrder(this._layoutSceneOrder, allScenes.map(s => s.eid));
      allScenes.sort((a, b) =>
        this._layoutSceneOrder.indexOf(a.eid) - this._layoutSceneOrder.indexOf(b.eid));
    } else {
      const order = slots.sceneOrder ?? [];
      if (order.length) {
        const orderMap = new Map(order.map((id, i) => [id, i]));
        allScenes.sort((a, b) =>
          (orderMap.get(a.eid) ?? 999) - (orderMap.get(b.eid) ?? 999));
      }
    }

    // In normal mode, filter out hidden scenes
    const scenes = this._layoutMode ? allScenes : allScenes.filter(s => !hiddenSet.has(s.eid));

    return html`
      <div class="sc-hero">
        <h2 class="sc-label">Quick Scenes</h2>
        <div class="sc-carousel ${this._layoutMode ? 'layout-mode' : ''}">
          ${scenes.map(({eid, state}, i) => {
            const bg = this._sceneCardGradient(eid);
            const isHidden = hiddenSet.has(eid);
            const lightColors = this._getSceneColors(eid);
            const isActive = this._isSceneActive(eid);
            if (this._layoutMode) {
              return html`
                <div class="sc-card layout-item ${isHidden ? 'hidden-item' : ''}" style="background:${bg}"
                     @pointerdown=${(e) => this._onLayoutPointerDown('scene', i, e)}
                     @pointermove=${(e) => this._onLayoutPointerMove(e)}
                     @pointerup=${(e) => this._onLayoutPointerUp(e)}>
                  <div class="layout-overlay" style="justify-content:flex-end">
                    <span class="layout-touch" style="padding:2px 4px;min-width:unset;min-height:unset"
                      @pointerdown=${(e) => e.stopPropagation()}
                      @click=${(e) => { e.stopPropagation(); this._toggleLayoutHidden('scene', eid); }}>
                      <ha-icon class="layout-eye" icon="${isHidden ? 'mdi:eye-off' : 'mdi:eye'}" style="--mdc-icon-size:16px"></ha-icon>
                    </span>
                  </div>
                  <ha-icon class="sc-card-icon" icon="${eid.startsWith('script.') ? 'mdi:script-text' : 'mdi:palette'}" style="--mdc-icon-size:28px"></ha-icon>
                  <span class="sc-card-name">${this._label(eid)}</span>
                  ${lightColors.length ? html`
                    <div class="sc-dots">
                      ${lightColors.map(([r,g,b]) => html`<span class="sc-dot" style="background:rgb(${r},${g},${b})"></span>`)}
                    </div>
                  ` : ''}
                </div>
              `;
            }
            return html`
              <div class="sc-card ${isActive ? 'active' : ''}" style="background:${bg}"
                   @click=${() => this._triggerScene(eid)}
                   @contextmenu=${(e) => { e.preventDefault(); this._openSceneModal(eid); }}
                   @pointerdown=${(e) => {
                     this._sceneLpTimer = setTimeout(() => { this._sceneLpTimer = null; this._openSceneModal(eid); }, 500);
                   }}
                   @pointerup=${() => { if (this._sceneLpTimer) clearTimeout(this._sceneLpTimer); }}
                   @pointerleave=${() => { if (this._sceneLpTimer) clearTimeout(this._sceneLpTimer); }}>
                <ha-icon class="sc-card-icon" icon="${eid.startsWith('script.') ? 'mdi:script-text' : 'mdi:palette'}" style="--mdc-icon-size:28px"></ha-icon>
                <span class="sc-card-name">${this._label(eid)}</span>
                ${lightColors.length ? html`
                  <div class="sc-dots">
                    ${lightColors.map(([r,g,b]) => html`
                      <span class="sc-dot" style="background:rgb(${r},${g},${b})"></span>
                    `)}
                  </div>
                ` : ''}
              </div>
            `;
          })}
          ${!this._layoutMode ? html`
            <div class="sc-card sc-card-add" @click=${() => this._openNewSceneModal()}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:28px; color:var(--sv-text-secondary)"></ha-icon>
              <span class="sc-card-name" style="color:var(--sv-text-secondary)">Add Scene</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ── Lights list panel ────────────────────────────────────────

  _renderLightsPanel(lights) {
    const slots = this._resolveSlots() ?? {};
    const hiddenSet = this._layoutMode ? this._layoutHiddenLights : new Set(slots.hiddenLights ?? []);

    // Apply ordering
    let orderedLights = [...lights];
    if (this._layoutMode) {
      this._syncOrder(this._layoutLightOrder, orderedLights.map(l => l.eid));
      orderedLights.sort((a, b) =>
        this._layoutLightOrder.indexOf(a.eid) - this._layoutLightOrder.indexOf(b.eid));
    } else {
      const order = slots.lightOrder ?? [];
      if (order.length) {
        const orderMap = new Map(order.map((id, i) => [id, i]));
        orderedLights.sort((a, b) =>
          (orderMap.get(a.eid) ?? 999) - (orderMap.get(b.eid) ?? 999));
      }
      orderedLights = orderedLights.filter(l => !hiddenSet.has(l.eid));
    }

    const onCount = orderedLights.filter(l => l.state?.state === 'on').length;

    return html`
      <div class="lp-panel">
        <h3 class="lp-label">Lights <span class="lp-count">${onCount} / ${orderedLights.length}</span></h3>
        <div class="lp-list">
          ${orderedLights.map(({eid, state, _slotName}, i) => {
            const isOn = state?.state === 'on';
            const unavail = !state || state.state === 'unavailable' || state.state === 'unknown';
            const bri = isOn ? Math.round((state?.attributes?.brightness ?? 255) / 2.55) : 0;
            const name = _slotName || this._label(eid);
            const icon = this._lightIcon(eid);
            const isSegment = !!state?.attributes?.smartvanio_parent_entity_id;
            const isStrip = !isSegment && /strip/i.test(eid);
            const typeLabel = isSegment ? 'Segment' : isStrip ? 'Strip' : '';
            const supRgb = state?.attributes?.supported_color_modes?.some(m => m === 'rgb' || m === 'hs' || m === 'xy') ?? false;
            const curRgb = state?.attributes?.rgb_color;

            const isHidden = hiddenSet.has(eid);

            if (this._layoutMode) {
              const isSvLight = this._isSmartvanioLight(eid);
              return html`
                <div class="lp-row layout-item ${isOn ? 'on' : ''} ${unavail ? 'unavail' : ''} ${isHidden ? 'hidden-item' : ''}"
                     @pointerdown=${(e) => this._onLayoutPointerDown('light', i, e)}
                     @pointermove=${(e) => this._onLayoutPointerMove(e)}
                     @pointerup=${(e) => this._onLayoutPointerUp(e)}>
                  <ha-icon class="layout-drag" icon="mdi:drag-vertical" style="--mdc-icon-size:20px"></ha-icon>
                  <ha-icon class="lp-icon" icon="${icon}"
                    style="--mdc-icon-size:20px; opacity:${unavail ? 0.25 : isOn ? 1 : 0.55}; color:${unavail ? 'var(--sv-red)' : isOn && curRgb ? `rgb(${curRgb.join(',')})` : isOn ? 'var(--sv-accent)' : 'var(--sv-text-secondary)'}"></ha-icon>
                  <div class="lp-info">
                    <span class="lp-name"><span class="lp-name-text">${name}</span>${typeLabel ? html`<span class="lp-type">${typeLabel}</span>` : ''}${!isSvLight ? html`<span class="lp-type">External</span>` : ''}</span>
                    <span class="lp-bri">${unavail ? 'Unavailable' : isOn ? bri + '%' : 'Off'}</span>
                  </div>
                  ${!isSvLight ? html`
                    <span class="layout-touch"
                      @pointerdown=${(e) => e.stopPropagation()}
                      @click=${(e) => { e.stopPropagation(); this._removeLightFromSlots(eid); }}>
                      <ha-icon class="layout-del" icon="mdi:delete-outline" style="--mdc-icon-size:18px; color:var(--sv-red)"></ha-icon>
                    </span>
                  ` : ''}
                  <span class="layout-touch"
                    @pointerdown=${(e) => e.stopPropagation()}
                    @click=${(e) => { e.stopPropagation(); this._toggleLayoutHidden('light', eid); }}>
                    <ha-icon class="layout-eye" icon="${isHidden ? 'mdi:eye-off' : 'mdi:eye'}" style="--mdc-icon-size:18px"></ha-icon>
                  </span>
                </div>
              `;
            }

            const editEid = isSegment ? (state?.attributes?.smartvanio_parent_entity_id ?? eid) : eid;

            const liveBri = (this._lpBriLocal?.eid === eid) ? this._lpBriLocal.pct : bri;
            // Check for active pattern (optimistic or from HA state)
            let tilePatternGrad = null;
            let patternStops = null;
            const activePatName = this._getActivePatternName(eid);
            if (activePatName) {
              const pats = this._getEntityPatterns(eid);
              patternStops = pats[activePatName];
              if (patternStops) tilePatternGrad = this._patternGradientCSS(patternStops);
            }
            const patFirstColor = patternStops?.length ? `rgb(${patternStops[0].r},${patternStops[0].g},${patternStops[0].b})` : null;
            const sliderColor = patFirstColor || (curRgb ? `rgb(${curRgb.join(',')})` : 'var(--sv-accent)');
            const iconColor = unavail ? 'var(--sv-red)' : isOn && patFirstColor ? patFirstColor : isOn && curRgb ? `rgb(${curRgb.join(',')})` : isOn ? 'var(--sv-accent)' : 'var(--sv-text-secondary)';
            return html`
              <div class="lp-row ${isOn ? 'on' : ''} ${unavail ? 'unavail' : ''}"
                   @pointerdown=${(e) => {
                     if (e.target.closest('.lp-slider-wrap')) return;
                     this._lightLpFired = false;
                     this._lightLpTimer = setTimeout(() => {
                       this._lightLpTimer = null;
                       this._lightLpFired = true;
                       this._openEditModal(editEid);
                     }, 500);
                   }}
                   @pointerup=${() => { if (this._lightLpTimer) { clearTimeout(this._lightLpTimer); this._lightLpTimer = null; } }}
                   @pointerleave=${() => { if (this._lightLpTimer) { clearTimeout(this._lightLpTimer); this._lightLpTimer = null; } }}>
                <div class="lp-header" @click=${() => { if (this._lightLpFired) { this._lightLpFired = false; return; } if (!unavail) this._toggleLight(eid); }}>
                  <ha-icon class="lp-icon" icon="${icon}"
                    style="--mdc-icon-size:20px; opacity:${unavail ? 0.25 : isOn ? 1 : 0.55}; color:${iconColor}"></ha-icon>
                  <div class="lp-info">
                    <span class="lp-name"><span class="lp-name-text">${name}</span>${typeLabel ? html`<span class="lp-type">${typeLabel}</span>` : ''}</span>
                    <span class="lp-bri">${unavail ? 'Unavailable' : isOn ? liveBri + '%' : 'Off'}</span>
                  </div>
                  <button class="lp-power" @click=${(e) => { e.stopPropagation(); if (!unavail) this._toggleLight(eid); }}
                    style="color:${isOn ? 'var(--sv-accent)' : 'var(--sv-text-disabled)'}">
                    <ha-icon icon="mdi:power" style="--mdc-icon-size:18px"></ha-icon>
                  </button>
                </div>
                ${!unavail ? html`
                  <div class="lp-slider-wrap" style="--lp-bri:${liveBri}; --lp-color:${sliderColor}"
                    @pointerdown=${(e) => this._lpBriPick(e, eid, true)}
                    @pointermove=${(e) => this._lpBriPick(e, eid, false)}
                    @pointerup=${(e) => this._lpBriRelease(e, eid)}>
                    <div class="lp-slider-track"><div class="lp-slider-fill" style="${tilePatternGrad ? `background:${tilePatternGrad}; width:100%; opacity:0.35` : ''}"></div></div>
                    <div class="lp-slider-thumb" style="${tilePatternGrad ? `background:none; border-color:rgba(255,255,255,0.8)` : ''}"></div>
                  </div>
                ` : ''}
              </div>
            `;
          })}
          ${this._layoutMode ? html`
            <div class="lp-add-btn" @click=${() => this._openAddLightModal()}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
              <span>Add Light</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _openAddLightModal() {
    this._lightModal = { item: { entity: '', name: '' }, isNew: true };
  }

  _saveLightModal() {
    const m = this._lightModal;
    if (!m || !m.item.entity) return;
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    const arr = [...(slots.lights ?? [])];
    // Don't add duplicates
    if (!arr.some(l => l.entity === m.item.entity)) {
      arr.push({ entity: m.item.entity, name: m.item.name || '' });
      slots.lights = arr;
      this._cardConfig = { ...this._cardConfig, slots };
      this._saveMqttConfig();
      // Also add to layout light order
      if (!this._layoutLightOrder.includes(m.item.entity)) {
        this._layoutLightOrder.push(m.item.entity);
      }
    }
    this._lightModal = null;
  }

  _cancelLightModal() {
    this._lightModal = null;
  }

  _toggleLight(eid) {
    const isOn = this.hass.states[eid]?.state === 'on';
    if (isOn) {
      this.hass.callService('light', 'turn_off', { entity_id: eid });
    } else {
      // The integration handles re-applying the effect on turn_on
      this.hass.callService('light', 'turn_on', { entity_id: eid });
    }
  }

  _getActivePatternName(eid) {
    // Optimistic local state first (per-entity)
    const local = this._activePatterns?.get(eid);
    if (local) return local;
    // Fall back to HA state (persists across refreshes).
    // Check smartvanio_effect first (persists even when light is off),
    // then HA's built-in effect attribute.
    const attrs = this.hass?.states?.[eid]?.attributes;
    const effect = attrs?.smartvanio_effect || attrs?.effect;
    if (effect && effect !== 'None') return effect;
    return null;
  }

  _applyPattern(eid, name, stops) {
    const info = this._resolveEntityTopic(eid);
    if (!info || !stops?.length) return;
    const channel = info.channel.replace(/_seg_.*$/, '');
    const topic = `${info.deviceId}/light/${channel}/pattern_set`;
    this.hass.callService('mqtt', 'publish', {
      topic,
      payload: JSON.stringify({ stops }),
    });
    // Tell HA about the active effect so it persists across refreshes
    this.hass.callService('light', 'turn_on', { entity_id: eid, effect: name });
    if (!this._activePatterns) this._activePatterns = new Map();
    this._activePatterns.set(eid, name);
  }

  _lpBriPick(e, eid, capture) {
    if (capture) {
      e.target.setPointerCapture(e.pointerId);
      e.stopPropagation();
    }
    if (!e.buttons && !capture) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pad = 16;
    const x = Math.max(pad, Math.min(e.clientX - rect.left, rect.width - pad));
    const pct = Math.round(((x - pad) / (rect.width - pad * 2)) * 100);
    this._lpBriLocal = { eid, pct };
    this.requestUpdate();
    const now = Date.now();
    if (!this._lastLpBriEmit || now - this._lastLpBriEmit > 80) {
      this._lastLpBriEmit = now;
      this.hass.callService('light', 'turn_on', { entity_id: eid, brightness_pct: pct });
    }
  }

  _lpBriRelease(e, eid) {
    e.target.releasePointerCapture(e.pointerId);
    if (this._lpBriLocal?.eid === eid) {
      this.hass.callService('light', 'turn_on', { entity_id: eid, brightness_pct: this._lpBriLocal.pct });
    }
    setTimeout(() => { this._lpBriLocal = null; this.requestUpdate(); }, 500);
  }

  _clearPattern(eid) {
    const info = this._resolveEntityTopic(eid);
    if (!info) return;
    const channel = info.channel.replace(/_seg_.*$/, '');
    const topic = `${info.deviceId}/light/${channel}/pattern_set`;
    this.hass.callService('mqtt', 'publish', {
      topic,
      payload: JSON.stringify({ stops: [] }),
    });
    // Clear the effect on HA so it doesn't persist
    this.hass.callService('light', 'turn_on', { entity_id: eid, effect: 'None' });
    this._activePatterns?.delete(eid);
  }

  _resolveSegmentTopic() {
    const entity_id = this._editingEntity;
    if (!entity_id) return null;
    const haDeviceId = this.hass.entities?.[entity_id]?.device_id;
    const haDevice = haDeviceId ? this.hass.devices?.[haDeviceId] : null;
    const svIdent = haDevice?.identifiers?.find(([dom]) => dom === 'smartvanio');
    const deviceId = svIdent?.[1] ?? '';
    let channel = '';
    if (deviceId && this._knownDevices[deviceId]) {
      const cfg = this._knownDevices[deviceId];
      const friendlyName = this.hass.states[entity_id]?.attributes?.friendly_name ?? '';
      for (const ent of cfg.entities ?? []) {
        if (ent.type !== 'light') continue;
        if (entity_id.includes(ent.channel) || friendlyName.includes(ent.name)) { channel = ent.channel; break; }
      }
    }
    if (!deviceId || !channel) return null;
    return { deviceId, channel };
  }

  _sendSegmentsToStrip(segments) {
    const info = this._resolveSegmentTopic();
    if (!info) return;
    const { deviceId, channel } = info;
    // Clear all then re-send (used for restore / full sync)
    this.hass.callService('mqtt', 'publish', {
      topic: `${deviceId}/light/${channel}/command`,
      payload: JSON.stringify({ state: 'ON' }),
    });
    segments.forEach((seg, i) => {
      this.hass.callService('mqtt', 'publish', {
        topic: `${deviceId}/light/${channel}/segment_set`,
        payload: JSON.stringify({
          id: i,
          state: 'ON',
          segment: { start: seg.start, end: seg.end },
          color: { r: seg.r, g: seg.g, b: seg.b },
          brightness: Math.round((seg.brightness ?? 100) * 2.55),
        }),
      });
    });
  }

  _sendSegmentPreview() {
    const info = this._resolveSegmentTopic();
    if (!info) {
      console.warn('[smartvanio] segment preview: no topic resolved for', this._editingEntity);
      return;
    }

    const eid = this._editingEntity;
    const st = eid ? this.hass.states[eid] : null;
    if (st && st.state !== 'on') this._previewTurnedOn = true;

    this._patternPreviewActive = true;
    const stops = this._segmentsToPatternStops(this._lightSegments);
    const topic = `${info.deviceId}/light/${info.channel}/pattern_set`;
    const payload = JSON.stringify({ stops });
    this.hass.callService('mqtt', 'publish', { topic, payload });
  }

  /** Convert segments array to pattern stops for preview.
   *  Each segment becomes a solid block; gaps between segments are black. */
  _segmentsToPatternStops(segments) {
    const stops = [];
    const sorted = [...(segments ?? [])].sort((a, b) => a.start - b.start);
    for (let i = 0; i < sorted.length; i++) {
      const seg = sorted[i];
      const bri = (seg.brightness ?? 100) / 100;
      const r = Math.round((seg.r ?? 255) * bri);
      const g = Math.round((seg.g ?? 255) * bri);
      const b = Math.round((seg.b ?? 255) * bri);
      // Black before this segment if there's a gap
      if (seg.start > 0 && (i === 0 || sorted[i - 1].end < seg.start - 1)) {
        stops.push({ pos: seg.start > 0 ? seg.start - 1 : 0, r: 0, g: 0, b: 0, brightness: 100 });
      }
      stops.push({ pos: seg.start, r, g, b, brightness: 100 });
      stops.push({ pos: seg.end, r, g, b, brightness: 100 });
      // Black after this segment if there's a gap
      if (i === sorted.length - 1 || sorted[i + 1].start > seg.end + 1) {
        stops.push({ pos: seg.end + 1, r: 0, g: 0, b: 0, brightness: 100 });
      }
    }
    return stops;
  }

  _restoreOnCancel() {
    const eid = this._editingEntity;
    const snap = this._modalOpenState;
    const info = this._resolveSegmentTopic();

    // If save already updated the snapshot, nothing to revert
    if (!snap) {
      this._patternPreviewActive = false;
      this._previewTurnedOn = false;
      return;
    }

    const segmentsChanged = this._initialSegments &&
      JSON.stringify(this._lightSegments) !== JSON.stringify(this._initialSegments);
    const stripTouched = this._patternPreviewActive || this._previewTurnedOn || segmentsChanged || this._stripTouched;

    // Nothing was changed on the strip — leave it alone
    if (!stripTouched) {
      this._modalOpenState = null;
      return;
    }

    // Clear any active pattern preview
    if (info) {
      this.hass.callService('mqtt', 'publish', {
        topic: `${info.deviceId}/light/${info.channel}/pattern_set`,
        payload: JSON.stringify({ stops: [] }),
      });
    }
    this._patternPreviewActive = false;

    // Restore original light state
    if (eid) {
      if (snap.state === 'off') {
        this.hass.callService('light', 'turn_off', { entity_id: eid });
        this._activePatterns?.delete(eid);
      } else if (snap.effect) {
        // Re-apply the original pattern
        const patterns = this._getEntityPatterns(eid);
        const stops = patterns?.[snap.effect];
        if (stops) {
          this._applyPattern(eid, snap.effect, stops);
        }
        if (snap.brightness != null) {
          this.hass.callService('light', 'turn_on', { entity_id: eid, brightness: snap.brightness });
        }
      } else {
        // Restore solid color
        const svc = { entity_id: eid, effect: 'None' };
        if (snap.rgb_color) svc.rgb_color = snap.rgb_color;
        if (snap.brightness != null) svc.brightness = snap.brightness;
        this.hass.callService('light', 'turn_on', svc);
        this._activePatterns?.delete(eid);
      }
    }

    // Restore original segments on the strip
    if (segmentsChanged && info) {
      this._sendSegmentsToStrip(this._initialSegments);
    }

    this._modalOpenState = null;
    this._previewTurnedOn = false;
  }

  _sendPatternPreview(stops) {
    const info = this._resolveSegmentTopic();
    if (!info) return;
    this._patternPreviewActive = true;
    this.hass.callService('mqtt', 'publish', {
      topic: `${info.deviceId}/light/${info.channel}/pattern_set`,
      payload: JSON.stringify({ stops }),
    });
  }

  _savePattern(name, stops) {
    const eid = this._editingEntity;
    const info = this._resolveSegmentTopic();
    if (!info) return;
    const patterns = { ...(this._lightPatterns ?? {}) };
    patterns[name] = stops;
    this._lightPatterns = patterns;
    this.hass.callService('mqtt', 'publish', {
      topic: `smartvanio/${info.deviceId}/light/${info.channel}/patterns`,
      payload: JSON.stringify(patterns),
      retain: true,
    });
    // Apply the saved pattern as the active effect and update snapshot
    // so closing the modal won't revert
    if (eid) {
      this._applyPattern(eid, name, stops);
      this._modalOpenState = {
        state: 'on',
        brightness: this.hass.states[eid]?.attributes?.brightness,
        rgb_color: null,
        effect: name,
      };
    }
  }

  _deletePattern(name) {
    const info = this._resolveSegmentTopic();
    if (!info) return;
    const patterns = { ...(this._lightPatterns ?? {}) };
    delete patterns[name];
    this._lightPatterns = patterns;
    this.hass.callService('mqtt', 'publish', {
      topic: `smartvanio/${info.deviceId}/light/${info.channel}/patterns`,
      payload: JSON.stringify(patterns),
      retain: true,
    });
  }

  _removeLightFromSlots(eid) {
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    slots.lights = (slots.lights ?? []).filter(l => l.entity !== eid);
    this._cardConfig = { ...this._cardConfig, slots };
    this._saveMqttConfig();
    // Also remove from layout order/hidden
    this._layoutLightOrder = this._layoutLightOrder.filter(id => id !== eid);
    this._layoutHiddenLights.delete(eid);
    this.requestUpdate();
  }

  _isSmartvanioLight(entity_id) {
    const haDeviceId = this.hass?.entities?.[entity_id]?.device_id;
    if (!haDeviceId) return false;
    const device = this.hass?.devices?.[haDeviceId];
    return device?.identifiers?.some(([dom]) => dom === 'smartvanio') ?? false;
  }

  _renderLightModal() {
    const m = this._lightModal;
    if (!m) return '';
    return html`
      <div class="fm-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._cancelLightModal(); }}>
        <div class="fm-modal">
          <div class="fm-header">
            <span>Add Light</span>
            <button class="fm-close" @click=${() => this._cancelLightModal()}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:16px"></ha-icon>
            </button>
          </div>
          <div class="fm-body">
            <div class="fm-field">
              <label class="fm-label">Entity</label>
              ${this._entitySelect(
                ['light'],
                m.item.entity,
                (v) => { this._lightModal = { ...m, item: { ...m.item, entity: v } }; }
              )}
            </div>
            <div class="fm-field">
              <label class="fm-label">Label (optional)</label>
              <input class="fm-input" type="text" placeholder="e.g. Kitchen Light"
                .value=${m.item.name ?? ''}
                @input=${(e) => { this._lightModal = { ...m, item: { ...m.item, name: e.target.value } }; }} />
            </div>
          </div>
          <div class="fm-footer">
            <button class="fm-btn cancel" @click=${() => this._cancelLightModal()}>Cancel</button>
            <button class="fm-btn save" ?disabled=${!m.item.entity} @click=${() => this._saveLightModal()}>Add</button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Right panel (climate ↔ level) ────────────────────────────

  _renderRightPanel(entities, slots, level) {
    return html`
      <div class="rp-swiper swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="rp-page">${this._renderClimatePanel(entities, slots)}</div>
          </div>
          <div class="swiper-slide">
            <div class="rp-page">${this._renderLevelPanel(level)}</div>
          </div>
          <div class="swiper-slide">
            <div class="rp-page">${this._renderOverviewPanel(entities, slots)}</div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;
  }

  _initSwiper() {
    if (this._swiperInstance) return;
    const el = this.renderRoot?.querySelector('.rp-swiper');
    if (!el) return;
    this._swiperInstance = new Swiper(el, {
      modules: [Pagination],
      slidesPerView: 1,
      speed: 400,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  }

  _destroySwiper() {
    if (this._swiperInstance) {
      this._swiperInstance.destroy(true, true);
      this._swiperInstance = null;
    }
  }

  // ── Footer bar (tanks + switches + HA button) ────────────────

  _getTankData(entities, slots) {
    const { sensors } = entities;
    const find = (pat) => sensors.find(({eid}) => pat.test(eid))?.eid;
    const slotIds = new Set((slots?.resources ?? []).map(r => r.entity));
    const discovered = [
      { eid: find(/water_tank$/), label: 'Water', icon: 'mdi:water', color: 'var(--sv-accent)' },
      { eid: find(/gas_tank$/), label: 'Gas', icon: 'mdi:gas-cylinder', color: 'var(--sv-amber)' },
      { eid: find(/waste_tank$/), label: 'Waste', icon: 'mdi:delete-empty', color: 'var(--sv-red)' },
    ].filter(({eid}) => eid && !slotIds.has(eid));

    const slotItems = (slots?.resources ?? []).map(({entity, name, color, icon}) => ({
      eid: entity, slotName: name, icon: icon || 'mdi:gauge', color: color ?? 'var(--sv-accent)',
    }));

    return [...slotItems, ...discovered].map(t => ({
      ...t,
      label: t.slotName || this._label(t.eid) || t.label,
      value: Math.max(0, Math.min(100, parseFloat(this.hass.states[t.eid]?.state) || 0)),
    }));
  }

  _openFooterModal(key, idx) {
    const ps = this._setupMode ? this._pendingSlots : this._resolveSlots();
    const arr = ps?.[key] ?? [];
    if (idx >= arr.length) return;
    const item = arr[idx];
    const type = key === 'resources' ? 'tank' : 'switch';
    this._footerModal = { key, idx, item: { ...item }, type };
  }

  _openNewFooterModal(type) {
    const configs = {
      power:  { key: 'power',  item: { soc: '', voltage: '', current: '', time_left: '' } },
      tank:   { key: 'resources', item: { entity: '', name: '', color: '#4a9eff', icon: 'mdi:gauge' } },
      switch: { key: 'footerSwitches', item: { entity: '', name: '', color: '', icon: '' } },
      stat:   { key: 'topbarStats', item: { entity: '', name: '', color: '', icon: '' } },
    };
    const cfg = configs[type] ?? configs.switch;
    this._footerModal = { key: cfg.key, item: cfg.item, type, isNew: true };
    this._footerAddMenu = false;
  }

  async _openEditFooterModal(key, idx) {
    if (key === 'power') {
      const ps = this._pendingSlots ?? this._resolveSlots();
      const power = ps?.power;
      if (!power) return;
      this._footerModal = { key: 'power', item: { soc: power.soc ?? '', voltage: power.voltage ?? '', current: power.current ?? '', time_left: power.time_left ?? '' }, type: 'power', isNew: false };
      return;
    }
    const ps = this._pendingSlots ?? this._resolveSlots();
    const arr = ps?.[key] ?? [];
    if (idx >= arr.length) return;
    const type = key === 'resources' ? 'tank' : key === 'topbarStats' ? 'stat' : 'switch';
    const modal = { key, idx, item: { ...arr[idx] }, type, isNew: false, autoRows: [], autoOrigIds: {} };

    // For switches, load existing automations
    if (type === 'switch' && modal.item.entity) {
      try {
        const rows = [];
        const origIds = {};
        const entity_id = modal.item.entity;
        const allAutomations = Object.entries(this.hass?.states ?? {})
          .filter(([eid, s]) => eid.startsWith("automation.") && s.attributes?.friendly_name?.startsWith("[VanCtl]"));
        for (const [autoEid, autoState] of allAutomations) {
          try {
            const configKey = this.hass.entities?.[autoEid]?.unique_id || autoState.attributes?.id;
            if (!configKey) continue;
            const cfg = await this.hass.callApi("GET", `config/automation/config/${configKey}`);
            const meta = JSON.parse(cfg.description ?? "{}");
            if (!meta.smartvanio) continue;
            if (meta.entity_id === entity_id || meta.target_entity_id === entity_id) {
              rows.push({
                id: configKey,
                source_entity_id: meta.entity_id ?? "",
                gesture: meta.gesture ?? meta.event ?? "",
                target_entity_id: meta.target_entity_id ?? "",
                action: meta.action ?? "",
                duration: meta.duration ?? "",
                brightness_pct: meta.brightness_pct ?? "",
                threshold: meta.threshold ?? "",
              });
              origIds[configKey] = configKey;
            }
          } catch {}
        }
        if (!rows.length) {
          const dom = entity_id.split(".")[0];
          rows.push({
            id: null,
            source_entity_id: entity_id,
            gesture: dom === "switch" ? "off_to_on" : "press",
            target_entity_id: "",
            action: "",
            duration: "",
            brightness_pct: "",
          });
        }
        modal.autoRows = rows;
        modal.autoOrigIds = origIds;
      } catch {}
    }

    this._footerModal = modal;
  }

  _saveFooterModal() {
    const m = this._footerModal;
    if (!m) return;
    // Power saves as a single object, not an array item
    if (m.type === 'power') {
      const power = {};
      if (m.item.soc) power.soc = m.item.soc;
      if (m.item.voltage) power.voltage = m.item.voltage;
      if (m.item.current) power.current = m.item.current;
      if (m.item.time_left) power.time_left = m.item.time_left;
      if (!Object.keys(power).length) return;
      this._setPS('power', power);
      this._footerModal = null;
      return;
    }
    if (!m.item.entity) return;
    if (m.isNew) {
      this._addPSItem(m.key, m.item);
    } else {
      this._updatePSItem(m.key, m.idx, 'entity', m.item.entity);
      this._updatePSItem(m.key, m.idx, 'name', m.item.name);
      if (m.item.color !== undefined) {
        this._updatePSItem(m.key, m.idx, 'color', m.item.color);
      }
      if (m.item.icon !== undefined) {
        this._updatePSItem(m.key, m.idx, 'icon', m.item.icon);
      }
    }

    // Save automations if this is a switch with automation rows
    if (m.type === 'switch' && m.autoRows?.length && m.item.entity) {
      this._saveEdit({
        entity_id: m.item.entity,
        name: this._label(m.item.entity),
        area: '',
        rows: m.autoRows,
        lightSegments: [],
        maxLeds: 0,
      }).catch(() => {});
    }

    this._footerModal = null;
  }

  _cancelFooterModal() {
    this._footerModal = null;
  }

  _renderFooter(entities, slots) {
    const tankData = this._getTankData(entities, slots);

    // Power tile — use configured entities or fall back to auto-detected battery
    const power = slots?.power;
    let socVal = null, battV = null, currentVal = null, timeLeft = null;
    let battPct = null, battCol = 'var(--sv-text-secondary)', battUnavail = false;
    const readSensor = (eid) => {
      const st = eid ? this.hass.states[eid] : null;
      if (!st || st.state === 'unavailable' || st.state === 'unknown') return null;
      return parseFloat(st.state);
    };
    if (power) {
      socVal = readSensor(power.soc);
      battV = readSensor(power.voltage);
      currentVal = readSensor(power.current);
      timeLeft = readSensor(power.time_left);
      // Use SoC directly if available, otherwise estimate from voltage
      battPct = socVal !== null ? Math.max(0, Math.min(100, socVal))
        : battV !== null ? Math.max(0, Math.min(100, ((battV - 11.5) / 1.7) * 100))
        : null;
      battCol = battPct === null ? 'var(--sv-text-secondary)' : battPct > 50 ? 'var(--sv-green)' : battPct > 20 ? 'var(--sv-amber)' : 'var(--sv-red)';
      battUnavail = battPct === null;
    } else {
      // Legacy auto-detect
      const battEid = entities.sensors.find(({eid}) => /battery/.test(eid))?.eid;
      if (battEid) {
        battV = readSensor(battEid);
        battUnavail = battV === null;
        battPct = battV !== null ? Math.max(0, Math.min(100, ((battV - 11.5) / 1.7) * 100)) : null;
        battCol = battV === null ? 'var(--sv-text-secondary)' : battPct > 50 ? 'var(--sv-green)' : battPct > 20 ? 'var(--sv-amber)' : 'var(--sv-red)';
      }
    }
    const hasBatt = power || battV !== null;

    // Pinned switches from slots (manually added)
    const pinnedSwitches = (slots?.footerSwitches ?? []).map(({entity, name, icon, color}, i) => ({
      eid: entity,
      name: name || this._label(entity),
      icon: icon || null,
      color: color || null,
      idx: i,
    }));

    return html`
      <div class="ft-bar">
        <div class="ft-tanks">
          ${tankData.map((t, i) => {
            const unavail = !this.hass.states[t.eid] || this.hass.states[t.eid]?.state === 'unavailable';
            return html`
              <div class="ft-tank ${unavail ? 'unavail' : ''} ${this._setupMode ? 'setup' : ''}"
                   @click=${() => { if (this._setupMode) this._openEditFooterModal('resources', i); }}
                   @pointerdown=${(e) => {
                     if (this._setupMode) return;
                     this._tankLpTimer = setTimeout(() => {
                       this._tankLpTimer = null;
                       this._openEditModal(t.eid);
                     }, 500);
                   }}
                   @pointerup=${() => { if (this._tankLpTimer) clearTimeout(this._tankLpTimer); }}
                   @pointerleave=${() => { if (this._tankLpTimer) clearTimeout(this._tankLpTimer); }}>
                <div class="ft-tank-top">
                  <ha-icon icon="${t.icon}" style="--mdc-icon-size:32px; color:${unavail ? 'var(--sv-red)' : t.color}"></ha-icon>
                  <div class="ft-tank-text">
                    <span class="ft-tank-label">${t.label}</span>
                    <span class="ft-tank-pct" style="color:${unavail ? 'var(--sv-red)' : t.color}">${unavail ? '—' : Math.round(t.value) + '%'}</span>
                  </div>
                </div>
                <div class="ft-tank-bar">
                  <div class="ft-tank-fill" style="width:${unavail ? 0 : t.value.toFixed(0)}%;background:${t.color}"></div>
                </div>
              </div>
            `;
          })}
          ${hasBatt ? html`
            <div class="ft-tank ${battUnavail ? 'unavail' : ''} ${this._setupMode && power ? 'setup' : ''}"
                 @click=${() => { if (this._setupMode && power) this._openEditFooterModal('power'); }}
                 @pointerdown=${(e) => {
                   if (this._setupMode) return;
                   const socEid = power?.soc;
                   const voltEid = power?.voltage;
                   const targetEid = socEid || voltEid;
                   if (!targetEid) return;
                   this._tankLpTimer = setTimeout(() => {
                     this._tankLpTimer = null;
                     this._openEditModal(targetEid);
                   }, 500);
                 }}
                 @pointerup=${() => { if (this._tankLpTimer) clearTimeout(this._tankLpTimer); }}
                 @pointerleave=${() => { if (this._tankLpTimer) clearTimeout(this._tankLpTimer); }}>
              <div class="ft-tank-top">
                <ha-icon icon="mdi:battery" style="--mdc-icon-size:32px; color:${battUnavail ? 'var(--sv-red)' : battCol}"></ha-icon>
                <div class="ft-tank-text">
                  <span class="ft-tank-label">Battery</span>
                  <span class="ft-tank-pct" style="color:${battUnavail ? 'var(--sv-red)' : battCol}">${battUnavail ? '—' : battPct !== null ? Math.round(battPct) + '%' : '—'}${battV !== null ? html`<span class="ft-tank-sub">${battV.toFixed(1)}V</span>` : ''}</span>
                </div>
              </div>
              <div class="ft-tank-bar">
                <div class="ft-tank-fill" style="width:${battUnavail ? 0 : (battPct ?? 0).toFixed(0)}%;background:${battCol}"></div>
              </div>
            </div>
          ` : ''}
          ${this._setupMode ? html`
            <div class="ft-add-wrap">
              <div class="ft-tank-add" @click=${() => { this._footerAddMenu = !this._footerAddMenu; }}>
                <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              </div>
              ${this._footerAddMenu ? html`
                <div class="ft-add-backdrop" @click=${() => { this._footerAddMenu = false; }}></div>
                <div class="ft-add-menu">
                  <div class="ft-add-menu-item" @click=${() => this._openNewFooterModal('tank')}>
                    <ha-icon icon="mdi:gauge" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Tank</span>
                  </div>
                  <div class="ft-add-menu-item" @click=${() => this._openNewFooterModal('power')}>
                    <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Power</span>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
        <div class="ft-right">
          ${pinnedSwitches.map(({eid, name, icon, color, idx}) => {
            const st = this.hass.states[eid];
            const unavail = !st || st.state === 'unavailable' || st.state === 'unknown';
            const isOn = st?.state === 'on';
            return html`
              <div class="ft-sw ${isOn ? 'on' : ''} ${unavail ? 'unavail' : ''} ${this._setupMode ? 'setup' : ''} ${icon && !this._setupMode ? 'icon-only' : ''}"
                   style="${color ? `--ft-sw-color:${color}` : ''}"
                   title="${name}${unavail && !this._setupMode ? ' (offline)' : ''}"
                   @click=${() => this._setupMode
                     ? this._openEditFooterModal('footerSwitches', idx)
                     : (!unavail && this._toggleSwitch(eid))}>
                ${this._setupMode
                  ? html`<ha-icon icon="mdi:pencil" style="--mdc-icon-size:14px"></ha-icon><span>${name}</span>`
                  : icon
                    ? html`<ha-icon icon="${icon}" style="--mdc-icon-size:24px"></ha-icon>`
                    : html`<span class="ft-sw-toggle"><span class="ft-sw-knob"></span></span><span>${name}${unavail ? ' (offline)' : ''}</span>`}
              </div>
            `;
          })}
          ${this._setupMode ? html`
            <div class="ft-sw-add" @click=${() => this._openNewFooterModal('switch')}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
            </div>
          ` : ''}
          <button class="ft-ha-btn" title="Toggle Home Assistant UI"
            @click=${() => this._toggleHaSidebar()}>
            <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size:18px"></ha-icon>
          </button>
        </div>
      </div>

    `;
  }

  _renderFooterModalFields(m) {
    return html`
      <div class="fm-field">
        <label class="fm-label">Entity</label>
        <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.entity ?? ''}
          .domains=${['switch', 'light', 'script', 'button', 'input_boolean']}
          placeholder="Select entity"
          @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, entity: e.detail.value } }; }}
        ></smartvanio-entity-picker>
      </div>
      <div class="fm-field">
        <label class="fm-label">Label</label>
        <input class="fm-input" type="text" placeholder="e.g. Water Pump"
          .value=${m.item.name ?? ''}
          @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, name: e.target.value } }; }} />
      </div>
      <div class="fm-row">
        <div class="fm-field" style="flex:1">
          <label class="fm-label">Color</label>
          <input type="color" class="fm-color"
            .value=${m.item.color ?? ''}
            @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, color: e.target.value } }; }} />
        </div>
        <div class="fm-field" style="flex:2">
          <label class="fm-label">Icon</label>
          <smartvanio-icon-picker .value=${m.item.icon ?? ''}
            @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, icon: e.detail.value } }; }}
          ></smartvanio-icon-picker>
        </div>
      </div>
    `;
  }

  _renderFooterModalAutomations(m) {
    const rows = m.autoRows ?? [];
    const eid = m.item.entity;
    return html`
      <div class="fm-auto-header">
        <span class="fm-label">Automations</span>
        <button class="add-row-btn" @click=${() => {
          const dom = eid?.split(".")?.[0];
          const isTriggerType = dom === "binary_sensor" || dom === "button" || dom === "switch";
          this._footerModal = { ...m, autoRows: [...rows, {
            id: null,
            source_entity_id: isTriggerType ? eid : "",
            gesture: isTriggerType ? (dom === "switch" ? "off_to_on" : "press") : "",
            target_entity_id: isTriggerType ? "" : eid,
            action: "",
            duration: "",
            brightness_pct: "",
          }]};
        }}>
          <ha-icon icon="mdi:plus"></ha-icon> Add
        </button>
      </div>
      ${!rows.length
        ? html`<div class="fm-auto-empty">No automations yet</div>`
        : rows.map((row, i) => html`
          <div class="fm-auto-row">
            <div class="auto-row-trigger">
              <span class="auto-row-label-text">Trigger</span>
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${row.source_entity_id}
                .domains=${["binary_sensor", "button", "switch"]}
                placeholder="Select trigger…"
                @smartvanio-change=${(e) => { const r = [...rows]; r[i] = { ...r[i], source_entity_id: e.detail.value }; this._footerModal = { ...m, autoRows: r }; }}
              ></smartvanio-entity-picker>
              <smartvanio-select
                .value=${row.gesture}
                .options=${this._eventsForSource(row.source_entity_id).map((ev) => ({ value: ev.value, label: ev.label }))}
                placeholder="— event —"
                ?disabled=${!row.source_entity_id}
                @smartvanio-change=${(e) => { const r = [...rows]; r[i] = { ...r[i], gesture: e.detail.value }; this._footerModal = { ...m, autoRows: r }; }}
              ></smartvanio-select>
            </div>
            <div class="auto-row-target">
              <span class="auto-row-label-text">Target</span>
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${row.target_entity_id}
                .domains=${["light", "switch", "fan", "scene", "cover", "lock"]}
                placeholder="Select target…"
                @smartvanio-change=${(e) => { const r = [...rows]; r[i] = { ...r[i], target_entity_id: e.detail.value }; this._footerModal = { ...m, autoRows: r }; }}
              ></smartvanio-entity-picker>
            </div>
            <div class="auto-row-action">
              <span class="auto-row-label-text">Action</span>
              <smartvanio-select
                .value=${row.action}
                .options=${this._actionsForTarget(row.target_entity_id)}
                placeholder="— select —"
                ?disabled=${!row.target_entity_id}
                @smartvanio-change=${(e) => { const r = [...rows]; r[i] = { ...r[i], action: e.detail.value }; this._footerModal = { ...m, autoRows: r }; }}
              ></smartvanio-select>
            </div>
            <button class="delete-row-btn" @click=${() => { const r = [...rows]; r.splice(i, 1); this._footerModal = { ...m, autoRows: r }; }}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        `)
      }
    `;
  }

  _renderFooterModal() {
    const m = this._footerModal;
    if (!m) return '';
    const titles = { power: 'Power', tank: 'Tank', switch: 'Switch', stat: 'Status' };
    const title = `${m.isNew ? 'Add' : 'Edit'} ${titles[m.type] ?? 'Item'}`;
    const canSave = m.type === 'power'
      ? !!(m.item.soc || m.item.voltage || m.item.current || m.item.time_left)
      : !!m.item.entity;
    const isSwitchType = m.type === 'switch' && !m.isNew;

    return html`
      <div class="fm-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._cancelFooterModal(); }}>
        <div class="fm-modal ${isSwitchType ? 'fm-wide' : ''}">
          <div class="fm-header">
            <span>${title}</span>
            <button class="fm-close" @click=${() => this._cancelFooterModal()}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:16px"></ha-icon>
            </button>
          </div>
          <div class="fm-body ${isSwitchType ? 'fm-two-col' : ''}">
            ${isSwitchType ? html`
              <div class="fm-col-left">
                ${this._renderFooterModalFields(m)}
              </div>
              <div class="fm-col-right">
                ${this._renderFooterModalAutomations(m)}
              </div>
            ` : m.type === 'power' ? html`
              <div class="fm-field">
                <label class="fm-label">State of Charge</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.soc ?? ''}
                  .domains=${['sensor','number']} placeholder="Select SoC entity"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, soc: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Voltage</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.voltage ?? ''}
                  .domains=${['sensor','number']} placeholder="Select voltage entity"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, voltage: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Current Consumption</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.current ?? ''}
                  .domains=${['sensor','number']} placeholder="Select current entity"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, current: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Time Left</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.time_left ?? ''}
                  .domains=${['sensor','number']} placeholder="Select time remaining entity"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, time_left: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
            ` : m.type === 'tank' ? html`
              <div class="fm-field">
                <label class="fm-label">Entity</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.entity ?? ''}
                  .domains=${['sensor','number']} placeholder="Select tank sensor"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, entity: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Label</label>
                <input class="fm-input" type="text" placeholder="e.g. Fresh Water"
                  .value=${m.item.name ?? ''}
                  @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, name: e.target.value } }; }} />
              </div>
              <div class="fm-row">
                <div class="fm-field" style="flex:1">
                  <label class="fm-label">Color</label>
                  <input type="color" class="fm-color"
                    .value=${m.item.color ?? '#4a9eff'}
                    @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, color: e.target.value } }; }} />
                </div>
                <div class="fm-field" style="flex:2">
                  <label class="fm-label">Icon</label>
                  <smartvanio-icon-picker .value=${m.item.icon ?? ''}
                    @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, icon: e.detail.value } }; }}
                  ></smartvanio-icon-picker>
                </div>
              </div>
            ` : html`
              <div class="fm-field">
                <label class="fm-label">Entity</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${m.item.entity ?? ''}
                  .domains=${m.type === 'stat' ? ['sensor', 'number', 'binary_sensor'] : ['switch', 'light', 'script', 'button', 'input_boolean']}
                  placeholder="Select entity"
                  @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, entity: e.detail.value } }; }}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Label</label>
                <input class="fm-input" type="text" placeholder="${m.type === 'stat' ? 'e.g. Temperature' : 'e.g. Water Pump'}"
                  .value=${m.item.name ?? ''}
                  @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, name: e.target.value } }; }} />
              </div>
              ${m.type === 'stat' ? html`
                <div class="fm-field">
                  <label class="fm-label">Icon</label>
                  <smartvanio-icon-picker .value=${m.item.icon ?? ''}
                    @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, icon: e.detail.value } }; }}
                  ></smartvanio-icon-picker>
                </div>
              ` : html`
                <div class="fm-row">
                  <div class="fm-field" style="flex:1">
                    <label class="fm-label">Color</label>
                    <input type="color" class="fm-color"
                      .value=${m.item.color ?? ''}
                      @input=${(e) => { this._footerModal = { ...m, item: { ...m.item, color: e.target.value } }; }} />
                  </div>
                  <div class="fm-field" style="flex:2">
                    <label class="fm-label">Icon</label>
                    <smartvanio-icon-picker .value=${m.item.icon ?? ''}
                      @smartvanio-change=${(e) => { this._footerModal = { ...m, item: { ...m.item, icon: e.detail.value } }; }}
                    ></smartvanio-icon-picker>
                  </div>
                </div>
              `}
            `}
          </div>
          <div class="fm-footer">
            ${!m.isNew ? html`
              <button class="fm-btn delete" @click=${() => {
                if (m.type === 'power') { this._setPS('power', null); }
                else { this._removePSItem(m.key, m.idx); }
                this._footerModal = null;
              }}>
                Delete
              </button>
            ` : ''}
            <button class="fm-btn cancel" @click=${() => this._cancelFooterModal()}>Cancel</button>
            <button class="fm-btn save" ?disabled=${!canSave} @click=${() => this._saveFooterModal()}>
              ${m.isNew ? 'Add' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout mode (reorder scenes & lights) ──────────────────

  _enterLayoutMode() {
    const slots = this._resolveSlots() ?? {};
    this._layoutSceneOrder = [...(slots.sceneOrder ?? [])];
    this._layoutHiddenScenes = new Set(slots.hiddenScenes ?? []);
    this._layoutLightOrder = [...(slots.lightOrder ?? [])];
    this._layoutHiddenLights = new Set(slots.hiddenLights ?? []);
    this._layoutMode = true;
    this._layoutDrag = null;
  }

  _cancelLayoutMode() {
    this._layoutMode = false;
    this._layoutDrag = null;
  }

  _saveLayoutMode() {
    const slots = { ...(this._cardConfig?.slots ?? {}) };
    slots.sceneOrder = this._layoutSceneOrder;
    slots.hiddenScenes = [...this._layoutHiddenScenes];
    slots.lightOrder = this._layoutLightOrder;
    slots.hiddenLights = [...this._layoutHiddenLights];
    this._cardConfig = { ...this._cardConfig, slots };
    this._saveMqttConfig();
    this._layoutMode = false;
    this._layoutDrag = null;
  }

  _toggleLayoutHidden(type, id) {
    const set = type === 'scene' ? this._layoutHiddenScenes : this._layoutHiddenLights;
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.requestUpdate();
  }

  _syncOrder(orderArr, allIds) {
    const inOrder = new Set(orderArr);
    for (let i = orderArr.length - 1; i >= 0; i--) {
      if (!allIds.includes(orderArr[i])) orderArr.splice(i, 1);
    }
    for (const id of allIds) {
      if (!inOrder.has(id)) orderArr.push(id);
    }
    return orderArr;
  }

  // FLIP-animated reorder: snapshot positions, mutate, then animate delta
  _layoutReorder(type, fromIdx, toIdx) {
    const arr = type === 'scene' ? this._layoutSceneOrder : this._layoutLightOrder;
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || toIdx >= arr.length) return;

    // Snapshot current positions of all items in the container
    const container = type === 'scene'
      ? this.shadowRoot.querySelector('.sc-carousel')
      : this.shadowRoot.querySelector('.lp-list');
    const children = container ? [...container.querySelectorAll('.layout-item')] : [];
    const rects = children.map(el => el.getBoundingClientRect());

    // Mutate order
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    this.requestUpdate();

    // After Lit re-renders, animate from old positions
    this.updateComplete.then(() => {
      const newChildren = container ? [...container.querySelectorAll('.layout-item')] : [];
      newChildren.forEach((el, i) => {
        if (!rects[i]) return;
        const newRect = el.getBoundingClientRect();
        const dx = rects[i].left - newRect.left;
        const dy = rects[i].top - newRect.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          animate(el, { x: [dx, 0], y: [dy, 0] }, { duration: 0.25, easing: 'ease-out' });
        }
      });
    });
  }

  _onLayoutPointerDown(type, idx, e) {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const isHoriz = type === 'scene';
    this._layoutDrag = {
      type, idx, el,
      startX: e.clientX, startY: e.clientY,
      offsetX: 0, offsetY: 0,
      moved: false,
    };
    el.style.zIndex = '10';
    el.style.transition = 'none';
  }

  _onLayoutPointerMove(e) {
    const d = this._layoutDrag;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    d.moved = true;
    d.offsetX = dx;
    d.offsetY = dy;
    const isHoriz = d.type === 'scene';
    d.el.style.transform = isHoriz ? `translateX(${dx}px)` : `translateY(${dy}px)`;
    d.el.style.opacity = '0.85';

    // Determine swap target
    const container = d.type === 'scene'
      ? this.shadowRoot.querySelector('.sc-carousel')
      : this.shadowRoot.querySelector('.lp-list');
    const items = [...container.querySelectorAll('.layout-item')];
    const elRect = d.el.getBoundingClientRect();
    const center = isHoriz
      ? elRect.left + elRect.width / 2
      : elRect.top + elRect.height / 2;

    for (let i = 0; i < items.length; i++) {
      if (i === d.idx) continue;
      const r = items[i].getBoundingClientRect();
      const mid = isHoriz ? r.left + r.width / 2 : r.top + r.height / 2;
      if ((d.idx < i && center > mid) || (d.idx > i && center < mid)) {
        // Swap
        d.el.style.transform = '';
        d.el.style.opacity = '';
        d.el.style.zIndex = '';
        d.el.style.transition = '';
        const fromIdx = d.idx;
        d.idx = i;
        this._layoutReorder(d.type, fromIdx, i);
        // Re-acquire element after render
        this.updateComplete.then(() => {
          const newItems = [...container.querySelectorAll('.layout-item')];
          if (newItems[i]) {
            d.el = newItems[i];
            d.startX = e.clientX;
            d.startY = e.clientY;
            d.el.style.zIndex = '10';
            d.el.style.transition = 'none';
            d.el.setPointerCapture(e.pointerId);
          }
        });
        return;
      }
    }
  }

  _onLayoutPointerUp(e) {
    const d = this._layoutDrag;
    if (!d) return;
    d.el.style.transform = '';
    d.el.style.opacity = '';
    d.el.style.zIndex = '';
    d.el.style.transition = '';
    this._layoutDrag = null;
  }

  _toggleSwitch(eid) {
    const domain = eid.split('.')[0];
    const isOn = this.hass.states[eid]?.state === 'on';
    this.hass.callService(domain, isOn ? 'turn_off' : 'turn_on', { entity_id: eid });
  }

  _toggleTheme() {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('smartvanio-theme', this._theme);
  }

  _toggleHaSidebar() {
    const url = new URL(window.location.href);
    if (url.searchParams.has('disable_km')) {
      url.searchParams.delete('disable_km');
    } else {
      url.searchParams.set('disable_km', '');
    }
    window.location.href = url.toString();
  }

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
    const TRUMA = "ESP32 Truma Heater Controller";

    // Resolve entities: explicit slot > Truma device channel > regex fallback
    const cEid =
      slots?.temperature ??
      this._entityByChannel(TRUMA, "sensor", "current_room_temperature");
    const tEid =
      slots?.target_temp ??
      this._entityByChannel(TRUMA, "number", "room_temperature_setpoint");
    const fEid =
      slots?.fan_speed ??
      this._entityByChannel(TRUMA, "select", "fan_mode");
    const wmEid =
      slots?.water_mode ??
      this._entityByChannel(TRUMA, "select", "water_mode");
    const haEid =
      slots?.heating_active ??
      this._entityByChannel(TRUMA, "binary_sensor", "heating_active");
    // Legacy: climate_mode select (generic HVAC, not Truma)
    const mEid =
      slots?.climate_mode ??
      entities.selects.find(({ eid }) => /climate_mode/.test(eid))?.eid;
    // Legacy: heater switch
    const hEid =
      slots?.heater ??
      entities.switches.find(
        ({ eid }) => /\bheater\b/.test(eid) && !/water/.test(eid),
      )?.eid;
    // Legacy: water pump switch
    const wpEid =
      slots?.water_pump ??
      entities.switches.find(({ eid }) => /water_pump/.test(eid))?.eid;

    const cabinTemp = cEid
      ? parseFloat(this.hass.states[cEid]?.state) || null
      : null;

    // Derive target temp range from the number entity's attributes
    const tState = tEid ? this.hass.states[tEid] : null;
    const tMin = parseFloat(tState?.attributes?.min ?? 0);
    const tMax = parseFloat(tState?.attributes?.max ?? 30);
    const tStep = parseFloat(tState?.attributes?.step ?? 1);
    const tRange = tMax - tMin || 30;

    const targetTemp =
      this._pendingTargetTemp ??
      (tEid ? parseFloat(tState?.state) || tMin : tMin);

    const fanSpeed = fEid ? (this.hass.states[fEid]?.state ?? "Off") : "Off";
    const fanOptions = fEid
      ? this.hass.states[fEid]?.attributes?.options ?? ["Off", "Low", "Medium", "High"]
      : ["Off", "Low", "Medium", "High"];

    const waterMode = wmEid ? (this.hass.states[wmEid]?.state ?? "Off") : null;
    const waterOptions = wmEid
      ? this.hass.states[wmEid]?.attributes?.options ?? ["Off", "Eco", "Hot"]
      : null;

    const heatingActive = haEid ? this.hass.states[haEid]?.state === "on" : false;

    // Legacy generic HVAC
    const climMode = mEid ? (this.hass.states[mEid]?.state ?? "Off") : null;
    const heaterOn = hEid ? this.hass.states[hEid]?.state === "on" : false;
    const pumpOn = wpEid ? this.hass.states[wpEid]?.state === "on" : false;

    // Outer arc: heating status (0 or full based on burner state)
    const heatPct = heatingActive || heaterOn ? 1 : 0;
    const tPct = tRange > 0 ? Math.max(0, Math.min(1, (targetTemp - tMin) / tRange)) : 0;
    const hFill = C_WL * heatPct;
    const tFill = C_TL * tPct;

    const thumbDeg = C_START + tPct * C_SWEEP;
    const [thumbX, thumbY] = polarXY(C_CX, C_CY, C_TR, thumbDeg);
    const heatColor = heatingActive || heaterOn ? "var(--sv-amber)" : "var(--sv-gauge-inactive)";

    const waterModeIcon = { Off: "○", Eco: "💧", Hot: "♨" };
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
            stroke="var(--sv-gauge-track)"
            stroke-width="14"
            stroke-linecap="butt"
          />
          <path
            d="${arcPath(C_TR)}"
            fill="none"
            stroke="var(--sv-gauge-track)"
            stroke-width="14"
            stroke-linecap="butt"
          />

          <!-- heating status fill (outer) -->
          <path
            d="${arcPath(C_WR)}"
            fill="none"
            stroke="${heatColor}"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${hFill.toFixed(1)} ${(C_WL + 20).toFixed(1)}"
            style="transition:stroke-dasharray 1s ease,stroke 0.6s ease"
          />

          <!-- target temp fill (inner) -->
          <path
            d="${arcPath(C_TR)}"
            fill="none"
            stroke="var(--sv-accent)"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${tFill.toFixed(1)} ${(C_TL + 20).toFixed(1)}"
            style="transition:stroke-dasharray 0.15s ease"
          />

          <!-- arc labels -->
          <text x="24" y="155" text-anchor="middle" class="c-arc-tag">
            HEATER
          </text>
          <text
            x="24"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:${heatColor}"
          >
            ${heatingActive || heaterOn ? "ON" : "OFF"}
          </text>
          <text x="176" y="155" text-anchor="middle" class="c-arc-tag">
            SET
          </text>
          <text
            x="176"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:var(--sv-accent)"
          >
            ${targetTemp > 0 ? targetTemp.toFixed(0) + "°" : "OFF"}
          </text>

          <!-- drag thumb -->
          <circle
            cx="${thumbX.toFixed(1)}"
            cy="${thumbY.toFixed(1)}"
            r="11"
            fill="var(--sv-accent)"
            stroke="var(--sv-bg-base)"
            stroke-width="2.5"
            style="cursor:grab;filter:drop-shadow(0 0 7px var(--sv-accent-muted))"
          />
          <circle
            cx="${thumbX.toFixed(1)}"
            cy="${thumbY.toFixed(1)}"
            r="4"
            fill="var(--sv-accent-hover)"
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

          <!-- heating status indicator -->
          <g>
            <circle
              cx="${C_CX}"
              cy="${C_CY + 28}"
              r="13"
              fill="${heatingActive || heaterOn ? "#7a2a00" : "var(--sv-gauge-track)"}"
              stroke="${heatingActive || heaterOn ? "var(--sv-amber)" : "var(--sv-bg-input)"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${heatingActive || heaterOn
                ? "drop-shadow(0 0 5px rgba(240,183,47,0.53))"
                : "none"}"
            />
            <text
              x="${C_CX}"
              y="${C_CY + 33}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              🔥
            </text>
          </g>
          <text
            x="${C_CX}"
            y="${C_CY + 50}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${heatingActive || heaterOn ? "HEATING" : "IDLE"}
          </text>
        </svg>

        <div class="climate-controls">
          <!-- fan speed -->
          <span class="climate-control-label">Fan</span>
          <div class="fan-row">
            ${fanOptions.map(
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

          <!-- water mode (Truma) or climate mode (generic) -->
          ${waterOptions
            ? html`
              <span class="climate-control-label">Water</span>
              <div class="mode-row">
                ${waterOptions.map(
                  (m) => html`
                    <div
                      class="mode-btn ${waterMode === m ? "active" : ""}"
                      @click=${() =>
                        wmEid &&
                        this.hass.callService("select", "select_option", {
                          entity_id: wmEid,
                          option: m,
                        })}
                    >
                      <span class="mode-icon">${waterModeIcon[m] ?? "○"}</span>
                      <span class="mode-lbl">${m}</span>
                    </div>
                  `,
                )}
              </div>
            `
            : climMode !== null
              ? html`
                <span class="climate-control-label">Mode</span>
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
            `
              : ""}
        </div>
      </div>
    `;
  }

  // ── Render: scenes panel ───────────────────────────────────

  // ── Scene edit ────────────────────────────────────────────

  _getSceneLightOptions() {
    if (!this.hass) return [];
    const deviceIds = this._allSmartvanioDeviceIds();
    if (!deviceIds.size) return [];

    const parents = [];
    const segsByParent = {};

    for (const [entity_id, entry] of Object.entries(this.hass.entities ?? {})) {
      if (!entity_id.startsWith("light.")) continue;
      if (!deviceIds.has(entry.device_id)) continue;
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

    // Load from scene config (has saved effect, brightness, color)
    const sceneCfg = this._sceneConfigs[eid];
    if (sceneCfg?.entities) {
      this._sceneEditLights = Object.entries(sceneCfg.entities)
        .filter(([id]) => id.startsWith("light."))
        .map(([id, cfg]) => ({
          entity_id: id,
          state: (cfg.state ?? "on").toUpperCase(),
          brightness: cfg.brightness ?? 255,
          rgb_color: cfg.rgb_color ?? this.hass.states[id]?.attributes?.rgb_color ?? [255, 255, 255],
          effect: cfg.effect ?? null,
        }));
    } else {
      // Fallback: read from HA state
      const entityIds = state?.attributes?.entity_id ?? [];
      this._sceneEditLights = entityIds
        .filter((id) => id.startsWith("light."))
        .map((id) => {
          const ls = this.hass.states[id];
          const isOn = ls?.state === "on";
          return {
            entity_id: id,
            state: isOn ? "ON" : "OFF",
            brightness: ls?.attributes?.brightness ?? 255,
            rgb_color: ls?.attributes?.rgb_color ?? [255, 255, 255],
            effect: ls?.attributes?.effect ?? null,
          };
        });
    }
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
    // If no lights added yet, snapshot all device lights that are currently on
    if (!this._sceneEditLights.length) {
      const allLights = Object.entries(this.hass.states)
        .filter(([eid, s]) => eid.startsWith('light.') && s.state === 'on')
        .map(([eid, s]) => ({
          entity_id: eid,
          state: 'ON',
          brightness: s.attributes?.brightness ?? 255,
          rgb_color: s.attributes?.rgb_color ?? [255, 255, 255],
          effect: s.attributes?.effect ?? null,
        }));
      this._sceneEditLights = allLights;
      return;
    }
    // Otherwise update existing lights with current HA state
    this._sceneEditLights = this._sceneEditLights.map((l) => {
      const s = this.hass.states[l.entity_id];
      return {
        ...l,
        state: s?.state?.toUpperCase() ?? l.state,
        brightness: s?.attributes?.brightness ?? l.brightness,
        rgb_color: s?.attributes?.rgb_color ?? l.rgb_color,
        effect: s?.attributes?.effect ?? l.effect ?? null,
      };
    });
  }

  async _saveScene() {
    this._sceneEditSaving = true;
    try {
      const name = this._sceneEditName.trim() || "Unnamed Scene";

      // Build HA entities dict: { "light.foo": { state, brightness, rgb_color }, ... }
      const entities = {};
      for (const l of this._sceneEditLights) {
        const entry = { state: (l.state ?? "ON").toLowerCase() };
        if (entry.state === "on") {
          if (l.brightness != null) entry.brightness = l.brightness;
          if (l.rgb_color != null) entry.rgb_color = l.rgb_color;
          if (l.effect) entry.effect = l.effect;
        }
        entities[l.entity_id] = entry;
      }

      const configId = (this._editingScene !== "new" && this.hass.states[this._editingScene]?.attributes?.id)
        || String(Date.now());

      await this.hass.callApi("POST", `config/scene/config/${configId}`, {
        id: configId,
        name,
        entities,
      });

      await this.hass.callService("scene", "reload", {});
      this._sceneConfigsLoaded = false;  // reload scene configs for gradients
      this._editingScene = null;
    } catch (err) {
      console.error("VanCtl: save scene failed:", err);
    } finally {
      this._sceneEditSaving = false;
    }
  }

  async _deleteScene() {
    try {
      const configId = this.hass.states[this._editingScene]?.attributes?.id;
      if (configId) {
        await this.hass.callApi("DELETE", `config/scene/config/${configId}`);
        await this.hass.callService("scene", "reload", {});
        this._sceneConfigsLoaded = false;
      }
    } catch (err) {
      console.error("VanCtl: delete scene failed:", err);
    }
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
              <ha-icon class="auto-row-icon" icon="mdi:play-circle-outline" style="color:var(--sv-accent)"></ha-icon>
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
        ${scenes.map(({ eid }) => {
          const bg = this._sceneCardGradient(eid);
          const lightColors = this._getSceneColors(eid);
          const isActive = this._isSceneActive(eid);
          return html`
            <div class="scene-tile ${isActive ? 'active' : ''}" style="background:${bg}"
                 @click=${() => this._triggerScene(eid)}>
              <ha-icon class="scene-icon" icon="mdi:palette"></ha-icon>
              <span class="scene-name">${this._label(eid)}</span>
              ${lightColors.length ? html`
                <div class="scene-dots">
                  ${lightColors.map(([r,g,b]) => html`<span class="scene-dot" style="background:rgb(${r},${g},${b})"></span>`)}
                </div>
              ` : ''}
            </div>
          `;
        })}
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

  // ── Render: devices page ───────────────────────────────────

  _buildInCardEids(entities, slots) {
    const inCardEids = new Set();
    const s = slots;
    if (s) {
      const addSlotEids = (arr) => (arr ?? []).forEach((item) => {
        const eid = typeof item === 'string' ? item : item.entity;
        if (eid) inCardEids.add(eid);
      });
      addSlotEids(s.lights);
      addSlotEids(s.switches);
      addSlotEids(s.resources);
      addSlotEids(s.fans);
      addSlotEids(s.buttons);
      addSlotEids(s.footerSwitches);
      addSlotEids(s.topbarStats);
      (s.status_sensors ?? []).forEach((eid) => inCardEids.add(eid));
      if (s.pitch) inCardEids.add(s.pitch);
      if (s.roll) inCardEids.add(s.roll);
      if (s.temperature) inCardEids.add(s.temperature);
      if (s.water_temp) inCardEids.add(s.water_temp);
      if (s.target_temp) inCardEids.add(s.target_temp);
      if (s.fan_speed) inCardEids.add(s.fan_speed);
      if (s.climate_mode) inCardEids.add(s.climate_mode);
      if (s.heater) inCardEids.add(s.heater);
      if (s.water_pump) inCardEids.add(s.water_pump);
      if (s.power) {
        if (s.power.soc) inCardEids.add(s.power.soc);
        if (s.power.voltage) inCardEids.add(s.power.voltage);
        if (s.power.current) inCardEids.add(s.power.current);
        if (s.power.time_left) inCardEids.add(s.power.time_left);
      }
      (s.groups ?? []).forEach((g) => (g.lights ?? []).forEach((eid) => inCardEids.add(eid)));
      (s.hiddenLights ?? []).forEach((eid) => inCardEids.add(eid));
    }
    for (const e of entities.lights) inCardEids.add(e.eid);
    for (const e of entities.switches) inCardEids.add(e.eid);
    return inCardEids;
  }

  _renderDevicesPage(entities, slots) {
    const haDevices = Object.values(this.hass.devices ?? {})
      .filter((d) => d.identifiers?.some(([dom]) => dom === "smartvanio"));

    const deviceEntities = {};
    for (const dev of haDevices) {
      deviceEntities[dev.id] = [];
    }
    for (const [eid, entry] of Object.entries(this.hass.entities ?? {})) {
      if (deviceEntities[entry.device_id] !== undefined) {
        const state = this.hass.states[eid];
        if (state) deviceEntities[entry.device_id].push({ eid, state, entry });
      }
    }

    const inCardEids = this._buildInCardEids(entities, slots);

    return html`
      <div class="dev-page">
        <div class="dev-grid">
          ${haDevices.map((dev) => {
            const svId = dev.identifiers?.find(([d]) => d === "smartvanio")?.[1];
            const mqttDev = svId ? this._knownDevices[svId] : null;
            const status = svId ? this._deviceStatuses[svId] : null;
            const online = status === "online";
            const offline = status === "offline";
            const ents = deviceEntities[dev.id] || [];
            const inCard = ents.filter((e) => inCardEids.has(e.eid));
            const notInCard = ents.filter((e) => !inCardEids.has(e.eid));
            const devName = dev.name_by_user ?? dev.name ?? svId ?? "Unknown";
            const model = mqttDev?.model ?? dev.model ?? "";
            const firmware = mqttDev?.firmware ?? dev.sw_version ?? "";

            return html`
              <div class="dev-card">
                <div class="dev-card-header">
                  <div class="dev-card-status ${online ? 'online' : offline ? 'offline' : 'unknown'}"></div>
                  <div class="dev-card-info">
                    <span class="dev-card-name">${devName}</span>
                    ${model ? html`<span class="dev-card-meta">${model}${firmware ? ` · v${firmware}` : ''}</span>` : ''}
                  </div>
                  <span class="dev-card-cfg" @click=${() => this._openDeviceModal(dev, svId, ents, inCardEids, slots)} title="Configure">
                    <ha-icon icon="mdi:cog" style="--mdc-icon-size:16px"></ha-icon>
                  </span>
                  <a class="dev-card-link" href="/config/devices/device/${dev.id}" target="_top" title="Open in HA">
                    <ha-icon icon="mdi:open-in-new" style="--mdc-icon-size:16px"></ha-icon>
                  </a>
                </div>

                <div class="dev-card-stats">
                  <span class="dev-stat">${ents.length} entities</span>
                  <span class="dev-stat-sep">·</span>
                  <span class="dev-stat in">${inCard.length} in card</span>
                  ${notInCard.length ? html`
                    <span class="dev-stat-sep">·</span>
                    <span class="dev-stat out">${notInCard.length} unused</span>
                  ` : ''}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _openDeviceModal(device, svId, ents, inCardEids, slots) {
    this._deviceModal = { device, deviceId: svId, entities: ents, inCardEids, slots };
    // Reset cached calibration so the modal re-reads from current entity state
    requestAnimationFrame(() => {
      const el = this.shadowRoot?.querySelector("smartvanio-modal-device");
      if (el) el.resetCalData();
    });
  }

  _refreshDeviceModal() {
    if (!this._deviceModal) return;
    // Rebuild inCardEids from updated config after an add/remove
    requestAnimationFrame(() => {
      const m = this._deviceModal;
      const slots = this._cardConfig?.slots ?? {};
      // Re-collect entities for the device
      const haDevices = Object.values(this.hass.devices ?? {})
        .filter((d) => d.identifiers?.some(([dom]) => dom === "smartvanio"));
      const ents = [];
      for (const [eid, entry] of Object.entries(this.hass.entities ?? {})) {
        if (entry.device_id === m.device.id) {
          const state = this.hass.states[eid];
          if (state) ents.push({ eid, state, entry });
        }
      }
      // Build a minimal entities object for _buildInCardEids
      const allEnts = { lights: [], switches: [] };
      for (const [eid, entry] of Object.entries(this.hass.entities ?? {})) {
        const hasDev = Object.values(this.hass.devices ?? {}).find(d =>
          d.identifiers?.some(([dom]) => dom === "smartvanio") && d.id === entry.device_id
        );
        if (!hasDev) continue;
        const state = this.hass.states[eid];
        if (!state) continue;
        if (eid.startsWith("light.")) allEnts.lights.push({ eid, state });
        else if (eid.startsWith("switch.")) allEnts.switches.push({ eid, state });
      }
      const inCardEids = this._buildInCardEids(allEnts, slots);
      this._deviceModal = { ...m, entities: ents, inCardEids, slots };
    });
  }

  _addEntityToCard(eid, domain) {
    const currentSlots = this._cardConfig?.slots ?? {};
    const updated = { ...currentSlots };

    if (domain === 'light') {
      const lights = [...(updated.lights ?? [])];
      if (!lights.some((l) => (typeof l === 'string' ? l : l.entity) === eid)) {
        lights.push({ entity: eid });
        updated.lights = lights;
      }
    } else if (domain === 'switch') {
      const switches = [...(updated.switches ?? [])];
      if (!switches.some((s) => (typeof s === 'string' ? s : s.entity) === eid)) {
        switches.push({ entity: eid });
        updated.switches = switches;
      }
    } else if (domain === 'sensor' || domain === 'binary_sensor' || domain === 'number' || domain === 'select') {
      const sensors = [...(updated.status_sensors ?? [])];
      if (!sensors.includes(eid)) {
        sensors.push(eid);
        updated.status_sensors = sensors;
      }
    }

    this._saveCardConfig({ ...this._cardConfig, slots: updated });
  }

  _removeEntityFromCard(eid, domain) {
    const currentSlots = this._cardConfig?.slots ?? {};
    const updated = { ...currentSlots };

    if (domain === 'light') {
      updated.lights = (updated.lights ?? []).filter((l) =>
        (typeof l === 'string' ? l : l.entity) !== eid
      );
      updated.hiddenLights = (updated.hiddenLights ?? []).filter((e) => e !== eid);
      if (updated.groups) {
        updated.groups = updated.groups.map((g) => ({
          ...g,
          lights: (g.lights ?? []).filter((e) => e !== eid),
        }));
      }
    } else if (domain === 'switch') {
      updated.switches = (updated.switches ?? []).filter((s) =>
        (typeof s === 'string' ? s : s.entity) !== eid
      );
      updated.footerSwitches = (updated.footerSwitches ?? []).filter((s) =>
        (typeof s === 'string' ? s : s.entity) !== eid
      );
    } else if (domain === 'sensor' || domain === 'binary_sensor' || domain === 'number' || domain === 'select') {
      updated.status_sensors = (updated.status_sensors ?? []).filter((e) => e !== eid);
      updated.topbarStats = (updated.topbarStats ?? []).filter((s) =>
        (typeof s === 'string' ? s : s.entity) !== eid
      );
      updated.resources = (updated.resources ?? []).filter((r) =>
        (typeof r === 'string' ? r : r.entity) !== eid
      );
    }

    this._saveCardConfig({ ...this._cardConfig, slots: updated });
  }

  // ── Render: level panel ────────────────────────────────────

  _renderOverviewPanel(entities, slots) {
    // Lights — build by area
    const slotLights = slots?.lights ?? [];
    const hiddenSet = new Set(slots?.hiddenLights ?? []);
    const dashboardEids = [...new Set([...slotLights.map(s => s.entity), ...entities.lights.map(e => e.eid)])]
      .filter(eid => !hiddenSet.has(eid));
    const areaMap = {};
    for (const eid of dashboardEids) {
      const slot = slotLights.find(s => s.entity === eid);
      const area = slot?.area?.trim() || 'Other';
      if (!areaMap[area]) areaMap[area] = { all: [], on: [], icon: 'mdi:map-marker' };
      areaMap[area].all.push(eid);
      if (this.hass.states[eid]?.state === 'on') areaMap[area].on.push(eid);
    }
    // Only show areas that have lights assigned
    const areas = Object.entries(areaMap).filter(([, a]) => a.all.length > 0);
    const totalOn = areas.reduce((sum, [, a]) => sum + a.on.length, 0);

    // Power
    const power = slots?.power;
    const readSensor = (eid) => {
      const st = eid ? this.hass.states[eid] : null;
      if (!st || st.state === 'unavailable' || st.state === 'unknown') return null;
      return parseFloat(st.state);
    };
    const socVal = power ? readSensor(power.soc) : null;
    const battV = power ? readSensor(power.voltage) : null;
    const currentVal = power ? readSensor(power.current) : null;
    const timeLeft = power ? readSensor(power.time_left) : null;

    // Weather
    const weatherEid = Object.keys(this.hass?.states ?? {}).find(id => id.startsWith('weather.'));
    const weather = weatherEid ? this.hass.states[weatherEid] : null;
    const weatherTemp = weather ? parseFloat(weather.attributes?.temperature) : null;
    const weatherCond = weather?.state;
    const weatherIcon = { 'sunny': 'mdi:weather-sunny', 'clear-night': 'mdi:weather-night', 'partlycloudy': 'mdi:weather-partly-cloudy', 'partly_cloudy': 'mdi:weather-partly-cloudy', 'cloudy': 'mdi:weather-cloudy', 'rainy': 'mdi:weather-rainy', 'pouring': 'mdi:weather-pouring', 'snowy': 'mdi:weather-snowy', 'snowy-rainy': 'mdi:weather-snowy-rainy', 'fog': 'mdi:weather-fog', 'hail': 'mdi:weather-hail', 'windy': 'mdi:weather-windy', 'windy-variant': 'mdi:weather-windy-variant', 'lightning': 'mdi:weather-lightning', 'lightning-rainy': 'mdi:weather-lightning-rainy', 'exceptional': 'mdi:alert-circle-outline' };

    return html`
      <div class="ov-panel">
        <div class="ov-grid">
          <!-- Area tiles -->
          ${areas.map(([area, { all, on, icon }]) => html`
            <div class="ov-card ov-card-area ${on.length ? 'active' : ''}" @click=${() => {
              if (on.length) { on.forEach(eid => this.hass.callService('light', 'turn_off', { entity_id: eid })); }
              else { all.forEach(eid => this.hass.callService('light', 'turn_on', { entity_id: eid })); }
            }}>
              <div class="ov-card-header">
                <ha-icon icon="${icon}" style="--mdc-icon-size:18px; color:${on.length ? 'var(--sv-amber)' : 'var(--sv-text-disabled)'}"></ha-icon>
                <span class="ov-card-title">${area}</span>
              </div>
              <span class="ov-area-status" style="color:${on.length ? 'var(--sv-amber)' : 'var(--sv-text-secondary)'}">${on.length ? `${on.length}/${all.length} on` : `${all.length} lights`}</span>
            </div>
          `)}

          <!-- Power -->
          ${power ? html`
            <div class="ov-card">
              <div class="ov-card-header">
                <ha-icon icon="mdi:battery" style="--mdc-icon-size:18px; color:${socVal !== null ? (socVal > 50 ? 'var(--sv-green)' : socVal > 20 ? 'var(--sv-amber)' : 'var(--sv-red)') : 'var(--sv-text-disabled)'}"></ha-icon>
                <span class="ov-card-title">Power</span>
              </div>
              <div class="ov-power-rows">
                ${currentVal !== null ? html`<div class="ov-power-row"><span class="ov-power-label">Draw</span><span class="ov-power-val">${currentVal.toFixed(1)}A</span></div>` : ''}
                ${timeLeft !== null ? html`<div class="ov-power-row"><span class="ov-power-label">Left</span><span class="ov-power-val">${timeLeft.toFixed(0)}h</span></div>` : ''}
                ${battV !== null ? html`<div class="ov-power-row"><span class="ov-power-label">Volts</span><span class="ov-power-val">${battV.toFixed(1)}V</span></div>` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Weather -->
          ${weather ? html`
            <div class="ov-card">
              <div class="ov-card-header">
                <ha-icon icon="${weatherIcon[weatherCond] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:18px; color:var(--sv-accent)"></ha-icon>
                <span class="ov-card-title">Weather</span>
              </div>
              <span class="ov-card-value">${weatherTemp !== null ? Math.round(weatherTemp) + '°' : '—'}<span class="ov-card-sub">${weatherCond ? weatherCond.replace(/-/g, ' ') : ''}</span></span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

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
            fill="var(--sv-bg-base)"
            stroke="${col}"
            stroke-width="2"
            style="transition:stroke 0.4s ease"
          />
          <circle
            r="${ARENA_R * 0.6}"
            fill="none"
            stroke="var(--sv-bg-input)"
            stroke-width="1"
          />
          <circle
            r="${ARENA_R * 0.3}"
            fill="none"
            stroke="var(--sv-bg-input)"
            stroke-width="0.8"
          />
          <line
            x1="${-ARENA_R}"
            y1="0"
            x2="${ARENA_R}"
            y2="0"
            stroke="var(--sv-bg-input)"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="${-ARENA_R}"
            x2="0"
            y2="${ARENA_R}"
            stroke="var(--sv-bg-input)"
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
          <circle r="3" fill="none" stroke="var(--sv-bg-input)" stroke-width="1" />
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
    const state = this.hass?.states[eid];
    if (state?.attributes?.smartvanio_parent_entity_id) return 'mdi:led-strip';
    if (/strip/i.test(eid)) return 'mdi:led-strip-variant';
    if (/spot/i.test(eid)) return 'mdi:spotlight-beam';
    if (/main/i.test(eid)) return 'mdi:lightbulb';
    return 'mdi:lightbulb-outline';
  }

  // ── Tile long-press → popover ────────────────────────────

  _onTilePointerDown(e, eid) {
    if (this._setupMode) return; // In edit mode, drag handled by grid, tap in pointerUp
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
    if (this._setupMode) return;
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
    if (this._setupMode) {
      this._openEditModal(eid);
      return;
    }
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
    const sliderColor = isOn ? `rgb(${r},${g},${b})` : 'var(--sv-text-disabled)';
    const sliderBg = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${briPct}%, rgba(255,255,255,0.08) ${briPct}%, rgba(255,255,255,0.08) 100%)`;

    const patterns = this._getEntityPatterns(eid);
    const patternNames = Object.keys(patterns);
    const activePatName = this._getActivePatternName(eid);

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
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:16px; color:var(--sv-text-secondary)"></ha-icon>
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
                <ha-icon icon="mdi:palette" style="--mdc-icon-size:16px; color:var(--sv-text-secondary)"></ha-icon>
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
            ${patternNames.length ? html`
              <div class="popover-patterns">
                ${patternNames.map(name => html`
                  <div class="popover-pat-chip ${activePatName === name ? 'active' : ''}"
                    @click=${() => {
                      this._applyPattern(eid, name, patterns[name]);
                      this._tilePopover = null;
                    }}>
                    <div class="popover-pat-grad" style="background:${this._patternGradientCSS(patterns[name])}"></div>
                    <span class="popover-pat-name">${name}</span>
                  </div>
                `)}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  _renderLightTile({ eid, state, _slotName = null }) {
    const isOn = state?.state === 'on';
    const isOffline = !state || state.state === 'unavailable';
    const bri = this._bri(eid);
    const briPct = Math.round((bri / 255) * 100);
    const rgb = state?.attributes?.rgb_color ?? [255, 200, 80];
    const [r, g, b] = rgb;
    const bgStyle = isOffline
      ? 'background: rgba(28,28,30,0.35)'
      : isOn
        ? `background: rgba(${r},${g},${b},${0.12 + 0.22 * (bri / 255)})`
        : 'background: rgba(28,28,30,0.65)';
    const iconColor = isOffline ? '#6b3030' : isOn ? `rgb(${r},${g},${b})` : 'var(--sv-text-disabled)';
    const icon = this._lightIcon(eid);
    const name = this._label(eid, _slotName);

    return html`
      <div
        class="ltile ${isOn ? 'on' : ''} ${isOffline ? 'offline' : ''} ${this._setupMode ? 'edit-mode' : ''}"
        style="${bgStyle}"
        data-tile-id=${eid}
        @pointerdown=${(e) => this._onTilePointerDown(e, eid)}
        @pointermove=${(e) => this._onTilePointerMove(e)}
        @pointerup=${(e) => this._onTilePointerUp(e, eid)}
        @contextmenu=${(e) => e.preventDefault()}
      >
        <ha-icon
          class="ltile-icon"
          icon=${this._setupMode ? 'mdi:pencil' : isOffline ? 'mdi:cloud-off-outline' : icon}
          style="color:${this._setupMode ? 'var(--sv-text-disabled)' : iconColor}"
        ></ha-icon>
        <span class="ltile-name">${name}</span>
        ${isOffline ? html`<span class="ltile-bri" style="color:#6b3030">Offline</span>` : !this._setupMode && isOn ? html`<span class="ltile-bri">${briPct}%</span>` : ''}
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
      const savedLayouts = this._cardConfig?.slots?.layouts ?? {};
      // Check exact key or legacy "NxM" key
      let lk = savedLayouts[this._gridKey] ? this._gridKey : null;
      if (!lk) {
        for (const k of Object.keys(savedLayouts)) {
          if (k.startsWith(this._gridKey + "x")) { lk = k; break; }
        }
      }
      if (lk) {
        this._currentLayout = this._mergeNewItems(
          structuredClone(savedLayouts[lk]),
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
          ${this._setupMode
            ? html`<span class="dnd-hint">Tap to edit · Hold &amp; drag to reorder</span>`
            : ''}
        </div>
        <div class="unified-grid ${this._setupMode ? 'dnd-mode' : ''}"
             @pointerdown=${this._setupMode ? (e) => this._dragController.start(e) : null}>
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
                ${this._setupMode && this._allowedSizes(i).length > 1 ? html`
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
          ${this._setupMode ? this._renderEmptyCells(layout) : ''}
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
    const dotCol = isOn ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "var(--sv-bg-input)";
    const glowOn = isOn ? `0 0 9px rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "none";
    const sliderPct = isOn ? pct : 0;
    const sliderBg = `linear-gradient(to right, var(--sv-accent) ${sliderPct}%, var(--sv-gauge-track) ${sliderPct}%)`;

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
                  style="background:${isOn ? hexColor : "var(--sv-bg-input)"}"
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
        @click=${() => { this._setupMode ? this._openEditModal(eid) : this.hass.callService(eid.split(".")[0], "toggle", {}, { entity_id: eid }); }}
      >
        <ha-icon class="stile-icon" icon=${this._setupMode ? 'mdi:pencil' : icon} style="color:${this._setupMode ? 'var(--sv-text-disabled)' : ''}"></ha-icon>
        <span class="stile-name">${this._label(eid, _slotName)}</span>
        <span class="stile-badge">${this._setupMode ? '' : isOn ? "ON" : "OFF"}</span>
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
        color: color ?? "var(--sv-accent)",
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
        ? "var(--sv-text-secondary)"
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

    // Auto-select first device for MQTT config operations (hmi_config, scenes)
    if (!this._selectedId) {
      const devices = Object.values(this.hass.devices ?? {})
        .filter((d) => d.identifiers?.some(([dom]) => dom === "smartvanio"));
      if (devices.length) {
        this._selectedId = devices[0].identifiers.find(([dom]) => dom === "smartvanio")[1];
      }
    }

    if (!entities && !this._allSmartvanioDeviceIds().size) {
      return html`<div class="picker"><div class="picker-title">SmartVan.io</div><div class="picker-empty">No devices found. Add a device via Settings → Devices & Services.</div></div>`;
    }

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
      })).filter((e) => e.eid && this.hass.states[e.eid]);  // filter removed/missing entities
      const slotIds = new Set(slotMapped.map((e) => e.eid));
      return [...slotMapped, ...discovered.filter((e) => !slotIds.has(e.eid))];
    };

    const lights = mergeEntities(slots?.lights, safeEntities.lights);
    const powerSwitches = mergeEntities(
      slots?.switches,
      this._powerSwitches(safeEntities.switches),
    );
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Quick stats for top bar
    const topbarStats = slots?.topbarStats ?? [];
    const tankData = this._getTankData(safeEntities, slots);
    // Legacy auto-detected stats (used when no topbarStats configured)
    let legacyStats = null;
    if (!topbarStats.length) {
      const tempEid = slots?.temperature ?? safeEntities.sensors.find(({eid}) => /temperature/.test(eid) && !/heater/.test(eid))?.eid;
      const cabinTemp = tempEid ? parseFloat(this.hass.states[tempEid]?.state) || null : null;
      const battEid = safeEntities.sensors.find(({eid}) => /battery/.test(eid))?.eid;
      const battV = battEid ? parseFloat(this.hass.states[battEid]?.state) : null;
      const battPct = battV !== null ? Math.max(0, Math.min(100, ((battV - 11.5) / 1.7) * 100)) : null;
      const waterTank = tankData.find(t => /water/i.test(t.label));
      const wasteTank = tankData.find(t => /waste|grey/i.test(t.label));
      legacyStats = { cabinTemp, battV, battPct, waterTank, wasteTank };
    }

    return html`
      <div class="hmi">
        <!-- Top bar -->
        <div class="top-bar">
          <span class="tb-greeting">${greeting} <span style="font-size:10px;opacity:0.4;font-weight:400">v141</span></span>
          <div class="tb-stats">
            ${topbarStats.length ? topbarStats.map(({entity, name, icon}, i) => {
              const st = this.hass.states[entity];
              if (!st) return '';
              const val = st.state;
              const unit = st.attributes?.unit_of_measurement ?? '';
              const ic = icon && icon.length > 0 ? icon : (st.attributes?.icon || 'mdi:eye');
              const label = val === 'unavailable' ? '—' : (parseFloat(val) === parseFloat(val) ? (Number.isInteger(parseFloat(val)) ? val : parseFloat(val).toFixed(1)) : val) + (unit ? ' ' + unit : '');
              return html`
                ${i > 0 ? html`<span class="tb-divider"></span>` : ''}
                <span class="tb-stat ${this._setupMode ? 'setup' : ''}"
                      @click=${() => { if (this._setupMode) this._openEditFooterModal('topbarStats', i); }}>
                  <ha-icon icon="${ic}" style="--mdc-icon-size:20px"></ha-icon>
                  ${name ? html`<span class="tb-stat-label">${name}</span>` : ''}
                  ${label}
                </span>
              `;
            }) : legacyStats ? html`
              ${legacyStats.battV !== null ? html`
                <span class="tb-stat">
                  <ha-icon icon="mdi:battery" style="--mdc-icon-size:14px; color:${legacyStats.battPct > 50 ? 'var(--sv-green)' : legacyStats.battPct > 20 ? 'var(--sv-amber)' : 'var(--sv-red)'}"></ha-icon>
                  ${legacyStats.battV.toFixed(1)}V ${Math.round(legacyStats.battPct)}%
                </span>
              ` : ''}
              ${legacyStats.waterTank ? html`
                <span class="tb-stat">
                  <ha-icon icon="mdi:water" style="--mdc-icon-size:14px; color:var(--sv-accent)"></ha-icon>
                  ${Math.round(legacyStats.waterTank.value)}%
                </span>
              ` : ''}
              ${legacyStats.wasteTank ? html`
                <span class="tb-stat">
                  <ha-icon icon="mdi:delete-empty" style="--mdc-icon-size:14px; color:var(--sv-amber)"></ha-icon>
                  ${Math.round(legacyStats.wasteTank.value)}%
                </span>
              ` : ''}
              ${legacyStats.cabinTemp !== null ? html`
                <span class="tb-stat">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size:14px"></ha-icon>
                  ${legacyStats.cabinTemp.toFixed(0)}°C
                </span>
              ` : ''}
            ` : ''}
            ${this._setupMode ? html`
              <span class="tb-stat-add" @click=${() => this._openNewFooterModal('stat')}>
                <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              </span>
            ` : ''}
          </div>
          <div class="tb-right">
            <span class="tb-time">${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            ${this._layoutMode ? html`
              <button class="setup-cancel-btn" @click=${() => this._cancelLayoutMode()}>Cancel</button>
              <button class="setup-save-btn" @click=${() => this._saveLayoutMode()}>Save</button>
            ` : !this._setupMode ? html`
              <span class="tb-cfg" @click=${() => this._toggleTheme()} title="Toggle theme">
                <ha-icon icon="${this._theme === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'}" style="--mdc-icon-size:16px"></ha-icon>
              </span>
              <span class="tb-cfg ${this._page === 'devices' ? 'active' : ''}" @click=${() => { this._page = this._page === 'devices' ? 'dashboard' : 'devices'; }} title="Devices">
                <ha-icon icon="mdi:chip" style="--mdc-icon-size:16px"></ha-icon>
              </span>
              <span class="tb-cfg" @click=${() => this._enterLayoutMode()} title="Reorder & hide">
                <ha-icon icon="mdi:sort" style="--mdc-icon-size:16px"></ha-icon>
              </span>
              <span class="tb-cfg" @click=${() => this._enterSetupMode()} title="Settings">
                <ha-icon icon="mdi:cog" style="--mdc-icon-size:16px"></ha-icon>
              </span>
            ` : html`
              <button class="setup-cancel-btn" @click=${() => this._cancelSetupMode()}>Cancel</button>
              <button class="setup-save-btn" @click=${() => this._saveSetupMode()}>Save</button>
            `}
          </div>
        </div>

        ${this._page === 'devices' ? this._renderDevicesPage(safeEntities, slots) : html`
        <div class="main-content">
          <!-- Scene carousel -->
          ${this._renderSceneCarousel()}

          <!-- Two-column control area -->
          <div class="control-area">
            <!-- Left: lights list -->
            ${this._renderLightsPanel(lights)}

            <!-- Right: climate / level swipeable -->
            ${this._renderRightPanel(safeEntities, slots, level)}
          </div>
        </div>

        <!-- Footer -->
        ${this._renderFooter(safeEntities, slots)}
        `}

        ${this._renderAutoModal()}
        ${this._renderTilePopover()}
        ${this._footerModal ? this._renderFooterModal() : ''}
        ${this._lightModal ? this._renderLightModal() : ''}
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
                edit-area=${this._editArea ?? ''}
                .editRows=${this._editRows}
                ?edit-saving=${this._editSaving}
                ?edit-loading=${this._editLoading}
                ?is-button=${this._editingEntity.startsWith("button.") || this._editingEntity.startsWith("binary_sensor.")}
                ?is-switch=${this._editingEntity.startsWith("switch.")}
                ?is-light=${this._editingEntity.startsWith("light.") && this._isSmartvanioLight(this._editingEntity)}
                ?is-tank=${this._editingEntity.startsWith("sensor.") && (this.hass.states[this._editingEntity]?.attributes?.device_class === "volume" || this._editingEntity.includes("tank"))}
                ?is-sensor=${this._editingEntity.startsWith("sensor.")}
                .lightSegments=${this._lightSegments}
                .lightPatterns=${this._lightPatterns}
                .entityPatterns=${this._getEntityPatterns(this._editingEntity)}
                active-pattern=${(() => { const p = this._getActivePatternName(this._editingEntity); return p ? `${this._editingEntity}:${p}` : ''; })()}
                max-leds=${this._maxLeds}
                .targetEntities=${this._getTargetEntities()}
                .sourceEntities=${this._getSourceEntities()}
                save-error=${this._saveError ?? ""}
                @smartvanio-modal-close=${() => {
                  this._restoreOnCancel();
                  this._editingEntity = null;
                  this._saveError = null;
                }}
                @smartvanio-light-toggle=${() => {
                  const eid = this._editingEntity;
                  if (!eid) return;
                  this._toggleLight(eid);
                }}
                @smartvanio-light-brightness=${(e) => {
                  const eid = this._editingEntity;
                  if (!eid) return;
                  const pct = e.detail.brightness;
                  if (pct > 0) {
                    const svc = { entity_id: eid, brightness: Math.round(pct * 2.55) };
                    if (!this._getActivePatternName(eid)) svc.effect = 'None';
                    this.hass.callService('light', 'turn_on', svc);
                  } else {
                    this.hass.callService('light', 'turn_off', { entity_id: eid });
                  }
                }}
                @smartvanio-light-color=${(e) => {
                  const eid = this._editingEntity;
                  if (!eid) return;
                  this._activePatterns?.delete(eid);
                  this.hass.callService('light', 'turn_on', { entity_id: eid, rgb_color: e.detail.rgb, effect: 'None' });
                }}
                @smartvanio-light-pattern=${(e) => {
                  const eid = this._editingEntity;
                  if (!eid) return;
                  this._applyPattern(eid, e.detail.name, e.detail.stops);
                }}
                @smartvanio-update-edit-name=${(e) => {
                  this._editName = e.detail.value;
                }}
                @smartvanio-update-edit-area=${(e) => {
                  this._editArea = e.detail.value;
                }}
                @smartvanio-add-edit-row=${() => {
                  const eid = this._editingEntity;
                  const dom = eid?.split(".")?.[0];
                  const isTriggerType = dom === "binary_sensor" || dom === "button" || dom === "switch";
                  const defaultGesture = isTriggerType
                    ? (dom === "switch" ? "off_to_on" : "press")
                    : "";
                  this._editRows = [
                    ...this._editRows,
                    {
                      id: null,
                      source_entity_id: isTriggerType ? eid : "",
                      gesture: defaultGesture,
                      target_entity_id: isTriggerType ? "" : eid,
                      action: "",
                      duration: "",
                      brightness_pct: "",
                    },
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
                    if (field === "source_entity_id") {
                      // Auto-default gesture based on source domain
                      const srcDom = value?.split(".")?.[0];
                      if (srcDom === "binary_sensor" || srcDom === "button") updated.gesture = "press";
                      else if (srcDom === "switch" || srcDom === "light" || srcDom === "fan") updated.gesture = "off_to_on";
                      else if (srcDom === "cover") updated.gesture = "off_to_on";
                      else if (srcDom === "lock") updated.gesture = "off_to_on";
                      else updated.gesture = "";
                    }
                    if (field === "target_entity_id") { updated.action = ""; updated.duration = ""; updated.brightness_pct = ""; }
                    if (field === "action") { updated.duration = ""; updated.brightness_pct = ""; }
                    return updated;
                  });
                }}
                @smartvanio-add-segment=${() => {
                  const nextStart = this._lightSegments.length
                    ? Math.max(...this._lightSegments.map((s) => s.end)) + 1
                    : 0;
                  const nextEnd = Math.min(nextStart + 9, Math.max((this._maxLeds || 100) - 1, nextStart));
                  this._lightSegments = [
                    ...this._lightSegments,
                    {
                      id: `seg_${Date.now()}`,
                      name: "",
                      start: nextStart,
                      end: nextEnd,
                      r: 255, g: 255, b: 255,
                      brightness: 100,
                      parent_entity_id: this._editingEntity,
                    },
                  ];
                  setTimeout(() => this._sendSegmentPreview(), 100);
                }}
                @smartvanio-remove-segment=${(e) => {
                  this._lightSegments = this._lightSegments.filter(
                    (s, i) => (s.id ?? i) !== e.detail.id,
                  );
                  setTimeout(() => this._sendSegmentPreview(), 100);
                }}
                @smartvanio-update-segment=${(e) => {
                  const { id, field, value } = e.detail;
                  if (field === "maxLeds") {
                    this._maxLeds = value;
                    return;
                  }
                  this._lightSegments = this._lightSegments.map((s, i) => {
                    if ((s.id ?? i) !== id) return s;
                    if (field === "color") {
                      const r = parseInt(value.slice(1, 3), 16);
                      const g = parseInt(value.slice(3, 5), 16);
                      const b = parseInt(value.slice(5, 7), 16);
                      return { ...s, r, g, b };
                    }
                    return { ...s, [field]: value };
                  });
                }}
                @smartvanio-add-segment-at=${(e) => {
                  const { start, end } = e.detail;
                  this._lightSegments = [
                    ...this._lightSegments,
                    {
                      id: `seg_${Date.now()}`,
                      name: "",
                      start, end,
                      r: 255, g: 255, b: 255,
                      brightness: 100,
                      parent_entity_id: this._editingEntity,
                    },
                  ];
                  setTimeout(() => this._sendSegmentPreview(), 100);
                }}
                @smartvanio-segment-preview=${() => this._sendSegmentPreview()}
                @smartvanio-pattern-preview=${(e) => this._sendPatternPreview(e.detail.stops)}
                @smartvanio-save-pattern=${(e) => this._savePattern(e.detail.name, e.detail.stops)}
                @smartvanio-delete-pattern=${(e) => this._deletePattern(e.detail.name)}
                @smartvanio-save-edit=${(e) => this._saveEdit(e.detail)}
              ></smartvanio-modal-edit>
            `
          : ""}
        ${this._deviceModal
          ? html`
              <smartvanio-modal-device
                .hass=${this.hass}
                .device=${this._deviceModal.device}
                device-id=${this._deviceModal.deviceId ?? ''}
                .entities=${this._deviceModal.entities}
                .inCardEids=${this._deviceModal.inCardEids}
                .slots=${this._deviceModal.slots}
                @smartvanio-device-modal-close=${() => { this._deviceModal = null; }}
                @smartvanio-device-add-entity=${(e) => {
                  this._addEntityToCard(e.detail.eid, e.detail.domain);
                  this._refreshDeviceModal();
                }}
                @smartvanio-device-remove-entity=${(e) => {
                  this._removeEntityFromCard(e.detail.eid, e.detail.domain);
                  this._refreshDeviceModal();
                }}
              ></smartvanio-modal-device>
            `
          : ""}

      </div>
    `;
  }

  // ── Styles ─────────────────────────────────────────────────

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
        background: var(--sv-bg-base);
        color: var(--sv-text-primary);

        /* ── Dark theme (default) ── */
        --sv-bg-base: #050509;
        --sv-bg-surface: #141420;
        --sv-bg-elevated: #1C1C2A;
        --sv-bg-rail: #08080C;
        --sv-bg-input: #212830;
        --sv-bg-overlay: rgba(22,27,34,0.96);
        --sv-border: #2A2A38;
        --sv-border-subtle: #1E1E2A;
        --sv-text-primary: #E8E8F0;
        --sv-text-heading: var(--sv-text-heading);
        --sv-text-secondary: #9898AA;
        --sv-text-disabled: #55556A;
        --sv-accent: #4A9EFF;
        --sv-accent-hover: var(--sv-accent-hover);
        --sv-accent-muted: rgba(74, 158, 255, 0.15);
        --sv-green: #34C759;
        --sv-amber: #FFB830;
        --sv-red: #FF453A;
        --sv-orange: #FF9F0A;
        --sv-radius: 16px;
        --sv-radius-sm: 8px;
        --sv-gauge-track: #151b23;
        --sv-gauge-inactive: #30363d;
        --sv-tile-off-bg: rgba(28,28,30,0.65);
        --sv-shadow: rgba(0,0,0,0.4);
        --sv-nebula-1: rgba(74, 158, 255, 0.08);
        --sv-nebula-2: rgba(138, 80, 255, 0.06);

        color-scheme: dark;

        /* Legacy HA vars */
        --primary-color: var(--sv-accent);
        --primary-text-color: var(--sv-text-primary);
        --secondary-text-color: var(--sv-text-secondary);
        --secondary-background-color: var(--sv-bg-surface);
        --card-background-color: var(--sv-bg-surface);
        --divider-color: var(--sv-border-subtle);
        --error-color: var(--sv-red);
        --warning-color: var(--sv-amber);
        --disabled-color: var(--sv-text-disabled);
        --slider-track: var(--sv-border-subtle);
        --tile-bg: var(--sv-bg-surface);
        --tile-border: var(--sv-border-subtle);
      }

      /* ── Light theme ── */
      :host([theme="light"]) {
        --sv-bg-base: #FDF8F0;
        --sv-bg-surface: #FFFFFF;
        --sv-bg-elevated: #F5EDE0;
        --sv-bg-rail: #FAF4EA;
        --sv-bg-input: #F0E8D8;
        --sv-bg-overlay: rgba(255,252,245,0.97);
        --sv-border: #E0D5C0;
        --sv-border-subtle: #EDE5D5;
        --sv-text-primary: #2C2416;
        --sv-text-heading: #1A1208;
        --sv-text-secondary: #8A7D6B;
        --sv-text-disabled: #C0B5A0;
        --sv-accent: #D4880A;
        --sv-accent-hover: #E09A1A;
        --sv-accent-muted: rgba(212, 136, 10, 0.12);
        --sv-green: #2D9B46;
        --sv-amber: #D4880A;
        --sv-red: #CC3B30;
        --sv-orange: #D4720A;
        --sv-gauge-track: #EDE5D5;
        --sv-gauge-inactive: #E0D5C0;
        --sv-tile-off-bg: rgba(240,232,216,0.65);
        --sv-shadow: rgba(120,100,70,0.12);
        --sv-nebula-1: rgba(212, 136, 10, 0.06);
        --sv-nebula-2: rgba(180, 120, 60, 0.04);
        color-scheme: light;
      }

      /* ── Layout ─────────────────────────────────────────── */

      .hmi {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        background:
          radial-gradient(ellipse 80% 60% at 15% 20%, var(--sv-nebula-1) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 85% 75%, var(--sv-nebula-2) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, var(--sv-nebula-1) 0%, transparent 50%),
          var(--sv-bg-base);
        border-radius: 0;
        overflow: hidden;
        position: relative;
      }

      /* ── Top bar ────────────────────────────────────────── */

      .top-bar {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        background: var(--sv-bg-rail);
        border-bottom: 1px solid var(--sv-border);
        flex-shrink: 0;
        z-index: 20;
      }

      .tb-greeting {
        font-size: 16px;
        font-weight: 500;
      }

      .tb-stats {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 16px;
        color: var(--sv-text-secondary);
      }

      .tb-divider {
        width: 1px;
        height: 18px;
        background: var(--sv-border);
        opacity: 0.5;
      }

      .tb-stat {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tb-stat.setup {
        cursor: pointer;
        border-radius: 4px;
        padding: 2px 6px;
        margin: -2px -6px;
        border: 1px dashed transparent;
      }
      .tb-stat.setup:hover {
        border-color: var(--sv-accent);
      }

      .tb-stat-label {
        opacity: 0.7;
      }

      .tb-stat-add {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--sv-text-secondary);
        border: 1px dashed var(--sv-border);
        border-radius: 4px;
        padding: 2px 6px;
        transition: all 0.2s;
      }
      .tb-stat-add:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .tb-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tb-time {
        font-size: 14px;
        color: var(--sv-text-secondary);
      }

      .tb-cfg {
        cursor: pointer;
        color: var(--sv-text-secondary);
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .tb-cfg:hover { opacity: 1; }
      .tb-cfg.active { opacity: 1; color: var(--sv-accent); }

      /* ── Main content ──────────────────────────────────── */

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* ── Scene carousel ────────────────────────────────── */

      .sc-hero {
        padding: 20px 24px 16px;
        flex-shrink: 0;
      }

      .sc-label {
        font-size: 12px;
        color: var(--sv-text-disabled);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 12px;
        font-weight: 600;
      }

      .sc-carousel {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
        scroll-snap-type: x mandatory;
      }

      .sc-carousel::-webkit-scrollbar { height: 0; }

      .sc-card {
        flex-shrink: 0;
        width: 160px;
        height: 100px;
        border-radius: var(--sv-radius);
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        padding: 16px;
        cursor: pointer;
        transition: all 0.25s;
        scroll-snap-align: start;
        user-select: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .sc-card:active { transform: scale(0.96); }
      .sc-card:hover { border-color: rgba(74, 158, 255, 0.4); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); }
      .sc-card.active { border-color: var(--sv-accent); box-shadow: 0 0 12px rgba(74, 158, 255, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25); }

      .sc-card-icon {
        color: rgba(255, 255, 255, 0.85);
        --mdc-icon-size: 32px;
        filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
      }

      .sc-card-name {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      }

      .sc-dots {
        display: flex;
        gap: 4px;
      }

      .sc-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      }

      .sc-card-add {
        border-style: dashed;
        opacity: 0.6;
      }

      /* ── Control area (two-column) ─────────────────────── */

      .control-area {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        overflow: hidden;
        border-top: 1px solid var(--sv-border);
      }

      /* ── Lights panel (left) ───────────────────────────── */

      .lp-panel {
        padding: 16px 20px;
        overflow-y: auto;
        border-right: 1px solid var(--sv-border);
      }

      .lp-panel::-webkit-scrollbar { width: 3px; }
      .lp-panel::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      .lp-label {
        font-size: 12px;
        color: var(--sv-text-disabled);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 12px;
        font-weight: 600;
      }

      .lp-count {
        font-weight: 400;
        margin-left: 8px;
        color: var(--sv-text-secondary);
        text-transform: none;
        letter-spacing: 0;
      }

      .lp-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .lp-add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 16px;
        border: 1px dashed var(--sv-border);
        border-radius: var(--sv-radius);
        color: var(--sv-text-secondary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        grid-column: 1 / -1;
      }
      .lp-add-btn:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .lp-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius);
        transition: all 0.25s;
        user-select: none;
        cursor: pointer;
      }

      .lp-row:active:not(.unavail):not(.expanded) { transform: scale(0.99); }

      .lp-row.on {
        border-color: rgba(74, 158, 255, 0.2);
        background: var(--sv-bg-elevated);
      }



      .lp-header {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        cursor: pointer;
      }

      .lp-icon { flex-shrink: 0; }

      .lp-info { flex: 1; min-width: 0; }

      .lp-power {
        flex-shrink: 0;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.15s;
      }
      .lp-power:hover { background: rgba(255,255,255,0.05); }

      .lp-name {
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
      }

      .lp-name-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .lp-type {
        font-size: 10px;
        font-weight: 500;
        padding: 1px 5px;
        border-radius: 4px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        color: var(--sv-text-disabled);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .lp-bri {
        font-size: 11px;
        color: var(--sv-text-disabled);
        margin-top: 1px;
      }

      .lp-slider-wrap {
        position: relative;
        width: 100%;
        height: 32px;
        border-radius: 16px;
        background: rgba(255,255,255,0.06);
        touch-action: none;
        cursor: pointer;
      }
      .lp-slider-track {
        position: absolute;
        inset: 0;
        border-radius: 16px;
        overflow: hidden;
      }
      .lp-slider-fill {
        height: 100%;
        background: var(--lp-color, var(--sv-accent));
        opacity: 0.25;
        width: calc(16px + (100% - 32px) * var(--lp-bri, 0) / 100);
      }
      .lp-slider-thumb {
        position: absolute;
        top: 50%;
        left: calc(16px + (100% - 32px) * var(--lp-bri, 0) / 100);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--lp-color, var(--sv-accent));
        border: 2.5px solid #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      /* ── Right panel (climate / level swipeable) ────────── */

      /* ── Swiper core styles (needed inside shadow DOM) ── */
      .swiper {
        overflow: hidden;
        position: relative;
      }
      .swiper-wrapper {
        display: flex;
        transition-property: transform;
        box-sizing: content-box;
      }
      .swiper-slide {
        flex-shrink: 0;
        width: 100%;
        position: relative;
      }
      .swiper-pagination {
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 10;
      }
      .swiper-pagination-bullet {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--sv-text-disabled, #555);
        opacity: 1;
        margin: 0 3px;
        cursor: pointer;
      }
      .swiper-pagination-bullet-active {
        background: var(--sv-accent, #4fc3f7);
      }

      .rp-swiper {
        width: 100%;
        height: 100%;
      }

      .rp-page {
        height: 100%;
        overflow-y: auto;
        padding: 0 0 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .rp-page::-webkit-scrollbar { width: 3px; }
      .rp-page::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      /* ── Overview panel ──────────────────────────────────── */

      .ov-panel {
        padding: 12px 16px;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }

      .ov-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        width: 100%;
      }

      .ov-card {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ov-card-header {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ov-card-title {
        font-size: 11px;
        font-weight: 600;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .ov-card-value {
        font-size: 22px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        line-height: 1.1;
      }

      .ov-card-value-sm {
        font-size: 14px;
        font-weight: 600;
      }

      .ov-card-sub {
        font-size: 12px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 4px;
      }

      .ov-action {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        margin-top: 2px;
        background: rgba(255, 69, 58, 0.1);
        border: 1px solid rgba(255, 69, 58, 0.25);
        border-radius: 6px;
        color: var(--sv-red);
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        align-self: flex-start;
        transition: background 0.15s;
      }
      .ov-action:hover {
        background: rgba(255, 69, 58, 0.2);
      }

      .ov-power-rows {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ov-power-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .ov-power-label {
        color: var(--sv-text-secondary);
      }

      .ov-power-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .ov-card-area {
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s;
      }
      .ov-card-area:hover {
        background: var(--sv-bg-elevated);
      }
      .ov-card-area.active {
        border-color: rgba(255, 184, 48, 0.25);
        background: rgba(255, 184, 48, 0.05);
      }

      .ov-area-status {
        font-size: 13px;
        font-weight: 600;
      }

      .ov-card-action {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.2s;
      }
      .ov-card-action:hover {
        background: rgba(255, 69, 58, 0.1);
      }

      /* ── Devices page ──────────────────────────────────── */

      .dev-page {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }
      .dev-page::-webkit-scrollbar { width: 3px; }
      .dev-page::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      .dev-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 12px;
      }

      .dev-card {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .dev-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dev-card-status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--sv-text-disabled);
      }
      .dev-card-status.online { background: var(--sv-green); box-shadow: 0 0 6px var(--sv-green); }
      .dev-card-status.offline { background: var(--sv-red); }
      .dev-card-status.unknown { background: var(--sv-text-disabled); }

      .dev-card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .dev-card-name {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dev-card-meta {
        font-size: 11px;
        color: var(--sv-text-disabled);
      }

      .dev-card-link {
        color: var(--sv-text-secondary);
        opacity: 0.5;
        transition: opacity 0.15s, color 0.15s;
        cursor: pointer;
        text-decoration: none;
        flex-shrink: 0;
      }
      .dev-card-link:hover { opacity: 1; color: var(--sv-accent); }

      .dev-card-cfg {
        color: var(--sv-text-secondary);
        opacity: 0.5;
        transition: opacity 0.15s, color 0.15s;
        cursor: pointer;
        flex-shrink: 0;
      }
      .dev-card-cfg:hover { opacity: 1; color: var(--sv-accent); }

      .dev-card-stats {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--sv-text-secondary);
      }
      .dev-stat-sep { opacity: 0.3; }
      .dev-stat.in { color: var(--sv-green); }
      .dev-stat.out { color: var(--sv-text-disabled); }

      /* ── Footer bar ─────────────────────────────────────── */

      .ft-bar {
        min-height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0 20px;
        background: var(--sv-bg-rail);
        border-top: 1px solid var(--sv-border);
        flex-shrink: 0;
        z-index: 20;
      }

      .ft-tanks {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        position: relative;
      }

      .ft-tank {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        cursor: default;
        user-select: none;
        min-width: 90px;
      }

      .ft-tank-top {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ft-tank-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .ft-tank-label {
        font-size: 13px;
        color: var(--sv-text-secondary);
        line-height: 1.2;
      }

      .ft-tank-pct {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.2;
      }

      .ft-tank-sub {
        font-size: 11px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 4px;
      }

      .ft-power-inline {
        font-size: 11px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 6px;
      }
      .ft-power-inline span + span::before {
        content: ' · ';
      }

      .ft-tank-bar {
        width: 100%;
        height: 4px;
        background: var(--sv-border);
        border-radius: 2px;
        overflow: hidden;
      }

      .ft-tank-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.5s;
      }

      .ft-tank-add {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 14px;
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        border: 1px dashed var(--sv-border);
        cursor: pointer;
        color: var(--sv-text-secondary);
        font-size: 12px;
        transition: all 0.2s;
        align-self: center;
        flex-shrink: 0;
      }

      .ft-add-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }

      .ft-tank-add:hover { border-color: var(--sv-accent); color: var(--sv-accent); }

      .ft-sw-add {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 14px;
        background: none;
        border: none;
        border-left: 1px dashed var(--sv-border);
        border-radius: 0;
        cursor: pointer;
        color: var(--sv-text-secondary);
        transition: background 0.2s, color 0.2s;
      }

      .ft-sw-add:hover { background: var(--sv-bg-elevated); color: var(--sv-accent); }

      .ft-add-backdrop {
        position: fixed;
        inset: 0;
        z-index: 99;
      }

      .ft-add-menu {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 0;
        z-index: 100;
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 4px 0;
        min-width: 140px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }

      .ft-add-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        cursor: pointer;
        color: var(--sv-text-primary);
        font-size: 13px;
        transition: background 0.15s;
      }

      .ft-add-menu-item:hover {
        background: var(--sv-bg-surface);
        color: var(--sv-accent);
      }

      .ft-power-stats {
        display: flex;
        gap: 6px;
        margin-top: 2px;
      }

      .ft-power-badge {
        font-size: 10px;
        color: var(--sv-text-secondary);
        background: var(--sv-bg-surface);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .ft-power-badge.solar {
        color: var(--sv-amber);
      }

      .ft-right {
        display: flex;
        align-items: stretch;
        align-self: stretch;
      }

      .ft-sw {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 16px;
        background: none;
        border: none;
        border-left: 1px solid var(--sv-border);
        border-radius: 0;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: background 0.2s, color 0.2s;
        user-select: none;
        color: var(--sv-text-secondary);
      }

      .ft-sw:hover { background: var(--sv-bg-elevated); }
      .ft-sw:active { background: var(--sv-bg-surface); }
      .ft-sw.on { color: var(--sv-text-primary); }

      .ft-sw.icon-only {
        padding: 0 14px;
        color: var(--sv-text-disabled);
        transition: background 0.2s, color 0.2s;
      }
      .ft-sw.icon-only.on {
        color: var(--ft-sw-color, var(--sv-accent));
        background: color-mix(in srgb, var(--ft-sw-color, var(--sv-accent)) 10%, transparent);
      }

      .ft-sw-toggle {
        position: relative;
        width: 28px;
        height: 16px;
        border-radius: 8px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        flex-shrink: 0;
        transition: background 0.2s, border-color 0.2s;
      }

      .ft-sw-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--sv-text-disabled);
        transition: transform 0.2s, background 0.2s;
      }

      .ft-sw.on .ft-sw-toggle {
        background: rgba(52, 199, 89, 0.2);
        border-color: rgba(52, 199, 89, 0.4);
      }

      .ft-sw.on .ft-sw-knob {
        transform: translateX(12px);
        background: var(--sv-green);
      }

      .ft-ha-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        padding: 0 24px;
        background: none;
        border: none;
        border-left: 1px solid var(--sv-border);
        border-radius: 0;
        color: var(--sv-text-secondary);
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        box-sizing: border-box;
      }

      .ft-ha-btn:hover { background: var(--sv-bg-elevated); color: var(--sv-text-primary); }
      .ft-ha-btn:active { background: var(--sv-bg-surface); }

      /* ── Unavailable state ──────────────────────────────── */

      .lp-row.unavail { opacity: 0.5; }
      .lp-row.unavail .lp-bri { color: var(--sv-red); }
      .ft-tank.setup { cursor: pointer; outline: 1px dashed var(--sv-accent); outline-offset: 4px; border-radius: 4px; }
      .ft-tank.unavail { opacity: 0.5; }
      .ft-sw.unavail { opacity: 0.5; cursor: default; }
      .ft-sw.unavail:active { transform: none; }
      .ft-sw.setup { border-left-style: dashed; color: var(--sv-accent); cursor: pointer; }
      .ft-sw.setup:hover { background: color-mix(in srgb, var(--sv-accent) 8%, transparent); }

      /* ── Layout mode ──────────────────────────────────── */

      .layout-item {
        cursor: grab;
        touch-action: none;
        user-select: none;
        position: relative;
      }

      .layout-item:active { cursor: grabbing; }

      .layout-item.hidden-item { opacity: 0.35; }

      .layout-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: none;
        z-index: 2;
        padding: 4px;
      }

      .layout-overlay > * { pointer-events: auto; }

      .layout-touch {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
        padding: 4px 10px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        border-radius: 8px;
      }

      .layout-touch:active { background: rgba(255, 255, 255, 0.1); }

      .layout-drag {
        color: rgba(255, 255, 255, 0.8);
        cursor: grab;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .lp-row .layout-drag {
        color: var(--sv-text-disabled);
        filter: none;
        flex-shrink: 0;
      }

      .layout-eye {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        flex-shrink: 0;
        transition: color 0.15s;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .layout-eye:hover { color: var(--sv-accent); }

      .lp-row .layout-eye {
        color: var(--sv-text-secondary);
        filter: none;
      }

      .lp-row .layout-touch:active { background: rgba(255, 255, 255, 0.05); }

      .hidden-item .layout-eye { color: var(--sv-text-disabled); }

      /* ── Footer modal ──────────────────────────────────── */

      .fm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
      }

      .fm-modal {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius);
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        overflow: visible;
      }
      .fm-modal.fm-wide { max-width: 900px; }

      .fm-body.fm-two-col {
        flex-direction: row;
        gap: 0;
      }
      .fm-col-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-right: 18px;
        min-width: 0;
      }
      .fm-col-right {
        flex: 1.4;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-left: 1px solid var(--sv-border);
        padding-left: 18px;
        min-width: 0;
      }
      .fm-auto-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .fm-auto-empty {
        font-size: 12px;
        color: var(--sv-text-disabled);
        padding: 8px 0;
      }
      .fm-auto-row {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 4px;
      }
      .fm-auto-row .auto-row-trigger,
      .fm-auto-row .auto-row-target,
      .fm-auto-row .auto-row-action {
        grid-column: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .fm-auto-row .auto-row-trigger > *,
      .fm-auto-row .auto-row-target > *,
      .fm-auto-row .auto-row-action > * { min-width: 0; }
      .fm-auto-row smartvanio-entity-picker { flex: 2; }
      .fm-auto-row smartvanio-select { flex: 1; }
      .fm-auto-row .auto-row-label-text {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--sv-text-disabled);
        min-width: 44px;
        width: 44px;
        flex-shrink: 0;
        letter-spacing: 0.5px;
      }
      .fm-auto-row .auto-row-trigger .auto-row-label-text { color: var(--sv-accent); }
      .fm-auto-row .auto-row-target .auto-row-label-text { color: var(--sv-amber); }
      .fm-auto-row .auto-row-action .auto-row-label-text { color: var(--sv-green); }
      .fm-auto-row .delete-row-btn {
        grid-column: 2;
        grid-row: 1 / -1;
        align-self: center;
        background: none;
        border: none;
        color: var(--sv-red);
        cursor: pointer;
        padding: 4px;
        opacity: 0.5;
        transition: opacity 0.15s;
      }
      .fm-auto-row .delete-row-btn:hover { opacity: 1; }
      .fm-auto-header .add-row-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-accent);
        font-size: 11px;
        padding: 4px 10px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .fm-auto-header .add-row-btn:hover { background: rgba(74, 158, 255, 0.1); }

      .fm-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px;
        border-bottom: 1px solid var(--sv-border);
        font-size: 15px;
        font-weight: 600;
      }

      .fm-close {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--sv-bg-elevated);
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .fm-body {
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .fm-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .fm-row {
        display: flex;
        gap: 12px;
      }

      .fm-label {
        font-size: 11px;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .fm-optional {
        text-transform: none;
        font-size: 10px;
        opacity: 0.6;
      }

      .fm-input {
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 8px 12px;
        font-size: 13px;
        color: var(--sv-text-primary);
        outline: none;
        font-family: inherit;
      }

      .fm-input:focus { border-color: var(--sv-accent); }

      .fm-color {
        width: 40px;
        height: 32px;
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        background: none;
        cursor: pointer;
        padding: 2px;
      }

      .fm-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 18px;
        border-top: 1px solid var(--sv-border);
      }

      .fm-btn {
        padding: 8px 16px;
        border-radius: var(--sv-radius-sm);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid var(--sv-border);
        background: var(--sv-bg-elevated);
        color: var(--sv-text-primary);
        transition: all 0.2s;
        font-family: inherit;
      }

      .fm-btn.delete { color: var(--sv-red); margin-right: auto; }
      .fm-btn.save { background: var(--sv-accent); border-color: var(--sv-accent); color: #fff; }
      .fm-btn[disabled] { opacity: 0.4; cursor: default; }
      /* ── Panel: empty state ─────────────────────────────── */

      .panel-empty {
        padding: 40px 20px;
        text-align: center;
        font-size: 14px;
        color: var(--sv-text-secondary);
      }

      /* ── Panel: climate ─────────────────────────────────── */

      .panel-climate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 16px 20px 20px;
        box-sizing: border-box;
      }

      .climate-svg {
        display: block;
        width: 100%;
        max-width: min(240px, 100%);
        height: auto;
        overflow: visible;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
      }

      .c-main-val {
        fill: var(--sv-text-heading);
        font-size: 34px;
        font-weight: 200;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.03em;
      }

      .c-main-unit {
        fill: var(--sv-text-secondary);
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.18em;
      }

      .c-arc-tag {
        fill: var(--sv-text-secondary);
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
        fill: var(--sv-text-secondary);
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.12em;
      }

      .climate-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        max-width: min(260px, 100%);
      }

      .climate-control-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        margin: 4px 0 0;
      }

      .fan-row,
      .mode-row {
        display: flex;
        gap: 5px;
        width: 100%;
      }

      .fan-btn {
        flex: 1;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--sv-text-secondary);
        padding: 8px 0;
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        cursor: pointer;
        transition:
          border-color 0.2s,
          color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
      }

      .fan-btn.active {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
        background: var(--sv-accent-muted);
        box-shadow: 0 0 8px var(--sv-accent-muted);
      }
      .fan-btn:hover:not(.active) {
        border-color: var(--sv-text-secondary);
        color: var(--sv-text-primary);
      }

      .mode-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 4px;
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        cursor: pointer;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
      }

      .mode-btn.active {
        border-color: var(--sv-accent);
        background: var(--sv-accent-muted);
        box-shadow: 0 0 8px var(--sv-accent-muted);
      }
      .mode-btn:hover:not(.active) {
        border-color: var(--sv-text-secondary);
      }

      .mode-icon {
        font-size: 15px;
        line-height: 1;
      }

      .mode-lbl {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--sv-text-secondary);
        white-space: nowrap;
      }

      .mode-btn.active .mode-lbl {
        color: var(--sv-accent-hover);
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
        justify-content: flex-end;
        gap: 6px;
        padding: 14px 10px;
        background: linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface));
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        cursor: pointer;
        text-align: center;
        transition: border-color 0.25s, box-shadow 0.25s, transform 0.15s;
        user-select: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        -webkit-tap-highlight-color: transparent;
        aspect-ratio: 1;
      }

      .scene-tile:hover {
        border-color: rgba(74, 158, 255, 0.4);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }
      .scene-tile:active {
        transform: scale(0.96);
      }

      .scene-tile.active {
        border-color: var(--sv-accent);
        box-shadow: 0 0 12px rgba(74, 158, 255, 0.35), 0 4px 16px rgba(0, 0, 0, 0.35);
      }
      .scene-tile.active .scene-icon {
        color: #fff;
      }
      .scene-tile.active .scene-name {
        color: #fff;
      }

      .scene-tile--script .scene-icon {
        color: var(--sv-accent);
      }

      .scene-icon {
        --mdc-icon-size: 24px;
        color: rgba(255, 255, 255, 0.55);
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        transition: color 0.2s;
      }

      .scene-name {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: color 0.2s;
      }

      .scene-dots {
        display: flex;
        gap: 4px;
      }
      .scene-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        box-shadow: 0 0 4px currentColor;
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
        color: var(--sv-text-secondary);
      }

      .hint-link {
        color: var(--sv-accent);
        cursor: pointer;
        text-decoration: underline;
      }

      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--sv-gauge-track);
        cursor: pointer;
        transition: background 0.15s;
        user-select: none;
      }

      .action-row:hover {
        background: var(--sv-accent-muted);
      }
      .action-row.pinned {
        background: var(--sv-accent-muted);
      }

      .action-domain {
        --mdc-icon-size: 16px;
        color: var(--sv-text-secondary);
        flex-shrink: 0;
      }

      .action-label {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: var(--sv-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .action-run {
        font-size: 12px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
      }

      .action-pin {
        font-size: 18px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .action-pin.pinned {
        color: var(--sv-accent);
      }

      /* ── Actions sub-sections ───────────────────────────── */

      .actions-sub-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 6px;
        border-bottom: 1px solid var(--sv-border-subtle);
      }

      .actions-sub-title {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
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
        border: 1px dashed var(--sv-border);
        border-radius: 8px;
        color: var(--sv-text-secondary);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s;
        --mdc-icon-size: 14px;
      }
      .add-action-btn-full:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }
      .add-action-btn-full ha-icon {
        --mdc-icon-size: 14px;
      }

      .actions-empty-hint {
        padding: 10px 14px;
        font-size: 12px;
        color: var(--sv-text-disabled);
        font-style: italic;
      }

      .auto-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid var(--sv-gauge-track);
      }

      .auto-row-icon {
        --mdc-icon-size: 15px;
        color: var(--sv-accent);
        flex-shrink: 0;
      }

      .auto-row-label {
        flex: 1;
        font-size: 13px;
        color: var(--sv-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .auto-row-delete {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--sv-text-disabled);
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
        color: var(--sv-text-disabled);
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
      }
      .auto-row-edit:hover { color: var(--sv-accent); }
      .auto-row-edit ha-icon { --mdc-icon-size: 16px; }

      .scene-name-input {
        width: 100%;
        background: #0d1117;
        border: 1px solid var(--sv-border);
        border-radius: 8px;
        color: var(--sv-text-heading);
        font-size: 14px;
        padding: 9px 12px;
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .scene-name-input:focus { border-color: var(--sv-accent); }

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
        border: 1px solid var(--sv-border);
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
        border-bottom: 1px solid var(--sv-border-subtle);
      }

      .auto-modal-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--sv-text-heading);
      }

      .auto-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--sv-text-secondary);
        padding: 0;
        line-height: 1;
        --mdc-icon-size: 18px;
      }
      .auto-modal-close:hover {
        color: var(--sv-text-heading);
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
        color: var(--sv-text-secondary);
      }

      .auto-field-sep {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--sv-text-disabled);
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
        border-top: 1px solid var(--sv-border-subtle);
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
        background: var(--sv-border-subtle);
        border-color: var(--sv-border);
        color: var(--sv-text-secondary);
      }
      .auto-btn.cancel:hover {
        background: #2d333b;
      }
      .auto-btn.save {
        background: var(--sv-accent);
        color: var(--sv-bg-base);
        font-weight: 600;
      }
      .auto-btn.save:hover {
        background: var(--sv-accent-hover);
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
        gap: 20px;
        padding: 20px 16px;
      }

      .bubble-lg {
        display: block;
        width: 100%;
        max-width: min(200px, 100%);
        height: auto;
        overflow: visible;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
      }

      .level-stats {
        display: flex;
        gap: 12px;
        justify-content: center;
        width: 100%;
        max-width: min(280px, 100%);
      }

      .lstat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 8px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
      }

      .lstat-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .lstat-val {
        font-size: 20px;
        font-weight: 300;
        color: var(--sv-text-heading);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        transition: color 0.4s;
      }

      .lstat-val.warn {
        color: var(--sv-amber);
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
        color: var(--sv-text-secondary);
        padding: 10px 0 4px;
      }

      .sstat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--sv-gauge-track);
      }

      .sstat-row:last-child {
        border-bottom: none;
      }

      .sstat-row-name {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--sv-text-primary);
      }

      .sstat-row-val {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--sv-text-heading);
      }

      .val-offline {
        color: var(--sv-text-disabled);
      }

      .sstat-hint {
        font-size: 11px;
        color: var(--sv-text-secondary);
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
        background: var(--sv-bg-elevated);
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
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        padding: 0 2px;
      }

      .dstat {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
        border-radius: 8px;
        font-size: 14px;
        color: var(--sv-text-primary);
        transition: border-color 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .dstat.open {
        border-color: var(--sv-amber);
      }

      .dstat-name {
        flex: 1;
        font-size: 13px;
        color: var(--sv-text-primary);
      }

      .dstat-state {
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
      }

      .dstat.open .dstat-state {
        color: var(--sv-amber);
      }

      /* ── Right panel top bar ────────────────────────────── */

      .list-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        border-bottom: 1px solid var(--sv-border);
        flex-shrink: 0;
        background: var(--sv-bg-base);
      }

      .list-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .cfg-btn {
        font-size: 18px;
        color: var(--sv-text-secondary);
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
        color: var(--sv-text-heading);
        background: var(--sv-accent-muted);
      }
      .cfg-btn.active {
        color: var(--sv-accent);
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
        border-bottom: 1px solid var(--sv-border);
        background: var(--sv-gauge-track);
        flex-shrink: 0;
      }

      .pinned-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border: 1px solid var(--sv-text-secondary);
        border-radius: 20px;
        background: var(--sv-bg-input);
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-primary);
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
        border-color: var(--sv-accent);
        color: var(--sv-text-heading);
        background: var(--sv-accent-muted);
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
        border: 1px dashed var(--sv-border);
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
        transition:
          border-color 0.2s,
          color 0.2s;
        user-select: none;
      }

      .pinned-add:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
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
        background: var(--sv-bg-elevated);
        border-radius: 2px;
      }
      .acc-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Accordion ──────────────────────────────────────── */

      .acc-section {
        border-bottom: 1px solid var(--sv-border);
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
        background: var(--sv-accent-muted);
      }

      .acc-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--sv-accent);
        text-transform: uppercase;
      }

      .acc-chevron {
        font-size: 22px;
        color: var(--sv-text-disabled);
        line-height: 1;
        transform: rotate(90deg);
        transition:
          transform 0.2s ease,
          color 0.2s;
        display: inline-block;
      }

      .acc-chevron.open {
        transform: rotate(-90deg);
        color: var(--sv-accent);
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
        border-bottom: 1px solid var(--sv-gauge-track);
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }

      .lrow:hover {
        background: var(--sv-accent-muted);
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
        color: var(--sv-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
        min-width: 0;
      }

      .lrow.on .lname {
        color: var(--sv-text-heading);
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
        border: 2px solid var(--sv-text-secondary);
        cursor: pointer;
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.2s;
      }

      .color-swatch:hover {
        border-color: var(--sv-text-heading);
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
        background: var(--sv-accent);
        cursor: pointer;
        border: none;
        box-shadow: 0 0 7px var(--sv-accent-muted);
      }

      .lslider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--sv-accent);
        cursor: pointer;
        border: none;
      }

      .lpct {
        font-size: 13px;
        color: var(--sv-text-secondary);
        width: 32px;
        text-align: right;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }

      .lrow.on .lpct {
        color: var(--sv-accent);
      }

      /* ── CarPlay tile shared ────────────────────────────── */

      .section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--sv-accent);
      }

      .dnd-hint {
        font-size: 10px;
        color: var(--sv-accent);
        opacity: 0.7;
        font-style: italic;
      }

      .dnd-toggle-btn {
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        transition: color 0.15s, background 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .dnd-toggle-btn:hover { color: var(--sv-text-heading); background: rgba(255,255,255,0.06); }
      .dnd-toggle-btn ha-icon { --mdc-icon-size: 18px; }

      .dnd-done-btn {
        background: var(--sv-accent);
        border: none;
        color: var(--sv-bg-base);
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
      .unified-grid::-webkit-scrollbar-thumb { background: var(--sv-bg-elevated); border-radius: 2px; }
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
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .gtile-icon.on {
        color: var(--sv-accent);
        filter: drop-shadow(0 0 4px rgba(92,172,255,0.5));
      }

      .gtile.expanded .gtile-icon {
        --mdc-icon-size: 16px;
      }

      .gtile-name {
        font-size: 10px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        transition: color 0.2s;
      }

      .gtile.on .gtile-name { color: var(--sv-text-heading); }

      .gtile.expanded .gtile-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--sv-text-heading);
        text-align: left;
        flex: 1;
      }

      .gtile-name-input {
        flex: 1;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(92,172,255,0.25);
        border-radius: 6px;
        color: var(--sv-text-heading);
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
        background: var(--sv-border);
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
        background: var(--sv-text-heading);
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
        background: var(--sv-border);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }
      .gtile-bri-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }
      .gtile-bri-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }

      .gtile-collapse-btn {
        flex-shrink: 0;
        margin-left: auto;
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        transition: color 0.2s;
      }
      .gtile-collapse-btn:hover { color: var(--sv-text-primary); }
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
        color: var(--sv-text-secondary);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .ltile.on .ltile-name { color: var(--sv-text-heading); }
      .ltile.offline { opacity: 0.5; }
      .ltile.offline .ltile-name { color: #6b3030; }

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
        border: 1px solid var(--sv-border);
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
        color: var(--sv-text-heading);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .popover-toggle {
        padding: 3px 10px;
        border-radius: 10px;
        border: 1px solid var(--sv-border);
        background: rgba(255,255,255,0.06);
        color: var(--sv-text-secondary);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .popover-toggle.on {
        background: rgba(92,172,255,0.15);
        border-color: var(--sv-accent);
        color: var(--sv-accent);
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
        background: var(--sv-text-heading);
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      .popover-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }

      .popover-pct {
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
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

      .popover-patterns {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        padding-top: 4px;
      }
      .popover-pat-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 8px;
        padding: 3px;
        transition: border-color 0.15s, transform 0.15s;
        flex: 1;
        min-width: 48px;
      }
      .popover-pat-chip:hover { transform: scale(1.05); border-color: rgba(255,255,255,0.3); }
      .popover-pat-chip.active { border-color: var(--primary-color, #4a9eff); box-shadow: 0 0 6px rgba(74,158,255,0.4); }
      .popover-pat-grad {
        width: 100%;
        height: 18px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      .popover-pat-name {
        font-size: 10px;
        color: var(--secondary-text-color, rgba(255,255,255,0.6));
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }
      .popover-pat-chip.active .popover-pat-name { color: var(--primary-color, #4a9eff); }

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
        color: var(--sv-text-disabled);
        transition: color 0.2s;
      }

      .stile.on .stile-icon {
        color: #1C1C1E;
      }

      .stile-name {
        font-size: 10px;
        font-weight: 500;
        color: var(--sv-text-secondary);
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
        color: var(--sv-text-disabled);
      }

      /* ── Button tiles ───────────────────────────────────── */

      .btile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: var(--sv-bg-base);
        min-height: 52px;
        cursor: default;
        user-select: none;
        transition:
          background 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .btile:hover {
        background: var(--sv-gauge-track);
      }

      .btile.active {
        background: var(--sv-gauge-track);
      }

      .btile.editable {
        cursor: pointer;
      }
      .btile.editable:hover {
        background: var(--sv-accent-muted);
      }

      .btile-icon {
        --mdc-icon-size: 20px;
        color: var(--sv-text-secondary);
        flex-shrink: 0;
        transition: color 0.15s;
      }

      .btile.active .btile-icon {
        color: var(--sv-accent);
      }
      .btile.editable .btile-icon {
        color: var(--sv-accent);
      }

      .btile-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }

      .btile.active .btile-name {
        color: var(--sv-text-heading);
      }

      .btile-state {
        font-size: 11px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        white-space: nowrap;
      }

      .btile.active .btile-state {
        color: var(--sv-accent);
      }
      .btile.editable .btile-state {
        color: var(--sv-accent);
        font-size: 11px;
      }

      /* ── Resources bar ──────────────────────────────────── */

      .res-item {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        padding: 0 10px;
        border-right: 1px solid var(--sv-border);
      }

      .res-item:last-child {
        border-right: none;
      }

      .res-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .res-bar-wrap {
        height: 5px;
        background: var(--sv-bg-input);
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
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
      }
      .kiosk-toggle-btn:hover {
        color: var(--sv-text-primary);
      }
      .kiosk-toggle-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      /* ── Device picker ──────────────────────────────────── */

      .picker {
        padding: 40px 28px;
        background: var(--sv-bg-base);
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
        color: var(--sv-text-primary);
        letter-spacing: 0.06em;
      }
      .picker-sub {
        font-size: 12px;
        color: var(--sv-text-secondary);
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .picker-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 16px 32px;
        border: 1px solid var(--sv-text-secondary);
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
        border-color: var(--sv-accent);
        background: var(--sv-gauge-track);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }

      .picker-name {
        font-size: 16px;
        color: var(--sv-text-primary);
      }
      .picker-id {
        font-size: 12px;
        color: var(--sv-text-secondary);
      }
      .picker-empty {
        font-size: 14px;
        color: var(--sv-text-secondary);
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
        background: var(--sv-bg-base);
        border: 1px solid var(--sv-border);
        border-radius: 5px;
        color: var(--sv-text-primary);
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
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .group-no-scenes {
        font-size: 11px;
        color: var(--sv-text-secondary);
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
        color: var(--sv-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }
      .grp-light-row.on .grp-light-name {
        color: var(--sv-text-heading);
      }

      .grp-light-grip {
        flex-shrink: 0;
        --mdc-icon-size: 16px;
        color: rgba(92,172,255,0.5);
        cursor: grab;
      }

      .grp-light-bar-wrap {
        height: 3px;
        background: var(--sv-bg-base);
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
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
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
        color: var(--sv-text-secondary);
        margin-top: 4px;
      }

      .group-lights-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .group-light-chip {
        background: var(--sv-bg-base);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-secondary);
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        transition: all 0.15s;
      }

      .group-light-chip.on {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
        background: var(--sv-accent-muted);
      }

      .group-edit-hint {
        font-size: 11px;
        color: var(--sv-text-secondary);
        font-style: italic;
      }

      /* ── Setup mode ─────────────────────────────────────── */

      .setup-title {
        color: var(--sv-accent);
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
        background: var(--sv-accent);
        color: var(--sv-text-heading);
      }

      .setup-save-btn:hover {
        background: var(--sv-accent);
      }

      .setup-cancel-btn {
        background: var(--sv-bg-input);
        color: var(--sv-text-primary);
      }

      .setup-cancel-btn:hover {
        background: var(--sv-bg-elevated);
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
        color: var(--sv-text-secondary);
        margin-top: 4px;
      }

      .setup-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-label {
        font-size: 12px;
        color: var(--sv-text-primary);
        flex: 0 0 64px;
        white-space: nowrap;
      }

      /* Theme smartvanio-select to match the HMI dark palette */
      .setup-entity-select {
        flex: 1;
        min-width: 0;
        --primary-text-color: var(--sv-text-heading);
        --secondary-background-color: var(--sv-gauge-track);
        --divider-color: var(--sv-border);
        --primary-color: var(--sv-accent);
        --card-background-color: var(--sv-gauge-track);
      }

      .setup-name-input {
        flex: 0 0 90px;
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-heading);
        font-size: 13px;
        padding: 6px 8px;
        font-family: inherit;
        outline: none;
      }

      .setup-name-input:focus {
        border-color: var(--sv-accent);
      }

      .setup-del {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--sv-text-secondary);
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
        border: 1px dashed var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-secondary);
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
        border-color: var(--sv-accent);
        color: var(--sv-accent);
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
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        background: var(--sv-gauge-track);
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
        background: var(--sv-bg-elevated);
        border-radius: 2px;
      }

      .tab-content::-webkit-scrollbar-track,
      .lights::-webkit-scrollbar-track,
      .list::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Responsive: tablet ≤1400px ────────────────────── */

      @media (max-width: 1400px) {
        /* Shrink scene tiles */
        .sc-card {
          width: 110px;
          height: 60px;
          padding: 8px 10px;
          gap: 4px;
        }
        .sc-card-icon { --mdc-icon-size: 18px; }
        .sc-card-name { font-size: 11px; }
        .sc-dots { display: none; }

        /* Shrink climate gauge */
        .climate-svg { max-width: min(200px, 100%); }
        .panel-climate { gap: 8px; padding: 8px 12px 12px; }
        .climate-controls { max-width: min(200px, 100%); }
        .fan-btn, .mode-btn { padding: 6px 0; font-size: 10px; }
        .climate-control-label { font-size: 8px; margin: 2px 0 0; }

        /* Shrink level bubble */
        .bubble-lg { max-width: min(180px, 100%); }
        .panel-level { gap: 10px; padding: 8px 12px; }
        .lstat-val { font-size: 18px; }
        .lstat-label { font-size: 8px; }

        /* Light rows compact */
        .lp-row {
          gap: 8px;
        }
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
