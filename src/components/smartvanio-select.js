import {
  LitElement,
  html,
  css,
} from "lit";
// smartvanio-shared import kept for consistency even though nothing is used here
import {} from "../smartvanio-shared.js";

// ─── Reusable select component ─────────────────────────────────────────────────
//
// Usage:
//   <smartvanio-select
//     .value=${currentValue}
//     .options=${[{value, label}, ...] or [{groupLabel, options:[{value,label}]}, ...]}
//     placeholder="— Choose —"
//     variant="default|add"
//     @smartvanio-change=${(e) => handler(e.detail.value)}
//   ></smartvanio-select>

class VanCtlSelect extends LitElement {
  static get properties() {
    return {
      value:       { type: String },
      options:     { type: Array },
      placeholder: { type: String },
      variant:     { type: String }, // "default" | "add"
      disabled:    { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = "";
    this.options = [];
    this.placeholder = undefined;
    this.variant = "default";
  }

  _onChange(e) {
    this.dispatchEvent(
      new CustomEvent("smartvanio-change", {
        detail: { value: e.target.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _option(o) {
    return html`<option value="${o.value}" ?selected=${this.value === o.value}>${o.label}</option>`;
  }

  render() {
    return html`
      <div class="wrap ${this.variant ?? "default"}">
        <select .value=${this.value ?? ""} ?disabled=${this.disabled} @change=${this._onChange}>
          ${this.placeholder !== undefined
            ? html`<option value="" ?selected=${!this.value}>${this.placeholder}</option>`
            : ""}
          ${(this.options ?? []).map((item) =>
            item.groupLabel !== undefined
              ? html`<optgroup label="${item.groupLabel}">${(item.options ?? []).map((o) => this._option(o))}</optgroup>`
              : this._option(item),
          )}
        </select>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; min-width: 0; }

      .wrap {
        position: relative;
        display: block;
      }

      /* custom chevron */
      .wrap::after {
        content: "";
        pointer-events: none;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--secondary-text-color, #888);
      }
      .wrap.add::after {
        border-top-color: var(--primary-color, #03a9f4);
      }

      select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100%;
        padding: 9px 32px 9px 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 14px;
        font-family: inherit;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      select:focus {
        border-color: var(--primary-color);
      }
      select:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .wrap.add select {
        border-style: dashed;
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color) 6%, var(--card-background-color, #fff));
        color: var(--primary-color);
        font-weight: 500;
      }
      .wrap.add select:focus {
        border-style: solid;
      }
    `;
  }
}

customElements.define("smartvanio-select", VanCtlSelect);
