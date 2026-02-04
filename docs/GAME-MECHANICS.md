# Game Mechanics Specification

**Application Name:** Badge Threes

## Core Mechanics

* **Fixed 4×4 grid** (16 cells) — board size never changes
* **Finite play** — game ends when no valid moves remain
* **Power-of-3 merge** — 1+2→3, then identical tiles (≥3, divisible by 3) merge: 3+3→6, 6+6→12, etc.
* **Incremental scoring** — score increases by merged value on each merge
* **New tiles spawn** after valid moves (values 1, 2, or 3)
* **Game over** = no empty cells AND no adjacent pair that can merge under Threes rules

## Board Structure

* **Grid size:** Always 4×4 (16 cells total)
* **Cell states:** Empty (null) or contains a number tile
* **Tile values:** 1, 2, 3, 6, 12, 24, 48, 96, 192, … (1 and 2 only from spawn; 3 and multiples of 3 from merging)
* **Maximum tiles:** Up to 16 tiles when board is full
* **Important:** Board dimensions are fixed and never expand

## Input

* **Keyboard:** Arrow keys (up, down, left, right)
* **Touch:** Swipe gestures (mobile)
* **Mouse:** Drag/swipe gestures (desktop)

## State Machine (Deterministic)

```
state → action → new_state
```

### Actions

* `SLIDE_LEFT`
* `SLIDE_RIGHT`
* `SLIDE_UP`
* `SLIDE_DOWN`
* `RESTART`

## Spawn Logic

* Spawn **1**, **2**, or **3** with weighted probabilities (e.g. 1: 40%, 2: 40%, 3: 20%)
* Random empty cell
* Only spawn after a valid move (board changed)
* Implemented in `lib/game/rules/spawnRule.ts` and `lib/game/spawn.ts`

## Merge Logic (Threes / Power-of-3)

* **Special case:** 1 + 2 → 3 (or 2 + 1 → 3)
* **General case:** Two identical tiles that are ≥ 3 and divisible by 3 merge: n + n → 2n
  * 3 + 3 → 6
  * 6 + 6 → 12
  * 12 + 12 → 24
  * etc.
* **No merge:** 1+1, 2+2, or any pair that does not satisfy the rules above
* Score += merged value
* One merge per cell per action
* Tiles merge in direction of slide
* Implemented in `lib/game/rules/mergeRule.ts` (`canMerge`, `getMergedValue`) and `lib/game/merge.ts`

## End Condition

* Game over when:
  * **No empty cell**, AND
  * **No adjacent pair** that can merge according to Threes rules (i.e. 1 next to 2, or two equal tiles ≥ 3 and divisible by 3)

## Game Flow

1. **Initialize:** Spawn 2 tiles (each 1, 2, or 3) on empty board
2. **Player action:** Slide in a direction
3. **Process slide:** Move tiles, merge where rules allow
4. **Check if board changed**
5. **If changed:** Spawn one new tile (1, 2, or 3), update score
6. **Check end condition**
7. **If game over:** Show game over state
8. Repeat from step 2

## Reference

* Detailed rule reference: [THREES-RULES.md](./THREES-RULES.md)
* Implementation: `lib/game/` and `lib/game/rules/`
