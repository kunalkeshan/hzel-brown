import { Page, expect } from '@playwright/test'

/**
 * Helper functions for cart-related E2E operations
 */

/**
 * Navigate to a menu item and add it to cart
 */
export async function addItemToCart(page: Page, itemName: string) {
  // Click on the item
  await page.click(`text=${itemName}`)

  // Wait for item details to load
  await page.waitForLoadState('networkidle')

  // Click "Add to Cart" button
  await page.click('button:has-text("Add to Cart")')

  // Wait for cart update
  await page.waitForTimeout(500)
}

/**
 * Open the cart sidebar/modal
 */
export async function openCart(page: Page) {
  await page.click('[data-testid="cart-button"]')
  await page.waitForTimeout(300)
}

/**
 * Get the current cart item count from the badge
 */
export async function getCartItemCount(page: Page): Promise<number> {
  const badge = page.locator('[data-testid="cart-badge"]')
  const isVisible = await badge.isVisible()

  if (!isVisible) {
    return 0
  }

  const text = await badge.textContent()
  return parseInt(text || '0', 10)
}

/**
 * Verify item is in cart
 */
export async function verifyItemInCart(
  page: Page,
  itemName: string,
  quantity?: number
) {
  await openCart(page)

  // Check if item name is visible
  await expect(page.locator(`text=${itemName}`)).toBeVisible()

  // If quantity is specified, verify it
  if (quantity) {
    const quantityText = page.locator(
      `[data-testid="cart-item-${itemName}"] [data-testid="quantity"]`
    )
    await expect(quantityText).toHaveText(quantity.toString())
  }
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(
  page: Page,
  itemName: string,
  action: 'increment' | 'decrement'
) {
  await openCart(page)

  const selector =
    action === 'increment'
      ? `[data-testid="cart-item-${itemName}"] [data-testid="increment-quantity"]`
      : `[data-testid="cart-item-${itemName}"] [data-testid="decrement-quantity"]`

  await page.click(selector)
  await page.waitForTimeout(300)
}

/**
 * Remove item from cart
 */
export async function removeItemFromCart(page: Page, itemName: string) {
  await openCart(page)
  await page.click(`[data-testid="cart-item-${itemName}"] [data-testid="remove-item"]`)
  await page.waitForTimeout(300)
}

/**
 * Get total cart cost
 */
export async function getCartTotal(page: Page): Promise<string> {
  await openCart(page)
  const total = await page.locator('[data-testid="cart-total"]').textContent()
  return total || '₹0'
}

/**
 * Clear the entire cart
 */
export async function clearCart(page: Page) {
  await openCart(page)
  await page.click('[data-testid="clear-cart"]')
  await page.waitForTimeout(300)
}
