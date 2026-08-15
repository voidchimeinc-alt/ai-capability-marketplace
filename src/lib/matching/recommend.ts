import type { RecommendationContext, ToolEntity, UseCase } from "@/types/domain";
import { getCatalog } from "@/lib/db/catalog";
import { scoreTool } from "@/lib/matching/scoring";
import { matchBuildersForStack, recommendStack } from "@/lib/matching/stack";

export interface RankedRecommendation {
  tool: ToolEntity;
  score: number;
  tier: "recommended" | "alternative" | "advanced";
  reasons: string[];
  caveats: string[];
}

export function recommendTools(context: RecommendationContext): RankedRecommendation[] {
  const catalog = getCatalog();
  const useCase = context.problemSlug ? catalog.getUseCaseBySlug(context.problemSlug) : null;

  const candidates = catalog.listTools({
    useCase: useCase?.slug,
  });

  const pool = candidates.length ? candidates : catalog.listTools();

  return pool
    .map((tool) => {
      const scored = scoreTool(tool, {
        useCase,
        budget: context.budget,
        currentTools: context.currentTools,
      });
      return { tool, score: scored.score, reasons: scored.reasons, caveats: scored.caveats };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      tier: (index === 0 ? "recommended" : index === 1 ? "alternative" : "advanced") as RankedRecommendation["tier"],
    }));
}

export function matchBuilders(context: RecommendationContext, limit = 3) {
  const stack = recommendStack(context);
  return matchBuildersForStack(context, stack, limit);
}

export { recommendStack, matchBuildersForStack };
export type { UseCase };
