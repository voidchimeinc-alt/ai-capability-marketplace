# AI Workbench

Working name for an **AI Capability Marketplace**.

> Find the right AI. Find the right people. Build the right thing.

Not a tools directory. Not a freelancer site. A decision → implementation network.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The MVP runs on a curated **seed catalog** by default so the product is usable without provisioning a database.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest |
| `npm run seed:check` | Validate seed inventory |

## Environment

See `.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Auth (+ future data adapter)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only admin operations
- `NEXT_PUBLIC_SITE_URL` — canonical URL for SEO

Apply SQL in `supabase/migrations/` via the Supabase SQL editor when ready to persist auth-linked data.

## Product surfaces

- `/` — Landing + “I have a business problem”
- `/ai/tools` — AI Atlas
- `/ai/compare` — Comparison
- `/ai/recommend` — Stack recommendation flow
- `/arena` — AI Arena benchmarks
- `/network` — AI Builders
- `/projects` — Marketplace
- `/admin` — Founder console shell

## Docs

- `PRODUCT.md` — thesis and scope
- `ARCHITECTURE.md` — system design
- `DECISIONS.md` — decision log
- `ENGINEERING_RULES.md` — constraints
- `COMPONENT_GUIDE.md` — UI building blocks

## Brand rename

Change the product name in `src/lib/brand.ts` only.
