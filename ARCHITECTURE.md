# Architecture

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + custom design tokens
- Supabase Auth (when configured)
- PostgreSQL schema via Supabase SQL migrations
- Zod validation · Server Actions · Motion · Lucide

Intentionally avoided: Prisma, Drizzle, tRPC, GraphQL, Redux, MongoDB.

## Layers

```
UI (app/ + components/)
  → domain (lib/matching, lib/ai)
  → data access (lib/db)
  → seed | supabase adapters
```

## Data strategy (MVP)

1. **Curated TypeScript seed catalog** powers Atlas/Arena/Network so the product works without a provisioned database.
2. **`supabase/migrations`** define the production relational model.
3. Repositories implement a single interface; `DATA_SOURCE=seed|supabase` selects the adapter.
4. Unknown pricing / scores are stored as `null` and rendered as **Unknown** — never invented.

## Auth

- Supabase Auth for email/password and magic link when env vars are present.
- Role claims: `explorer | company | builder | vendor | admin`.
- Demo/admin bootstrap documented in README.

## AI services

`lib/ai` exposes a provider-agnostic interface. V1 recommendations are **weighted matching** over structured data; LLM text is advisory only and optional.

## Brand

Working product name lives in `src/lib/brand.ts` so rename is a single-token change.
