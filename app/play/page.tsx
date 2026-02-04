import type { Metadata } from 'next'
import { Game } from '@/components/game/Game'

export const metadata: Metadata = {
  title: 'Badge Three Stacks - Play',
  description: 'Badge Three Stacks: Threes-style game on Stacks. Combine 1+2→3, merge pairs to grow tiles, unlock badges with high scores.',
}

export default function PlayPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F4622F] mb-2">Badge Three Stacks</h1>
        <p className="text-sm sm:text-base text-[#4B5563]">Threes-style game on Stacks — combine 1+2 to make 3, then merge pairs (3+3→6, 6+6→12) to earn badges!</p>
      </div>

      <Game />
    </div>
  )
}
