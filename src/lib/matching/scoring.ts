import type {
  CapabilityDimension,
  CostPosture,
  PricingModel,
  ScoreProvenance,
  ToolEntity,
  UseCase,
} from "@/types/domain";

export const WEIGHTS = {
  useCase: 0.4,
  capability: 0.2,
  cost: 0.15,
  integration: 0.15,
  enterprise: 0.1,
} as const;

export function getScoreProvenance(
  tool: ToolEntity,
  dimension: CapabilityDimension,
): ScoreProvenance | null {
  const value = tool.capabilities[dimension];
  if (value == null) return null;
  return tool.capabilityProvenance?.[dimension] ?? "editorial";
}

export function formatCapabilityScore(
  tool: ToolEntity,
  dimension: CapabilityDimension,
): { display: string; provenance: ScoreProvenance | null; value: number | null } {
  const value = tool.capabilities[dimension] ?? null;
  if (value == null) {
    return { display: "Not yet evaluated", provenance: null, value: null };
  }
  return {
    display: `${value}/10`,
    provenance: getScoreProvenance(tool, dimension),
    value,
  };
}

export function deriveCostPosture(tool: ToolEntity): CostPosture {
  if (tool.costPosture) return tool.costPosture;
  const map: Record<PricingModel, CostPosture> = {
    free: "low",
    freemium: "low",
    usage: "medium",
    paid: "medium",
    enterprise: "high",
    unknown: "unknown",
  };
  return map[tool.pricingModel] ?? "unknown";
}

export function deriveEnterprisePosture(tool: ToolEntity): "low" | "medium" | "high" | "unknown" {
  if (tool.enterprisePosture) return tool.enterprisePosture;
  const score = tool.capabilities.enterprise_readiness;
  if (score == null) return "unknown";
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

export function averageCapability(tool: ToolEntity, useCase?: UseCase | null) {
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
    const value = tool.capabilities[dim as CapabilityDimension];
    if (typeof value === "number" && typeof weight === "number") {
      total += value * weight;
      weightSum += weight;
    }
  }
  if (weightSum === 0) return 5;
  return total / weightSum;
}

export function costScore(tool: ToolEntity, budget?: string) {
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

export function integrationScore(tool: ToolEntity, currentTools?: string[]) {
  if (!currentTools?.length) return 6;
  const hay = tool.integrations.map((i) => i.toLowerCase());
  const hits = currentTools.filter((t) =>
    hay.some((h) => h.includes(t.toLowerCase()) || t.toLowerCase().includes(h)),
  );
  if (hits.length >= 2) return 9;
  if (hits.length === 1) return 7;
  return 5;
}

export function scoreTool(
  tool: ToolEntity,
  opts: {
    useCase?: UseCase | null;
    budget?: string;
    currentTools?: string[];
    tagHints?: string[];
  } = {},
) {
  const useCase = opts.useCase ?? null;
  const useCaseFit = useCase
    ? tool.useCaseSlugs.includes(useCase.slug)
      ? 9
      : averageCapability(tool, useCase)
    : averageCapability(tool, useCase);
  const capability = averageCapability(tool, useCase);
  const cost = costScore(tool, opts.budget);
  const integrations = integrationScore(tool, opts.currentTools);
  const enterprise = tool.capabilities.enterprise_readiness ?? 5;

  let tagBoost = 0;
  if (opts.tagHints?.length) {
    const blob = [...tool.tags, tool.category, tool.name, ...tool.bestFor].join(" ").toLowerCase();
    const hits = opts.tagHints.filter((h) => blob.includes(h.toLowerCase())).length;
    tagBoost = Math.min(1.5, hits * 0.35);
  }

  const score =
    useCaseFit * WEIGHTS.useCase +
    capability * WEIGHTS.capability +
    cost * WEIGHTS.cost +
    integrations * WEIGHTS.integration +
    (typeof enterprise === "number" ? enterprise : 5) * WEIGHTS.enterprise +
    tagBoost;

  const reasons: string[] = [];
  if (useCase && tool.useCaseSlugs.includes(useCase.slug)) {
    reasons.push(`Mapped to use case “${useCase.name}”.`);
  }
  reasons.push(
    `Capability fit ${capability.toFixed(1)}/10 (editorial seed estimates where marked).`,
  );
  if (integrations >= 7) reasons.push("Integrations overlap with tools you already use.");
  if (tool.pricingModel === "freemium" || tool.pricingModel === "free") {
    reasons.push("Lower commercial friction based on pricing model (exact price Unknown unless verified).");
  }
  if ((tool.capabilities.enterprise_readiness ?? 0) >= 8) {
    reasons.push("Stronger enterprise-readiness signal in editorial scores.");
  }

  const caveats: string[] = [];
  if (tool.pricingNotes.toLowerCase().includes("unknown") || deriveCostPosture(tool) === "unknown") {
    caveats.push("Pricing not verified — treat cost as Unknown.");
  }
  caveats.push(...tool.weaknesses.slice(0, 2));

  return { score, reasons, caveats, capability, cost, integrations, enterprise };
}
