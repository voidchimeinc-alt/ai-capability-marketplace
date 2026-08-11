# Decisions

## 2026-08-11 — Working name: AI Workbench

Temporary brand. All user-facing strings read from `src/lib/brand.ts`.

## 2026-08-11 — Seed-first data adapter

**Decision:** Ship a high-quality TypeScript seed catalog as the default data source; keep Supabase SQL migrations + adapter for production.

**Why:** No `DATABASE_URL` in the agent environment; founder must be able to `npm run dev` and see a living product immediately. Fabricating live DB connectivity would block the MVP.

**Consequence:** Content edits in seed mode are code changes until Supabase schema is applied and `DATA_SOURCE=supabase`.

## 2026-08-11 — Visual direction

Cool mist atmosphere, deep ink, teal accent, Syne + DM Sans. Avoid purple AI clichés, crypto neon, cream/terracotta editorial, and dashboard chrome.

## 2026-08-11 — Recommendation engine V1

Weighted rule matching (use-case 40%, capability 20%, cost 15%, integrations 15%, enterprise 10%). Explanations are deterministic templates over scores.
