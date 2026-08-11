import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { StackComponentCard } from "@/components/recommendation/stack-component-card";
import { getCatalog } from "@/lib/db/catalog";
import { matchBuildersForStack, recommendStack } from "@/lib/matching/stack";
import {
  COMPLEXITY_LABELS,
  COST_POSTURE_LABELS,
} from "@/types/domain";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find My AI Stack",
  description:
    "Describe a business problem and get an explainable AI stack — components, why, alternatives, risks, and builders.",
};

const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const budgets = ["Exploratory / low", "Mid-market", "Enterprise"];
const urgencies = ["This month", "This quarter", "This year", "Just researching"];

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: Promise<{
    problem?: string;
    q?: string;
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

  const hasInput = Boolean(params.problem || params.q);

  const context = {
    problemSlug: params.problem,
    q: params.q,
    customProblem: params.q,
    companySize: params.size,
    industry: params.industry,
    budget: params.budget,
    urgency: params.urgency,
    currentTools: params.tools
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    desiredOutcome: params.outcome,
  };

  const stack = hasInput ? recommendStack(context) : null;
  const builders = stack ? matchBuildersForStack(context, stack) : [];

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Find My AI Stack</p>
        <h1 className="display text-5xl sm:text-6xl">What are you trying to accomplish?</h1>
        <p className="text-lg text-[var(--muted)]">
          Describe the business outcome. Get a stack — not a single tool tip. Facts stay structured;
          recommendations stay explainable.
        </p>
      </div>

      <form className="mt-10 grid gap-4 rounded-[2rem] border border-[var(--border)] bg-white/70 p-6 sm:p-8">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Business problem</span>
          <textarea
            name="q"
            defaultValue={params.q ?? ""}
            rows={3}
            placeholder='e.g. "I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases."'
            className="rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3 leading-relaxed"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">
            Or pick a curated use case <span className="text-[var(--muted)]">(optional)</span>
          </span>
          <select
            name="problem"
            defaultValue={params.problem ?? ""}
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          >
            <option value="">Infer from my description</option>
            {useCases.map((uc) => (
              <option key={uc.id} value={uc.slug}>
                {uc.name}
              </option>
            ))}
          </select>
        </label>

        <details className="rounded-2xl border border-[var(--border)] bg-white/50 p-4">
          <summary className="cursor-pointer text-sm font-medium">Optional context</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Company size</span>
              <select
                name="size"
                defaultValue={params.size ?? ""}
                className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
              >
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
              <select
                name="budget"
                defaultValue={params.budget ?? ""}
                className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
              >
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
              <select
                name="urgency"
                defaultValue={params.urgency ?? ""}
                className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
              >
                <option value="">Optional</option>
                {urgencies.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm">
            <span className="font-medium">Current tools</span>
            <input
              name="tools"
              defaultValue={params.tools}
              placeholder="Salesforce, Slack, Zendesk…"
              className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
            />
          </label>
          <label className="mt-4 grid gap-2 text-sm">
            <span className="font-medium">Desired outcome</span>
            <input
              name="outcome"
              defaultValue={params.outcome}
              placeholder="What does success look like?"
              className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
            />
          </label>
        </details>

        <button
          type="submit"
          className="mt-2 h-12 rounded-full bg-[var(--accent)] px-6 text-sm font-medium text-white"
        >
          Show my AI Stack
        </button>
      </form>

      {!hasInput ? (
        <div className="mt-10 flex flex-wrap gap-2">
          {useCases.map((uc) => (
            <Link
              key={uc.id}
              href={`/ai/recommend?problem=${uc.slug}`}
              className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-sm hover:bg-white focus-ring"
            >
              {uc.name}
            </Link>
          ))}
        </div>
      ) : null}

      {stack ? (
        <section className="mt-16 space-y-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">Your AI Stack</Badge>
              <Badge tone="muted">Interpretation {stack.confidence}</Badge>
              <Badge tone="warning">{COMPLEXITY_LABELS[stack.complexity]} complexity</Badge>
              <Badge>Cost posture {COST_POSTURE_LABELS[stack.costPosture]}</Badge>
            </div>
            <h2 className="display text-4xl sm:text-5xl">{stack.stackName}</h2>
            <p className="max-w-3xl text-lg text-[var(--muted)]">{stack.interpretedProblem}</p>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              {stack.interpretationNotes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            {stack.components.map((component) => (
              <StackComponentCard
                key={`${component.role.id}-${component.tool?.id ?? component.processLabel}`}
                component={component}
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8">
              <p className="eyebrow">Why this stack</p>
              <ul className="mt-4 space-y-2 text-[var(--muted)]">
                {stack.whyThisStack.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
            <section className="rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8">
              <p className="eyebrow">Risks / watch-outs</p>
              <ul className="mt-4 space-y-2 text-[var(--muted)]">
                {stack.risks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="space-y-4">
            <div>
              <p className="eyebrow">Alternatives</p>
              <h3 className="mt-2 display text-3xl">Credible substitutions</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {stack.alternatives.map((alt) => (
                <article
                  key={alt.name}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5"
                >
                  <h4 className="font-medium">{alt.name}</h4>
                  <p className="mt-2 text-sm text-[var(--muted)]">{alt.summary}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Best if:</span>{" "}
                    <span className="text-[var(--muted)]">{alt.whenBetter}</span>
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                    {alt.components.map((c) => (
                      <li key={c.roleLabel}>
                        {c.roleLabel}: {c.toolName}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--foreground)] p-6 text-white sm:p-8">
            <p className="eyebrow text-white/60">Find builders</p>
            <h3 className="mt-2 display text-3xl">Need someone to build this?</h3>
            <p className="mt-2 max-w-2xl text-white/75">
              Matched on capability, stack overlap, and proof of work — not résumé keywords.
            </p>
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
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/network" variant="subtle">
                Browse AI Network
              </ButtonLink>
              <ButtonLink href="/projects/new" variant="ghost" className="text-white hover:bg-white/10">
                Post this as a project
              </ButtonLink>
            </div>
          </section>
        </section>
      ) : null}
    </Container>
  );
}
