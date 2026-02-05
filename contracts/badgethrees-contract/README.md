# Badge Threes Smart Contract

SIP-009 NFT contract for **Badge Threes** game achievements. Badge Threes uses Power-of-3 merge mechanics (1+2→3, 3+3→6, etc.).

## Overview

- **Contract name**: `badgethrees`
- **Purpose**: NFT badges for Badge Threes score milestones
- **Game**: Power-of-3 (Threes-style) mechanics; thresholds (384/768/1536/3072) are lower than 2048-style values because Threes is harder

## Contract Details

- **Network**: Testnet (deployed); Mainnet TBD
- **Address (Testnet)**: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
- **Deployer**: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`
- **Standard**: SIP-009 NFT

## Badge Tiers & Thresholds

(Threes is harder than 2048; thresholds aligned to Power-of-3 progression.)

| Tier   | Min score |
|--------|-----------|
| Bronze | ≥ 384     |
| Silver | ≥ 768     |
| Gold   | ≥ 1536    |
| Elite  | ≥ 3072    |

## Public Functions

- **`mint-badge`** `(tier string-ascii, score uint)` — Mint NFT for an achieved tier (score must meet tier threshold).
- **`update-high-score`** `(score uint)` — Update caller’s on-chain high score (only if higher).
- **`transfer`** `(token-id uint, sender principal, recipient principal)` — Transfer NFT (SIP-009).

## Read-Only Functions

- **`get-high-score`** `(player principal)` — Player’s high score.
- **`get-badge-ownership`** `(player principal, tier string-ascii)` — Token ID if player owns that tier, else `none`.
- **`get-badge-metadata`** `(token-id uint)` — Metadata for a token.
- **`get-badge-mint-count`** `(tier string-ascii)` — Total mints for that tier.
- **`get-last-token-id`** — Last minted token ID.
- **`get-token-uri`** `(token-id uint)` — Token metadata base URI.
- **`get-owner`** `(token-id uint)` — Owner of token.

## Events

Emitted via `print`; queryable via Stacks API / indexers.

- **`badge-minted`** — When a badge NFT is minted: `{ event, player, tier, token-id, score }`.
- **`high-score-updated`** — When high score is updated: `{ event, player, old-score, new-score }`.

## Error Codes

| Code | Constant             | Meaning                        |
|------|----------------------|--------------------------------|
| 1001 | ERR-INVALID-TIER     | Invalid badge tier             |
| 1002 | ERR-SCORE-TOO-LOW    | Score below tier threshold     |
| 1003 | ERR-ALREADY-MINTED   | Badge already minted for tier   |
| 1004 | ERR-UNAUTHORIZED     | Unauthorized                   |
| 1005 | ERR-INSUFFICIENT-FUNDS| Insufficient STX               |
| 1006 | ERR-NOT-FOUND        | Resource not found             |

## Testing

11 test cases cover: mint (valid/invalid/duplicate), all tiers, high score, ownership, events, and SIP-009 (get-owner, get-token-uri, transfer).

```bash
npm install
npm test
```

If Vitest fails (e.g. fork worker), use [Clarinet](https://docs.hiro.so/clarinet) if installed:

```bash
clarinet test
```

## Deployment

**Thresholds (384/768/1536/3072)** are fixed in the contract. If you change them in `badgethrees.clar`, you must **redeploy** the contract for the new values to apply on testnet/mainnet.

### Testnet

1. Configure `settings/Testnet.toml` with deployer and encrypted mnemonic (see Clarinet docs).
2. Generate plan (and adjust cost if needed):
   ```bash
   clarinet deployments generate --testnet --manual-cost
   ```
3. Deploy:
   ```bash
   clarinet deployments apply --testnet
   ```
4. Save contract address and tx ID; verify on [Stacks Explorer (testnet)](https://explorer.stacks.co/?chain=testnet).

**If you get `RecvError` when running `clarinet deployments apply --testnet`:**  
The error usually means the CLI cannot reach the **Bitcoin testnet node** (`bitcoind.testnet.stacks.co`) or the Stacks API (firewall, VPN, or network blocking). Your `Testnet.toml` and encrypted mnemonic are not the cause, and **the error is not specific to this project** (same config and plan shape as other contracts).

**Fix CLI – things to try:**

1. **Use an alternative Stacks endpoint in the plan**  
   Edit `deployments/default.testnet-plan.yaml` and set:
   ```yaml
   stacks-node: "https://stacks-node-api.testnet.stacks.co"
   ```
   (keep `bitcoin-node` as is.) Save and run `clarinet deployments apply --testnet` again.

2. **Regenerate the deployment plan**  
   Remove the plan, then regenerate (you will need to re-enter cost if you use `--manual-cost`):
   ```bash
   del deployments\default.testnet-plan.yaml
   clarinet deployments generate --testnet --manual-cost
   clarinet deployments apply --testnet
   ```

3. **Upgrade Clarinet**  
   Check version: `clarinet --version`. Install the latest from [Hiro Clarinet](https://docs.hiro.so/stacks/clarinet/) in case a newer release fixes connectivity or uses different endpoints.

4. **Network**  
   Try from another connection (e.g. hotspot), turn VPN off, or allow the CLI in firewall/antivirus.

If none of the above work, deploy via **[Hiro Platform](https://www.hiro.so/platform)** (Deploy Contracts → testnet) so broadcasting is done from Hiro’s servers.

### Mainnet

After testnet validation:

```bash
clarinet deployments generate --mainnet --manual-cost
clarinet deployments apply --mainnet
```

## Deployment History

- **Testnet**: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees` — deployed 2025-02-05; transactions successfully confirmed on Testnet (cost: 0.077610 STX)
- **Mainnet**: TBD

## Verify on Stacks Explorer

- Testnet: `https://explorer.stacks.co/?chain=testnet&contract=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
