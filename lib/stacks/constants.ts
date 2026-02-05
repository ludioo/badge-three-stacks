/**
 * Stacks Contract Constants
 *
 * Constants for Badge Threes (badgethrees) smart contract interaction.
 */

export const CONTRACT_NAME = 'badgethrees';

// Function names
export const CONTRACT_FUNCTIONS = {
  MINT_BADGE: 'mint-badge',
  UPDATE_HIGH_SCORE: 'update-high-score',
  TRANSFER: 'transfer',
  GET_HIGH_SCORE: 'get-high-score',
  GET_BADGE_OWNERSHIP: 'get-badge-ownership',
  GET_BADGE_METADATA: 'get-badge-metadata',
  GET_BADGE_MINT_COUNT: 'get-badge-mint-count',
  GET_LAST_TOKEN_ID: 'get-last-token-id',
  GET_TOKEN_URI: 'get-token-uri',
  GET_OWNER: 'get-owner',
} as const;

// Badge tiers
export const BADGE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  ELITE: 'elite',
} as const;

export type BadgeTier = typeof BADGE_TIERS[keyof typeof BADGE_TIERS];

// Re-export for convenience
export type { BadgeTier as BadgeTierType };

// Badge tier thresholds
export const BADGE_THRESHOLDS = {
  [BADGE_TIERS.BRONZE]: 384,
  [BADGE_TIERS.SILVER]: 768,
  [BADGE_TIERS.GOLD]: 1536,
  [BADGE_TIERS.ELITE]: 3072,
} as const;

// Error codes
export const ERROR_CODES = {
  ERR_INVALID_TIER: 1001,
  ERR_SCORE_TOO_LOW: 1002,
  ERR_ALREADY_MINTED: 1003,
  ERR_UNAUTHORIZED: 1004,
  ERR_INSUFFICIENT_FUNDS: 1005,
  ERR_NOT_FOUND: 1006,
} as const;

// Error messages mapping (user-facing; align with plan Phase 6 error handling strategy)
export const ERROR_MESSAGES: Record<number, string> = {
  [ERROR_CODES.ERR_INVALID_TIER]: 'Invalid badge tier',
  [ERROR_CODES.ERR_SCORE_TOO_LOW]: 'Score is too low for this badge tier',
  [ERROR_CODES.ERR_ALREADY_MINTED]: "You've already minted this badge!",
  [ERROR_CODES.ERR_UNAUTHORIZED]: 'Unauthorized operation',
  [ERROR_CODES.ERR_INSUFFICIENT_FUNDS]: 'Insufficient STX for transaction fee. Get testnet STX from a faucet and try again.',
  [ERROR_CODES.ERR_NOT_FOUND]: 'Resource not found',
};

/**
 * Returns a user-friendly message for a contract error code.
 */
export function getErrorMessage(errorCode: number): string {
  return ERROR_MESSAGES[errorCode] ?? 'Unknown error occurred'
}

/**
 * Whether the error is retryable (e.g. after user adds STX).
 */
export function isRetryableError(errorCode: number): boolean {
  return errorCode === ERROR_CODES.ERR_INSUFFICIENT_FUNDS
}
