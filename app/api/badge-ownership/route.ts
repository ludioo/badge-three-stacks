import { NextRequest, NextResponse } from 'next/server';
import { getBadgeOwnershipAllTiers } from '@/lib/stacks/badgeOwnershipServer';
import { FEATURES } from '@/lib/featureFlags';
import { contractConfig, isTestnet } from '@/lib/stacks/config';

export const dynamic = 'force-dynamic';

/** GET /api/badge-ownership?address=SP... — baca ownership semua tier lewat backend (Hiro). Returns empty when on-chain disabled. */
export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');
  if (!address || typeof address !== 'string' || address.trim() === '') {
    return NextResponse.json(
      { error: 'Missing or invalid address' },
      { status: 400 }
    );
  }

  const trimmed = address.trim();
  // Stacks address: SP (mainnet), ST (testnet), SM (multisig), dll. Panjang tipikal ~34–40.
  if (!/^S[PTM][0-9A-Za-z]{28,}$/.test(trimmed)) {
    return NextResponse.json(
      { error: 'Invalid Stacks address format' },
      { status: 400 }
    );
  }

  if (!FEATURES.ONCHAIN_ENABLED) {
    const res = NextResponse.json({ data: {} });
    res.headers.set('X-Stacks-Network', isTestnet ? 'testnet' : 'mainnet');
    res.headers.set('X-Onchain-Enabled', 'false');
    return res;
  }

  try {
    const data = await getBadgeOwnershipAllTiers(trimmed);
    const res = NextResponse.json({ data });
    res.headers.set('X-Stacks-Network', isTestnet ? 'testnet' : 'mainnet');
    res.headers.set('X-Contract-Address', contractConfig.address);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch badge ownership';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
