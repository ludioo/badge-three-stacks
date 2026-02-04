# MVP Scope

**Application Name:** Badge Threes

**Phase:** Off-chain. Threes (Power-of-3) mechanics; on-chain minting and on-chain score submission disabled. See [OFFCHAIN-PHASE.md](./OFFCHAIN-PHASE.md).

## Included Features

### Core Gameplay

* ✅ Full puzzle gameplay (Threes / Power-of-3 mechanics: 1+2→3, 3+3→6, etc.)
* ✅ 4×4 grid with tile merging
* ✅ Score system with incremental scoring
* ✅ Game over detection (no valid moves)
* ✅ Keyboard controls (arrow keys)
* ✅ Touch swipe controls
* ✅ Mouse drag controls
* ✅ Restart functionality

### UI/UX

* ✅ Slightly modernized UI
* ✅ Responsive design
* ✅ Basic animations (slide, merge, spawn)
* ✅ Game over modal
* ✅ Score display

### Badge System

* ✅ Badge unlock logic (based on score thresholds)
* ✅ Badge display on `/badges` page
* ✅ Badge tiers: Bronze, Silver, Gold, Elite
* ✅ Visual distinction between owned/locked badges

### Multi-page Structure

* ✅ Multi-page routing (Next.js App Router)
* ✅ `/play` - Game page
* ✅ `/claim` - Claim page
* ✅ `/badges` - Badges display page
* ✅ `/leaderboard` - Leaderboard (off-chain)
* ✅ Navigation between pages

### Claim Flow

* ✅ Frontend-only claim flow (local claim)
* ✅ Claim button and confirmation
* ✅ State update after claim
* ✅ Badge persistence (local storage)
* ✅ Off-chain mode messaging when minting is disabled

### Persistence

* ✅ Badge state saved to local storage
* ✅ Badges persist across sessions

## Out of Scope (Current Off-Chain MVP)

* ❌ On-chain minting (disabled via feature flags)
* ❌ Wallet required (optional; hidden or not required in off-chain phase)
* ❌ On-chain score verification
* ❌ Anti-cheat mechanisms
* ❌ Tokenomics
* ❌ Social share
* ❌ Multiplayer
* ❌ Profile page
* ❌ Game history
* ❌ Undo functionality

## MVP Success Criteria

* Game is playable and fun
* Badge system works end-to-end
* All pages are accessible and functional
* State persists correctly
* No critical bugs
* Ready for on-chain integration in next phase
