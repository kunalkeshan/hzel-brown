# data-testid Attribute Guide

This guide explains how to add `data-testid` attributes to components for stable E2E testing with Playwright.

## Why data-testid?

Using `data-testid` attributes makes tests:
- **More stable**: Won't break when text changes
- **More readable**: Clear intent in test code
- **Easier to maintain**: Explicit markers for testable elements

## Naming Convention

Use kebab-case with descriptive names:
- `data-testid="cart-button"`
- `data-testid="menu-item"`
- `data-testid="increment-quantity"`

## Components That Need data-testid

### 🛒 Cart Components

#### Cart Button (Navbar)
```tsx
// components/layouts/navbar.tsx or similar
<button data-testid="cart-button">
  Cart
  {itemCount > 0 && (
    <span data-testid="cart-badge">{itemCount}</span>
  )}
</button>
```

#### Cart Item
```tsx
// components/cart/cart-item.tsx
<div data-testid="cart-item">
  <h3>{item.name}</h3>
  <span data-testid="quantity">{item.quantity}</span>
  <button data-testid="increment-quantity">+</button>
  <button data-testid="decrement-quantity">-</button>
  <button data-testid="remove-item">Remove</button>
</div>
```

#### Cart Summary
```tsx
// components/cart/cart-summary.tsx
<div data-testid="cart-summary">
  <div data-testid="cart-total">₹{total}</div>
  <button data-testid="clear-cart">Clear Cart</button>
  <button data-testid="checkout-button">Checkout</button>
</div>
```

#### Cart Modal/Sidebar
```tsx
// components/cart/cart-modal.tsx or cart-sidebar.tsx
<div data-testid="cart-modal">
  {/* or data-testid="cart-sidebar" */}
  {/* Cart content */}
</div>
```

### 🍰 Menu Components

#### Menu Category Card
```tsx
// components/menu/menu-category-card.tsx
<div data-testid="menu-category">
  <h3>{category.name}</h3>
</div>
```

#### Menu Item Card
```tsx
// components/menu/menu-item-card.tsx
<div data-testid="menu-item">
  <h3>{item.name}</h3>
  <p data-testid="item-price">{formatCurrency(item.price)}</p>
  <button data-testid="add-to-cart">Add to Cart</button>
</div>
```

#### Menu Item Detail
```tsx
// components/menu/menu-item-details.tsx or app/(static)/menu/[category]/[item]/page.tsx
<div data-testid="menu-item-detail">
  <h1>{item.name}</h1>
  <p data-testid="item-description">{item.description}</p>
  <span data-testid="item-price">{formatCurrency(item.price)}</span>
  <button data-testid="add-to-cart">Add to Cart</button>
</div>
```

### 📝 Contact Form

```tsx
// components/contact/contact-form.tsx or similar
<form>
  <input name="name" />
  <input name="email" />
  <textarea name="message" />
  <button type="submit">Send Message</button>
</form>
```

Note: Contact form uses `name` attributes which are already good selectors. data-testid optional here.

### 🔍 Command Menu (Search)

```tsx
// components/command-menu.tsx
<div data-testid="command-menu">
  <input data-testid="command-menu-input" placeholder="Search..." />
</div>
```

### 🧭 Navigation

```tsx
// components/layouts/navbar.tsx
<nav>
  <a href="/">Home</a>
  <a href="/menu">Menu</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

Note: Navigation links work fine with `href` selectors. data-testid optional.

## Implementation Checklist

Add data-testid to these priority components:

### High Priority (Required for E2E tests to pass)
- [ ] Cart button with badge (`cart-button`, `cart-badge`)
- [ ] Cart modal/sidebar (`cart-modal` or `cart-sidebar`)
- [ ] Cart item controls (`cart-item`, `quantity`, `increment-quantity`, `decrement-quantity`, `remove-item`)
- [ ] Cart total and actions (`cart-total`, `clear-cart`, `checkout-button`)
- [ ] Menu categories (`menu-category`)
- [ ] Menu items (`menu-item`)
- [ ] Item price (`item-price`)
- [ ] Item description (`item-description`)

### Medium Priority (Nice to have)
- [ ] Command menu (`command-menu`, `command-menu-input`)
- [ ] User menu (future: `user-menu`, `user-email`)

### Low Priority (Optional)
- [ ] Cart summary (`cart-summary`)
- [ ] Newsletter form
- [ ] Social media links

## Example: Adding to Existing Component

### Before
```tsx
<button onClick={openCart}>
  Cart {itemCount > 0 && <span>{itemCount}</span>}
</button>
```

### After
```tsx
<button onClick={openCart} data-testid="cart-button">
  Cart
  {itemCount > 0 && (
    <span data-testid="cart-badge">{itemCount}</span>
  )}
</button>
```

## Testing the Changes

After adding data-testid attributes, run E2E tests:

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e cart-flow.spec.ts

# Run in UI mode to debug
pnpm test:e2e:ui
```

## Future: Firebase Auth Components

When implementing Firebase authentication, add these:

```tsx
// Sign In/Sign Up Forms
<form data-testid="signin-form">
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Sign In</button>
</form>

// User Menu
<div data-testid="user-menu">
  <span data-testid="user-email">{user.email}</span>
  <button data-testid="signout-button">Sign Out</button>
</div>

// Protected Content
<div data-testid="profile-section">
  {/* User profile content */}
</div>

<div data-testid="order-history">
  {/* Order history */}
</div>
```

## Tips

1. **Keep it simple**: Only add data-testid to elements you actually test
2. **Use semantic names**: `increment-quantity` not `button-1`
3. **Avoid dynamic values**: `cart-item` not `cart-item-${id}`
4. **Document patterns**: Add to this guide when creating new testable components
5. **TypeScript safety**: Consider creating a constants file for testid values:

```typescript
// test/testids.ts
export const TESTIDS = {
  CART_BUTTON: 'cart-button',
  CART_BADGE: 'cart-badge',
  CART_ITEM: 'cart-item',
  // ... etc
} as const
```

Then use in components and tests:
```tsx
import { TESTIDS } from '@/test/testids'

<button data-testid={TESTIDS.CART_BUTTON}>Cart</button>
```

```typescript
await page.click(`[data-testid="${TESTIDS.CART_BUTTON}"]`)
```
