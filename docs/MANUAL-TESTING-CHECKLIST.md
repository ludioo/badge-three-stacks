# Manual Testing Checklist — Badge Threes (Off-chain Phase)

Use this checklist to validate game playability and off-chain behaviour before release or Phase 5.

---

## 1. Game Start

- [ ] Board spawns 2 tiles on load
- [ ] Tile values are only 1, 2, or 3
- [ ] Tiles appear in random positions
- [ ] Score starts at 0

---

## 2. Merge Mechanics

- [ ] **1 + 2 → 3** (merge 1 and 2 in either order)
- [ ] **2 + 1 → 3** (same result)
- [ ] **3 + 3 → 6**
- [ ] **6 + 6 → 12**
- [ ] Continue to higher values (12+12→24, 24+24→48, …)
- [ ] **1 + 1** and **2 + 2** do **not** merge
- [ ] Non-matching tiles (e.g. 3 and 6) do not merge
- [ ] Multiple merges in one swipe work (e.g. row [1,2,3,3] → [3,6] after left swipe)

---

## 3. Tile Spawning

- [ ] After a valid move, exactly one new tile appears (value 1, 2, or 3)
- [ ] No new tile appears if the board did not change (invalid move)
- [ ] No new tile appears when the board is full (game over)

---

## 4. Game Over

- [ ] Game ends when the board is full **and** no valid merges remain
- [ ] Final score is displayed
- [ ] "Play Again" (or equivalent) restarts the game correctly
- [ ] Game over does **not** trigger when merges are still possible

---

## 5. Score Tracking

- [ ] Score increases by the correct amount on each merge (sum of merged values)
- [ ] High score is persisted (e.g. localStorage) and shown after refresh
- [ ] Off-chain leaderboard submission works (submit score, see entry on leaderboard)

---

## 6. UI/UX

- [ ] No "2048" or "Badge2048" text in visible UI
- [ ] All headings and copy reference "Badge Threes" / "Badge Three Stacks"
- [ ] Tile colours match the new value progression (1, 2, 3, 6, 12, …)
- [ ] Instructions explain Threes rules (1+2→3, then merge pairs)
- [ ] Animations (tile move/merge) work smoothly
- [ ] Sound toggle works (if applicable)

---

## 7. Off-chain Verification

- [ ] No wallet connection is required to play or view leaderboard
- [ ] No on-chain transactions are attempted (no wallet prompts for minting)
- [ ] Claim page shows "Off-chain mode" and "Coming soon" (or disabled) for claim actions
- [ ] Leaderboard loads and displays entries without wallet
- [ ] Badge tiers and unlock states are visible; claim is disabled or "Coming soon"

---

## Sign-off

| Date       | Tester | Notes |
|-----------|--------|--------|
|            |        |        |

---

*Ref: [Badge Threes Off-chain Implementation Plan](plan/badge_threes_off-chain_implementation_cdf96f44.plan.md) — Phase 4.3*
