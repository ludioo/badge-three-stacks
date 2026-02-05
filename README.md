# Badge Threes

**Threes-style puzzle meets Web3: Power-of-3 merge mechanics, collect achievement badges, climb the leaderboard.**

**Blockchain: [Stacks](https://stacks.co) ($STX)** — This project uses Stacks only. All on-chain logic (Clarity contracts, Stacks Connect, leaderboard wallet identity, badge NFT minting) is Stacks-specific. For another chain you need different contracts, SDKs, and wallet integration.

**Status:** **Testnet phase.** On-chain features are enabled: connect a Stacks wallet to mint badges as NFTs and sync high scores. Game and leaderboard work with or without a wallet. See [docs/OFFCHAIN-PHASE.md](docs/OFFCHAIN-PHASE.md) for phase details and [docs/USER-GUIDE.md](docs/USER-GUIDE.md) for wallet and minting steps.

---

## Overview

Badge Threes is a full-stack puzzle game with **Threes / Power-of-3** merge mechanics and optional blockchain integration. Combine 1+2 to make 3, then merge pairs (3+3→6, 6+6→12) to reach higher scores. Unlock badges at score milestones (Bronze, Silver, Gold, Elite), claim them locally or—when enabled—mint as NFTs on Stacks. Connect your wallet to submit scores to the leaderboard and compete for top spots.

Game logic lives in pure, tested functions; the UI is built with React and modern tooling. Badge and leaderboard behavior support both the current off-chain phase and a path to on-chain minting.

---

## Features

- **Threes gameplay** — 4×4 grid, slide/merge with Power-of-3 rules (1+2→3, 3+3→6, …). Keyboard (arrows), touch swipe, mouse drag. Game ends when no valid moves remain.
- **Badge system** — Unlock at 384 (Bronze), 768 (Silver), 1536 (Gold), 3072 (Elite). Threes uses lower thresholds than 2048 (Power-of-3 is harder). Local persistence; optional on-chain mint as SIP-009 NFTs when enabled.
- **Claim flow** — Claim unlocked badges on `/claim`. Local-only in off-chain phase; mint via Stacks ($STX) when contract is configured and feature flags allow.
- **Stacks ($STX) wallet** — Optional in off-chain phase. When enabled: connect via Stacks Connect for leaderboard identity and on-chain minting.
- **Leaderboard** — Off-chain; best score per wallet. Auto-submit on game over when connected. "Your rank" and top entries on `/leaderboard`.
- **Responsive UI** — Mobile and desktop. Animations (Framer Motion), focus/aria improvements.
- **Tests** — Unit (Vitest) for game and leaderboard logic; E2E (Playwright) for navigation, play, badges, claim, leaderboard.

See [docs/THREES-RULES.md](docs/THREES-RULES.md) for detailed merge and spawn rules.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Radix UI (Dialog, Slot), Lucide, CVA + `clsx` / `tailwind-merge` |
| **Blockchain: Stacks ($STX)** | Stacks Connect, `@stacks/connect-react`, `@stacks/network`, `@stacks/transactions`; native token STX for fees |
| **Smart contract** | Clarity on Stacks; Clarinet, deployments for simnet/testnet |
| **Backend (API)** | Next.js API routes: `/api/leaderboard`, `/api/leaderboard/rank`, `/api/badge-ownership` |
| **Testing** | Vitest (unit), Playwright (E2E, Chromium/Firefox/WebKit) |
| **Tooling** | ESLint, PostCSS, Autoprefixer |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ /play       │  │ /badges      │  │ /claim      │  │ /leaderboard  │  │
│  │ Game        │  │ BadgesGrid   │  │ ClaimGrid   │  │ Leaderboard   │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └───────┬───────┘  │
│         │                │                 │                 │          │
│         ▼                ▼                 ▼                 ▼          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ useGame     │  │ useBadges    │  │ useBadge    │  │ useLeaderboard│  │
│  │ useBadge…   │  │ useBadge     │  │ Onchain     │  │ useSubmitScore│  │
│  │             │  │ Contract     │  │ useStacks…  │  │ useLeaderboard│  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  │     Rank      │  │
│         │                │                 │         └───────┬───────┘  │
│         ▼                ▼                 ▼                 ▼          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ lib/game    │  │ lib/badges   │  │ lib/stacks  │  │ lib/leaderboard│  │
│  │ (reducer,   │  │ localStorage │  │ + Stacks    │  │ leaderboard   │  │
│  │  slide,…)   │  │              │  │  Connect    │  │ Client → API  │  │
│  └─────────────┘  └──────────────┘  └──────┬──────┘  └───────┬───────┘  │
└────────────────────────────────────────────│─────────────────│──────────┘
                                             │                 │
                    ┌────────────────────────┘                 │
                    ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Next.js server                                                          │
│  ┌───────────────────────┐  ┌─────────────────────────────────────────┐ │
│  │ /api/badge-ownership  │  │ /api/leaderboard (GET list, POST submit) │ │
│  │ (proxy to Stacks RPC) │  │ /api/leaderboard/rank?address=           │ │
│  └───────────────────────┘  │ in-memory store (abstraction for DB)   │ │
│                           └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                             │
                    ┌────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Stacks ($STX) — when feature flags enable on-chain                      │
│  contracts/badgethrees-contract: mint-badge, get-badge-ownership, etc.   │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Game:** `lib/game` holds pure logic (reducer, slide, merge, spawn, checkGameOver) and rule engine (`lib/game/rules/`). No React; fully unit-tested. Threes merge/spawn rules: see [docs/GAME-MECHANICS.md](docs/GAME-MECHANICS.md).
- **Leaderboard:** Off-chain. `POST /api/leaderboard` and `GET /api/leaderboard` (and `/rank`) use an in-memory store; swap to DB/KV by changing the store implementation.
- **Badges:** Local state in `localStorage`; on-chain mint via Stacks ($STX) contract when enabled (feature flags + `NEXT_PUBLIC_CONTRACT_ADDRESS` and wallet).

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

```bash
git clone https://github.com/your-username/badge-threes.git
cd badge-threes
npm install
```

### Environment variables

For **testnet**, set Stacks env vars so on-chain minting and badge-ownership work. Copy the example and set values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_STACKS_NETWORK` | For on-chain | `testnet` (default) or `mainnet` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | For on-chain | Testnet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`; mainnet: `SP....badgethrees` when deployed |
| `NEXT_PUBLIC_CONTRACT_NAME` | No | `badgethrees` (default) |
| `NEXT_PUBLIC_DEPLOYER_ADDRESS` | No | Deployer principal; testnet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`; mainnet: `SP...` when deployed |

Feature flags in `lib/featureFlags.ts` control whether minting and on-chain score are enabled; ensure they match your environment.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and run production

```bash
npm run build
npm run start
```

### Wallet connection (testnet)

- Install **Leather** or **Hiro** wallet and switch to **Stacks Testnet**.
- Get testnet STX from a [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet) (needed for mint and high-score transaction fees).
- Use **Connect wallet** in the app header to connect; then you can mint badges on `/claim` and sync high score after game over.
- See **[docs/USER-GUIDE.md](docs/USER-GUIDE.md)** for step-by-step wallet setup, minting, and troubleshooting.

### Testnet deployment (local only for now)

- Run locally with `npm run dev` and the env vars above to use the testnet contract.
- **Vercel deployment** is planned for mainnet; see **[docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md)** and **[docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md](docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md)** when deploying to production.

### npm audit (vulnerabilities)

After `npm install` you may see **low severity** vulnerabilities from transitive dependencies of `@stacks/connect` / `@stacks/connect-react`. Do **not** run `npm audit fix --force` without testing; it can downgrade `@stacks/connect` and break the app. Re-run `npm audit` after dependency updates.

---

## Usage

| Page | Description |
|------|-------------|
| `/` | Home; links to Play and Badges |
| `/play` | Threes game. Arrow keys, touch swipe, or mouse drag. On game over, if wallet is connected, score is submitted to the leaderboard. |
| `/badges` | All tiers; owned / unlocked / locked. Shortcut to claim. |
| `/claim` | Eligible (unlocked, unclaimed) badges. In off-chain phase: local claim only; mint on Stacks when enabled. |
| `/leaderboard` | Top scores and "Your rank" when connected. |

**Play without wallet:** Game, local badges, and leaderboard submit (when implemented) work. On-chain mint and on-chain score require a connected Stacks ($STX) wallet and enabled feature flags.

---

## Project structure

```
├── app/
│   ├── page.tsx                 # Home
│   ├── play/page.tsx            # Game
│   ├── badges/page.tsx          # Badges
│   ├── claim/page.tsx           # Claim
│   ├── leaderboard/page.tsx     # Leaderboard
│   ├── api/
│   │   ├── leaderboard/         # GET list, POST submit
│   │   │   └── rank/            # GET ?address=
│   │   └── badge-ownership/     # Stacks read proxy
│   └── layout.tsx
├── components/
│   ├── game/                    # Game, GameBoard, Tile, ScoreDisplay
│   ├── badge/                   # BadgeCard, BadgesGrid, ClaimGrid
│   ├── leaderboard/             # LeaderboardTable, LeaderboardView, MyRankCard
│   ├── ui/                      # navigation, wallet-connect, button, dialog, alert
│   └── providers/               # StacksProvider, GlobalErrorHandler
├── lib/
│   ├── game/                    # types, reducer, slide, merge, spawn, checkGameOver, utils, constants
│   │   └── rules/               # mergeRule, spawnRule (Threes)
│   ├── badges.ts                # unlock, storage
│   ├── leaderboard/             # store, types, validate, leaderboardClient
│   ├── stacks/                  # config, constants, badgeOwnershipClient, badgeOwnershipServer
│   ├── featureFlags.ts          # ONCHAIN_ENABLED, BADGE_MINTING, etc.
│   └── utils.ts
├── hooks/
│   ├── useGame.ts
│   ├── useBadges.ts, useBadgeContract.ts, useBadgeOnchain.ts, useStacksWallet.ts
│   ├── useLeaderboard.ts, useLeaderboardRank.ts, useSubmitScore.ts
│   └── …
├── contracts/
│   └── badgethrees-contract/   # Clarity (Clarinet), badgethrees.clar, tests, deployments
├── e2e/                         # Playwright: navigation, play, badges, badge-claim, leaderboard
└── docs/                        # Specs, rules, THREES-RULES, OFFCHAIN-PHASE, etc.
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit) |
| `npm run test:ui` | Vitest UI |
| `npm run test:e2e` | Playwright E2E |
| `npm run test:e2e:ui` | Playwright E2E with UI |

