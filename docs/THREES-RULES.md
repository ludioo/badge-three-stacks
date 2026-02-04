# Threes Rules Reference

Quick reference for Badge Threes merge and spawn rules (Power-of-3 mechanics).

## Merge Rules

### When two tiles merge

| Left | Right | Result |
|------|--------|--------|
| 1 | 2 | 3 |
| 2 | 1 | 3 |
| 3 | 3 | 6 |
| 6 | 6 | 12 |
| 12 | 12 | 24 |
| n (≥3, divisible by 3) | n | 2n |

### When tiles do **not** merge

* 1 and 1
* 2 and 2
* 1 and 3 (or 3 and 1)
* 2 and 3 (or 3 and 2)
* 3 and 6 (different values)
* Any pair that does not match the table above

### Summary

* **Only** 1+2 (or 2+1) produces 3.
* **Only** two equal values that are ≥ 3 and divisible by 3 merge (double the value).
* Score for a move is the sum of all merged values in that move.

## Spawn Rules

* After every **valid** move (board changed), one new tile appears in a random empty cell.
* New tile value is **1**, **2**, or **3** with weighted probabilities (e.g. 40% / 40% / 20%).
* If the board did not change (invalid or no-op move), nothing spawns.
* If the board is full, no spawn (and game over is checked).

## Game Over

* The game ends when:
  1. There are **no empty cells**, and
  2. There is **no adjacent pair** that can merge (no 1 next to 2, and no two equal tiles that are ≥ 3 and divisible by 3).

## Implementation

* Merge: `lib/game/rules/mergeRule.ts` — `canMerge(a, b)`, `getMergedValue(a, b)`
* Spawn: `lib/game/rules/spawnRule.ts` — `getSpawnValue(weights)`
* Core usage: `lib/game/merge.ts`, `lib/game/spawn.ts`, `lib/game/checkGameOver.ts`
