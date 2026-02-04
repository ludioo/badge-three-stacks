import type { SpawnWeights } from './types';

/**
 * Default spawn weights for Threes: 1 (40%), 2 (40%), 3 (20%).
 * Can be overridden for testing or tuning.
 */
const DEFAULT_SPAWN_WEIGHTS: SpawnWeights = {
  1: 0.4,
  2: 0.4,
  3: 0.2,
};

/**
 * Returns a spawn value (1, 2, or 3) according to weighted probabilities.
 * Uses cumulative thresholds: [0, w1) → 1, [w1, w1+w2) → 2, [w1+w2, 1] → 3.
 */
export function getSpawnValue(weights: SpawnWeights = DEFAULT_SPAWN_WEIGHTS): 1 | 2 | 3 {
  const r = Math.random();
  if (r < weights[1]) return 1;
  if (r < weights[1] + weights[2]) return 2;
  return 3;
}

export { DEFAULT_SPAWN_WEIGHTS };
