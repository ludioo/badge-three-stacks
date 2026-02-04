import { test, expect } from '@playwright/test'

const badgesFixture = [
  { tier: 'bronze', threshold: 1024, unlocked: false, claimed: false },
  { tier: 'silver', threshold: 2048, unlocked: true, claimed: false },
  { tier: 'gold', threshold: 4096, unlocked: false, claimed: false },
  { tier: 'elite', threshold: 8192, unlocked: false, claimed: false },
]

test.describe('badges page', () => {
  test('shows heading and unlock progress', async ({ page }) => {
    await page.addInitScript((badges) => {
      window.localStorage.setItem('badges_v1', JSON.stringify({ badges }))
    }, badgesFixture)

    await page.goto('/')
    await page.evaluate((badges) => {
      window.localStorage.setItem('badges_v1', JSON.stringify({ badges }))
    }, badgesFixture)
    await page.goto('/badges')

    await expect(page.getByRole('heading', { name: 'Badges' })).toBeVisible()
    // Without wallet connected, effective badges are all locked (off-chain behavior)
    await expect(page.getByText('Locked: 4')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('0 of 4 badges unlocked')).toBeVisible()
  })
})
