import { test, expect, type Page } from '@playwright/test'

const navigateFromHeader = async (page: Page, name: string) => {
  const menuButton = page.getByRole('button', { name: 'Toggle navigation menu' })
  if (await menuButton.isVisible()) {
    await menuButton.click()
    await page.locator('#mobile-navigation').getByRole('link', { name }).click()
    return
  }

  // Desktop: use nav scope so "Badges" doesn't match homepage "View Badges"
  await page.getByRole('navigation').getByRole('link', { name }).click()
}

test.describe('navigation', () => {
  test('can reach core pages from home', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Welcome to Badge Three Stacks' })
    ).toBeVisible()

    await page.getByRole('link', { name: 'Start Playing' }).click()
    await expect(
      page.getByRole('heading', { name: 'Badge Three Stacks' })
    ).toBeVisible()

    await navigateFromHeader(page, 'Badges')
    await expect(page.getByRole('heading', { name: 'Badges' })).toBeVisible()

    await navigateFromHeader(page, 'Claim')
    await expect(
      page.getByRole('heading', { name: 'Claim Badges' })
    ).toBeVisible()

    await navigateFromHeader(page, 'Leaderboard')
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible()
  })
})
