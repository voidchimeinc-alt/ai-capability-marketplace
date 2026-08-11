import { getCatalog } from "@/lib/db/catalog";
import { interpretProblem } from "@/lib/matching/interpret";
import { getBlueprint } from "@/lib/matching/stack-blueprints";
import { deriveCostPosture, scoreTool } from "@/lib/matching/scoring";
import type {
  AlternativeStackSummary,
  CostPosture,
  ImplementationComplexity,
  RecommendationContext,
  StackComponentRecommendation,
  StackRecommendationResult,
  StackRoleSpec,
  ToolEntity,
} from "@/types/domain";

function maxCostPosture(postures: CostPosture[]): CostPosture {
  if (postures.includes("unknown")) return "unknown";
  if (postures.includes("high")) return "high";
  if (postures.includes("medium")) return "medium";
  if (postures.includes("low")) return "low";
  return "unknown";
}

function roleComplexity(role: StackRoleSpec, tool: ToolEntity | null): ImplementationComplexity {
  if (role.id === "agent_orchestration" || role.id === "retrieval") return "advanced";
  if (role.id === "automation" || role.id === "integration") return "moderate";
  if (!tool) return "moderate";
  if (tool.kind === "framework" || tool.kind === "infrastructure") return "advanced";
  if (tool.kind === "automation" || tool.kind === "api") return "moderate";
  return "simple";
}

function stackComplexity(components: StackComponentRecommendation[]): ImplementationComplexity {
  if (components.some((c) => c.complexity === "advanced")) return "advanced";
  if (components.filter((c) => c.complexity === "moderate").length >= 2) return "moderate";
  if (components.length >= 5) return "moderate";
  return "simple";
}

