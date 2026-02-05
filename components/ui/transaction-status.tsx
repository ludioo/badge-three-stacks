'use client'

import { cn } from '@/lib/utils'

export type TransactionStatusType = 'idle' | 'pending' | 'polling' | 'success' | 'error'

export interface TransactionStatusProps {
  /** Current transaction status. When 'idle', nothing is rendered. */
  status: TransactionStatusType
  /** Transaction ID (for explorer link). */
  txId?: string | null
  /** Full URL to view transaction (e.g. from getExplorerUrl(txId)). */
  txUrl?: string | null
  /** Error message when status is 'error'. */
  error?: string | null
  /** Called when user clicks retry (error state). */
  onRetry?: () => void
  /** Optional: poll attempt count for polling state (e.g. "Attempt 3/60"). */
  pollCount?: number
  /** Optional: max poll attempts for polling state. */
  maxPolls?: number
  /** Optional: custom label for "check status" / refresh during polling. */
  onCheckStatus?: () => void
  /** Optional class name for the container. */
  className?: string
  /** Optional: override pending message. */
  pendingMessage?: string
  /** Optional: override success message. */
  successMessage?: string
  /** Optional: override polling message. */
  pollingMessage?: string
  /** Optional: override success description (default: badge minted message). */
  successDescription?: string
}

/**
 * Reusable transaction status UI for mint/sync flows.
 * Renders pending (spinner), polling (spinner + link), success (checkmark + link), or error (message + retry).
 */
export function TransactionStatus({
  status,
  txId,
  txUrl,
  error,
  onRetry,
  pollCount = 0,
  maxPolls = 60,
  onCheckStatus,
  className,
  pendingMessage = 'Waiting for wallet approval...',
  successMessage = 'Transaction confirmed!',
  pollingMessage = 'Minting badge onchain...',
  successDescription = 'Your badge has been minted as an NFT on the Stacks blockchain.',
}: TransactionStatusProps) {
  if (status === 'idle') return null

  const linkUrl = txUrl || (txId ? `https://explorer.stacks.co/?chain=testnet&txid=${txId.replace(/^0x/i, '')}` : null)

  if (status === 'pending') {
    return (
      <div
        className={cn(
          'rounded-lg border border-[#FB6331] bg-[#FD9E7F]/20 p-3 sm:p-4',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-[#F4622F] border-t-transparent"
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#F4622F] sm:text-sm">{pendingMessage}</p>
            <p className="mt-1 text-xs text-[#E8552A]">
              Please approve the transaction in your wallet extension.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'polling') {
    return (
      <div
        className={cn(
          'rounded-lg border border-[#FB6331] bg-[#FD9E7F]/20 p-3 sm:p-4',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-[#F4622F] border-t-transparent"
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#F4622F] sm:text-sm">{pollingMessage}</p>
            <p className="mt-1 text-xs text-[#E8552A]">
              Transaction submitted. Waiting for confirmation…
              {maxPolls > 0 && ` (Attempt ${pollCount}/${maxPolls})`}
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              {linkUrl && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-xs text-[#F4622F] underline hover:text-[#E8552A]"
                >
                  View on Stacks Explorer
                </a>
              )}
              {onCheckStatus && (
                <button
                  type="button"
                  onClick={onCheckStatus}
                  className="text-left text-xs text-[#F4622F] underline hover:text-[#E8552A] sm:text-left"
                >
                  Check status now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-lg border border-[#FB6331] bg-[#FD9E7F]/20 p-3 sm:p-4',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-[#F4622F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#F4622F] sm:text-sm">{successMessage}</p>
            <p className="mt-1 text-xs text-[#E8552A]">
              {successDescription}
            </p>
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block break-all text-xs text-[#F4622F] underline hover:text-[#E8552A]"
              >
                View transaction on Stacks Explorer
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error' && error) {
    return (
      <div
        className={cn(
          'rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4',
          className
        )}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-red-900 sm:text-sm">Transaction failed</p>
            <p className="mt-1 break-words text-xs text-red-700">{error}</p>
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block break-all text-xs text-red-600 underline hover:text-red-800"
              >
                View transaction on Stacks Explorer
              </a>
            )}
            {onRetry && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-sm font-medium text-red-700 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
