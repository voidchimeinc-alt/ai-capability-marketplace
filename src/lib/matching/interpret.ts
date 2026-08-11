import { getCatalog } from "@/lib/db/catalog";
import type { UseCase } from "@/types/domain";

export interface InterpretedProblem {
  query: string;
  useCase: UseCase | null;
  confidence: "low" | "medium" | "high";
  notes: string[];
  matchedTerms: string[];
}

const KEYWORDS: Record<string, string[]> = {
  "reduce-customer-support-costs": [
    "support",
    "ticket",
    "helpdesk",
    "help desk",
    "customer service",
    "csat",
    "deflect",
    "zendesk",
    "intercom",
  ],
  "automate-recruitment": ["recruit", "hiring", "résumé", "resume", "candidate", "ats", "screening"],
  "build-ai-sales-assistant": ["sales", "outreach", "crm", "account research", "pipeline", "sdr"],
  "analyse-documents": ["document", "contract", "pdf", "policy", "review", "extract"],
  "automate-finance": ["finance", "invoice", "accounting", "reconcile", "ledger", "ap ", "ar "],
  "internal-knowledge-search": [
    "knowledge",
    "wiki",
    "rag",
    "internal search",
    "company knowledge",
    "notion",
    "confluence",
  ],
  "automate-workflows": ["workflow", "automat", "ops", "zapier", "n8n", "hand-off", "handoff"],
  "generate-marketing-content": ["marketing", "content", "campaign", "copy", "brand", "social"],
  "build-ai-agent": ["agent", "multi-step", "tool use", "orchestrat", "mcp"],
};

export function interpretProblem(input: string, problemSlug?: string): InterpretedProblem {
  const catalog = getCatalog();
  const query = input.trim();

  if (problemSlug) {
    const useCase = catalog.getUseCaseBySlug(problemSlug);
    return {
      query: query || useCase?.name || problemSlug,
      useCase,
      confidence: useCase ? "high" : "low",
      notes: useCase
        ? [`Matched curated use case “${useCase.name}”.`]
        : ["Selected problem slug was not found in the catalog."],
      matchedTerms: [],
    };
  }

  if (!query) {
    return {
      query: "",
      useCase: null,
      confidence: "low",
      notes: ["No problem text provided."],
      matchedTerms: [],
    };
  }

  const lower = query.toLowerCase();
  const scored = catalog.listUseCases().map((useCase) => {
    const terms = KEYWORDS[useCase.slug] ?? [];
    const matched = terms.filter((t) => lower.includes(t));
    const nameHit = lower.includes(useCase.name.toLowerCase()) ? 2 : 0;
    const exampleHit = useCase.exampleQueries.some((q) => lower.includes(q.toLowerCase())) ? 2 : 0;
    return {
      useCase,
      matched,
      score: matched.length * 2 + nameHit + exampleHit,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best || best.score <= 0) {
    return {
      query,
      useCase: null,
      confidence: "low",
      notes: [
        "Could not confidently map this to a curated use case. Showing a general-purpose stack pattern — refine with a suggestion chip for better fit.",
      ],
      matchedTerms: [],
    };
  }

  const runnerUp = scored[1];
  const margin = best.score - (runnerUp?.score ?? 0);
  const confidence = best.score >= 4 && margin >= 2 ? "high" : best.score >= 2 ? "medium" : "low";

  return {
    query,
    useCase: best.useCase,
    confidence,
    notes: [
      `Interpreted as “${best.useCase.name}” using keyword overlap (not a black-box model).`,
      ...(best.matched.length
        ? [`Matched terms: ${best.matched.slice(0, 5).join(", ")}.`]
        : []),
    ],
    matchedTerms: best.matched,
  };
}
