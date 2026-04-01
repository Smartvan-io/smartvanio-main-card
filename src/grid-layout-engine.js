/**
 * Grid Layout Engine — pure functions for positioned grid layout.
 *
 * Each tile has a position { col, row, w, h } in grid-cell units.
 * Layout is an object: { [itemId]: { col, row, w, h } }
 */

// ── Occupancy helpers ──────────────────────────────────────

/**
 * Build a 2-D occupancy grid: occ[row][col] = itemId | null.
 */
export function rebuildOccupancy(layout, cols) {
  const occ = [];
  for (const [id, pos] of Object.entries(layout)) {
    for (let r = pos.row; r < pos.row + pos.h; r++) {
      if (!occ[r]) occ[r] = new Array(cols).fill(null);
      for (let c = pos.col; c < pos.col + pos.w; c++) {
        if (c < cols) occ[r][c] = id;
      }
    }
  }
  return occ;
}

/**
 * Check whether the rectangle (col, row, w, h) is free in the occupancy grid.
 */
function regionEmpty(occ, col, row, w, h, cols) {
  if (col + w > cols || col < 0) return false;
  for (let r = row; r < row + h; r++) {
    for (let c = col; c < col + w; c++) {
      if (occ[r]?.[c] != null) return false;
    }
  }
  return true;
}

/**
 * Mark cells occupied in the occupancy grid.
 */
function markOccupied(occ, col, row, w, h, id, cols) {
  for (let r = row; r < row + h; r++) {
    if (!occ[r]) occ[r] = new Array(cols).fill(null);
    for (let c = col; c < col + w; c++) {
      if (c < cols) occ[r][c] = id;
    }
  }
}

// ── First-fit packing ──────────────────────────────────────

/**
 * Find the first position where a (w x h) tile fits.
 */
export function findFirstFit(occ, cols, w, h) {
  for (let row = 0; row < 200; row++) {
    for (let col = 0; col <= cols - w; col++) {
      if (regionEmpty(occ, col, row, w, h, cols)) {
        return { col, row };
      }
    }
  }
  return { col: 0, row: 0 };
}

/**
 * Auto-pack items into a grid using first-fit placement.
 */
export function autoPackLayout(items, cols, tileSizeFn) {
  const layout = {};
  const occ = [];
  for (const item of items) {
    if (item.type === 'spacer') continue;
    const { w, h } = tileSizeFn(item);
    const pos = findFirstFit(occ, cols, w, h);
    layout[item.id] = { col: pos.col, row: pos.row, w, h };
    markOccupied(occ, pos.col, pos.row, w, h, item.id, cols);
  }
  return layout;
}

// ── Overlap / collision ────────────────────────────────────

function rectsOverlap(a, b) {
  return !(
    a.col + a.w <= b.col ||
    b.col + b.w <= a.col ||
    a.row + a.h <= b.row ||
    b.row + b.h <= a.row
  );
}

function findOverlapping(layout, placedId) {
  const p = layout[placedId];
  const result = [];
  for (const [id, pos] of Object.entries(layout)) {
    if (id === placedId) continue;
    if (rectsOverlap(p, pos)) result.push(id);
  }
  return result;
}

// ── Compact ────────────────────────────────────────────────

/**
 * Compact layout by pulling every item up as far as possible (gravity).
 * Items are processed top-to-bottom so higher items settle first.
 */
export function compactLayout(layout, excludeId, cols) {
  const ids = Object.keys(layout)
    .filter((id) => id !== excludeId)
    .sort(
      (a, b) =>
        layout[a].row - layout[b].row || layout[a].col - layout[b].col
    );

  for (const id of ids) {
    const item = layout[id];
    while (item.row > 0) {
      item.row--;
      if (findOverlapping(layout, id).length > 0) {
        item.row++;
        break;
      }
    }
  }
}

// ── Move with push ─────────────────────────────────────────

/**
 * Place an item at (targetCol, targetRow), push overlapping items to
 * valid positions, then compact the whole layout.
 * Returns a NEW layout object (does not mutate input).
 */
