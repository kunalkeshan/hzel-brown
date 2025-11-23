import { test, expect } from '@playwright/test'
import {
  goToHome,
  goToMenu,
  goToAbout,
  goToContact,
  goToCart,
} from './helpers/navigation'

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots of key pages and compare them against baselines.
 * Baselines are stored in e2e/screenshots/ and committed to git.
 * Test results and diffs are excluded via .gitignore.
 *
 * To update baselines: pnpm test:e2e --update-snapshots
 */

test.describe('Visual Regression', () => {
  test.describe('Desktop Views', () => {
    test.use({ viewport: { width: 1920, height: 1080 } })

    test('homepage should match screenshot', async ({ page }) => {
      await goToHome(page)

      // Wait for all images and fonts to load
      await page.waitForLoadState('networkidle')

      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        // Allow small differences for fonts across OS
        threshold: 0.2,
      })
    })

    test('menu page should match screenshot', async ({ page }) => {
      await goToMenu(page)
      await page.waitForLoadState('networkidle')

      // Wait for menu categories to load
      await page.waitForSelector('[data-testid="menu-category"]', {
        timeout: 10000,
      })

      await expect(page).toHaveScreenshot('menu-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('about page should match screenshot', async ({ page }) => {
      await goToAbout(page)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('about-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('contact page should match screenshot', async ({ page }) => {
      await goToContact(page)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('contact-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('cart page should match screenshot', async ({ page }) => {
      await goToCart(page)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('cart-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('menu category page should match screenshot', async ({ page }) => {
      await goToMenu(page)

      // Navigate to first category
      await page.waitForSelector('[data-testid="menu-category"]', {
        timeout: 10000,
      })
      await page.locator('[data-testid="menu-category"]').first().click()
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('category-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('menu item detail page should match screenshot', async ({ page }) => {
      await goToMenu(page)

      // Navigate to first category
      await page.waitForSelector('[data-testid="menu-category"]', {
        timeout: 10000,
      })
      await page.locator('[data-testid="menu-category"]').first().click()
      await page.waitForLoadState('networkidle')

      // Navigate to first item
      await page.waitForSelector('[data-testid="menu-item"]', {
        timeout: 10000,
      })
      await page.locator('[data-testid="menu-item"]').first().click()
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('item-detail-desktop.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })
  })

  test.describe('Mobile Views', () => {
    test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE size

    test('homepage mobile should match screenshot', async ({ page }) => {
      await goToHome(page)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('menu page mobile should match screenshot', async ({ page }) => {
      await goToMenu(page)
      await page.waitForLoadState('networkidle')

      await page.waitForSelector('[data-testid="menu-category"]', {
        timeout: 10000,
      })

      await expect(page).toHaveScreenshot('menu-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('cart page mobile should match screenshot', async ({ page }) => {
      await goToCart(page)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('cart-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2,
      })
    })
  })

  test.describe('Component-Level Screenshots', () => {
    test.use({ viewport: { width: 1920, height: 1080 } })

    test('navbar should match screenshot', async ({ page }) => {
      await goToHome(page)
      await page.waitForLoadState('networkidle')

      const navbar = page.locator('nav').first()
      await expect(navbar).toHaveScreenshot('navbar.png', {
        animations: 'disabled',
        threshold: 0.2,
      })
    })

    test('footer should match screenshot', async ({ page }) => {
      await goToHome(page)
      await page.waitForLoadState('networkidle')

      const footer = page.locator('footer').first()
      await expect(footer).toHaveScreenshot('footer.png', {
        animations: 'disabled',
        threshold: 0.2,
      })
    })
  })
})
