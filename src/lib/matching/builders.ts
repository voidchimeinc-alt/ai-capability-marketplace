import { getCatalog } from "@/lib/db/catalog";
import type {
  Builder,
  BuilderMatchResult,
  BuilderProject,
  RecommendationContext,
  StackRecommendationResult,
} from "@/types/domain";
import { isOutcomeVerified } from "@/lib/network/trust";

/** V1 stack→builder weights (deterministic, explainable). */
export const BUILDER_MATCH_WEIGHTS = {
  capability: 0.4,
  proofOfWork: 0.25,
  technology: 0.2,
  availability: 0.1,
  location: 0.05,
} as const;

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").trim();
}

function tokens(input: string) {
  return normalize(input)
    .split(/[\s,/|]+/)
    .filter((t) => t.length > 1);
}

function overlaps(a: string[], b: string[]) {
  const nb = b.map(normalize);
  return a.filter((item) => {
    const n = normalize(item);
    return nb.some((x) => x.includes(n) || n.includes(x));
  });
}

function stackTechnologies(stack: StackRecommendationResult): string[] {
  return stack.components
    .map((c) => c.tool?.name)
    .filter((name): name is string => Boolean(name));
}

function stackCapabilityHints(stack: StackRecommendationResult, context: RecommendationContext): string[] {
  const hints = new Set<string>();
  for (const h of stack.builderHints) hints.add(h);
  for (const c of stack.components) {
    hints.add(c.role.label);
    for (const tag of c.tool?.tags ?? []) hints.add(tag);
    for (const best of c.tool?.bestFor ?? []) hints.add(best);
  }
  if (stack.useCaseName) hints.add(stack.useCaseName);
  if (context.q) for (const t of tokens(context.q)) if (t.length > 3) hints.add(t);
  return [...hints];
}

function relevantProjects(builder: Builder, stack: StackRecommendationResult): BuilderProject[] {
  const tech = stackTechnologies(stack).map(normalize);
  const useCaseTokens = tokens(stack.useCaseName ?? stack.interpretedProblem);
  return builder.projects.filter((project) => {
    const blob = normalize(
      [project.title, project.problem, project.solution, project.outcome, ...project.technologies].join(" "),
    );
    const techHit = project.technologies.some((t) =>
      tech.some((x) => normalize(t).includes(x) || x.includes(normalize(t))),
    );
    const useCaseHit = useCaseTokens.some((t) => t.length > 3 && blob.includes(t));
    const slugHit = (builder.useCaseSlugs ?? []).includes(stack.useCaseSlug ?? "");
    return techHit || useCaseHit || slugHit;
  });
}

function scoreCapability(builder: Builder, hints: string[]): { score: number; matched: string[] } {
  const pool = [...builder.capabilities, ...builder.specializations, ...builder.preferredProjectTypes];
  const matched = overlaps(pool, hints);
  // Also soft-match bio keywords
  const bioHits = hints.filter((h) => normalize(builder.bio).includes(normalize(h)) && normalize(h).length > 3);
  const unique = [...new Set([...matched, ...bioHits.map((h) => h)])].slice(0, 8);
  const score = Math.min(10, 3 + unique.length * 1.4);
  return { score, matched: unique.slice(0, 6) };
}

function scoreProof(
  builder: Builder,
  relevant: BuilderProject[],
): { score: number; count: number } {
  if (!relevant.length) {
    return { score: builder.trust.verifiedProjects > 0 ? 4 : 2, count: 0 };
  }
  const verifiedRelevant = relevant.filter(
    (p) =>
      p.verificationStatus === "platform_verified" ||
      p.verificationStatus === "client_verified" ||
      isOutcomeVerified(p),
  ).length;
  const score = Math.min(10, 4 + relevant.length * 1.5 + verifiedRelevant * 1.2);
  return { score, count: relevant.length };
}

function scoreTechnology(
  builder: Builder,
  stackTech: string[],
): { score: number; matched: string[] } {
  if (!stackTech.length) return { score: 5, matched: [] };
  const matched = overlaps(builder.stack, stackTech);
  // Also match project technologies
  const projectTech = builder.projects.flatMap((p) => p.technologies);
  const projectMatched = overlaps(projectTech, stackTech).filter(
    (t) => !matched.some((m) => normalize(m) === normalize(t)),
  );
  const all = [...matched, ...projectMatched];
  const ratio = all.length / stackTech.length;
  const score = Math.min(10, 3 + ratio * 7 + Math.min(2, all.length * 0.3));
  return { score, matched: all.slice(0, 8) };
}

