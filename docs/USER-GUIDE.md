# Badge Threes — User Guide (Testnet)

This guide explains how to connect your Stacks wallet, get testnet STX, mint badges, view on-chain badges, and update your high score when using Badge Threes on **Stacks testnet**.

---

## 1. Connect Your Wallet

Badge Threes supports **Leather** and **Hiro** wallets on Stacks testnet.

### Install a wallet

- **Leather** (recommended): [leather.io](https://leather.io) — install the browser extension and create or import a wallet.
- **Hiro**: [wallet.hiro.so](https://wallet.hiro.so) — install the extension and create or import a wallet.

### Switch to Testnet

1. Open your wallet extension.
2. Find the network selector (often in settings or the header).
3. Choose **Testnet** (or “Stacks Testnet”).  
   Testnet addresses start with **ST** (e.g. `ST22...`). Mainnet addresses start with **SP**.

### Connect in the app

1. Open Badge Threes (e.g. [http://localhost:3000](http://localhost:3000) when running locally).
2. Click **Connect wallet** in the top navigation.
3. Approve the connection in your wallet when prompted.
4. When connected, you’ll see your truncated address (e.g. `ST22...RBAQ`) in the header.

You can disconnect anytime via the same button.

---

## 2. Get Testnet STX

Minting badges and updating high score on-chain cost a small amount of STX for transaction fees. On **testnet**, STX has no real value; you can get it from a faucet.

### Option A: Hiro Explorer Sandbox (recommended)

1. Go to [Explorer Sandbox Faucet (testnet)](https://explorer.hiro.so/sandbox/faucet?chain=testnet).
2. Connect your Leather or Hiro wallet.
3. Click **Request STX** (or similar). You typically receive 500 STX per request.
4. Wait for the transaction to confirm.

### Option B: API faucet

If you have your testnet address (e.g. `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`), you can request STX via API:

```bash
curl -X POST "https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx?address=YOUR_STX_ADDRESS&stacking=false"
```

Replace `YOUR_STX_ADDRESS` with your STX testnet address.

### Option C: Other faucets

Search for “Stacks testnet faucet” or check community links (e.g. Stacks Discord, [LearnWeb3](https://www.diadata.org/web3-builder-hub/faucets/stacks-faucets/)).

**Note:** If a faucet is temporarily empty, try again later or use another source.

---

## 3. How to Mint Badges

1. **Play** the game on `/play` and reach the score needed for a tier (e.g. Bronze ≥ 384, Silver ≥ 768, Gold ≥ 1536, Elite ≥ 3072).
2. After the game ends, the badge **unlocks** (saved locally).
3. Go to the **Claim** page (`/claim`).
4. If you’re not connected, the app will ask you to **connect your wallet** first.
5. Click **Claim** on an unlocked badge. Confirm in the app dialog.
6. Your wallet will ask you to **sign the transaction** (mint NFT on Stacks testnet). Approve it.
7. Wait for the transaction to confirm. The app will show **pending**, then **success** (and usually a link to Stacks Explorer).
8. The badge is now **minted on-chain** and will appear on your `/badges` page and in your wallet’s NFT list.

Each tier can only be minted once per wallet. If you already minted that tier, the contract will reject a second mint.

---

## 4. How to View On-Chain Badges

- **In the app:** Open the **Badges** page (`/badges`). It shows both locally unlocked/claimed badges and badges minted on-chain. Minted badges are usually marked (e.g. on-chain or token ID).
- **In your wallet:** Open Leather or Hiro → NFTs (or Collectibles). You should see Badge Threes NFTs for the tiers you minted.
- **On the blockchain:** Use [Stacks Explorer (testnet)](https://explorer.stacks.co/?chain=testnet) and search for your address or the contract `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`.

---

## 5. How to Update High Score On-Chain

1. **Connect your wallet** (see section 1).
2. **Play** a game and reach a **new personal best** score.
3. When the game ends, the app may show an option to **sync** or **update high score** on-chain.
4. Confirm in the app and **sign the transaction** in your wallet.
5. After confirmation, your on-chain high score is updated. This can be used for leaderboards or verification.

If you skip the update, your score is still saved locally; you can sync the next time you beat your record.

---

## 6. FAQ

**Do I need a wallet to play?**  
No. You can play, unlock badges locally, and use the off-chain leaderboard without a wallet. You need a wallet only to **mint** badges and **sync high score** on-chain.

**Which network should I use?**  
For this guide, use **Stacks Testnet**. Do not send mainnet STX to testnet addresses.

**I don’t see “Connect wallet”.**  
Ensure the app is configured for testnet and that on-chain features are enabled (see README and `lib/featureFlags.ts`). Hard refresh the page and try again.

**Can I mint the same tier twice?**  
No. Each badge tier can be minted once per wallet. The contract will return an error if you try again.

**Where is the contract?**  
Testnet contract: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`. You can view it on Stacks Explorer (testnet).

---

## 7. Troubleshooting

| Issue | What to try |
|-------|-------------|
| **Wallet won’t connect** | Refresh the page; ensure the wallet extension is unlocked and set to **Testnet**. Try disconnecting and reconnecting. |
| **Transaction failed / reverted** | Check that your score meets the tier threshold. Ensure you haven’t already minted that tier. Check Stacks Explorer for the error reason. |
| **Insufficient STX** | Get testnet STX from a faucet (see section 2). |
| **Transaction pending forever** | Testnet can be slow. Check the transaction on Stacks Explorer; if it’s confirmed, refresh the app. |
| **Badges page doesn’t show on-chain badges** | Ensure you’re connected with the same wallet that minted. Refresh the page. Check that the app’s contract address is `...badgethrees` and network is testnet. |
| **“Contract not found” or similar** | Confirm env vars: `NEXT_PUBLIC_STACKS_NETWORK=testnet`, `NEXT_PUBLIC_CONTRACT_ADDRESS=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`. Restart the dev server. |

For more on configuration and deployment, see [README](../README.md), [OFFCHAIN-PHASE.md](./OFFCHAIN-PHASE.md), and [TESTNET-TO-MAINNET-MIGRATION-PLAN.md](./TESTNET-TO-MAINNET-MIGRATION-PLAN.md).
