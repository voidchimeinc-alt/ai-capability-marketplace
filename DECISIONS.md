# Decisions

## 2026-08-15 — Piton brand mark

**Decision:** The product lockup is the founder icon (dark rounded square, cream angular P/piton, teal joint) plus the PITON wordmark. Use the supplied artwork in `public/brand/piton-icon.png` — do not substitute a reconstructed A-arrow.

**Why:** Founder-supplied mark. The spike is the piton; the angular P is the name.

**How:** Header/footer `Logo` renders the PNG mark + PITON. Favicon/Apple icon are the same artwork.

## 2026-08-11 — Working name

User-facing product name reads from `src/lib/brand.ts`. Current working name: Piton.

## 2026-08-11 — Seed-first data adapter

**Decision:** Ship a high-quality TypeScript seed catalog as the default data source; keep Supabase SQL migrations + adapter for production.

**Why:** No `DATABASE_URL` in the agent environment; founder must be able to `npm run dev` and see a living product immediately. Fabricating live DB connectivity would block the MVP.

**Consequence:** Content edits in seed mode are code changes until Supabase schema is applied and `DATA_SOURCE=supabase`.

## 2026-08-11 — Visual direction

Cool mist atmosphere, deep ink, teal accent, Syne + DM Sans. Avoid purple AI clichés, crypto neon, cream/terracotta editorial, and dashboard chrome.

## 2026-08-11 — Recommendation engine V1

Weighted rule matching (use-case 40%, capability 20%, cost 15%, integrations 15%, enterprise 10%). Explanations are deterministic templates over scores.

## 2026-08-11 — AI Stack as the central recommendation object

**Decision:** “Find My AI Stack” returns a multi-component stack (knowledge, retrieval, model, automation, integration, human escalation, implementation) rather than a single-tool tip.

**Why:** The product thesis is decision → implementation. A lone “use ChatGPT” answer fails the core job.

**How:** Use-case blueprints select relevant roles; each role is filled with the existing weighted matcher. Natural-language input is mapped via keyword interpretation to curated use cases.

## 2026-08-11 — Score provenance

**Decision:** Capability scores carry provenance (`tested | sourced | editorial | community`). Null scores render as **Not yet evaluated**. Seed scores default to `editorial`.

**Why:** Unsupported numbers must not look like lab truth.

## 2026-08-11 — AI Network matching V1

**Decision:** Stack→builder matching uses deterministic weights — capability 40%, proof of work 25%, technology 20%, availability 10%, location/timezone 5%. UI shows “Why this builder matches” with percentage breakdowns.

**Why:** Network must answer “who can build this stack?” without black-box ranking or freelancer-marketplace UX.

**Scope:** Discovery + shortlist + Build-this project brief only. No payments/escrow/chat.

