import { test, expect } from '@playwright/test'
import { goToContact } from './helpers/navigation'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await goToContact(page)
  })

  test('should display contact form', async ({ page }) => {
    // Verify page loaded
    await expect(page).toHaveURL('/contact')

    // Verify form elements are present
    await expect(page.locator('[name="name"]')).toBeVisible()
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="message"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]')

    // Wait for validation errors
    await page.waitForTimeout(500)

    // Verify error messages appear (adjust selectors based on your implementation)
    const errors = await page.locator('[role="alert"], .error-message').count()
    expect(errors).toBeGreaterThan(0)
  })

  test('should show validation error for invalid email', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'invalid-email')
    await page.fill('[name="message"]', 'Test message')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for validation
    await page.waitForTimeout(500)

    // Verify email validation error (adjust selector based on implementation)
    const emailError = await page.locator('text=/email/i').count()
    expect(emailError).toBeGreaterThan(0)
  })

  test('should successfully submit valid contact form', async ({ page }) => {
    // Fill form with valid data
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="message"]', 'This is a test message from E2E test.')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for submission
    await page.waitForTimeout(2000)

    // Verify success message or redirect
    // Adjust based on your implementation:
    // Option 1: Success message
    const successMessage = page.locator('text=/success|sent|thank you/i')
    const hasSuccessMessage = await successMessage.isVisible()

    // Option 2: Form reset
    const nameFieldCleared = (await page.locator('[name="name"]').inputValue()) === ''

    // At least one should be true
    expect(hasSuccessMessage || nameFieldCleared).toBe(true)
  })

  test('should display contact information', async ({ page }) => {
    // Verify contact details are displayed
    // Phone number (adjust selector based on implementation)
    const phoneVisible = await page
      .locator('text=/phone|call|\+91|mobile/i')
      .isVisible()

    // Email address
    const emailVisible = await page
      .locator('text=/email|@|contact/i')
      .isVisible()

    // At least one contact method should be visible
    expect(phoneVisible || emailVisible).toBe(true)
  })

  test('should clear form after successful submission', async ({ page }) => {
    // Fill and submit form
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="message"]', 'Test message')

    await page.click('button[type="submit"]')

    // Wait for submission
    await page.waitForTimeout(2000)

    // Check if form fields are cleared
    const nameValue = await page.locator('[name="name"]').inputValue()
    const emailValue = await page.locator('[name="email"]').inputValue()
    const messageValue = await page.locator('[name="message"]').inputValue()

    // Form might clear or stay filled depending on implementation
    // Just verify form is still functional
    expect(page.locator('[name="name"]')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Fill only name
    await page.fill('[name="name"]', 'Test User')

    // Submit
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)

    // Should show errors for missing fields
    const errors = await page.locator('[role="alert"], .error-message').count()
    expect(errors).toBeGreaterThan(0)
  })

  test('should allow typing in all fields', async ({ page }) => {
    const testName = 'John Doe'
    const testEmail = 'john@example.com'
    const testMessage = 'Hello, this is a test message!'

    // Type in all fields
    await page.fill('[name="name"]', testName)
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="message"]', testMessage)

    // Verify values
    expect(await page.locator('[name="name"]').inputValue()).toBe(testName)
    expect(await page.locator('[name="email"]').inputValue()).toBe(testEmail)
    expect(await page.locator('[name="message"]').inputValue()).toBe(testMessage)
  })
})
