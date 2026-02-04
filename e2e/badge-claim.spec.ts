import { test, expect } from '@playwright/test'

const badgesFixture = [
  { tier: 'bronze', threshold: 1024, unlocked: true, claimed: false },
  { tier: 'silver', threshold: 2048, unlocked: false, claimed: false },
  { tier: 'gold', threshold: 4096, unlocked: false, claimed: false },
  { tier: 'elite', threshold: 8192, unlocked: false, claimed: false },
]

test.describe('badge claim flow', () => {
  test('claim page shows off-chain mode when minting disabled', async ({ page }) => {
    await page.goto('/claim')

    await expect(page.getByRole('heading', { name: 'Claim Badges' })).toBeVisible()
    await expect(page.getByText('Off-chain mode')).toBeVisible()
    await expect(
      page.getByText(/Badge minting on the blockchain is disabled/, { exact: false })
    ).toBeVisible()
    // With wallet disconnected, claimable list is empty; when minting is off, any claim button would show "Coming soon"
  })

  test.skip('can claim an unlocked badge and see it owned (run when BADGE_MINTING is true)', async ({ page }) => {
    await page.addInitScript((badges) => {
      window.localStorage.setItem('badges_v1', JSON.stringify({ badges }))
    }, badgesFixture)

    await page.goto('/')
    await page.evaluate((badges) => {
      window.localStorage.setItem('badges_v1', JSON.stringify({ badges }))
    }, badgesFixture)
    await page.goto('/claim')

    await expect(page.getByText('1 badge ready to claim.')).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: 'Claim badge' }).click()

    await expect(
      page.getByRole('heading', { name: 'Confirm badge claim' })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Confirm claim' }).click()

    const successBanner = page.getByText('Badge claimed!').locator('..')
    await expect(successBanner).toBeVisible()
    const viewBadgesLink = successBanner.getByRole('link', { name: 'View badges' })
    await Promise.all([
      page.waitForURL('**/badges'),
      viewBadgesLink.click(),
    ])

    await expect(page).toHaveURL(/\/badges$/)
    await expect(page.getByRole('heading', { name: /^Badges$/, level: 1 })).toBeVisible()
    await expect(page.getByText('Owned: 1')).toBeVisible()
    await expect(page.getByText('Claimable: 0')).toBeVisible()
  })
})
