# Tea Leafs — Ecommerce RudderStack Demo

A boutique tea shop ecommerce demo showcasing RudderStack's ecommerce event tracking. Built for sales presentations to demonstrate the complete purchase funnel with 19 distinct RudderStack events visible in the browser console.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and open the browser DevTools console to see analytics events.

### With RudderStack credentials

```bash
cp .env.example .env.local
# Edit .env.local with your RudderStack write key and data plane URL
pnpm dev
```

## Demo Walkthrough

Follow this flow to trigger all 19 analytics events:

1. **Home** (`/`) — `page`, `Promotion Viewed`, `Product List Viewed`
2. **Click "Shop Now"** — `Promotion Clicked`
3. **Product Catalog** (`/products`) — `page`, `Product List Viewed`
4. **Search for "oolong"** — `Products Searched`
5. **Click a product** — `Product Clicked`
6. **Product Detail** (`/products/[slug]`) — `page`, `Product Viewed`
7. **Click wishlist heart** — `Product Added to Wishlist`
8. **Click "Add to Cart"** — `Product Added`
9. **Cart** (`/cart`) — `page`, `Cart Viewed`
10. **Enter coupon "FIRSTSTEEP"** — `Coupon Applied` (try "INVALID" first for `Coupon Denied`)
11. **Remove an item** — `Product Removed`
12. **Click "Proceed to Checkout"** — `Checkout Started`
13. **Checkout Shipping** — `Checkout Step Viewed`, fill form, `Checkout Step Completed`
14. **Checkout Payment** — `Checkout Step Viewed`, `Payment Info Entered`, `Checkout Step Completed`
15. **Checkout Review** — `Checkout Step Viewed`, place order
16. **Order Confirmation** — `page`, `Order Completed`
17. **Account** (`/account`) — `page`, sign in → `identify`

## Available Coupons

| Code | Discount | Minimum |
|------|----------|---------|
| `FIRSTSTEEP` | 10% | None |
| `TEATIME20` | 20% | $50 |

## Analytics Events (19 total)

| # | Event | Page | Trigger |
|---|-------|------|---------|
| 1 | `page` | All | Route navigation |
| 2 | `identify` | Account | Login |
| 3 | `Products Searched` | Catalog | Search input |
| 4 | `Product List Viewed` | Home, Catalog | Page load |
| 5 | `Product Clicked` | Catalog | Card click |
| 6 | `Product Viewed` | Detail | Page load |
| 7 | `Product Added` | Detail | Add to cart |
| 8 | `Product Removed` | Cart | Remove item |
| 9 | `Product Added to Wishlist` | Detail | Wishlist button |
| 10 | `Cart Viewed` | Cart | Page load |
| 11 | `Coupon Applied` | Cart | Valid coupon |
| 12 | `Coupon Denied` | Cart | Invalid coupon |
| 13 | `Checkout Started` | Checkout | Page load |
| 14 | `Checkout Step Viewed` | Checkout | Step render |
| 15 | `Checkout Step Completed` | Checkout | Step submit |
| 16 | `Payment Info Entered` | Checkout | Payment form |
| 17 | `Order Completed` | Confirmation | Page load |
| 18 | `Promotion Viewed` | Home | Banner viewport |
| 19 | `Promotion Clicked` | Home | Banner click |

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5.9** (strict)
- **Tailwind CSS 4** — Custom tea-shop palette
- **Zod 4** — Runtime schema validation
- **@rudderstack/analytics-js v3** — Analytics SDK
- **pnpm** — Package manager

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
pnpm knip         # Dead code detection
pnpm check        # Run all checks (typecheck + lint + knip)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY` | RudderStack source write key |
| `NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL` | RudderStack data plane URL |

Without credentials, the app runs in dry-run mode — events are logged to the console but not sent to RudderStack.

## CI

- **CI workflow** — Runs typecheck, lint, knip, and build on every PR and push to main
- **Rudder AI Reviewer** — Automated RudderStack event review on PRs (requires `RUDDERSTACK_SOURCE_ID` and `RUDDERSTACK_SERVICE_ACCESS_TOKEN` repository secrets)
