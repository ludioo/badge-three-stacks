/**
 * GET /api/health — Health check for monitoring (Uptime Robot, cron, etc.)
 *
 * Verifies:
 * - App is running
 * - Stacks contract is reachable when on-chain enabled (read-only get-last-token-id via Hiro API)
 *
 * Returns 200 when contract is reachable (or not configured / on-chain disabled); 503 when contract unreachable.
 * Includes feature flag status for observability.
 */

import { NextResponse } from 'next/server';
import { FEATURES } from '@/lib/featureFlags';
import { contractConfig, apiUrl, isTestnet } from '@/lib/stacks/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const network = isTestnet ? 'testnet' : 'mainnet';
  const features = {
    onchainEnabled: FEATURES.ONCHAIN_ENABLED,
    badgeMinting: FEATURES.BADGE_MINTING,
    onchainScoreSubmission: FEATURES.ONCHAIN_SCORE_SUBMISSION,
    walletRequired: FEATURES.WALLET_REQUIRED,
  };

  const address = contractConfig.address;
  const [deployer, contractName] = (address || '').split('.');
  if (!FEATURES.ONCHAIN_ENABLED || !address || !deployer || !contractName) {
    return NextResponse.json(
      { status: 'ok', contract: FEATURES.ONCHAIN_ENABLED ? 'not_configured' : 'disabled', network, features },
      { status: 200 }
    );
  }

  try {
    const url = `${apiUrl}/v2/contracts/call-read/${deployer}/${contractName}/get-last-token-id`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: deployer, arguments: [] }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          status: 'degraded',
          contract: 'unreachable',
          network,
          features,
          error: `${res.status} ${res.statusText}`,
          details: text.slice(0, 200),
        },
        { status: 503 }
      );
    }

    const data = (await res.json()) as { okay?: boolean; result?: string };
    if (data.okay === false) {
      return NextResponse.json(
        {
          status: 'degraded',
          contract: 'error',
          network,
          features,
          error: 'Contract read returned not okay',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
        contract: 'reachable',
        network,
        features,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: 'degraded',
        contract: 'unreachable',
        network,
        features,
        error: message.slice(0, 200),
      },
      { status: 503 }
    );
  }
}
