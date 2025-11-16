import { test, expect } from '@playwright/test'
import { goToHome, goToMenu, goToCategory } from './helpers/navigation'

test.describe('Menu Browsing Flow', () => {
  test('should navigate from homepage to menu', async ({ page }) => {
    await goToHome(page)

    // Click on "Menu" link in navigation
    await page.click('a[href="/menu"]')

    // Verify we're on the menu page
    await expect(page).toHaveURL('/menu')

    // Verify menu heading is visible
    await expect(page.locator('h1')).toContainText(/menu/i)
  })

  test('should display menu categories', async ({ page }) => {
    await goToMenu(page)

    // Wait for categories to load
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })

    // Check that at least one category is displayed
    const categories = await page.locator('[data-testid="menu-category"]').count()
    expect(categories).toBeGreaterThan(0)
  })

  test('should navigate to a specific category', async ({ page }) => {
    await goToMenu(page)

    // Wait for categories to load
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })

    // Click on the first category
    const firstCategory = page.locator('[data-testid="menu-category"]').first()
    const categoryName = await firstCategory.textContent()

    await firstCategory.click()

    // Wait for navigation
    await page.waitForLoadState('networkidle')

    // Verify URL changed (should be /menu/[category-slug])
    expect(page.url()).toMatch(/\/menu\/[a-z-]+/)

    // Verify category name is in the heading
    const heading = await page.locator('h1').textContent()
    expect(heading).toContain(categoryName?.trim())
  })

  test('should display menu items in a category', async ({ page }) => {
    await goToMenu(page)

    // Wait for and click first category
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()

    await page.waitForLoadState('networkidle')

    // Check that menu items are displayed
    const items = await page.locator('[data-testid="menu-item"]').count()

    // Should have at least one item
    expect(items).toBeGreaterThan(0)
  })

  test('should view menu item details', async ({ page }) => {
    await goToMenu(page)

    // Navigate to first category
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    // Click on first menu item
    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    const firstItem = page.locator('[data-testid="menu-item"]').first()
    const itemName = await firstItem.locator('h3').textContent()

    await firstItem.click()
    await page.waitForLoadState('networkidle')

    // Verify we're on the item detail page
    expect(page.url()).toMatch(/\/menu\/[a-z-]+\/[a-z-]+/)

    // Verify item name is displayed
    await expect(page.locator('h1')).toContainText(itemName?.trim() || '')

    // Verify "Add to Cart" button is present
    await expect(
      page.locator('button:has-text("Add to Cart")')
    ).toBeVisible()
  })

  test('should navigate back from item to category', async ({ page }) => {
    await goToMenu(page)

    // Navigate to category
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    const firstCategory = page.locator('[data-testid="menu-category"]').first()
    const categoryName = await firstCategory.textContent()
    await firstCategory.click()
    await page.waitForLoadState('networkidle')

    // Navigate to item
    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')

    // Go back
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Verify we're back on the category page
    const heading = await page.locator('h1').textContent()
    expect(heading).toContain(categoryName?.trim())
  })

  test('should display item price and description', async ({ page }) => {
    await goToMenu(page)

    // Navigate to first category and item
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')

    // Verify price is displayed with rupee symbol
    const priceElement = page.locator('[data-testid="item-price"]')
    const price = await priceElement.textContent()

    expect(price).toMatch(/₹/)
    expect(price).toMatch(/\d/)

    // Verify description exists (if present)
    const descriptionExists = await page
      .locator('[data-testid="item-description"]')
      .isVisible()

    if (descriptionExists) {
      const description = await page
        .locator('[data-testid="item-description"]')
        .textContent()
      expect(description).toBeTruthy()
    }
  })
})
