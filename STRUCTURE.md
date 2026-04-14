# SmartVan.io Dashboard Card — Structure Reference

This document defines how every area of the dashboard behaves, what entities it consumes, and what interactions are available. It mirrors the visual layout of the card.

---

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
│  Greeting · Stats · Time · Theme · Devices · Layout · Setup     │
├─────────────────────────────────────────────────────────────────┤
│  SCENE CAROUSEL                                                 │
│  [Scene 1] [Scene 2] [Scene 3] [+ Add]                         │
├───────────────────────┬─────────────────────────────────────────┤
│  LEFT PANEL           │  RIGHT PANEL (swipeable)                │
│                       │  ┌─────────┬─────────┬──────────┐      │
│  Lights List          │  │ Climate │  Level  │ Overview │      │
│  - Light rows         │  │  (1/3)  │  (2/3)  │  (3/3)   │      │
│  - Brightness bars    │  └─────────┴─────────┴──────────┘      │
│  - Color pickers      │  · · · (pagination dots)               │
│  - Pattern presets    │                                         │
│                       │                                         │
├───────────────────────┴─────────────────────────────────────────┤
│  RESOURCE BAR                                                   │
│  [Water 75%] [Gas 50%] [Battery 82%] ··· [Switch] [Switch] [HA]│
└─────────────────────────────────────────────────────────────────┘
```

---

## Top Bar

**Render:** inline in `render()` | **CSS:** `.top-bar`

| Element | CSS | Content |
|---------|-----|---------|
| Greeting | `.tb-greeting` | "Good Morning/Afternoon/Evening" (time-based) |
| Stats strip | `.tb-stats` | Configurable stat chips |
| Time | `.tb-time` | HH:MM, updated every minute |
| Theme toggle | `.tb-cfg` | Sun/moon icon, toggles dark/light |
| Devices button | `.tb-cfg` | Grid icon, opens devices page |
| Layout button | `.tb-cfg` | Sort icon, enters layout reorder mode |
| Setup button | `.tb-cfg` | Cog icon, enters setup mode |

### Stats Strip

**Entity types:** `sensor`, `number`, `binary_sensor`

**Config source:** `slots.topbarStats[]` — array of `{ entity, name, icon }`

**Fallback:** If no topbarStats configured, auto-detects battery voltage, water tank %, waste tank %, cabin temperature from discovered entities.

| Mode | Interaction |
|------|-------------|
| Normal | Read-only display |
| Setup | Tap stat → opens footer modal (type: `stat`) |
| Setup | Tap + button → opens new footer modal (type: `stat`) |

### Stats — Footer Modal (type: `stat`)

| Field | Input | Required |
|-------|-------|----------|
| Entity | Entity picker (`sensor`, `number`, `binary_sensor`) | Yes |
| Label | Text input | No (falls back to entity name) |
| Icon | Icon picker | No |

---

## Scene Carousel

**Render:** `_renderSceneCarousel()` | **CSS:** `.sc-hero`, `.sc-carousel`, `.sc-card`

**Entity types:** `scene.*`, `script.*`

**Config source:** `slots.sceneOrder[]` (order), `slots.hiddenScenes[]` (visibility)

Each card displays:
- Scene/script icon
- Name
- Color dots (RGB samples from scene's light entities)
- Gradient background derived from scene's light colors

| Mode | Interaction | Result |
|------|-------------|--------|
| Normal | Tap | Execute scene/script |
| Normal | Long-press (500ms) | Open scene editor modal |
| Normal | Right-click | Open scene editor modal |
| Layout | Drag | Reorder scenes |
| Layout | Eye icon | Toggle visibility |
| Setup | Tap "Add" | Open new scene modal |

### Scene Editor Modal

**Component:** `smartvanio-modal-scene`

| Field | Input |
|-------|-------|
| Scene name | Text input |
| Lights | Add/remove lights to scene |
| Per-light: brightness | Range slider |
| Per-light: RGB color | Color picker (if RGB-capable) |
| Per-light: effect | Dropdown (if effects supported) |
| Capture button | Snapshot current light states |

**Actions:** Save (persists via MQTT), Delete (existing scenes), Cancel

---

## Left Panel — Lights List

**Render:** `_renderLightsPanel()` | **CSS:** `.lp-panel`, `.lp-list`, `.lp-row`

**Entity types:** `light.*`

**Config source:** `slots.lightOrder[]` (order), `slots.hiddenLights[]` (visibility), `slots.lights[]` (manual entity list)

Each light row displays:
- Icon (colored by current RGB state, or accent when on, muted when off)
- Name + type label ("Segment" / "Strip" / "External")
- Brightness % or "Off" or "Unavailable"
- Power toggle button

### Expanded Controls (tap to expand)

| Control | CSS | Behavior |
|---------|-----|----------|
| Brightness bar | `.lp-bri-bar-wrap` | Drag to set brightness (0-255), real-time service call |
| Color wheel | `.lp-color-wheel` | Drag to pick RGB, real-time service call |
| Preset swatches | `.lp-presets` | Tap to apply preset RGB value |
| Pattern swatches | `.lp-patterns` | Tap to set light effect |

### Interactions

| Mode | Interaction | Result |
|------|-------------|--------|
| Normal | Tap row | Expand/collapse controls |
| Normal | Power button | Toggle light on/off |
| Normal | Long-press (500ms) | Open edit modal |
| Layout | Drag handle | Reorder lights |
| Layout | Eye icon | Toggle visibility |
| Layout | Trash icon | Remove light (non-SmartVan.io only) |

### Light — Edit Modal

**Component:** `smartvanio-modal-edit`

**Layout:** Two-column

**Left column:**

| Field | Input | Condition |
|-------|-------|-----------|
| Display Name | Text input | Always |
| Area | Area picker dropdown | Always |
| LED Segments | Segment editor (tabs: Segments / Patterns) | SmartVan.io lights only |

**LED Segment fields (per segment):**

| Field | Input |
|-------|-------|
| Segment name | Text input |
| Start LED | Number input |
| End LED | Number input |
| Color | Color picker |
| Brightness | Range slider |

**Right column:**

| Field | Input |
|-------|-------|
| Automations | Add/remove automation rows |

**Automation row fields:**

| Field | Input | Notes |
|-------|-------|-------|
| Source entity | Entity picker (`binary_sensor`, `button`, `switch`) | Trigger source |
| Gesture | Select (press, double_press, hold, off_to_on, on_to_off) | Options vary by source domain |
| Target entity | Entity picker (`light`, `switch`, `fan`, `scene`, `cover`, `lock`) | Action target |
| Action | Select (toggle, turn_on, turn_off, turn_on_for, set_brightness) | Options vary by target domain |
| Duration | Number input (minutes) | Only when action = `turn_on_for` |
| Brightness % | Range slider | Only when action = `set_brightness` |

**Actions:** Save, Cancel

---

## Right Panel — Swiper

**Render:** `_renderRightPanel()` | **CSS:** `.rp-swiper`

Three swipeable slides with pagination dots. Swiper touch is disabled during climate ring drag.

---

### Slide 1: Climate Panel

**Render:** `_renderClimatePanel()` | **CSS:** `.panel-climate`, `.climate-svg`

**Entity resolution (priority order):**
1. Slot-configured entities (`slots.temperature`, `slots.target_temp`, etc.)
2. Truma device channel lookup via `_entityByChannel("ESP32 Truma Heater Controller", ...)`
3. No fallback — entities must be configured or discoverable

| Entity | Domain | Channel (Truma) | Slot key | Purpose |
|--------|--------|-----------------|----------|---------|
| Current cabin temp | `sensor` | `current_room_temperature` | `temperature` | Large center display |
| Target setpoint | `number` | `room_temperature_setpoint` | `target_temp` | Draggable arc ring |
| Fan mode | `select` | `fan_mode` | `fan_speed` | Fan speed buttons |
| Water mode | `select` | `water_mode` | `water_mode` | Water temp buttons |
| Heating active | `binary_sensor` | `heating_active` | `heating_active` | Status indicator |

**SVG Gauge:**
- Outer arc: Heating status (amber when active)
- Inner arc: Target temperature (accent-colored, draggable)
- Center: Current temperature (large text)
- Tick marks at temperature intervals

**Temperature range:** Read from `number` entity attributes (`min`, `max`, `step`). Defaults to 0–30 if unavailable.

| Control | Behavior |
|---------|----------|
| Drag temperature ring | Sets target temp, calls `number.set_value` on pointer up. Disables Swiper during drag. |
| Fan buttons (Off/Eco/High) | Calls `select.select_option` on fan_mode entity |
| Water buttons (Off/Eco/Hot) | Calls `select.select_option` on water_mode entity |

### Setup: Climate

**Render:** `_renderSetupClimate()` | **CSS:** `.setup-panel`

Entity picker rows for each climate entity (cabin temp, target setpoint, fan mode, water mode, heating active).

---

### Slide 2: Level Panel

**Render:** `_renderLevelPanel()` | **CSS:** `.panel-level`, `.bubble-lg`

**Entity types:** `sensor` (pitch, roll)

**Config source:** `slots.pitch`, `slots.roll`

| Display | Content |
|---------|---------|
| SVG bubble | Circular arena, bubble position = pitch/roll values |
| Bubble color | Green (<1.5), Amber (1.5–5), Red (>5) |
| Stats cards | Pitch , Roll , Status (Level/Tilted) |

**Interactions:** Read-only. No modals.

### Setup: Level

Entity picker rows for pitch and roll sensors.

---

### Slide 3: Overview Panel

**Render:** `_renderOverviewPanel()` | **CSS:** `.ov-panel`, `.ov-grid`, `.ov-card`

**Grid of summary cards:**

| Card | Content | Interaction |
|------|---------|-------------|
| Area cards (per light area) | Area name, "X/Y on" status | Tap → toggle all lights in area |
| Power card | SoC %, current draw, time remaining, voltage | Read-only |
| Weather card | Temperature + condition + icon | Read-only |

---

## Resource Bar (Footer)

**Render:** `_renderFooter()` | **CSS:** `.ft-bar`, `.ft-tanks`, `.ft-right`

### Left: Tank & Power Gauges

**CSS:** `.ft-tank`

**Entity types:** `sensor`, `number`

**Config source:** `slots.resources[]` (tanks), `slots.power` (battery)

**Auto-discovery fallback:** Detects entities matching `/water_tank$/`, `/gas_tank$/`, `/waste_tank$/`

Each gauge displays:
- Icon (configurable color)
- Label
- Percentage value
- Fill bar (colored)

**Battery gauge** additionally shows voltage as subscript.

| Mode | Interaction | Result |
|------|-------------|--------|
| Normal | Long-press (500ms) tank | Open edit modal for tank sensor entity |
| Normal | Long-press (500ms) battery | Open edit modal for SoC entity (or voltage fallback) |
| Setup | Tap tank | Open footer modal (type: `tank`) |
| Setup | Tap battery | Open footer modal (type: `power`) |
| Setup | Tap + | Menu: add Tank or Power |

### Tank — Footer Modal (type: `tank`)

| Field | Input | Required |
|-------|-------|----------|
| Entity | Entity picker (`sensor`, `number`) | Yes |
| Label | Text input | No |
| Color | Color picker | No (default: accent blue) |
| Icon | Icon picker | No (default: `mdi:gauge`) |

### Power — Footer Modal (type: `power`)

| Field | Input | Required |
|-------|-------|----------|
| State of Charge | Entity picker (`sensor`, `number`) | At least one field |
| Voltage | Entity picker (`sensor`, `number`) | |
| Current Consumption | Entity picker (`sensor`, `number`) | |
| Time Left | Entity picker (`sensor`, `number`) | |

### Tank / Battery — Edit Modal (long-press)

Opens `smartvanio-modal-edit` for the sensor entity.

**Layout:** Two-column

**Left column:**
- Display Name
- Area

**Right column:**
- Automations (add/remove rows — same fields as light automations)

---

### Right: Pinned Switches

**CSS:** `.ft-sw`

**Entity types:** `switch`, `light`, `input_boolean`, `button`, `script`

**Config source:** `slots.footerSwitches[]` — array of `{ entity, name, color, icon }`

Each switch displays:
- Toggle knob or custom icon
- Label
- On/off state coloring

| Mode | Interaction | Result |
|------|-------------|--------|
| Normal | Tap | Toggle entity on/off |
| Setup | Tap | Open footer modal (type: `switch`) |
| Setup | Tap + | Open new footer modal (type: `switch`) |

### Switch — Footer Modal (type: `switch`)

**Layout:** Two-column (when editing existing)

**Left column:**

| Field | Input | Required |
|-------|-------|----------|
| Entity | Entity picker (`switch`, `light`, `script`, `button`, `input_boolean`) | Yes |
| Label | Text input | No |
| Color | Color picker | No |
| Icon | Icon picker | No |

**Right column (existing only):**
- Automations (same fields as light automations)

### HA Button

**CSS:** `.ft-ha-btn`

Tap → toggles Home Assistant sidebar visibility (kiosk mode).

---

## Devices Page

**Render:** `_renderDevicesPage()` | **CSS:** `.dev-page`, `.dev-grid`, `.dev-card`

Accessed via the grid icon in the top bar. Replaces main content.

**One card per SmartVan.io MQTT device** (`_knownDevices`):

| Element | Content |
|---------|---------|
| Status dot | Green (online), Red (offline), Grey (unknown) |
| Device name | From MQTT config payload |
| Model + firmware | Device metadata |
| Entity count | "X entities · Y in card · Z unused" |
| Config button | Opens device modal |
| Link button | Opens HA device page in new tab |

### Device Modal

**Component:** `smartvanio-modal-device`

Shows all entities for the device, split into "in card" and "unused". Add/remove entities from the dashboard.

---

## Setup Mode

Entered via the cog icon in the top bar. Replaces the left panel with a tab bar.

**Render:** `_renderTabBar()` → `_renderLeftPanel()` dispatches to setup renderers

### Tabs

| Tab | Render Method | Purpose |
|-----|---------------|---------|
| Climate | `_renderSetupClimate()` | Entity pickers for climate entities |
| Scenes | `_renderScenesPanel()` (setup variant) | Scene list with edit buttons |
| Actions | `_renderActionsPanel()` (setup variant) | Automation list with delete buttons |
| Level | `_renderSetupLevel()` | Entity pickers for pitch/roll |
| Status | `_renderSetupStatus()` | Add/remove status sensor entities |

### Save / Cancel

- **Save:** Publishes slot config to `smartvanio/{device_id}/hmi_config` (retained MQTT)
- **Cancel:** Discards `_pendingSlots`, exits setup mode

---

## Layout Mode

Entered via the sort icon in the top bar. Modifies scene carousel and lights list.

| Area | Behavior |
|------|----------|
| Scene carousel | Cards become draggable. Eye icon toggles visibility. |
| Lights list | Rows get drag handles. Eye icon toggles visibility. Trash icon removes non-SmartVan.io lights. Add Light button appears. |

### Add Light Modal

| Field | Input | Required |
|-------|-------|----------|
| Entity | Entity picker (`light`) | Yes |
| Label | Text input | No |

---

## Slot Configuration Reference

All dashboard configuration is stored in `slots` (persisted to MQTT as `hmi_config`).

| Slot key | Type | Purpose |
|----------|------|---------|
| `temperature` | `string` (entity_id) | Climate: cabin temp sensor |
| `target_temp` | `string` | Climate: target setpoint number |
| `fan_speed` | `string` | Climate: fan mode select |
| `water_mode` | `string` | Climate: water mode select |
| `heating_active` | `string` | Climate: heating binary_sensor |
| `pitch` | `string` | Level: pitch sensor |
| `roll` | `string` | Level: roll sensor |
| `lights` | `array` of `{ entity, name, area }` | Manual light list |
| `lightOrder` | `array` of entity_ids | Light display order |
| `hiddenLights` | `array` of entity_ids | Hidden light entity_ids |
| `resources` | `array` of `{ entity, name, color, icon }` | Tank/resource gauges |
| `power` | `{ soc, voltage, current, time_left }` | Battery entity mapping |
| `footerSwitches` | `array` of `{ entity, name, color, icon }` | Pinned footer switches |
| `topbarStats` | `array` of `{ entity, name, icon }` | Top bar stat chips |
| `groups` | `array` of `{ id, name, lights, scenes }` | Light groups |
| `sceneOrder` | `array` of entity_ids | Scene display order |
| `hiddenScenes` | `array` of entity_ids | Hidden scene entity_ids |
| `status_sensors` | `array` of entity_ids | Status tab sensors |
| `tileOrder` | `array` of item_ids | Grid tile order |
| `layouts` | `object` | Per-screen grid layouts |

---

## Modal Behaviour Summary

| Trigger | Entity types | Modal | Layout | Left column | Right column |
|---------|-------------|-------|--------|-------------|--------------|
| Long-press light | `light.*` | `smartvanio-modal-edit` | Two-col | Name, Area, LED Segments | Automations |
| Long-press switch tile | `switch.*` | `smartvanio-modal-edit` | Two-col | Name, Area | Automations |
| Long-press button tile | `binary_sensor.*`, `button.*` | `smartvanio-modal-edit` | Two-col | Name, Area | Automations |
| Long-press tank gauge | `sensor.*` | `smartvanio-modal-edit` | Two-col | Name, Area | Automations |
| Long-press battery gauge | `sensor.*` / `number.*` | `smartvanio-modal-edit` | Two-col | Name, Area | Automations |
| Long-press / right-click scene | `scene.*` | `smartvanio-modal-scene` | Single | Scene name, lights, capture | — |
| Setup: tap tank gauge | `sensor.*` | Footer modal (tank) | Single | Entity, Label, Color, Icon | — |
| Setup: tap battery gauge | — | Footer modal (power) | Single | SoC, Voltage, Current, Time Left | — |
| Setup: tap footer switch | `switch.*` etc | Footer modal (switch) | Two-col | Entity, Label, Color, Icon | Automations |
| Setup: tap top bar stat | `sensor.*` etc | Footer modal (stat) | Single | Entity, Label, Icon | — |
| Devices: tap config | — | `smartvanio-modal-device` | Single | Entity add/remove list | — |
| Layout: tap Add Light | `light.*` | Light modal | Single | Entity, Label | — |
