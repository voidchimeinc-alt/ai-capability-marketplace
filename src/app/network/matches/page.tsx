import { BuilderMatchCard } from "@/components/network/builder-match-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { matchBuildersForStack, BUILDER_MATCH_WEIGHTS } from "@/lib/matching/builders";
import { recommendStack } from "@/lib/matching/stack";
import { COMPLEXITY_LABELS, COST_POSTURE_LABELS } from "@/types/domain";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Builders who can build this",
  description: "Explainable stack-to-builder matching for AI Workbench.",
};

function buildProjectHref(params: {
  problem?: string;
  q?: string;
  builder?: string;
  stackName?: string;
}) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.problem) qs.set("problem", params.problem);
  if (params.stackName) qs.set("stack", params.stackName);
  if (params.builder) qs.set("builder", params.builder);
  qs.set("from", "stack");
  return `/projects/new?${qs.toString()}`;
}

export default async function NetworkMatchesPage({
  searchParams,
}: {
  searchParams: Promise<{
    problem?: string;
    q?: string;
    size?: string;
    industry?: string;
    budget?: string;
    tools?: string;
  }>;
}) {
  const params = await searchParams;
  const hasInput = Boolean(params.problem || params.q);

  if (!hasInput) {
    return (
      <Container className="py-14 sm:py-20">
        <p className="eyebrow">AI Network</p>
        <h1 className="mt-3 display text-5xl">Start from an AI Stack</h1>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Generate a stack first, then find builders who can implement it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/ai/recommend">Find My AI Stack</ButtonLink>
          <ButtonLink href="/network" variant="subtle">
            Browse Network
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const context = {
    problemSlug: params.problem,
    q: params.q,
    customProblem: params.q,
    companySize: params.size,
    industry: params.industry,
    budget: params.budget,
    currentTools: params.tools
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const stack = recommendStack(context);
  const matches = matchBuildersForStack(context, stack, 6);
  const stackQuery = new URLSearchParams();
  if (params.problem) stackQuery.set("problem", params.problem);
  if (params.q) stackQuery.set("q", params.q);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow">Builders who can build this</p>
        <h1 className="display text-5xl sm:text-6xl">{stack.stackName}</h1>
        <p className="text-lg text-[var(--muted)]">{stack.interpretedProblem}</p>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{COMPLEXITY_LABELS[stack.complexity]}</Badge>
          <Badge tone="warning">Cost {COST_POSTURE_LABELS[stack.costPosture]}</Badge>
          <Badge tone="muted">Deterministic matching</Badge>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Weights: capability {BUILDER_MATCH_WEIGHTS.capability * 100}% · proof{" "}
          {BUILDER_MATCH_WEIGHTS.proofOfWork * 100}% · technology {BUILDER_MATCH_WEIGHTS.technology * 100}% ·
          availability {BUILDER_MATCH_WEIGHTS.availability * 100}% · location{" "}
          {BUILDER_MATCH_WEIGHTS.location * 100}%
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href={`/ai/recommend?${stackQuery.toString()}`} variant="subtle">
            Back to AI Stack
          </ButtonLink>
          <ButtonLink href="/network/shortlist" variant="ghost">
            View shortlist
          </ButtonLink>
          <ButtonLink
            href={buildProjectHref({
              problem: params.problem,
              q: params.q,
              stackName: stack.stackName,
            })}
          >
            Build this
          </ButtonLink>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/60 p-5">
        <p className="text-sm font-medium">Stack components</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.components.map((c) => (
            <Badge key={`${c.role.id}-${c.tool?.id ?? c.processLabel}`} tone="muted">
              {c.role.label}: {c.tool?.name ?? c.processLabel}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-5">
        {matches.map((match) => (
          <BuilderMatchCard
            key={match.builder.id}
            match={match}
            buildHref={buildProjectHref({
              problem: params.problem,
              q: params.q,
              stackName: stack.stackName,
              builder: match.builder.slug,
            })}
          />
        ))}
      </div>

      {!matches.length ? (
        <p className="mt-10 text-[var(--muted)]">
          No builders matched yet.{" "}
          <Link href="/network" className="underline">
            Browse the Network
          </Link>
          .
        </p>
      ) : null}
    </Container>
  );
}
