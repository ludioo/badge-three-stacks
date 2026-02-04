# PRD – Badge Threes (Evolution of Badge2048)

## 1. Overview

**Project Name:** Badge Threes
**Type:** Web-based Puzzle Game (Endless)
**Status:** New Project (Derived from Badge2048)
**Phase:** Level 2 – Game-first, Off-chain

Badge Threes is a puzzle game derived from the existing Badge2048 codebase. The goal of this project is to evolve the core game mechanic while reusing a proven grid, input, and rendering system.

This project intentionally focuses on **mechanic redesign**, not visual reskinning, to ensure it is a distinct product with its own learning outcomes and player strategy.

---

## 2. Background & Motivation

Badge2048 has been successfully built, deployed from testnet to mainnet, and validated as a stable game.

Rather than starting from scratch, Badge Threes is designed as:

* A technical iteration
* A mechanic experiment
* A new standalone repository

This approach mirrors real-world product iteration and showcases engineering maturity through reuse and abstraction.

---

## 3. Core Concept

Badge Threes replaces the traditional 2048 merge rules with a **Power-of-3 / Threes-inspired mechanic**.

### Key Design Pillars

* Same grid-based interaction model
* Different merge logic
* Higher emphasis on planning and efficiency
* Endless play, no fixed win condition

---

## 4. What Is Reused from Badge2048

The following components are reused with minimal or no change:

* Grid system (NxN board)
* Input handling (keyboard / swipe)
* Tile movement animation
* Rendering pipeline (Canvas / Phaser / DOM)
* Score tracking infrastructure
* Game loop and state lifecycle

These components are considered **engine-level systems**.

---

## 5. What Is Changed (Critical)

### 5.1 Merge Rules

**Badge2048:**

* Tiles merge if values are equal

**Badge Threes:**

* Tiles merge if the sum follows defined Power-of-3 rules
* Example rules (final ruleset can be tuned):

  * 1 + 2 → 3
  * 3 + 3 → 6
  * 6 + 6 → 12
  * n + n → n * 2 (where n is divisible by 3)

This fundamentally changes strategy and difficulty.

---

### 5.2 Tile Spawn Logic

**Badge2048:**

* Random spawn of 2 or 4

**Badge Threes:**

* Random spawn of 1, 2, or 3
* Spawn probability weighted to prevent early deadlocks

Spawn logic must be configurable and isolated from merge logic.

---

### 5.3 Win Condition

Badge Threes is designed as a **finite (non-endless) puzzle game**.

### Game End Conditions

The game ends when **no valid moves remain**, defined as:

* No adjacent tiles can merge according to the merge rules
* No empty cells remain on the grid

### Score & Highscore

* Each valid merge increases the score based on tile value
* Final score is calculated when the game ends
* Highscore is stored locally (localStorage) for the current device
* Future versions may sync highscores on-chain or via backend

This finite design allows:

* Clear session completion
* Meaningful score comparison
* Highscore-based achievement tracking

---

## 6. Engineering Refactor Requirements

To avoid hard-coded 2048 assumptions, the following refactors are required:

### 6.1 Naming & Abstraction

**Before:**

* `merge2048()`
* `spawnTile2048()`

**After:**

* `mergeTilesByRule()`
* `canMerge(a, b)`
* `spawnTileByRule()`

The game engine must support interchangeable rule sets.

---

### 6.2 Rule Engine

Introduce a rule module:

```
/game
  /rules
    mergeRule.ts
    spawnRule.ts
```

This allows future puzzle variants without rewriting the engine.

---

## 7. UX & UI Changes

Minimal UI changes are required:

* Updated game title and description
* Updated help / rules modal explaining merge behavior
* Visual differentiation through:

  * Color palette
  * Tile labeling style

No new assets or animations are required.

---

## 8. Non-Goals

This version explicitly does NOT include:

* On-chain logic
* Wallet connection
* NFT minting
* Multiplayer or leaderboard
* Monetization

These are deferred to a future PRD.

---

## 9. Success Metrics

* Game sessions reliably reach a clear end state
* Score calculation is deterministic and fair
* Highscore persists correctly across sessions
* Merge rules behave consistently
* Codebase clearly diverges from Badge2048 logic
* README clearly explains differences
* Project is independently deployable

---

## 10. Future Extensions (Out of Scope)

* On-chain badge minting
* Score verification
* Talent.app progress tracking
* Shared grid engine as a package

---

## 11. Implementation Status (Off-Chain Phase)

| Area | Status | Notes |
|------|--------|--------|
| Rule engine | ✅ Done | `lib/game/rules/mergeRule.ts`, `spawnRule.ts`, `types.ts` |
| Core game logic | ✅ Done | Merge, spawn, checkGameOver use Threes rules |
| UI rebranding | ✅ Done | Badge Threes text, tile colors, instructions |
| Feature flags | ✅ Done | `lib/featureFlags.ts`; on-chain disabled |
| Unit tests | ✅ Done | Threes rules and game flow covered |
| E2E tests | ✅ Done | Play, claim, leaderboard for off-chain mode |
| Documentation | ✅ Done | README, GAME-MECHANICS, THREES-RULES, OFFCHAIN-PHASE, BADGE-SYSTEM, CLAIM-FLOW, MVP-SCOPE |
| On-chain minting | 🔒 Disabled | Re-enable via feature flags for testnet/mainnet |
| On-chain score | 🔒 Disabled | Re-enable via feature flags for testnet/mainnet |

See [docs/OFFCHAIN-PHASE.md](OFFCHAIN-PHASE.md) and [docs/plan/badge_threes_off-chain_implementation_cdf96f44.plan.md](plan/badge_threes_off-chain_implementation_cdf96f44.plan.md) for details.

---

## 12. Summary

Badge Threes is a deliberate evolution of Badge2048.

It demonstrates:

* Code reuse with intention
* Mechanical experimentation
* Clean abstraction
* Product iteration mindset

This project serves as both a standalone game and a foundation for future puzzle-based experiments.
