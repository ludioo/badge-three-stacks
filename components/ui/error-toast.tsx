'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ErrorToastSeverity = 'error' | 'warning' | 'info'

export interface ErrorToastProps {
  /** Whether the toast is visible. */
  open: boolean
  /** Callback when toast should close (dismiss or auto-dismiss). */
  onClose: () => void
  /** Message to display. */
  message: string
  /** Severity affects styling only. */
  severity?: ErrorToastSeverity
  /** Optional retry label; when set, retry button is shown. */
  onRetry?: () => void
  /** Auto-dismiss after this many ms; 0 = no auto-dismiss. Default 5000. */
  autoDismissMs?: number
  /** Optional class name for the container. */
  className?: string
}

const severityStyles: Record<ErrorToastSeverity, string> = {
  error: 'border-red-200 bg-red-50 text-red-900 [&_button]:text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 [&_button]:text-amber-700',
  info: 'border-blue-200 bg-blue-50 text-blue-900 [&_button]:text-blue-700',
}

/**
 * Non-critical error toast. Auto-dismisses after 5s by default; supports optional retry and close.
 * Use for sync failures, network hiccups, etc.
 */
export function ErrorToast({
  open,
  onClose,
  message,
  severity = 'error',
  onRetry,
  autoDismissMs = 5000,
  className,
}: ErrorToastProps) {
  React.useEffect(() => {
    if (!open || autoDismissMs <= 0) return
    const t = setTimeout(onClose, autoDismissMs)
    return () => clearTimeout(t)
  }, [open, autoDismissMs, onClose])

  if (!open) return null

  return (
    <div
      role="alert"
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg',
        severityStyles[severity],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <p className="min-w-0 flex-1 text-sm font-medium">{message}</p>
        <div className="flex shrink-0 items-center gap-1">
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                onRetry()
                onClose()
              }}
              className="rounded px-2 py-1 text-xs font-semibold underline hover:no-underline"
            >
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