**Contract (Clarinet):** from `contracts/badgethrees-contract/` run `clarinet test`.

---

## Roadmap

- **Testnet phase (current)** — On-chain minting and high-score sync enabled; contract `badgethrees` on Stacks testnet. See [docs/OFFCHAIN-PHASE.md](docs/OFFCHAIN-PHASE.md) and [docs/USER-GUIDE.md](docs/USER-GUIDE.md).
- **Mainnet & Vercel** — After testnet validation: deploy contract to mainnet, then deploy app to Vercel with mainnet config.
- **Leaderboard persistence** — Replace in-memory store with DB or KV (e.g. Vercel KV, Upstash).
- **Game & UI** — Undo, hints, i18n, sound, theme toggles, a11y.
- See [docs/FUTURE-SCOPE.md](docs/FUTURE-SCOPE.md) for more.

---

## Contributing

1. **Branch** — Use `feature/<short-description>` or `fix/<short-description>` from `develop` (or `main` if default).
2. **Commit** — Prefer conventional messages: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.
3. **PR** — One logical change per PR. Include summary, rationale, and how you tested. Link relevant `docs/` when useful.
4. **Code** — Follow existing patterns; keep `lib/game` pure and tested. User-facing text in English.
5. **Docs** — Put non-trivial design and decisions in `docs/`.

See [docs/rules/repo-rules.md](docs/rules/repo-rules.md), [docs/rules/frontend-rules.md](docs/rules/frontend-rules.md), [docs/rules/backend-rules.md](docs/rules/backend-rules.md), and [docs/rules/testing-rules.md](docs/rules/testing-rules.md) for detailed conventions.

---

## License

See the [LICENSE](LICENSE) file in the root of this repository.

---

## Author

Maintained as an open-source / portfolio project. For issues and ideas, please open a GitHub issue or pull request.
