import { Page } from '@playwright/test'

/**
 * Helper functions for navigation-related E2E operations
 */

/**
 * Navigate to homepage
 */
export async function goToHome(page: Page) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to menu page (all categories)
 */
export async function goToMenu(page: Page) {
  await page.goto('/menu')
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to specific menu category
 */
export async function goToCategory(page: Page, categorySlug: string) {
  await page.goto(`/menu/${categorySlug}`)
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to specific menu item
 */
export async function goToMenuItem(page: Page, categorySlug: string, itemSlug: string) {
  await page.goto(`/menu/${categorySlug}/${itemSlug}`)
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to contact page
 */
export async function goToContact(page: Page) {
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to about page
 */
export async function goToAbout(page: Page) {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to cart page
 */
export async function goToCart(page: Page) {
  await page.goto('/cart')
  await page.waitForLoadState('networkidle')
}

/**
 * Use navbar to navigate
 */
export async function navigateViaNavbar(page: Page, linkText: string) {
  await page.click(`nav a:has-text("${linkText}")`)
  await page.waitForLoadState('networkidle')
}

/**
 * Open command menu (search)
 */
export async function openCommandMenu(page: Page) {
  // Usually Cmd+K or Ctrl+K
  const isMac = process.platform === 'darwin'
  await page.keyboard.press(isMac ? 'Meta+K' : 'Control+K')
  await page.waitForTimeout(300)
}

/**
 * Search using command menu
 */
export async function searchInCommandMenu(page: Page, query: string) {
  await openCommandMenu(page)
  await page.fill('[data-testid="command-menu-input"]', query)
  await page.waitForTimeout(500)
}

/**
 * Select first search result
 */
export async function selectFirstSearchResult(page: Page) {
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')
}
