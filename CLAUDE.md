# Tea Leafs — Ecommerce RudderStack Demo

## Package Manager
- **Always use `pnpm`** — never npm or yarn

## Commands
- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm typecheck` — TypeScript type checking
- `pnpm lint` — ESLint
- `pnpm lint:fix` — ESLint with auto-fix
- `pnpm format` — Prettier format
- `pnpm format:check` — Prettier check
- `pnpm knip` — Dead code detection
- `pnpm check` — Run typecheck + lint + knip

## Code Style
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Single quotes, semicolons, trailing commas
- Imports: use `@/*` path alias for `src/*`
- Components: one component per file, named export
- Analytics events: use typed tracking functions from `@/lib/analytics`
- Cart state: use `useCart()` hook from `@/lib/cart`
- No `any` types — use `unknown` + type narrowing
- Prefer `const` assertions and discriminated unions
- Server Components by default; add `'use client'` only when needed

## Architecture
- **Data layer**: `src/data/` — Zod schemas, mock data
- **Analytics layer**: `src/lib/analytics/` — RudderStack integration
- **Cart layer**: `src/lib/cart/` — State management with useReducer
- **Components**: `src/components/` — Organized by feature
- **Pages**: `src/app/` — Next.js App Router

## Environment Variables
- `NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY` — RudderStack source write key
- `NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL` — RudderStack data plane URL