function pickForRole(
  role: StackRoleSpec,
  tools: ToolEntity[],
  context: RecommendationContext,
  useCaseSlug: string | null,
  usedIds: Set<string>,
): StackComponentRecommendation {
  if (role.id === "human_escalation") {
    return {
      role,
      tool: null,
      processLabel: "Human review & escalation desk",
      why: [
        "Complex, high-risk, or ambiguous cases should stay with people.",
        "Keeps the stack trustworthy and reduces silent failure modes.",
      ],
      roleInStack: role.purpose,
      alternatives: [],
      complexity: "moderate",
      costPosture: "medium",
      watchOuts: [
        "Needs clear escalation criteria and response-time ownership.",
        "Without human review, automation can amplify bad answers.",
      ],
      matchScore: 10,
    };
  }

  if (role.id === "implementation") {
    return {
      role,
      tool: null,
      processLabel: "AI Builder / implementation specialist",
      why: [
        "Stacks fail in the wiring: auth, data quality, prompts, evaluation, and change management.",
        "A builder with proof of work turns this from a slide into a working system.",
      ],
      roleInStack: role.purpose,
      alternatives: [],
      complexity: "moderate",
      costPosture: "unknown",
      watchOuts: [
        "Implementation cost is Unknown until scoped against your systems and volume.",
      ],
      matchScore: 10,
    };
  }

  const catalog = getCatalog();
  const useCase = useCaseSlug ? catalog.getUseCaseBySlug(useCaseSlug) : null;

  const kindFiltered = tools
    .filter((t) => !usedIds.has(t.id))
    .filter((t) => {
      if (!role.preferredKinds.length) return true;
      return role.preferredKinds.includes(t.kind);
    });

  const hinted = role.tagHints.length
    ? kindFiltered.filter((t) => {
        const blob = [...t.tags, t.category, t.name, ...t.bestFor, t.shortDescription]
          .join(" ")
          .toLowerCase();
        return role.tagHints.some((h) => blob.includes(h.toLowerCase()));
      })
    : [];

  // Prefer kind+hint matches; never fall back to the whole catalog for typed roles.
  const pool =
    hinted.length > 0
      ? hinted
      : kindFiltered.length > 0
        ? kindFiltered
        : tools.filter((t) => !usedIds.has(t.id));

  const ranked = pool
    .map((tool) => {
      const scored = scoreTool(tool, {
        useCase,
        budget: context.budget,
        currentTools: context.currentTools,
        tagHints: role.tagHints,
      });
      // Role-specific fit dominates so a general chat app does not win every layer.
      const blob = [...tool.tags, tool.category, tool.name, ...tool.bestFor, tool.shortDescription]
        .join(" ")
        .toLowerCase();
      const hintHits = role.tagHints.filter((h) => blob.includes(h.toLowerCase())).length;
      const kindBonus = role.preferredKinds.includes(tool.kind) ? 1.5 : 0;
      const roleFit = hintHits * 2.2 + kindBonus;
      return { tool, ...scored, score: scored.score + roleFit };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const alts = ranked.slice(1, 4).map((item) => ({
    tool: item.tool,
    why: item.reasons[0] ?? "Strong secondary fit for this role.",
  }));

  if (!best) {
    return {
      role,
      tool: null,
      processLabel: "Not yet matched",
      why: ["No catalog tool clearly fit this role yet."],
      roleInStack: role.purpose,
      alternatives: [],
      complexity: "moderate",
      costPosture: "unknown",
      watchOuts: ["Treat this component as a discovery item during implementation."],
      matchScore: 0,
    };
  }

  usedIds.add(best.tool.id);

  return {
    role,
    tool: best.tool,
    why: [
      ...best.reasons.slice(0, 3),
      `Selected for the “${role.label}” role using weighted matching (use-case 40%, capability 20%, cost 15%, integrations 15%, enterprise 10%).`,
    ],
    roleInStack: role.purpose,
    alternatives: alts,
    complexity: roleComplexity(role, best.tool),
    costPosture: deriveCostPosture(best.tool),
    watchOuts: best.caveats.slice(0, 3),
    matchScore: best.score,
  };
}

function buildAlternativeStacks(
  primary: StackComponentRecommendation[],
  useCaseName: string | null,
): AlternativeStackSummary[] {
  const toolComponents = primary.filter((c) => c.tool);
  const alts: AlternativeStackSummary[] = [];

  const modelComp = toolComponents.find((c) => c.role.id === "model");
  const modelAlt = modelComp?.alternatives[0];
  if (modelComp?.tool && modelAlt) {
    alts.push({
      name: `${useCaseName ?? "Outcome"} stack · model swap`,
      summary: `Keep the same architecture, swap ${modelComp.tool.name} for ${modelAlt.tool.name}.`,
      whenBetter: modelAlt.why,
      components: toolComponents.map((c) => ({
        roleLabel: c.role.label,
        toolName: c.role.id === "model" ? modelAlt.tool.name : (c.tool?.name ?? c.processLabel ?? "—"),
      })),
    });
  }

  const autoComp = toolComponents.find((c) => c.role.id === "automation");
  const autoAlt = autoComp?.alternatives[0];
  if (autoComp?.tool && autoAlt) {
    alts.push({
      name: `${useCaseName ?? "Outcome"} stack · automation swap`,
      summary: `Same capabilities with ${autoAlt.tool.name} instead of ${autoComp.tool.name} for workflow glue.`,
      whenBetter: "Prefer this when your team already lives in that automation ecosystem.",
      components: toolComponents.map((c) => ({
        roleLabel: c.role.label,
        toolName:
          c.role.id === "automation" ? autoAlt.tool.name : (c.tool?.name ?? c.processLabel ?? "—"),
      })),
    });
  }

  const lean = toolComponents.filter((c) =>
    ["model", "automation", "application"].includes(c.role.id),
  );
  if (lean.length >= 2) {
    alts.push({
      name: "Lean pilot stack",
      summary: "Fewer moving parts for a shorter proof of concept.",
      whenBetter: "Best when you need a signal this quarter before committing to retrieval or deep integrations.",
      components: lean.map((c) => ({
        roleLabel: c.role.label,
        toolName: c.tool?.name ?? c.processLabel ?? "—",
      })),
    });
  }

  return alts.slice(0, 3);
}

export function recommendStack(context: RecommendationContext): StackRecommendationResult {
  const query = context.q || context.customProblem || "";
  const interpreted = interpretProblem(query, context.problemSlug);
  const useCase = interpreted.useCase;
  const blueprint = getBlueprint(useCase?.slug);
  const tools = getCatalog().listTools();
  const usedIds = new Set<string>();

  const components = blueprint.map((role) =>
    pickForRole(role, tools, context, useCase?.slug ?? null, usedIds),
  );

  const toolPostures = components
    .filter((c) => c.tool)
    .map((c) => c.costPosture);
  const costPosture = maxCostPosture(toolPostures.length ? toolPostures : ["unknown"]);
  const complexity = stackComplexity(components);

  const stackName = useCase
    ? `${useCase.name} stack`
    : "General AI implementation stack";

  const whyThisStack = [
    interpreted.notes[0] ?? "Mapped from your problem description.",
    `Assembled ${components.filter((c) => c.tool || c.processLabel).length} components — only roles relevant to this outcome.`,
    "Each tool pick uses explainable weighted matching, not a black-box ranker.",
    "Human escalation and implementation are first-class — software alone is not the stack.",
  ];

  if (context.currentTools?.length) {
    whyThisStack.push(`Took your current tools into account: ${context.currentTools.join(", ")}.`);
  }

  const risks = [
    ...new Set(
      components.flatMap((c) => c.watchOuts).concat([
        "Recommendations are advisory. Validate against your data, security, and compliance constraints.",
        "Exact software and implementation pricing are Unknown unless independently verified.",
        useCase
          ? `Success depends on clean source content and clear ownership for “${useCase.name}”.`
          : "Low interpretation confidence — refine the problem statement for a sharper stack.",
      ]),
    ),
  ].slice(0, 6);

  const builderHints = components
    .filter((c) => c.tool)
    .flatMap((c) => c.tool!.tags.slice(0, 2))
    .concat(useCase ? [useCase.name.split(" ")[0]!.toLowerCase()] : [])
    .slice(0, 8);

  return {
    interpretedProblem: interpreted.query || useCase?.problemStatement || "Business problem",
    useCaseSlug: useCase?.slug ?? null,
    useCaseName: useCase?.name ?? null,
    confidence: interpreted.confidence,
    interpretationNotes: interpreted.notes,
    stackName,
    components,
    whyThisStack,
    alternatives: buildAlternativeStacks(components, useCase?.name ?? null),
    complexity,
    costPosture,
    risks,
    builderHints,
  };
}

export function matchBuildersForStack(
  context: RecommendationContext,
  stack: StackRecommendationResult,
  limit = 3,
) {
  const catalog = getCatalog();
  const hints = [
    ...stack.builderHints,
    ...(stack.components.map((c) => c.tool?.name).filter(Boolean) as string[]),
    ...(context.currentTools ?? []),
  ].map((h) => h.toLowerCase());

  return catalog
    .listBuilders()
    .map((builder) => {
      const blob = [...builder.capabilities, ...builder.specializations, ...builder.stack, builder.bio]
        .join(" ")
        .toLowerCase();
      const hits = hints.filter((h) => h.length > 2 && blob.includes(h));
      const capabilityMatch = Math.min(10, 4 + hits.length);
      const techMatch = stack.components
        .filter((c) => c.tool)
        .some((c) => builder.stack.some((s) => s.toLowerCase().includes(c.tool!.name.toLowerCase())))
        ? 8
        : 5;
      const useCaseExp = stack.useCaseName
        ? builder.projects.some((p) =>
            [p.problem, p.solution, p.title].join(" ").toLowerCase().includes(
              stack.useCaseName!.toLowerCase().split(" ")[0]!,
            ),
          )
          ? 9
          : 5
        : 5;
      const availability = builder.availability === "available" ? 9 : builder.availability === "limited" ? 6 : 2;
      const score = capabilityMatch * 0.4 + techMatch * 0.2 + useCaseExp * 0.2 + availability * 0.1 + 6 * 0.1;
      const why = [
        hits.length
          ? `Stack overlap: ${hits.slice(0, 4).join(", ")}.`
          : "General AI implementation experience for this class of problem.",
        techMatch >= 8
          ? "Has worked with technologies adjacent to this stack."
          : "Can implement adjacent tooling even if exact products differ.",
        `${builder.trust.verifiedProjects} verified proof-of-work projects · ${builder.availability}.`,
      ];
      return { builder, score, why };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
