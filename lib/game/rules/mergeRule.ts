/**
 * Threes merge rules (Power-of-3):
 * - 1 + 2 → 3 (or 2 + 1 → 3)
 * - n + n → n × 2 for n ≥ 3 and n divisible by 3 (3+3→6, 6+6→12, ...)
 */

/**
 * Returns true if two tile values can merge according to Threes rules.
 */
export function canMerge(a: number, b: number): boolean {
  if (a === 1 && b === 2) return true;
  if (a === 2 && b === 1) return true;
  if (a >= 3 && a % 3 === 0 && a === b) return true;
  return false;
}

/**
 * Returns the merged value for two tiles that can merge.
 * Call canMerge(a, b) first; behavior is undefined if they cannot merge.
 */
export function getMergedValue(a: number, b: number): number {
  if ((a === 1 && b === 2) || (a === 2 && b === 1)) return 3;
  if (a >= 3 && a % 3 === 0 && a === b) return a * 2;
  return 0;
}
