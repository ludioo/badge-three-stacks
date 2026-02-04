/**
 * Rule engine types for Badge Threes (Power-of-3 merge mechanics).
 * Tile values: 1, 2, 3, 6, 12, 24, 48, ... (1+2→3, then n+n→2n for n≥3 divisible by 3).
 */

/** Valid non-null tile value in Threes (1, 2, or multiple of 3 ≥ 3). */
export type TileValue = number;

/** Weights for spawn values 1, 2, 3. Must sum to 1. */
export interface SpawnWeights {
  1: number;
  2: number;
  3: number;
}
