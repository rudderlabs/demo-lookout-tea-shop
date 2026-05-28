# Instant Checkout for Logged-In Users

## Problem

The "Buy Now" button currently sends all users through the full multi-step checkout (shipping, payment, review). Logged-in demo personas already have saved shipping and payment data. The button should be hidden for logged-out users and provide a fast-path checkout for logged-in users.

## Design

### 1. Persona Lookup — `getDemoPersonaByEmail`

Add an exported function to `src/data/demo-personas.ts`:

```ts
function getDemoPersonaByEmail(email: string): { shipping: ShippingData; payment: PaymentData }
```

Matches against `DEMO_PERSONAS` by `account.email`. Returns only the `shipping` and `payment` fields (not the full persona). Falls back to the first persona if no email match — this is intentional for the demo so that manually-entered logins still get a working checkout experience.

### 2. BuyNowButton Visibility Gate

In `src/components/product-detail/BuyNowButton.tsx`:

- When `!isLoggedIn` (from `useAuth()`): return `null` — the button is not rendered at all. This replaces the current redirect-to-`/account` behavior.
- When logged in and clicked: call `addItem(product, quantity)` (synchronous dispatch), then `router.push('/checkout/instant')`.

### 3. Instant Checkout Page — `/checkout/instant`

New file: `src/app/checkout/instant/page.tsx` (`'use client'`).

**Guards** (using `router.replace()`, matching regular checkout pattern):
- Not logged in: redirect to `/account`.
- Empty cart (and not mid-order-placement): redirect to `/cart`.
- While redirecting, show a minimal "Redirecting..." message (same as `checkout/page.tsx:120-126`).

**Data flow:**
1. Get `user` from `useAuth()`.
2. Call `getDemoPersonaByEmail(user.email)` to retrieve `shippingData` and `paymentData`.
3. Fire `trackCheckoutStarted` analytics event (same payload as regular checkout).

**Rendering:**
- No stepper — single-step flow.
- Render the existing `OrderReview` component with persona shipping/payment data.

**Place order handler:**
Mirror `checkout/page.tsx` lines 81-117:
- Compute shipping (free above $50), tax (8%), total.
- Store order data in `sessionStorage` under `serene-leaf-last-order`.
- Call `clearCart()`.
- Navigate to `/checkout/confirmation?orderId=...&total=...`.

## Files Changed

| File | Change |
|------|--------|
| `src/data/demo-personas.ts` | Add `getDemoPersonaByEmail()` |
| `src/components/product-detail/BuyNowButton.tsx` | Hide when logged out; navigate to `/checkout/instant` |
| `src/app/checkout/instant/page.tsx` | **New** — instant checkout page |

## Verification

```
pnpm check
```
