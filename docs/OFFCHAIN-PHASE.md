# Off-Chain Phase

This document describes the current **off-chain phase** of Badge Threes: what is enabled, what is disabled, and how we move to testnet/mainnet.

## Purpose

* Validate Threes game mechanics and UX without blockchain dependency
* Allow play, local badges, and off-chain leaderboard without a wallet
* Keep code paths for on-chain features behind feature flags for a clear path to testnet/mainnet

## What Is Enabled

* **Full Threes gameplay** — Power-of-3 merge (1+2→3, 3+3→6, …), spawn 1/2/3, game over when no moves
* **Local badges** — Unlock at score thresholds (Bronze, Silver, Gold, Elite); claim locally; persistence in `localStorage`
* **Off-chain leaderboard** — Submit best score (no wallet required in current implementation); view top scores and “Your rank”
* **All pages** — Home, Play, Badges, Claim, Leaderboard
* **Tests** — Unit tests (Vitest) and E2E tests (Playwright) for Threes rules and off-chain flows

## What Is Disabled (Feature Flags)

Controlled by `lib/featureFlags.ts`:

| Flag | Value (off-chain) | Effect |
|------|-------------------|--------|
| `ONCHAIN_ENABLED` | `false` | Master switch; all on-chain features off |
| `BADGE_MINTING` | `false` | Claim page does not mint NFTs; “Claim” is local-only or shows “Coming soon” / off-chain message |
| `ONCHAIN_SCORE_SUBMISSION` | `false` | Score is not submitted on-chain; only off-chain leaderboard is used |
| `WALLET_REQUIRED` | `false` | Wallet connect can be hidden or optional; game and leaderboard work without wallet |

## API Behavior

* **`/api/leaderboard`** — Fully functional (off-chain store).
* **`/api/leaderboard/rank`** — Works for off-chain leaderboard.
* **`/api/leaderboard/sync`** — Can return early or no-op when on-chain is disabled.
* **`/api/badge-ownership`** — Can return empty/mock data when contract is not used or not deployed.
* **`/api/health`** — Can report feature flag status for debugging.

## User Experience

* **Play:** No wallet required. Game over → score and local badges update; off-chain leaderboard can receive submission if implemented without wallet.
* **Badges:** Unlock and claim locally; badges are display-only from an on-chain perspective.
* **Claim page:** Shows off-chain mode (e.g. “Coming soon” for minting or local-only claim).
* **Leaderboard:** Works without connecting a wallet (when submission is allowed without wallet).

## Roadmap: Off-Chain → Testnet → Mainnet

1. **Off-chain (current)**  
   Feature flags keep on-chain off. Validate game, badges, and leaderboard behavior.

2. **Testnet**  
   * Set `ONCHAIN_ENABLED`, `BADGE_MINTING`, `ONCHAIN_SCORE_SUBMISSION`, and optionally `WALLET_REQUIRED` as needed.
   * Deploy or use existing Clarity contract on Stacks testnet.
   * Configure `NEXT_PUBLIC_STACKS_NETWORK=testnet` and contract/deployer env vars.
   * Run manual and E2E tests for claim and leaderboard with wallet.

3. **Mainnet**  
   * After testnet validation, switch to mainnet (e.g. `NEXT_PUBLIC_STACKS_NETWORK=mainnet`).
   * Use mainnet contract address and deployer.
   * See [TESTNET-TO-MAINNET-MIGRATION-PLAN.md](./TESTNET-TO-MAINNET-MIGRATION-PLAN.md) for deployment and checklist.

## Configuration

* **Environment:** Stacks-related env vars (e.g. `NEXT_PUBLIC_STACKS_NETWORK`, `NEXT_PUBLIC_CONTRACT_ADDRESS`) are optional during off-chain phase. See `.env.example` and [README.md](../README.md).
* **Feature flags:** Edit `lib/featureFlags.ts` (or switch to env-based flags) when enabling on-chain for testnet/mainnet.

## Assets & Metadata

* **Metadata:** App title and description are updated to Badge Threes in `app/layout.tsx`.
* **Icons:** The app currently uses `public/badge2048-stacks-icon.png` and `app/icon.png`. Replacing these with Threes-specific branding (e.g. icon with "3" or Threes theme) is optional and can be done in a follow-up; the game and docs do not depend on it.

## Documentation

* Game rules: [THREES-RULES.md](./THREES-RULES.md), [GAME-MECHANICS.md](./GAME-MECHANICS.md)
* Badge system: [BADGE-SYSTEM.md](./BADGE-SYSTEM.md)
* Claim flow: [CLAIM-FLOW.md](./CLAIM-FLOW.md)
* Migration: [TESTNET-TO-MAINNET-MIGRATION-PLAN.md](./TESTNET-TO-MAINNET-MIGRATION-PLAN.md)
