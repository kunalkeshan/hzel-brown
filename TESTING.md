# Testing Guide

This document provides comprehensive information about testing in the Hzel Brown Next.js application.

## 📚 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses a comprehensive testing strategy with:
- **Unit Tests**: Testing individual functions and business logic (Vitest)
- **Component Tests**: Testing React components in isolation (Vitest + React Testing Library)
- **E2E Tests**: Testing complete user journeys (Playwright)
- **Visual Regression**: Catching unintended UI changes (Playwright screenshots)

**Current Coverage:**
- Unit Tests: 55 tests
- E2E Tests: 3 test suites (menu browsing, cart flow, contact form)
- Visual Regression: 10+ screenshots

**Target Coverage:** 80% overall code coverage

## Testing Stack

### Vitest + React Testing Library
- **Purpose**: Unit and component testing
- **Speed**: 10x faster than Jest
- **Features**: Native ESM, TypeScript, JSX support out of the box
- **Why**: Optimized for Next.js 16 App Router

### Playwright
- **Purpose**: E2E and visual regression testing
- **Browsers**: Chromium (default), Firefox, WebKit
- **Features**: Multi-browser, mobile viewports, video/screenshot on failure
- **Why**: Firebase auth support (IndexedDB storage state), best performance

### MSW (Mock Service Worker)
- **Purpose**: API mocking for tests
- **Level**: Network-level interception
- **Why**: Works with both Vitest and Playwright, realistic mocking

## Project Structure

```
hzel-brown/
├── e2e/                          # E2E tests (Playwright)
│   ├── helpers/                  # E2E test helpers
│   │   ├── cart.ts               # Cart operations
│   │   ├── navigation.ts         # Navigation helpers
│   │   └── auth.ts               # Auth helpers (TODO: Firebase)
│   ├── cart-flow.spec.ts         # Cart user journey tests
│   ├── menu-browsing.spec.ts     # Menu browsing tests
│   ├── contact-form.spec.ts      # Contact form tests
│   └── visual-regression.spec.ts # Screenshot tests
│
├── test/                         # Test configuration & utilities
│   ├── setup.ts                  # Vitest global setup
│   ├── test-utils.tsx            # Custom render with providers
│   ├── msw/
│   │   ├── handlers.ts           # MSW request handlers
│   │   └── server.ts             # MSW server setup
│   └── DATA_TESTID_GUIDE.md      # Guide for adding test IDs
│
├── **/*.test.ts(x)               # Unit/component tests (co-located)
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
└── TESTING.md                    # This file
```

## Running Tests

### Unit & Component Tests (Vitest)

```bash
# Run all unit tests in watch mode
pnpm test

# Run once (CI mode)
pnpm test:run

# Run with UI dashboard
pnpm test:ui

# Run with coverage report
pnpm test:coverage

# Run specific test file
pnpm test lib/numbers.test.ts
```

### E2E Tests (Playwright)

**First time setup:**
```bash
# Install Playwright browsers
pnpm playwright:install
```

**Running tests:**
```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI mode (visual debugging)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in debug mode (step through tests)
pnpm test:e2e:debug

# Run specific test file
pnpm test:e2e cart-flow.spec.ts
```

### Visual Regression Tests

```bash
# Run visual tests
pnpm test:e2e visual-regression.spec.ts

# Update screenshot baselines (after intentional UI changes)
pnpm test:e2e --update-snapshots
```

### Run All Tests

```bash
# Run unit + E2E tests sequentially
pnpm test:all
```

## Writing Tests

### Unit Tests

**Location**: Co-located with source files (e.g., `utils.ts` → `utils.test.ts`)

**Example**:
```typescript
// lib/numbers.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './numbers'

describe('formatCurrency', () => {
  it('should format with rupee symbol', () => {
    expect(formatCurrency(100)).toBe('₹100.00')
  })

  it('should handle Indian numbering', () => {
    expect(formatCurrency(100000)).toBe('₹1,00,000.00')
  })
})
```

### Component Tests

**Location**: Co-located with component files

**Example**:
```typescript
// components/cart/cart-item.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { CartItem } from './cart-item'

describe('CartItem', () => {
  it('should display item name and price', () => {
    const item = { name: 'Cake', price: 500, quantity: 1 }

    render(<CartItem item={item} />)

    expect(screen.getByText('Cake')).toBeInTheDocument()
    expect(screen.getByText('₹500.00')).toBeInTheDocument()
  })
})
```

**Always use custom render from test-utils.tsx** (includes providers like QueryClient, ThemeProvider)

### E2E Tests

**Location**: `e2e/*.spec.ts`

**Example**:
```typescript
// e2e/cart-flow.spec.ts
import { test, expect } from '@playwright/test'
import { goToMenu } from './helpers/navigation'

test('should add item to cart', async ({ page }) => {
  await goToMenu(page)

  // Navigate to category and item
  await page.click('[data-testid="menu-category"]')
  await page.click('[data-testid="menu-item"]')

  // Add to cart
  await page.click('button:has-text("Add to Cart")')

  // Verify cart badge
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
})
```

**Use helper functions** from `e2e/helpers/` for common operations

### Visual Regression Tests

**Example**:
```typescript
test('homepage should match screenshot', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    animations: 'disabled',
    threshold: 0.2, // Allow 20% difference (fonts, rendering)
  })
})
```

