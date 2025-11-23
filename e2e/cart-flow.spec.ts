import { test, expect } from '@playwright/test'
import { goToMenu } from './helpers/navigation'

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test from menu page
    await goToMenu(page)
  })

  test('should add item to cart from item detail page', async ({ page }) => {
    // Navigate to first category
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    // Navigate to first item
    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    const firstItem = page.locator('[data-testid="menu-item"]').first()
    const itemName = await firstItem.locator('h3').textContent()

    await firstItem.click()
    await page.waitForLoadState('networkidle')

    // Add to cart
    await page.click('button:has-text("Add to Cart")')

    // Verify cart badge shows 1 item
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')

    // Verify success message or toast (if implemented)
    // await expect(page.locator('text=Added to cart')).toBeVisible()
  })

  test('should update cart badge when adding multiple items', async ({
    page,
  }) => {
    // Navigate to first category
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })

    // Add first item
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Verify cart has 1 item
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')

    // Go back to category
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Add second item
    await page.locator('[data-testid="menu-item"]').nth(1).click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Verify cart has 2 items
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('2')
  })

  test('should open cart modal/sidebar when clicking cart button', async ({
    page,
  }) => {
    // Add an item first
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Click cart button
    await page.click('[data-testid="cart-button"]')

    // Verify cart modal/sidebar is visible
    await expect(
      page.locator('[data-testid="cart-modal"], [data-testid="cart-sidebar"]')
    ).toBeVisible()
  })

  test('should display correct item in cart', async ({ page }) => {
    // Navigate and get item name
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    const firstItem = page.locator('[data-testid="menu-item"]').first()
    const itemName = await firstItem.locator('h3').textContent()

    // Add to cart
    await firstItem.click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Verify item is in cart
    await expect(page.locator(`text=${itemName?.trim()}`)).toBeVisible()
  })

  test('should increment item quantity in cart', async ({ page }) => {
    // Add item
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Find and click increment button
    const incrementButton = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="increment-quantity"]')

    await incrementButton.click()
    await page.waitForTimeout(300)

    // Verify cart badge updated to 2
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('2')

    // Verify quantity in cart item
    const quantity = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="quantity"]')

    await expect(quantity).toHaveText('2')
  })

  test('should decrement item quantity in cart', async ({ page }) => {
    // Add item twice to have quantity of 2
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')

    // Add twice
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(300)
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Verify initial quantity is 2
    const quantityBefore = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="quantity"]')
    await expect(quantityBefore).toHaveText('2')

    // Click decrement
    const decrementButton = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="decrement-quantity"]')

    await decrementButton.click()
    await page.waitForTimeout(300)

    // Verify quantity is now 1
    const quantityAfter = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="quantity"]')
    await expect(quantityAfter).toHaveText('1')
  })

  test('should remove item when quantity reaches 0', async ({ page }) => {
    // Add item once
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    const firstItem = page.locator('[data-testid="menu-item"]').first()
    const itemName = await firstItem.locator('h3').textContent()

    await firstItem.click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Click decrement (quantity is 1, so should remove item)
    const decrementButton = page
      .locator('[data-testid="cart-item"]')
      .first()
      .locator('[data-testid="decrement-quantity"]')

    await decrementButton.click()
    await page.waitForTimeout(500)

    // Verify cart badge is gone or shows 0
    const badgeVisible = await page
      .locator('[data-testid="cart-badge"]')
      .isVisible()

    if (badgeVisible) {
      await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('0')
    }

    // Verify item is no longer in cart
    const itemStillExists = await page
      .locator(`text=${itemName?.trim()}`)
      .isVisible()
    expect(itemStillExists).toBe(false)
  })

  test('should display correct total price', async ({ page }) => {
    // Add item
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')

    // Get item price
    const itemPriceText = await page
      .locator('[data-testid="item-price"]')
      .textContent()

    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Verify total price is displayed
    const totalPrice = await page
      .locator('[data-testid="cart-total"]')
      .textContent()

    expect(totalPrice).toContain('₹')

    // Price should match item price
    const itemPrice = itemPriceText?.replace(/[^0-9.,]/g, '')
    expect(totalPrice).toContain(itemPrice || '')
  })

  test('should navigate to cart page', async ({ page }) => {
    // Add item
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Go to cart page via navigation or link
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Verify we're on cart page
    await expect(page).toHaveURL('/cart')

    // Verify cart heading exists
    await expect(page.locator('h1')).toContainText(/cart/i)
  })

  test('should persist cart across page navigation', async ({ page }) => {
    // Add item
    await page.waitForSelector('[data-testid="menu-category"]', {
      timeout: 10000,
    })
    await page.locator('[data-testid="menu-category"]').first().click()
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 10000 })
    await page.locator('[data-testid="menu-item"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(500)

    // Navigate to home
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify cart badge still shows 1
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')

    // Navigate to about page
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    // Cart should still persist
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
  })
})
