# Off-Chain Phase & Testnet Transition

This document describes the **off-chain baseline** of Badge Threes and the **transition to testnet**: what can run without a wallet, what is controlled by feature flags, and how testnet/mainnet are configured.

## Purpose

* Validate Threes game mechanics and UX without blockchain dependency
* Allow play, local badges, and off-chain leaderboard without a wallet
* **Testnet phase**: On-chain minting and high-score sync are enabled when feature flags are on and contract is configured.

## What Is Enabled (Always)

* **Full Threes gameplay** — Power-of-3 merge (1+2→3, 3+3→6, …), spawn 1/2/3, game over when no moves
* **Local badges** — Unlock at score thresholds (Bronze, Silver, Gold, Elite); claim locally; persistence in `localStorage`
* **Off-chain leaderboard** — Submit best score view top scores and “Your rank”
* **All pages** — Home, Play, Badges, Claim, Leaderboard
* **Tests** — Unit tests (Vitest) and E2E tests (Playwright) for Threes rules and flows

## What Is Enabled on Testnet (When Feature Flags On)

* **On-chain badge minting** — Claim page mints badges as SIP-009 NFTs on Stacks testnet (contract `badgethrees`)
* **On-chain high score** — After game over, sync highest score to contract when wallet is connected
* **Wallet connection** — Leather or Hiro; connect to view on-chain badges and perform mint/score transactions
* **Badge display** — `/badges` merges off-chain and on-chain badge state

## Feature Flags (`lib/featureFlags.ts`)

| Flag | Off-chain (default) | Testnet (when enabled) |
|------|---------------------|-------------------------|
| `ONCHAIN_ENABLED` | `false` | `true` — enables on-chain reads and contract config |
| `BADGE_MINTING` | `false` | `true` — claim page can mint NFTs |
| `ONCHAIN_SCORE_SUBMISSION` | `false` | `true` — game over can sync high score on-chain |
| `WALLET_REQUIRED` | `false` | Typically `false` — game/leaderboard work without wallet; mint/score need wallet |

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

1. **Off-chain (baseline)**  
   With feature flags off, the app runs without any Stacks dependency. Game, local badges, and leaderboard work.

2. **Testnet (current)**  
   * Feature flags enabled for on-chain minting and high-score sync.
   * Contract `badgethrees` deployed on Stacks testnet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`.
   * Configure `NEXT_PUBLIC_STACKS_NETWORK=testnet` and contract/deployer env vars (see README and [USER-GUIDE.md](./USER-GUIDE.md)).
   * Manual and E2E tests cover claim flow and leaderboard; run locally (Vercel deploy planned for mainnet).

3. **Mainnet**  
   * After testnet validation, deploy contract to mainnet and set `NEXT_PUBLIC_STACKS_NETWORK=mainnet` and mainnet contract address.
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
