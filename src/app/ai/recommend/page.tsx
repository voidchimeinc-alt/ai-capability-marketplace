import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import { matchBuilders, recommendTools } from "@/lib/matching/recommend";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find My AI Stack",
  description: "Describe a business problem and get ranked AI options plus matching builders.",
};

const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const budgets = ["Exploratory / low", "Mid-market", "Enterprise"];
const urgencies = ["This month", "This quarter", "This year", "Just researching"];

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: Promise<{
    problem?: string;
    size?: string;
    industry?: string;
    budget?: string;
    urgency?: string;
    tools?: string;
    outcome?: string;
  }>;
}) {
  const params = await searchParams;
  const catalog = getCatalog();
  const useCases = catalog.listUseCases();
  const selected = params.problem ? catalog.getUseCaseBySlug(params.problem) : null;

  const context = {
    problemSlug: params.problem,
    companySize: params.size,
    industry: params.industry,
    budget: params.budget,
    urgency: params.urgency,
    currentTools: params.tools?.split(",").map((t) => t.trim()).filter(Boolean),
    desiredOutcome: params.outcome,
  };

  const recommendations = params.problem ? recommendTools(context) : [];
  const builders = params.problem ? matchBuilders(context) : [];

  const tierLabel = {
    recommended: "Recommended",
    alternative: "Alternative",
    advanced: "Advanced",
  } as const;

  const tierEmoji = {
    recommended: "🥇",
    alternative: "🥈",
    advanced: "🥉",
  } as const;

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Recommendation</p>
        <h1 className="display text-5xl sm:text-6xl">What are you trying to accomplish?</h1>
        <p className="text-lg text-[var(--muted)]">
          Lightweight context in. Ranked options out. Factual claims come from structured data — recommendations are advisory.
        </p>
      </div>

      <form className="mt-10 grid gap-4 rounded-[2rem] border border-[var(--border)] bg-white/70 p-6 sm:p-8">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Business problem</span>
          <select
            name="problem"
            defaultValue={params.problem ?? ""}
            required
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          >
            <option value="" disabled>
              Select a problem
            </option>
            {useCases.map((uc) => (
              <option key={uc.id} value={uc.slug}>
                {uc.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Company size</span>
            <select name="size" defaultValue={params.size ?? ""} className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4">
              <option value="">Optional</option>
              {companySizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Industry</span>
            <input
              name="industry"
              defaultValue={params.industry}
              placeholder="SaaS, finance, healthcare…"
              className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Budget posture</span>
            <select name="budget" defaultValue={params.budget ?? ""} className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4">
              <option value="">Optional</option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Urgency</span>
            <select name="urgency" defaultValue={params.urgency ?? ""} className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4">
              <option value="">Optional</option>
              {urgencies.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Current tools</span>
          <input
            name="tools"
            defaultValue={params.tools}
            placeholder="Salesforce, Slack, HubSpot…"
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Desired outcome</span>
          <input
            name="outcome"
            defaultValue={params.outcome}
            placeholder="What does success look like?"
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          />
        </label>

        <button type="submit" className="mt-2 h-12 rounded-full bg-[var(--accent)] px-6 text-sm font-medium text-white">
          Show my AI options
        </button>
      </form>

      {selected && recommendations.length ? (
        <section className="mt-16 space-y-8">
          <div>
            <p className="eyebrow">Your AI options</p>
            <h2 className="mt-2 display text-4xl">For: {selected.name}</h2>
            <p className="mt-2 text-[var(--muted)]">{selected.problemStatement}</p>
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <article
                key={rec.tool.id}
                className="rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {tierEmoji[rec.tier]}
                  </span>
                  <Badge tone={rec.tier === "recommended" ? "accent" : "muted"}>{tierLabel[rec.tier]}</Badge>
                  <Badge tone="warning">Match {rec.score.toFixed(1)}</Badge>
                </div>
                <h3 className="mt-4 display text-3xl">
                  <Link href={`/ai/tools/${rec.tool.slug}`} className="focus-ring rounded">
                    {rec.tool.name}
                  </Link>
                </h3>
                <p className="mt-2 text-[var(--muted)]">{rec.tool.shortDescription}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-medium">Why</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                      {rec.reasons.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Watch outs</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                      {rec.caveats.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Pricing: {rec.tool.pricingNotes} · Deployment: {rec.tool.deployment} · API:{" "}
                  {rec.tool.hasApi == null ? "Unknown" : rec.tool.hasApi ? "Yes" : "No"}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--foreground)] p-6 text-white sm:p-8">
            <p className="eyebrow text-white/60">Need someone to build this?</p>
            <h3 className="mt-2 display text-3xl">Matching AI Builders</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {builders.map(({ builder, why, score }) => (
                <Link
                  key={builder.id}
                  href={`/builders/${builder.slug}`}
                  className="rounded-2xl bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <p className="text-sm text-white/60">{builder.title}</p>
                  <p className="mt-1 text-lg font-medium">{builder.name}</p>
                  <p className="mt-2 text-xs text-white/60">Match {score.toFixed(1)}</p>
                  <ul className="mt-3 space-y-1 text-sm text-white/75">
                    {why.map((w) => (
                      <li key={w}>• {w}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <ButtonLink href="/projects/new" variant="subtle">
                Post this as a project
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}
    </Container>
  );
}
