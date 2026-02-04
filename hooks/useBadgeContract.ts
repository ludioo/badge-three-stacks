'use client'

/**
 * Badge Contract Interaction Hook
 * 
 * Hook untuk berinteraksi dengan Badge Threes smart contract.
 * When FEATURES.BADGE_MINTING is false, contract calls return early with a clear error.
 */

import { useConnect } from '@stacks/connect-react';
import { useState } from 'react';
import { stringAsciiCV, uintCV, principalCV } from '@stacks/transactions';
import { FEATURES } from '@/lib/featureFlags';
import { network, contractConfig, getExplorerUrl } from '@/lib/stacks/config';
import { CONTRACT_FUNCTIONS, ERROR_MESSAGES } from '@/lib/stacks/constants';
import type { TransactionResult, MintBadgeOptions, UpdateHighScoreOptions } from '@/lib/stacks/types';

const OFFCHAIN_MESSAGE = 'Badge minting is disabled in off-chain mode.';

export function useBadgeContract() {
  const { doContractCall } = useConnect();
  const [transactionResult, setTransactionResult] = useState<TransactionResult>({
    status: 'idle',
  });

  /**
   * Mint badge NFT
   */
  const mintBadge = async (options: MintBadgeOptions): Promise<TransactionResult> => {
    if (!FEATURES.BADGE_MINTING) {
      const result: TransactionResult = { status: 'error', error: OFFCHAIN_MESSAGE };
      setTransactionResult(result);
      return result;
    }

    const { tier, score, onFinish, onCancel } = options;

    setTransactionResult({ status: 'pending' });

    try {
      await doContractCall({
        network,
        contractAddress: contractConfig.address.split('.')[0],
        contractName: contractConfig.name,
        functionName: CONTRACT_FUNCTIONS.MINT_BADGE,
        functionArgs: [
          stringAsciiCV(tier),
          uintCV(score),
        ],
        onFinish: (data) => {
          const txId = data.txId;
          setTransactionResult({
            status: 'success',
            txId,
          });
          onFinish?.(data);
        },
        onCancel: () => {
          setTransactionResult({
            status: 'error',
            error: 'Transaction cancelled by user',
          });
          onCancel?.();
        },
      });

      return transactionResult;
    } catch (error: any) {
      const errorMessage = error?.message || 'Transaction failed';
      const errorCode = extractErrorCode(errorMessage);
      
      setTransactionResult({
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      });

      return {
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      };
    }
  };

  /**
   * Update high score on-chain
   */
  const updateHighScore = async (options: UpdateHighScoreOptions): Promise<TransactionResult> => {
    if (!FEATURES.ONCHAIN_SCORE_SUBMISSION) {
      const result: TransactionResult = { status: 'error', error: 'On-chain score submission is disabled in off-chain mode.' };
      setTransactionResult(result);
      return result;
    }

    const { score, onFinish, onCancel } = options;

    setTransactionResult({ status: 'pending' });

    try {
      await doContractCall({
        network,
        contractAddress: contractConfig.address.split('.')[0],
        contractName: contractConfig.name,
        functionName: CONTRACT_FUNCTIONS.UPDATE_HIGH_SCORE,
        functionArgs: [uintCV(score)],
        onFinish: (data) => {
          const txId = data.txId;
          setTransactionResult({
            status: 'success',
            txId,
          });
          onFinish?.(data);
        },
        onCancel: () => {
          setTransactionResult({
            status: 'error',
            error: 'Transaction cancelled by user',
          });
          onCancel?.();
        },
      });

      return transactionResult;
    } catch (error: any) {
      const errorMessage = error?.message || 'Transaction failed';
      const errorCode = extractErrorCode(errorMessage);
      
      setTransactionResult({
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      });

      return {
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      };
    }
  };

  /**
   * Extract error code from error message
   */
  const extractErrorCode = (message: string): number | undefined => {
    const match = message.match(/\(err\s+u(\d+)\)/i);
    return match ? parseInt(match[1], 10) : undefined;
  };

  /**
   * Transfer badge NFT
   * @param options.tokenId - Token ID to transfer
   * @param options.sender - Sender address (must match tx-sender)
   * @param options.recipient - Recipient address
   */
  const transferBadge = async (options: {
    tokenId: number;
    sender: string;
    recipient: string;
    onFinish?: (data: unknown) => void;
    onCancel?: () => void;
  }): Promise<TransactionResult> => {
    if (!FEATURES.ONCHAIN_ENABLED) {
      const result: TransactionResult = { status: 'error', error: OFFCHAIN_MESSAGE };
      setTransactionResult(result);
      return result;
    }

    const { tokenId, sender, recipient, onFinish, onCancel } = options;

    setTransactionResult({ status: 'pending' });

    try {
      await doContractCall({
        network,
        contractAddress: contractConfig.address.split('.')[0],
        contractName: contractConfig.name,
        functionName: CONTRACT_FUNCTIONS.TRANSFER,
        functionArgs: [
          uintCV(tokenId),
          principalCV(sender), // sender (must match tx-sender)
          principalCV(recipient), // recipient
        ],
        onFinish: (data) => {
          const txId = data.txId;
          setTransactionResult({
            status: 'success',
            txId,
          });
          onFinish?.(data);
        },
        onCancel: () => {
          setTransactionResult({
            status: 'error',
            error: 'Transaction cancelled by user',
          });
          onCancel?.();
        },
      });

      return transactionResult;
    } catch (error: any) {
      const errorMessage = error?.message || 'Transaction failed';
      const errorCode = extractErrorCode(errorMessage);
      
      setTransactionResult({
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      });

      return {
        status: 'error',
        error: errorCode ? ERROR_MESSAGES[errorCode] || errorMessage : errorMessage,
        errorCode,
      };
    }
  };

  /**
   * Get explorer URL for transaction
   */
  const getTransactionUrl = (txId?: string) => {
    return txId ? getExplorerUrl(txId) : null;
  };

  return {
    mintBadge,
    updateHighScore,
    transferBadge,
    transactionResult,
    getTransactionUrl,
  };
}