function scoreAvailability(builder: Builder): number {
  if (builder.availability === "available") return 10;
  if (builder.availability === "limited") return 6;
  return 2;
}

function scoreLocation(
  builder: Builder,
  context: RecommendationContext,
): number {
  // Soft signal only — no hard geo requirement in V1.
  if (!context.industry && !context.companySize) return 6;
  // Prefer available builders in common enterprise timezones lightly; keep mostly neutral.
  if (builder.timezone.startsWith("America/") || builder.timezone.startsWith("Europe/")) return 7;
  return 6;
}

function canBuildComponents(builder: Builder, stack: StackRecommendationResult): string[] {
  return stack.components
    .filter((c) => c.tool)
    .filter((c) => {
      const name = c.tool!.name;
      const tags = c.tool!.tags;
      const blob = normalize([...builder.stack, ...builder.capabilities, ...builder.specializations].join(" "));
      return (
        blob.includes(normalize(name)) ||
        tags.some((t) => blob.includes(normalize(t))) ||
        builder.projects.some((p) =>
          p.technologies.some(
            (tech) =>
              normalize(tech).includes(normalize(name)) || normalize(name).includes(normalize(tech)),
          ),
        )
      );
    })
    .map((c) => c.role.label);
}

export function matchBuildersForStack(
  context: RecommendationContext,
  stack: StackRecommendationResult,
  limit = 6,
): BuilderMatchResult[] {
  const catalog = getCatalog();
  const hints = stackCapabilityHints(stack, context);
  const stackTech = stackTechnologies(stack);

  return catalog
    .listBuilders()
    .map((builder) => {
      const relevant = relevantProjects(builder, stack);
      const capability = scoreCapability(builder, hints);
      const proof = scoreProof(builder, relevant);
      const technology = scoreTechnology(builder, stackTech);
      const availability = scoreAvailability(builder);
      const location = scoreLocation(builder, context);

      const breakdown = {
        capability: capability.score,
        proofOfWork: proof.score,
        technology: technology.score,
        availability,
        location,
      };

      const score =
        breakdown.capability * BUILDER_MATCH_WEIGHTS.capability +
        breakdown.proofOfWork * BUILDER_MATCH_WEIGHTS.proofOfWork +
        breakdown.technology * BUILDER_MATCH_WEIGHTS.technology +
        breakdown.availability * BUILDER_MATCH_WEIGHTS.availability +
        breakdown.location * BUILDER_MATCH_WEIGHTS.location;

      const breakdownPercent = {
        capability: Math.round(breakdown.capability * 10),
        proofOfWork: Math.round(breakdown.proofOfWork * 10),
        technology: Math.round(breakdown.technology * 10),
        availability: Math.round(breakdown.availability * 10),
        location: Math.round(breakdown.location * 10),
      };

      const components = canBuildComponents(builder, stack);
      const why: string[] = [];
      if (capability.matched.length) {
        why.push(`Capability overlap: ${capability.matched.slice(0, 4).join(", ")}.`);
      } else {
        why.push("Broad AI implementation capability — refine with a more specific stack for a sharper match.");
      }
      if (proof.count > 0) {
        why.push(
          `Relevant proof of work: ${proof.count} project${proof.count === 1 ? "" : "s"} adjacent to this problem.`,
        );
      } else {
        why.push("No directly adjacent proof-of-work projects found in the seed profile yet.");
      }
      if (technology.matched.length) {
        why.push(`Technology match: ${technology.matched.slice(0, 5).join(", ")}.`);
      }
      why.push(`Availability: ${builder.availability}.`);
      if (components.length) {
        why.push(`Can build components of this stack: ${components.slice(0, 4).join(", ")}.`);
      }

      const summary =
        proof.count > 0 && technology.matched.length > 0
          ? `${builder.name} has demonstrated adjacent work and stack overlap for this outcome.`
          : `${builder.name} is a plausible implementer based on capability signals — review proof of work carefully.`;

      return {
        builder,
        score,
        scorePercent: Math.round(Math.min(100, (score / 10) * 100)),
        breakdown,
        breakdownPercent,
        matchedCapabilities: capability.matched,
        matchedTechnologies: technology.matched,
        relevantProjects: relevant.slice(0, 3),
        canBuildComponents: components,
        why,
        summary,
      } satisfies BuilderMatchResult;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
