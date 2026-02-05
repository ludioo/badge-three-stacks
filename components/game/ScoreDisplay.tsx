'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useStacksWallet } from '@/hooks/useStacksWallet'
import { useBadgeContract } from '@/hooks/useBadgeContract'
import { useBadgeOnchain } from '@/hooks/useBadgeOnchain'
import { FEATURES } from '@/lib/featureFlags'
import { loadHighScore } from '@/lib/highScore'
import { apiUrl } from '@/lib/stacks/config'
import {
  TransactionStatus as TransactionStatusUI,
  type TransactionStatusType,
} from '@/components/ui/transaction-status'
import { Button } from '@/components/ui/button'

interface ScoreDisplayProps {
  score: number
  className?: string
}

export function ScoreDisplay({ score, className }: ScoreDisplayProps) {
  const [delta, setDelta] = useState<number | null>(null)
  const [localHighScore, setLocalHighScore] = useState(0)
  const [onchainHighScore, setOnchainHighScore] = useState<number | null>(null)
  const [syncStatus, setSyncStatus] = useState<TransactionStatusType>('idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [syncTxId, setSyncTxId] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const prevScoreRef = useRef(score)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const { address, isAuthenticated } = useStacksWallet()
  const { updateHighScore: updateHighScoreOnchain, getTransactionUrl } = useBadgeContract()
  const { getHighScore: getOnchainHighScore } = useBadgeOnchain()

  useEffect(() => {
    const refresh = () => {
      setLocalHighScore(loadHighScore())
    }
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  useEffect(() => {
    if (!FEATURES.ONCHAIN_SCORE_SUBMISSION || !isAuthenticated || !address) {
      setOnchainHighScore(null)
      return
    }
    getOnchainHighScore(address).then((result) => {
      if (result.data != null) {
        setOnchainHighScore(result.data.score)
      } else {
        setOnchainHighScore(null)
      }
    })
  }, [isAuthenticated, address, getOnchainHighScore, syncStatus])

  useEffect(() => {
    const prev = prevScoreRef.current
    if (score > prev) {
      setDelta(score - prev)
    }
    prevScoreRef.current = score
  }, [score])

  useEffect(() => {
    if (delta === null) return
    const timeout = setTimeout(() => setDelta(null), 700)
    return () => clearTimeout(timeout)
  }, [delta])

  const startPollingSyncTx = useCallback((txId: string) => {
    const normalizedTxId = txId.trim().replace(/^0x/i, '')
    const maxPolls = 60
    let count = 0

    const poll = async () => {
      count++
      setPollCount(count)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        const res = await fetch(`${apiUrl}/extended/v1/tx/${normalizedTxId}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (res.status === 404) {
          if (count >= maxPolls && pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
            setSyncStatus('error')
            setSyncError('Transaction not found after multiple attempts. Check Stacks Explorer.')
          }
          return
        }
        if (!res.ok) {
          if (count >= maxPolls && pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
            setSyncStatus('error')
            setSyncError('Failed to confirm transaction. Check Stacks Explorer.')
          }
          return
        }
        const data = await res.json()
        const txStatus = data?.tx_status || data?.status || data?.txStatus
        if (txStatus === 'success') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setOnchainHighScore(loadHighScore())
          setSyncStatus('success')
        }
      } catch {
        if (count >= maxPolls && pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
          setSyncStatus('error')
          setSyncError('Failed to confirm transaction. Check Stacks Explorer.')
        }
      }
    }

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    pollingIntervalRef.current = setInterval(poll, 5000)
    poll()
  }, [])

  const handleSyncToBlockchain = useCallback(() => {
    const best = loadHighScore()
    if (best <= 0) return
    setSyncStatus('pending')
    setSyncError(null)
    setSyncTxId(null)

    updateHighScoreOnchain({
      score: best,
      onFinish: (data) => {
        const txId = data?.txId
        if (txId && txId.trim()) {
          setSyncTxId(txId)
          setSyncStatus('polling')
          startPollingSyncTx(txId)
        } else {
          setSyncStatus('error')
          setSyncError('No transaction ID received')
        }
      },
      onCancel: () => {
        setSyncStatus('idle')
        setSyncError(null)
      },
    })
  }, [updateHighScoreOnchain, startPollingSyncTx])

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const showOnchainSection = FEATURES.ONCHAIN_SCORE_SUBMISSION && isAuthenticated && address
  const onchainScore = onchainHighScore ?? 0
  const needsSync = showOnchainSection && localHighScore > onchainScore && localHighScore > 0

  return (
    <div className={cn(
      'flex flex-col items-center gap-2',
      className
    )}>
      <div className="text-sm font-medium text-[#4B5563] uppercase tracking-wide">
        Score
      </div>
      <div className="relative">
        <div className={cn(
          'px-4 sm:px-5 py-2.5 bg-white rounded-xl border border-[#FD9E7F]',
          'text-xl sm:text-2xl font-bold text-[#F4622F]',
          'min-w-[120px] sm:min-w-[128px] text-center',
          'shadow-[0_10px_20px_rgba(244,98,47,0.08)]'
        )}>
          {score.toLocaleString()}
        </div>
        <AnimatePresence>
          {delta !== null && (
            <motion.span
              key={delta}
              initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: prefersReducedMotion ? 0 : -12, scale: 1 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -24, scale: prefersReducedMotion ? 1 : 0.95 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
              className="absolute -right-2 -top-2 rounded-full bg-[#F4622F]/90 px-2 py-0.5 text-xs font-semibold text-white shadow"
            >
              +{delta.toLocaleString()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {(localHighScore > 0 || showOnchainSection) && (
        <div className="mt-2 flex flex-col items-center gap-1.5 text-xs text-[#4B5563]">
          {localHighScore > 0 && (
            <p className="font-medium">
              Best: <span className="text-[#F4622F]">{localHighScore.toLocaleString()}</span>
            </p>
          )}
          {showOnchainSection && (
            <p className="font-medium">
              On-chain: <span className="text-[#E8552A]">{onchainHighScore != null ? onchainHighScore.toLocaleString() : '—'}</span>
            </p>
          )}
          {needsSync && (syncStatus === 'idle' || syncStatus === 'error') && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-[#FD9E7F] text-[#F4622F] hover:bg-[#FD9E7F]/10"
              onClick={handleSyncToBlockchain}
            >
              Sync to blockchain
            </Button>
          )}
        </div>
      )}

      {syncStatus !== 'idle' && (
        <div className="mt-2 w-full max-w-sm">
          <TransactionStatusUI
            status={syncStatus}
            txId={syncTxId}
            txUrl={syncTxId ? getTransactionUrl(syncTxId) : null}
            error={syncError}
            onRetry={handleSyncToBlockchain}
            pollCount={pollCount}
            maxPolls={60}
            pendingMessage="Waiting for wallet approval..."
            successMessage="High score updated!"
            successDescription="Your high score is now stored on the Stacks blockchain."
            pollingMessage="Updating high score on-chain..."
          />
        </div>
      )}
    </div>
  )
}