## Best Practices

### General

✅ **DO**:
- Write tests for business logic (stores, hooks, utils)
- Test user-facing behavior, not implementation
- Use meaningful test descriptions
- Keep tests independent and isolated
- Mock external dependencies (API, Firebase)

❌ **DON'T**:
- Test third-party libraries
- Test implementation details
- Have tests depend on each other
- Use real API/database in tests

### Unit Tests

✅ **DO**:
- Test edge cases (empty arrays, null values, errors)
- Test return values and side effects
- Use descriptive test names: `should format currency with rupee symbol`

❌ **DON'T**:
- Test TypeScript types (let compiler handle it)
- Test trivial code (getters, simple constants)

### E2E Tests

✅ **DO**:
- Use `data-testid` for stable selectors (see DATA_TESTID_GUIDE.md)
- Wait for network idle before assertions
- Test critical user paths (cart, checkout, auth)
- Clean up test data after each test

❌ **DON'T**:
- Use CSS classes or text content as primary selectors
- Test every possible path (focus on happy path + critical errors)
- Make tests flaky with hard-coded waits

### Visual Regression

✅ **DO**:
- Set appropriate threshold (0.2 = 20% tolerance for fonts)
- Disable animations before screenshots
- Wait for `networkidle` before capturing
- Update baselines after intentional UI changes

❌ **DON'T**:
- Commit `-actual.png` or `-diff.png` files (in .gitignore)
- Use on pages with dynamic content (dates, random data)

## Test Coverage

### Current Coverage

Run coverage report:
```bash
pnpm test:coverage
```

View HTML report:
```bash
open coverage/index.html
```

### Coverage Thresholds

Configured in `vitest.config.ts`:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

### Excluded from Coverage

- Config files (`config/**`)
- Type definitions (`types/**`, `**/*.d.ts`)
- Sanity CMS setup (`sanity/**`)
- Test files themselves

## Mocking

### MSW (API Mocking)

**Location**: `test/msw/handlers.ts`

**Add a new mock**:
```typescript
// test/msw/handlers.ts
export const handlers = [
  http.post('https://api.example.com/items', () => {
    return HttpResponse.json({ success: true })
  }),
]
```

**Use in tests**: Automatically applied in all Vitest tests (via `setup.ts`)

### Mocking Firebase (Future)

When implementing Firebase:

```typescript
// test/setup.ts
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))
```

See `e2e/helpers/auth.ts` for E2E auth patterns.

## CI/CD Integration

### GitHub Actions (Future)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm playwright:install
      - run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel Integration

Tests run automatically on PR preview deploys:
1. Vercel builds preview
2. GitHub Actions runs E2E tests against preview URL
3. Block merge if tests fail

Set environment variable:
```bash
PLAYWRIGHT_TEST_BASE_URL=https://preview-url.vercel.app
```

## Troubleshooting

### Unit Tests

**Problem**: `Cannot find module '@/...'`
**Solution**: Check path aliases in `vitest.config.ts`

**Problem**: `ReferenceError: sessionStorage is not defined`
**Solution**: Mock in test or use `jsdom` environment

**Problem**: Tests pass locally but fail in CI
**Solution**: Check for race conditions, use `waitFor` from RTL

### E2E Tests

**Problem**: `TimeoutError: page.goto: Timeout 30000ms exceeded`
**Solution**:
- Ensure dev server is running
- Check `baseURL` in `playwright.config.ts`
- Increase timeout: `page.goto('/', { timeout: 60000 })`

**Problem**: `Selector "[data-testid="cart-button"]" not found`
**Solution**: Add `data-testid` to component (see DATA_TESTID_GUIDE.md)

**Problem**: Visual regression tests fail
**Solution**:
- Font rendering differs across OS (increase threshold)
- Update baselines: `pnpm test:e2e --update-snapshots`
- Check for animations (should be disabled)

**Problem**: Tests are flaky
**Solution**:
- Replace `page.waitForTimeout()` with `page.waitForSelector()`
- Wait for `networkidle` before assertions
- Avoid testing time-dependent features

### Playwright Browsers

**Problem**: Playwright browsers not installed
**Solution**: Run `pnpm playwright:install`

**Problem**: Need specific browser
**Solution**: `pnpm playwright install chromium`

## Future Additions

### Firebase Authentication Tests

When adding Firebase auth:

1. **Setup**: Create `e2e/auth.setup.ts`
2. **Storage State**: Use IndexedDB storage state
3. **Helpers**: Implement functions in `e2e/helpers/auth.ts`
4. **Tests**: Protected routes, login/signup flows

See TODO comments in:
- `playwright.config.ts`
- `e2e/helpers/auth.ts`
- `test/msw/handlers.ts`

### Payment Flow Tests

When adding Stripe/Razorpay:

1. **Use test API keys**
2. **Mock webhook payloads**
3. **Test with test card numbers**
4. **Verify order creation**

### Accessibility Tests

Add `@axe-core/playwright` integration:

```typescript
test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)

## Getting Help

- Check this document first
- Review test examples in `e2e/` and `**/*.test.ts`
- Read error messages carefully
- Search existing issues on GitHub

---

**Happy Testing! 🎉**
