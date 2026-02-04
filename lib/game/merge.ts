import type { Tile } from './types';
import { canMerge, getMergedValue } from './rules/mergeRule';

/**
 * Merge tiles in a row/column using Threes rules (Power-of-3).
 * - Removes nulls
 * - Merges adjacent tiles that can merge (1+2→3, or n+n→2n for n≥3 divisible by 3)
 * - Returns merged row and score increment
 */
export function mergeTiles(tiles: Tile[]): {
  merged: Tile[];
  score: number;
} {
  const nonNullTiles = tiles.filter((tile): tile is number => tile !== null);

  if (nonNullTiles.length === 0) {
    return { merged: tiles, score: 0 };
  }

  const merged: Tile[] = [];
  let score = 0;
  let i = 0;

  while (i < nonNullTiles.length) {
    const a = nonNullTiles[i];
    const b = i < nonNullTiles.length - 1 ? nonNullTiles[i + 1] : null;

    if (b !== null && canMerge(a, b)) {
      const mergedValue = getMergedValue(a, b);
      merged.push(mergedValue);
      score += mergedValue;
      i += 2;
    } else {
      merged.push(a);
      i += 1;
    }
  }

  while (merged.length < tiles.length) {
    merged.push(null);
  }

  return { merged, score };
}
