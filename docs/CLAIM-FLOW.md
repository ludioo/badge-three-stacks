# Claim Flow Specification

**Application Name:** Badge Threes

**Testnet mode:** When on-chain is enabled, claim can **mint badges as NFTs** on Stacks testnet (contract `badgethrees`). Wallet must be connected; transaction is signed in Leather or Hiro. Local state is still saved; on-chain mint status is merged on `/badges`. See [OFFCHAIN-PHASE.md](./OFFCHAIN-PHASE.md) and [USER-GUIDE.md](./USER-GUIDE.md).

## Flow Overview

```
Play Game → Achieve Score → Unlock Badge → Eligible to Claim → Claim Badge → Update State
```

## Detailed Flow

### 1. Play Game

User plays game on `/play` page and achieves a score.

### 2. Score Check

After game ends, check if score meets any badge threshold:
- Compare final score against badge thresholds
- If score ≥ threshold and badge not yet unlocked, unlock badge
- Update badge state to "unlocked"

### 3. Notification

Show notification or indicator that new badge is available:
- Could be a badge icon in header/navbar
- Could be a toast notification
- Could be a banner on game over screen

### 4. Navigate to Claim

User navigates to `/claim` page (manually or via notification link).

### 5. Claim Page Display

Show list of eligible badges:
- Only show unlocked but not claimed badges
- Display badge tier, threshold, and description
- Show "Claim" button for each

### 6. Claim Action

User clicks "Claim" button:
- Update badge state from "unlocked" to "claimed"
- Save to local storage
- Show success message
- Optionally redirect to `/badges` page

### 7. State Update

After claim:
- Badge appears as "claimed" on `/badges` page
- Badge removed from `/claim` page (no longer eligible)
- State persists in local storage

## Implementation Notes

### Current (Testnet / On-Chain Enabled)

* Claim state is saved locally; when minting is enabled, user can mint as NFT on Stacks testnet
* Wallet (Leather or Hiro) required for minting; connect via header before claiming
* Transaction is signed in wallet; app shows pending/success/error and link to Stacks Explorer
* After mint, badge shows on-chain status on `/badges`; high score can be synced on game over

### Off-Chain Only (Feature Flags Off)

* With `BADGE_MINTING` false, claim is local-only (state saved to `localStorage`)
* No wallet required; no blockchain transaction
* Leaderboard works without wallet (off-chain)

## User Experience

* Clear indication of available badges
* Simple claim process (one click)
* Visual feedback on claim success
* Easy navigation between pages
