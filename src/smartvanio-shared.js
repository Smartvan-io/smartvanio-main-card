/**
 * VanCtl Shared — constants, helpers, and shared CSS used across all components.
 */

import { css } from "lit";

export const COLOR_PRESETS = [
  { name: "Warm", r: 255, g: 180, b: 107 },
  { name: "Cool", r: 200, g: 220, b: 255 },
  { name: "White", r: 255, g: 255, b: 255 },
  { name: "Red", r: 255, g: 50, b: 50 },
  { name: "Blue", r: 50, g: 100, b: 255 },
  { name: "Green", r: 50, g: 200, b: 80 },
];

// Tank sensor definitions — matched by keyword in entity_id
export const TANK_KEYWORDS = [
  {
    keyword: "water",
    label: "Water",
    icon: "mdi:water",
    color: "#2196F3",
    warnBelow: 25,
  },
  {
    keyword: "gas",
    label: "Gas",
    icon: "mdi:gas-cylinder",
    color: "#FF9800",
    warnBelow: 20,
  },
  {
    keyword: "waste",
    label: "Waste",
    icon: "mdi:delete-empty",
    color: "#78909C",
    warnAbove: 75,
  },
];

export function tankDef(entity_id, fallbackLabel) {
  return (
    TANK_KEYWORDS.find((t) => entity_id.includes(t.keyword)) ?? {
      label: fallbackLabel,
      icon: "mdi:gauge",
      color: "var(--primary-color)",
    }
  );
}

export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function formatRelativeTime(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const m = Math.floor(diffMs / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return "—"; }
}

// Fills gaps between user-defined segments with auto segments covering unclaimed LEDs.
export function computeSegmentsWithGaps(userSegs, maxLeds, parentEntityId) {
  if (!maxLeds || maxLeds <= 0 || !userSegs.length) return userSegs;
  const sorted = [...userSegs].sort((a, b) => a.start - b.start);
  const result = [];
  let pos = 0;
  for (const seg of sorted) {
    const segStart = Math.max(0, seg.start ?? 0);
    if (segStart > pos) {
      result.push({
        id: `auto_${pos}_${segStart - 1}`,
        name: `LEDs ${pos}–${segStart - 1}`,
        start: pos,
        end: segStart - 1,
        r: 255, g: 255, b: 255,
        brightness: 100,
        auto: true,
        parent_entity_id: parentEntityId,
      });
    }
    result.push({ ...seg, auto: false });
    pos = Math.max(pos, (seg.end ?? 0) + 1);
  }
  if (pos < maxLeds) {
    result.push({
      id: `auto_${pos}_${maxLeds - 1}`,
      name: `LEDs ${pos}–${maxLeds - 1}`,
      start: pos,
      end: maxLeds - 1,
      r: 255, g: 255, b: 255,
      brightness: 100,
      auto: true,
      parent_entity_id: parentEntityId,
    });
  }
  return result;
}

export function isButtonEntity(hass, entity_id) {
  return (
    entity_id.startsWith("binary_sensor.") &&
    !hass.states[entity_id]?.attributes?.device_class
  );
}

export function isTankEntity(entity_id) {
  if (!entity_id.startsWith("sensor.")) return false;
  if (
    entity_id.endsWith("_voltage") ||
    entity_id.endsWith("_config") ||
    entity_id.endsWith("_kind")
  )
    return false;
  return TANK_KEYWORDS.some((t) => entity_id.includes(t.keyword));
}

export function tankVoltageEntityId(entity_id) {
  return entity_id + "_voltage";
}

export function tankConfigEntityId(entity_id) {
  return entity_id + "_config";
}

// Shared tile CSS used by multiple tile components
export const sharedTileStyles = css`
  .toggle {
    width: 44px;
    height: 26px;
    border-radius: 13px;
    background: var(--disabled-color, #bdbdbd);
    position: relative;
    flex-shrink: 0;
    transition: background 0.25s;
  }

  .toggle.on {
    background: var(--primary-color, #03a9f4);
  }

  .toggle-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: transform 0.25s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle.on .toggle-dot {
    transform: translateX(18px);
  }

  .tile-edit-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .br-slider {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }

  .br-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--sc, var(--primary-color));
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .br-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--sc, var(--primary-color));
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .editable {
    cursor: pointer;
    border-color: color-mix(in srgb, var(--primary-color) 40%, transparent) !important;
    border-style: dashed !important;
  }

  .editable:hover {
    border-color: var(--primary-color) !important;
  }
`;
