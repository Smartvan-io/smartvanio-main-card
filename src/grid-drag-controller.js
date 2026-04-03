/**
 * GridDragController — Lit ReactiveController for grid tile dragging.
 *
 * Pointer-event based, works on touch + mouse.
 * The host must implement:
 *   - host.onTileDragMove(itemId, col, row)   → called during drag
 *   - host.onTileDragEnd(itemId, col, row)    → called on drop
 *   - host.onTileTap(itemId)                  → called on short tap (no drag)
 *   - host.shadowRoot                          → for DOM queries
 *   - host._gridCellW                          → cell size in px
 *   - host._gridCols                           → number of columns
 *   - host.requestUpdate()                     → trigger re-render
 */

export class GridDragController {
  /** @param {import('lit').LitElement} host */
  constructor(host) {
    this.host = host;
    host.addController(this);

    this.dragging = false;
    this.itemId = null;
    this.w = 1;
    this.h = 1;
    this.previewCol = 0;
    this.previewRow = 0;

    // Internal state
    this._tileEl = null;
    this._ghostEl = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._gridRect = null;
    this._gridPadLeft = 16;
    this._gridPadTop = 12;
    this._scrollEl = null;
    this._scrollRAF = null;
    this._pointerId = null;

    // Drag threshold state
    this._pending = false;
    this._startX = 0;
    this._startY = 0;
    this._dragThreshold = 8; // px movement before drag activates

    // Bind handlers once
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  // ── Lifecycle ────────────────────────────────────────────

  hostConnected() {}
  hostDisconnected() {
    this._cleanup();
  }

  // ── Public: start drag from a pointerdown on [data-drag-handle] ──

  /**
   * Call from the grid's pointerdown handler.
   * Returns true if drag started, false if event wasn't on a handle.
   */
  start(e) {
    // Don't drag from interactive elements (buttons, inputs, etc.)
    if (e.target.closest("button, input, select, .resize-btn")) return false;

    const tileEl = e.target.closest(".grid-tile");
    if (!tileEl) return false;

    const itemId = tileEl.dataset.tileId;
    if (!itemId) return false;

    e.preventDefault();

    const gridEl = this.host.shadowRoot.querySelector(".unified-grid");
    if (!gridEl) return false;

    const tileRect = tileEl.getBoundingClientRect();

    // Store pending state — don't start actual drag yet
    this._pending = true;
    this._startX = e.clientX;
    this._startY = e.clientY;
    this.itemId = itemId;
    this.w = parseInt(tileEl.dataset.tileW, 10) || 1;
    this.h = parseInt(tileEl.dataset.tileH, 10) || 1;
    this._tileEl = tileEl;
    this._scrollEl = gridEl;
    this._pointerId = e.pointerId;
    this._offsetX = e.clientX - tileRect.left;
    this._offsetY = e.clientY - tileRect.top;

    // Capture pointer on the grid so we get move/up even outside
    gridEl.setPointerCapture(e.pointerId);
    gridEl.addEventListener("pointermove", this._onPointerMove);
    gridEl.addEventListener("pointerup", this._onPointerUp);
    gridEl.addEventListener("pointercancel", this._onPointerUp);

    return true;
  }

  // ── Actually begin the visual drag ──────────────────────

  _beginDrag() {
    this._pending = false;
    this.dragging = true;

    const gridEl = this._scrollEl;
    const tileEl = this._tileEl;
    if (!gridEl || !tileEl) return;

    const tileRect = tileEl.getBoundingClientRect();
    this._gridRect = gridEl.getBoundingClientRect();

    // Compute initial preview position from the tile's current grid placement
    this.previewCol = parseInt(tileEl.dataset.tileCol, 10) || 0;
    this.previewRow = parseInt(tileEl.dataset.tileRow, 10) || 0;

    // Create ghost (clone of tile, fixed-position)
    this._createGhost(tileEl, tileRect);

    // Hide the original tile in the grid
    tileEl.style.opacity = "0";
    tileEl.style.pointerEvents = "none";

    this.host.requestUpdate();
  }

  // ── Pointer handlers ─────────────────────────────────────

  _onPointerMove(e) {
    if (this._pending) {
      const dx = e.clientX - this._startX;
      const dy = e.clientY - this._startY;
      if (Math.sqrt(dx * dx + dy * dy) >= this._dragThreshold) {
        this._beginDrag();
      } else {
        return; // Haven't moved enough yet
      }
    }

    if (!this.dragging) return;

    // Move ghost
    if (this._ghostEl) {
      this._ghostEl.style.left = `${e.clientX - this._offsetX}px`;
      this._ghostEl.style.top = `${e.clientY - this._offsetY}px`;
    }

    // Compute which grid cell the tile's TOP-LEFT corner is over
    // (not the cursor — the cursor may be anywhere inside the tile)
    const cellW = this.host._gridCellW || 80;
    const gap = this.host._gridGap || 12;
    const gridEl = this._scrollEl;
    const scrollTop = gridEl?.scrollTop || 0;
    // Always use fresh grid rect — it can shift during scroll
    const gridRect = gridEl?.getBoundingClientRect() ?? this._gridRect;

    // Tile top-left in grid-content coords
    const tileLeft = e.clientX - this._offsetX;
    const tileTop = e.clientY - this._offsetY;
    const relX = tileLeft - gridRect.left - this._gridPadLeft;
    const relY = tileTop - gridRect.top - this._gridPadTop + scrollTop;

    const col = Math.max(
      0,
      Math.min(
        this.host._gridCols - this.w,
        Math.round(relX / (cellW + gap))
      )
    );
    const row = Math.max(0, Math.round(relY / (cellW + gap)));

    if (col !== this.previewCol || row !== this.previewRow) {
      this.previewCol = col;
      this.previewRow = row;
      this.host.onTileDragMove(this.itemId, col, row);
    }

    // Auto-scroll
    this._autoScroll(e);
  }

  _onPointerUp(e) {
    if (this._pending) {
      // Pointer released before drag threshold — this is a tap
      this._pending = false;
      if (this.host.onTileTap) {
        this.host.onTileTap(this.itemId);
      }
      this._cleanup();
      return;
    }

    if (!this.dragging) return;

    this.host.onTileDragEnd(this.itemId, this.previewCol, this.previewRow);
    this._cleanup();
    this.host.requestUpdate();
  }

  // ── Ghost element ────────────────────────────────────────

  _createGhost(tileEl, rect) {
    const ghost = tileEl.cloneNode(true);
    ghost.classList.add("drag-ghost");
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      z-index: 10000;
      opacity: 0.85;
      pointer-events: none;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      border-radius: 16px;
      transition: none;
      animation: none;
    `;
    this.host.shadowRoot.appendChild(ghost);
    this._ghostEl = ghost;
  }

  // ── Auto-scroll ──────────────────────────────────────────

  _autoScroll(e) {
    if (this._scrollRAF) cancelAnimationFrame(this._scrollRAF);

    const el = this._scrollEl;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const threshold = 40;
    const maxSpeed = 10;
    let speed = 0;

    if (e.clientY > rect.bottom - threshold) {
      speed = maxSpeed * ((e.clientY - (rect.bottom - threshold)) / threshold);
    } else if (e.clientY < rect.top + threshold) {
      speed =
        -maxSpeed * (((rect.top + threshold) - e.clientY) / threshold);
    }

    if (Math.abs(speed) > 0.5) {
      const scroll = () => {
        el.scrollTop += speed;
        this._gridRect = el.getBoundingClientRect();
        if (this.dragging) {
          this._scrollRAF = requestAnimationFrame(scroll);
        }
      };
      this._scrollRAF = requestAnimationFrame(scroll);
    }
  }

  // ── Cleanup ──────────────────────────────────────────────

  _cleanup() {
    this._pending = false;

    if (this._scrollRAF) {
      cancelAnimationFrame(this._scrollRAF);
      this._scrollRAF = null;
    }

    if (this._ghostEl) {
      this._ghostEl.remove();
      this._ghostEl = null;
    }

    if (this._tileEl) {
      this._tileEl.style.opacity = "";
      this._tileEl.style.pointerEvents = "";
      this._tileEl = null;
    }

    const gridEl = this.host.shadowRoot?.querySelector(".unified-grid");
    if (gridEl && this._pointerId != null) {
      try {
        gridEl.releasePointerCapture(this._pointerId);
      } catch (_) {}
      gridEl.removeEventListener("pointermove", this._onPointerMove);
      gridEl.removeEventListener("pointerup", this._onPointerUp);
      gridEl.removeEventListener("pointercancel", this._onPointerUp);
    }

    this.dragging = false;
    this.itemId = null;
    this._pointerId = null;
  }
}