export function applyMove(layout, itemId, targetCol, targetRow, gridCols) {
  // Work on a clone
  const L = {};
  for (const [id, pos] of Object.entries(layout)) {
    L[id] = { ...pos };
  }

  const item = L[itemId];
  if (!item) return L;

  // Clamp to grid bounds
  targetCol = Math.max(0, Math.min(gridCols - item.w, targetCol));
  targetRow = Math.max(0, targetRow);

  // Place item at target
  item.col = targetCol;
  item.row = targetRow;

  // Iteratively resolve all overlaps
  const maxIterations = 50;
  for (let iter = 0; iter < maxIterations; iter++) {
    const displaced = findOverlapping(L, itemId);
    if (displaced.length === 0) break;

    for (const otherId of displaced) {
      const other = L[otherId];
      // Try pushing right first (just past the placed item's right edge)
      const rightCol = item.col + item.w;
      if (rightCol + other.w <= gridCols) {
        const saved = { col: other.col, row: other.row };
        other.col = rightCol;
        // Check if the new position is clear (besides the placed item)
        const stillOverlaps = findOverlapping(L, otherId);
        if (stillOverlaps.length === 0) continue; // success — moved right
        // Revert and try left
        other.col = saved.col;
        other.row = saved.row;
      }
      // Try pushing left (just before the placed item's left edge)
      const leftCol = item.col - other.w;
      if (leftCol >= 0) {
        const saved = { col: other.col, row: other.row };
        other.col = leftCol;
        const stillOverlaps = findOverlapping(L, otherId);
        if (stillOverlaps.length === 0) continue; // success — moved left
        other.col = saved.col;
        other.row = saved.row;
      }
      // Fall back to pushing below
      other.row = item.row + item.h;
      _resolveOverlaps(L, otherId, maxIterations - iter);
    }
  }

  return L;
}

/**
 * Resolve overlaps for a single item by pushing it down until clear.
 */
function _resolveOverlaps(layout, itemId, maxIter) {
  for (let i = 0; i < maxIter; i++) {
    const overlaps = findOverlapping(layout, itemId);
    if (overlaps.length === 0) return;
    // Push this item below the lowest overlapping item
    let maxBottom = 0;
    for (const oid of overlaps) {
      const o = layout[oid];
      maxBottom = Math.max(maxBottom, o.row + o.h);
    }
    layout[itemId].row = maxBottom;
  }
}

/**
 * Compact ALL items (no exclusion) — pull each up as far as possible.
 */
function compactAll(layout, cols) {
  const ids = Object.keys(layout).sort(
    (a, b) => layout[a].row - layout[b].row || layout[a].col - layout[b].col
  );
  for (const id of ids) {
    const item = layout[id];
    while (item.row > 0) {
      item.row--;
      if (findOverlapping(layout, id).length > 0) {
        item.row++;
        break;
      }
    }
  }
}

// ── Migration from flat tileOrder ──────────────────────────

/**
 * Convert a flat tileOrder array (with nulls for spacers) into a positioned layout.
 */
export function migrateFromTileOrder(tileOrder, items, cols, tileSizeFn) {
  const layout = {};
  const occ = [];
  const itemMap = new Map(items.filter(i => i.type !== 'spacer').map((i) => [i.id, i]));

  for (const id of tileOrder) {
    if (id == null) continue;
    const item = itemMap.get(id);
    if (!item) continue;
    const { w, h } = tileSizeFn(item);
    const pos = findFirstFit(occ, cols, w, h);
    layout[id] = { col: pos.col, row: pos.row, w, h };
    markOccupied(occ, pos.col, pos.row, w, h, id, cols);
    itemMap.delete(id);
  }

  // Remaining items not in tileOrder
  for (const [id, item] of itemMap) {
    const { w, h } = tileSizeFn(item);
    const pos = findFirstFit(occ, cols, w, h);
    layout[id] = { col: pos.col, row: pos.row, w, h };
    markOccupied(occ, pos.col, pos.row, w, h, id, cols);
  }

  return layout;
}

// ── Layout reflow for different grid sizes ─────────────────

/**
 * Find the closest saved layout key by column count, then row count.
 */
export function findClosestLayoutKey(layouts, targetCols, targetRows) {
  let bestKey = null;
  let bestDist = Infinity;
  for (const key of Object.keys(layouts)) {
    const [c, r] = key.split("x").map(Number);
    const dist = Math.abs(c - targetCols) * 10 + Math.abs(r - targetRows);
    if (dist < bestDist) {
      bestDist = dist;
      bestKey = key;
    }
  }
  return bestKey;
}

/**
 * Reflow an existing layout into a new column count.
 * Preserves relative ordering (top-to-bottom, left-to-right) and re-packs.
 */
export function reflowLayout(srcLayout, newCols) {
  const sorted = Object.entries(srcLayout).sort(
    ([, a], [, b]) => a.row - b.row || a.col - b.col
  );

  const layout = {};
  const occ = [];
  for (const [id, pos] of sorted) {
    const w = Math.min(pos.w, newCols);
    const h = pos.h;
    const fit = findFirstFit(occ, newCols, w, h);
    layout[id] = { col: fit.col, row: fit.row, w, h };
    markOccupied(occ, fit.col, fit.row, w, h, id, newCols);
  }
  return layout;
}
