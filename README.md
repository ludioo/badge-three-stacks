# Badge Threes

**Threes-style puzzle meets Web3: Power-of-3 merge mechanics, collect achievement badges, climb the leaderboard.**

**Blockchain: [Stacks](https://stacks.co) ($STX)** — This project uses Stacks only. All on-chain logic (Clarity contracts, Stacks Connect, leaderboard wallet identity, badge NFT minting) is Stacks-specific. For another chain you need different contracts, SDKs, and wallet integration.

**Status:** **Off-chain phase.** Game, badges (local), and leaderboard work without a wallet. On-chain minting and on-chain score submission are disabled via feature flags. See [docs/OFFCHAIN-PHASE.md](docs/OFFCHAIN-PHASE.md) for what's disabled and the roadmap to testnet/mainnet.

---

## Overview

Badge Threes is a full-stack puzzle game with **Threes / Power-of-3** merge mechanics and optional blockchain integration. Combine 1+2 to make 3, then merge pairs (3+3→6, 6+6→12) to reach higher scores. Unlock badges at score milestones (Bronze, Silver, Gold, Elite), claim them locally or—when enabled—mint as NFTs on Stacks. Connect your wallet to submit scores to the leaderboard and compete for top spots.

Game logic lives in pure, tested functions; the UI is built with React and modern tooling. Badge and leaderboard behavior support both the current off-chain phase and a path to on-chain minting.

---

## Features

- **Threes gameplay** — 4×4 grid, slide/merge with Power-of-3 rules (1+2→3, 3+3→6, …). Keyboard (arrows), touch swipe, mouse drag. Game ends when no valid moves remain.
- **Badge system** — Unlock at 1024 (Bronze), 2048 (Silver), 4096 (Gold), 8192 (Elite). Local persistence; optional on-chain mint as SIP-009 NFTs when enabled.
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

In **off-chain phase**, Stacks env vars are optional. Copy the example and adjust when you enable on-chain:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_STACKS_NETWORK` | No | `testnet` (default) or `mainnet` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | No* | `{deployer}.badgethrees` for on-chain mint when enabled; mainnet: `SP....badgethrees`; testnet: `ST....badgethrees` |
| `NEXT_PUBLIC_CONTRACT_NAME` | No | `badgethrees` (default) |
| `NEXT_PUBLIC_DEPLOYER_ADDRESS` | No | Deployer principal; mainnet `SP`, testnet `ST`; fallback if contract address unset |

\* Needed only when on-chain mint and badge-ownership API are enabled. Game, local badges, and leaderboard work without it.

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

### Deploying to Vercel

- **Build command** must be `npm run build` (defined in `vercel.json`). Do **not** override it in Vercel Dashboard with a custom script that exits on production, or production builds will fail.
- Set environment variables in **Project → Settings → Environment Variables** (see table above; for production with on-chain: use mainnet values).
- See **[docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md)** and **[docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md](docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md)** for full deploy and migration steps.

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

- **Off-chain phase (current)** — Threes mechanics, local badges, off-chain leaderboard; no wallet required. See [docs/OFFCHAIN-PHASE.md](docs/OFFCHAIN-PHASE.md).
- **Testnet / mainnet** — Re-enable on-chain features, deploy contract, wallet and minting.
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
