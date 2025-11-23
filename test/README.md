# Test Configuration & Utilities

This directory contains shared test configuration, utilities, and mocks used across the test suite.

## 📁 Directory Structure

```
test/
├── setup.ts              # Vitest global setup
├── test-utils.tsx        # Custom render with providers
├── msw/                  # Mock Service Worker setup
│   ├── handlers.ts       # API mock handlers
│   └── server.ts         # MSW server instance
├── DATA_TESTID_GUIDE.md  # Guide for adding test IDs
└── README.md             # This file
```

## Files Overview

### `setup.ts`

Global setup file that runs before all Vitest tests. Configures:
- MSW server (starts before tests, resets after each)
- React Testing Library cleanup
- Next.js router mocks
- Next.js Image component mocks

### `test-utils.tsx`

Custom render function that wraps components with necessary providers:
- `QueryClientProvider` (TanStack Query)
- `ThemeProvider` (next-themes)

**Usage:**
```typescript
import { render, screen } from '@/test/test-utils'

test('component renders', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### `msw/handlers.ts`

Mock Service Worker request handlers for API mocking.

**Current mocks:**
- Sanity CMS queries (menu items, categories, site config)

**TODO mocks:**
- Firebase Authentication (sign in, sign up, token refresh)
- Payment APIs (Stripe/Razorpay when implemented)

**Adding a new mock:**
```typescript
export const handlers = [
  http.post('https://api.example.com/endpoint', () => {
    return HttpResponse.json({ success: true })
  }),
]
```

### `msw/server.ts`

MSW server instance used by Vitest tests.

Automatically started/stopped in `setup.ts`.

## Usage Examples

### Testing a Component with Providers

```typescript
// components/my-component.test.tsx
import { render, screen, userEvent } from '@/test/test-utils'
import { MyComponent } from './my-component'

describe('MyComponent', () => {
  it('should render with providers', async () => {
    render(<MyComponent />)

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Testing with MSW Mocks

```typescript
// hooks/use-menu.test.ts
import { renderHook, waitFor } from '@/test/test-utils'
import { useMenu } from './use-menu'

describe('useMenu', () => {
  it('should fetch menu items', async () => {
    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Data comes from MSW mock in test/msw/handlers.ts
    expect(result.current.data).toHaveLength(2)
  })
})
```

### Adding a Custom Test Helper

```typescript
// test/helpers/cart-helpers.ts
import { useCartStore } from '@/stores/cart-store'
import type { MenuItem } from '@/types/cart'

export function createMockMenuItem(overrides?: Partial<MenuItem>): MenuItem {
  return {
    _id: 'test-item',
    name: 'Test Item',
    price: 500,
    isAvailable: true,
    ...overrides,
  } as MenuItem
}

export function setupCartWithItems(items: MenuItem[]) {
  const { addItem } = useCartStore.getState()
  items.forEach(item => addItem(item))
}
```

## Environment Variables

Test environment variables can be set in:
- `.env.test` (create this file, git-ignored)
- `vitest.config.ts` under `env` option

Example:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
    },
  },
})
```

## Future Additions

### Firebase Auth Mocks

When implementing Firebase:

```typescript
// test/msw/handlers.ts
export const handlers = [
  // Sign in
  http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', () => {
    return HttpResponse.json({
      idToken: 'mock-token',
      email: 'test@example.com',
      refreshToken: 'mock-refresh',
      expiresIn: '3600',
      localId: 'mock-user-id',
    })
  }),

  // Sign up
  http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp', () => {
    return HttpResponse.json({
      idToken: 'mock-token',
      email: 'new@example.com',
      refreshToken: 'mock-refresh',
      expiresIn: '3600',
      localId: 'new-user-id',
    })
  }),
]
```

### Payment Mocks

When adding Stripe/Razorpay:

```typescript
// test/msw/handlers.ts
export const handlers = [
  // Create payment intent
  http.post('https://api.stripe.com/v1/payment_intents', () => {
    return HttpResponse.json({
      id: 'pi_mock',
      client_secret: 'pi_mock_secret',
      status: 'succeeded',
      amount: 50000,
      currency: 'inr',
    })
  }),
]
```

## Troubleshooting

### MSW not intercepting requests

1. Check handler is added to `handlers.ts`
2. Verify URL matches exactly (including protocol)
3. Check MSW server is running (should be automatic via setup.ts)
4. Try: `server.listHandlers()` in test to debug

### Provider errors in tests

1. Ensure using `render` from `@/test/test-utils`, not `@testing-library/react`
2. Check all required providers are in `test-utils.tsx`
3. For complex state, use `wrapper` option:

```typescript
render(<Component />, {
  wrapper: ({ children }) => (
    <CustomProvider>
      {children}
    </CustomProvider>
  )
})
```

### Tests failing in CI but passing locally

1. Check for timezone issues (use UTC in tests)
2. Check for file path case sensitivity (CI is Linux)
3. Verify environment variables are set in CI
4. Check for race conditions (add proper waitFor)

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io)
- [Testing Best Practices](/TESTING.md)

## Contributing

When adding new test utilities:

1. Add them to this directory
2. Export from appropriate file
3. Document usage in this README
4. Add examples if complex

---

For the full testing guide, see [TESTING.md](/TESTING.md)
