# Testnet Manual Testing — Badge Threes (On-chain Phase)

Use this checklist to validate on-chain flows (badge minting, high score sync, wallet connection) on Stacks testnet before release or Phase 8 deployment.

**Prerequisites:**

- App configured for testnet (`NEXT_PUBLIC_STACKS_NETWORK=testnet`, contract `badgethrees`)
- Feature flags: `ONCHAIN_ENABLED`, `BADGE_MINTING`, `ONCHAIN_SCORE_SUBMISSION`, `WALLET_REQUIRED` all `true`
- Testnet STX in wallet (e.g. from [Stacks faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet))
- Wallet extension: Leather and/or Hiro

---

## 1. New User Flow

- [ ] Open app with no wallet connected
- [ ] Play game until a badge is unlocked (score ≥ 1024 for bronze)
- [ ] Navigate to **Claim** page
- [ ] See **Connect your wallet** prompt (no wallet)
- [ ] Connect wallet via navigation (Leather or Hiro)
- [ ] After connect, see **Wallet connected** and claim area
- [ ] Click **Claim badge** for unlocked tier
- [ ] Confirm transaction in wallet
- [ ] See success state (e.g. “Badge claimed!”) and transaction status
- [ ] Verify NFT in wallet (badgethrees contract)
- [ ] Verify transaction on [Stacks Explorer (testnet)](https://explorer.stacks.co/?chain=testnet)

---

## 2. Returning User Flow

- [ ] Connect wallet
- [ ] Open **Badges** page — see on-chain badges (e.g. “On-chain”, token id)
- [ ] Play game and beat previous high score
- [ ] On game over, see option to **Sync high score** on-chain
- [ ] Submit high score; confirm transaction in wallet
- [ ] Verify transaction on Stacks Explorer
- [ ] Verify high score updated (e.g. in UI or contract read)

---

## 3. Migration Flow (Off-chain → On-chain)

- [ ] User has off-chain badges (unlocked/claimed in localStorage only)
- [ ] Connect wallet
- [ ] Open **Claim** page — see claimable badges that are “not yet minted”
- [ ] Mint each claimable badge on-chain
- [ ] **Badges** page shows merged state: off-chain + on-chain (on-chain badges show minted status)
- [ ] No duplicate mint for same tier; already-minted tiers show as owned

---

## 4. Error Scenarios

- [ ] **Mint without wallet:** With wallet disconnected, claim page shows connect prompt; no mint possible
- [ ] **Insufficient STX:** If balance too low, transaction fails; user sees clear error (e.g. toast/modal)
- [ ] **Cancel in wallet:** User cancels signing; UI returns to previous state, no broken state
- [ ] **Network error:** Simulate offline or slow network; error message is user-friendly and suggests retry
- [ ] All error messages are non-technical where possible and point to next step

---

## 5. Device & Browser Matrix

| Device / OS     | Browser      | Wallet      | Notes                    |
|-----------------|-------------|-------------|---------------------------|
| Desktop         | Chrome      | Leather/Hiro| Primary                   |
| Desktop         | Firefox     | Leather/Hiro|                          |
| Desktop         | Edge        | Leather/Hiro|                          |
| Mobile (Android)| Chrome      | Leather/Hiro| Wallet connection, signing|
| Mobile (iOS)    | Safari      | Leather/Hiro| Wallet connection, signing|

**Focus:**

- Responsive layout on claim and badges pages
- Wallet connection and transaction signing on mobile
- Performance (no long freezes during tx status)

---

## 6. Sign-off

| Date       | Tester | Notes |
|-----------|--------|--------|
|            |        |        |

---

**See also:**

- [MANUAL-TESTING-CHECKLIST.md](./MANUAL-TESTING-CHECKLIST.md) — off-chain and game mechanics
- [CLAIM-FLOW.md](./CLAIM-FLOW.md) — claim and mint flow design
- [BADGE-SYSTEM.md](./BADGE-SYSTEM.md) — badge tiers and on-chain behavior
