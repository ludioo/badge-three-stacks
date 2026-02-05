/**
 * Centralized feature flags for Badge Threes.
 * Used to disable on-chain features during the off-chain phase.
 * Toggle these when moving to testnet/mainnet.
 */

export const FEATURES = {
  /** Master switch: when false, all on-chain features are disabled. */
  ONCHAIN_ENABLED: true,
  /** Badge minting (claim as NFT on Stacks). */
  BADGE_MINTING: true,
  /** Submit high score on-chain via contract. When false, only off-chain leaderboard is used. */
  ONCHAIN_SCORE_SUBMISSION: true,
  /** When false, wallet connect is hidden; game and leaderboard work without wallet. */
  WALLET_REQUIRED: true,
} as const;

export type FeatureFlags = typeof FEATURES;
