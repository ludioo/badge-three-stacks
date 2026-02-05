import type { Metadata } from 'next'
import { BadgesGrid } from '@/components/badge/BadgesGrid'

export const metadata: Metadata = {
  title: 'badgethrees-stacks - Badges',
  description:
    'View all Badge Threes tiers, including on-chain NFTs and your unlock progress.',
}

export default function BadgesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F4622F] mb-2">Badges</h1>
        <p className="text-sm sm:text-base text-[#4B5563]">
          Track your unlocked badges, see which ones are minted on-chain, and what is
          ready to claim.
        </p>
      </div>

      <BadgesGrid />
    </div>
  )
}
