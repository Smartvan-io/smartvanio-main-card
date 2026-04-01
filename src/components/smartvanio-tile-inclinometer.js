import {
  LitElement,
  html,
  css,
} from "lit";
import {} from "../smartvanio-shared.js";

class VanCtlTileInclinometer extends LitElement {
  static get properties() {
    return {
      pitch: { type: Number },
      roll:  { type: Number },
    };
  }

  constructor() {
    super();
    this.pitch = 0;
    this.roll = 0;
  }

  render() {
    const pitchVal = isNaN(this.pitch) ? 0 : this.pitch;
    const rollVal  = isNaN(this.roll)  ? 0 : this.roll;

    // Arena geometry (px)
    const ARENA_R  = 44;
    const BUBBLE_R = 10;
    const MAX_DEG  = 15; // degrees that map to the edge of the arena

    const maxOffset = ARENA_R - BUBBLE_R;
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    // Roll right → bubble moves right; pitch nose-up → bubble moves up
    const bx = clamp(rollVal  / MAX_DEG) * maxOffset;
    const by = clamp(-pitchVal / MAX_DEG) * maxOffset;

    const totalTilt = Math.sqrt(pitchVal ** 2 + rollVal ** 2);
    const statusColor =
      totalTilt < 1.5
        ? "var(--success-color, #4caf50)"
        : totalTilt < 5
          ? "var(--warning-color, #ff9800)"
          : "var(--error-color, #f44336)";
    const isLevel = totalTilt < 1.5;

    const fmt = (v) => {
      if (isNaN(v)) return "—";
      const sign = v >= 0 ? "+" : "";
      return `${sign}${v.toFixed(1)}°`;
    };

    return html`
      <div class="level-tile">
        <div class="level-arena" style="--lvl-status:${statusColor}">
          <div class="level-crosshair-h"></div>
          <div class="level-crosshair-v"></div>
          <div
            class="level-bubble"
            style="transform:translate(${bx}px,${by}px);background:${statusColor}"
          ></div>
        </div>
        <div class="level-readouts">
          <div class="level-row">
            <ha-icon icon="mdi:swap-vertical" class="level-icon"></ha-icon>
            <span class="level-label">Pitch</span>
            <span class="level-value" style="color:${statusColor}">${fmt(pitchVal)}</span>
          </div>
          <div class="level-row">
            <ha-icon icon="mdi:swap-horizontal" class="level-icon"></ha-icon>
            <span class="level-label">Roll</span>
            <span class="level-value" style="color:${statusColor}">${fmt(rollVal)}</span>
          </div>
          <div class="level-status" style="color:${statusColor}">
            <ha-icon icon="${isLevel ? "mdi:check-circle" : "mdi:alert-circle"}"></ha-icon>
            ${isLevel ? "Level" : "Off level"}
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; }

      .level-tile {
        display: flex;
        align-items: center;
        gap: 24px;
        background: var(--tile-bg, var(--card-background-color, #fff));
        border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
        border-radius: 12px;
        padding: 16px 20px;
      }

      .level-arena {
        position: relative;
        width: 88px;
        height: 88px;
        border-radius: 50%;
        background: var(--secondary-background-color, #f5f5f5);
        border: 2px solid var(--lvl-status, var(--divider-color));
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.4s ease;
      }

      .level-crosshair-h,
      .level-crosshair-v {
        position: absolute;
        background: rgba(0, 0, 0, 0.1);
        pointer-events: none;
      }
      .level-crosshair-h {
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        transform: translateY(-50%);
      }
      .level-crosshair-v {
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
        transform: translateX(-50%);
      }

      .level-bubble {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: -10px 0 0 -10px;
        opacity: 0.9;
        transition:
          transform 0.5s ease,
          background 0.4s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .level-readouts {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .level-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .level-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .level-label {
        font-size: 13px;
        color: var(--secondary-text-color);
        flex: 1;
      }

      .level-value {
        font-size: 16px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        transition: color 0.4s ease;
      }

      .level-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        margin-top: 2px;
        transition: color 0.4s ease;
      }
      .level-status ha-icon {
        --mdc-icon-size: 16px;
      }
    `;
  }
}

customElements.define("smartvanio-tile-inclinometer", VanCtlTileInclinometer);
