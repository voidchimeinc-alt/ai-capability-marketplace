import type { RecommendationContext, ToolEntity, UseCase } from "@/types/domain";
import { getCatalog } from "@/lib/db/catalog";

export interface RankedRecommendation {
  tool: ToolEntity;
  score: number;
  tier: "recommended" | "alternative" | "advanced";
  reasons: string[];
  caveats: string[];
}

function averageCapability(tool: ToolEntity, useCase?: UseCase | null) {
  const weights = useCase?.recommendedCapabilityWeights ?? {};
  const entries = Object.entries(weights);
  if (entries.length === 0) {
    const vals = Object.values(tool.capabilities).filter((v): v is number => typeof v === "number");
    if (!vals.length) return 5;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  let total = 0;
  let weightSum = 0;
  for (const [dim, weight] of entries) {
    const value = tool.capabilities[dim as keyof typeof tool.capabilities];
    if (typeof value === "number" && typeof weight === "number") {
      total += value * weight;
      weightSum += weight;
    }
  }
  if (weightSum === 0) return 5;
  return total / weightSum;
}

function costScore(tool: ToolEntity, budget?: string) {
  // Qualitative only — never invent prices. Prefer freemium/unknown neutrally.
  const modelBoost: Record<string, number> = {
    free: 9,
    freemium: 8,
    usage: 6,
    paid: 5,
    enterprise: 4,
    unknown: 5,
  };
  let score = modelBoost[tool.pricingModel] ?? 5;
  if (budget?.toLowerCase().includes("low") && (tool.pricingModel === "enterprise" || tool.pricingModel === "paid")) {
    score -= 2;
  }
  if (budget?.toLowerCase().includes("enterprise") && tool.pricingModel === "enterprise") {
    score += 1;
  }
  return Math.max(1, Math.min(10, score));
}

function integrationScore(tool: ToolEntity, currentTools?: string[]) {
  if (!currentTools?.length) return 6;
  const hay = tool.integrations.map((i) => i.toLowerCase());
  const hits = currentTools.filter((t) => hay.some((h) => h.includes(t.toLowerCase()) || t.toLowerCase().includes(h)));
  if (hits.length >= 2) return 9;
  if (hits.length === 1) return 7;
  return 5;
}

export function recommendTools(context: RecommendationContext): RankedRecommendation[] {
  const catalog = getCatalog();
  const useCase = context.problemSlug ? catalog.getUseCaseBySlug(context.problemSlug) : null;

  const candidates = catalog.listTools({
    useCase: useCase?.slug,
  });

  const pool = candidates.length ? candidates : catalog.listTools();

  const ranked = pool
    .map((tool) => {
      const useCaseFit = useCase
        ? tool.useCaseSlugs.includes(useCase.slug)
          ? 9
          : averageCapability(tool, useCase)
        : averageCapability(tool, useCase);
      const capability = averageCapability(tool, useCase);
      const cost = costScore(tool, context.budget);
      const integrations = integrationScore(tool, context.currentTools);
      const enterprise = tool.capabilities.enterprise_readiness ?? 5;

      const score =
        useCaseFit * 0.4 +
        capability * 0.2 +
        cost * 0.15 +
        integrations * 0.15 +
        (typeof enterprise === "number" ? enterprise : 5) * 0.1;

      const reasons: string[] = [];
      if (useCase && tool.useCaseSlugs.includes(useCase.slug)) {
        reasons.push(`Mapped to use case “${useCase.name}”.`);
      }
      reasons.push(`Capability fit score ${capability.toFixed(1)}/10 against your problem weights.`);
      if (integrations >= 7) reasons.push("Integrations overlap with tools you already use.");
      if (tool.pricingModel === "freemium" || tool.pricingModel === "free") {
        reasons.push("Lower commercial friction based on pricing model (exact price Unknown unless verified).");
      }
      if ((tool.capabilities.enterprise_readiness ?? 0) >= 8) {
        reasons.push("Stronger enterprise-readiness signal in editorial scores.");
      }

      const caveats: string[] = [];
      if (tool.pricingNotes.toLowerCase().includes("unknown")) {
        caveats.push("Pricing not verified — treat cost as Unknown.");
      }
      caveats.push(...tool.weaknesses.slice(0, 2));

      return { tool, score, reasons, caveats };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      tier: (index === 0 ? "recommended" : index === 1 ? "alternative" : "advanced") as RankedRecommendation["tier"],
    }));

  return ranked;
}

export function matchBuilders(context: RecommendationContext, limit = 3) {
  const catalog = getCatalog();
  const useCase = context.problemSlug ? catalog.getUseCaseBySlug(context.problemSlug) : null;
  const required = [
    ...(useCase?.name ? [useCase.name] : []),
    ...(context.customProblem ? context.customProblem.split(" ") : []),
  ];

  return catalog
    .listBuilders()
    .map((builder) => {
      const capBlob = [...builder.capabilities, ...builder.specializations, ...builder.stack].join(" ").toLowerCase();
      const capabilityHits = required.filter((r) => capBlob.includes(r.toLowerCase())).length;
      const capabilityMatch = Math.min(10, 4 + capabilityHits * 2);
      const techMatch = context.currentTools?.length
        ? Math.min(
            10,
            4 +
              context.currentTools.filter((t) =>
                builder.stack.some((s) => s.toLowerCase().includes(t.toLowerCase())),
              ).length *
                2,
          )
        : 6;
      const useCaseExp = useCase
        ? builder.projects.some((p) =>
            [p.problem, p.solution, p.title].join(" ").toLowerCase().includes(useCase.name.toLowerCase().split(" ")[0]!),
          )
          ? 8
          : 5
        : 5;
      const availability = builder.availability === "available" ? 9 : builder.availability === "limited" ? 6 : 2;
      const budgetFit = 6;
      const score =
        capabilityMatch * 0.4 + techMatch * 0.2 + useCaseExp * 0.2 + availability * 0.1 + budgetFit * 0.1;
      const why = [
        capabilityHits
          ? "Capability keywords overlap your problem."
          : "General AI implementation experience.",
        `Availability: ${builder.availability}.`,
        `${builder.trust.verifiedProjects} verified proof-of-work projects.`,
      ];
      return { builder, score, why };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
