import type { Badge } from './types';

// Default Badge Configuration (Threes is harder than 2048; thresholds aligned to Power-of-3 progression: 384→768→1536→3072)
export const DEFAULT_BADGES: Badge[] = [
  { tier: 'bronze', threshold: 384, unlocked: false, claimed: false },
  { tier: 'silver', threshold: 768, unlocked: false, claimed: false },
  { tier: 'gold', threshold: 1536, unlocked: false, claimed: false },
  { tier: 'elite', threshold: 3072, unlocked: false, claimed: false },
];

// Board size - FIXED, never changes
export const BOARD_SIZE = 4; // 4x4 grid = 16 cells total

// Threes spawn weights: 1 (40%), 2 (40%), 3 (20%). Tunable.
export const SPAWN_WEIGHTS = {
  1: 0.4,
  2: 0.4,
  3: 0.2,
} as const;
