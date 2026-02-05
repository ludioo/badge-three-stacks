'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ErrorModalProps {
  /** Whether the modal is open. */
  open: boolean
  /** Callback when open state changes (e.g. user dismisses). */
  onOpenChange: (open: boolean) => void
  /** Title of the error (e.g. "Transaction failed"). */
  title: string
  /** Main error message. */
  message: string
  /** Optional suggested next steps (displayed below message). */
  suggestedSteps?: string
  /** Called when user clicks Retry. */
  onRetry?: () => void
  /** Help link URL (e.g. docs or faucet). When set, "Get help" button is shown. */
  helpHref?: string
  /** Help link label. Default "Get help". */
  helpLabel?: string
  /** Optional class name for the content. */
  className?: string
}

/**
 * Critical error modal. Requires user action to dismiss.
 * Use for transaction failures, insufficient STX, etc. Supports Retry, Cancel, and optional Get help.
 */
export function ErrorModal({
  open,
  onOpenChange,
  title,
  message,
  suggestedSteps,
  onRetry,
  helpHref,
  helpLabel = 'Get help',
  className,
}: ErrorModalProps) {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
              aria-hidden
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="space-y-2 pt-1">
              <p className="text-sm text-muted-foreground">{message}</p>
              {suggestedSteps && (
                <p className="text-sm text-muted-foreground">{suggestedSteps}</p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {helpHref && (
            <Button
              variant="outline"
              asChild
              className="order-first w-full sm:order-none sm:w-auto"
            >
              <a href={helpHref} target="_blank" rel="noopener noreferrer">
                {helpLabel}
              </a>
            </Button>
          )}
          <div className="flex w-full flex-row justify-end gap-2 sm:w-auto">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {onRetry && (
              <Button onClick={onRetry}>Try again</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
