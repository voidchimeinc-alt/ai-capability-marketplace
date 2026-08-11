import { describe, expect, it } from "vitest";
import { getCatalog } from "@/lib/db/catalog";
import { interpretProblem } from "@/lib/matching/interpret";
import { recommendTools } from "@/lib/matching/recommend";
import { matchBuildersForStack, recommendStack } from "@/lib/matching/stack";
import { formatCapabilityScore } from "@/lib/matching/scoring";
import { brand } from "@/lib/brand";

describe("seed catalog", () => {
  it("has curated tools, builders, and use cases", () => {
    const catalog = getCatalog();
    expect(catalog.listTools().length).toBeGreaterThan(15);
    expect(catalog.listBuilders().length).toBeGreaterThan(5);
    expect(catalog.listUseCases().length).toBeGreaterThan(5);
    expect(catalog.listBenchmarks().length).toBeGreaterThan(3);
  });

  it("search finds customer support related entities", () => {
    const results = getCatalog().search("customer support");
    expect(results.useCases.length + results.tools.length).toBeGreaterThan(0);
  });
});

describe("problem interpretation", () => {
  it("maps natural language support problems to the support use case", () => {
    const result = interpretProblem(
      "I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.",
    );
    expect(result.useCase?.slug).toBe("reduce-customer-support-costs");
    expect(["medium", "high"]).toContain(result.confidence);
  });
});

describe("AI stack recommendation", () => {
  it("returns a multi-component support stack with explanations", () => {
    const stack = recommendStack({
      problemSlug: "reduce-customer-support-costs",
      q: "I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.",
    });

    expect(stack.useCaseSlug).toBe("reduce-customer-support-costs");
    expect(stack.components.length).toBeGreaterThanOrEqual(5);
    expect(stack.components.some((c) => c.role.id === "model" && c.tool)).toBe(true);
    expect(stack.components.some((c) => c.role.id === "human_escalation")).toBe(true);
    expect(stack.components.some((c) => c.role.id === "implementation")).toBe(true);

    const knowledge = stack.components.find((c) => c.role.id === "knowledge");
    const retrieval = stack.components.find((c) => c.role.id === "retrieval");
    expect(knowledge?.tool?.slug).not.toBe("chatgpt");
    expect(retrieval?.tool?.kind).toMatch(/infrastructure|api/);
    expect(
      stack.components.map((c) => `${c.role.id}:${c.tool?.slug ?? c.processLabel}`),
    ).toEqual(expect.any(Array));
    expect(stack.whyThisStack.length).toBeGreaterThan(0);
    expect(stack.alternatives.length).toBeGreaterThan(0);
    expect(stack.risks.length).toBeGreaterThan(0);
    expect(["simple", "moderate", "advanced"]).toContain(stack.complexity);
    expect(["low", "medium", "high", "unknown"]).toContain(stack.costPosture);

    for (const component of stack.components) {
      expect(component.why.length).toBeGreaterThan(0);
      expect(component.roleInStack.length).toBeGreaterThan(0);
    }
  });

  it("matches builders to the recommended stack with explainable breakdown", () => {
    const context = { problemSlug: "reduce-customer-support-costs" };
    const stack = recommendStack(context);
    const builders = matchBuildersForStack(context, stack);
    expect(builders.length).toBeGreaterThan(0);
    expect(builders[0]?.why.length).toBeGreaterThan(0);
    expect(builders[0]?.scorePercent).toBeGreaterThan(0);
    expect(builders[0]?.breakdownPercent.capability).toBeGreaterThan(0);
    expect(builders[0]?.summary.length).toBeGreaterThan(0);
  });
});

describe("builder discovery filters", () => {
  it("filters builders by capability and technology keywords", () => {
    const catalog = getCatalog();
    const rag = catalog.listBuilders({ q: "RAG engineer" });
    expect(rag.length).toBeGreaterThan(0);
    const n8n = catalog.listBuilders({ technology: "n8n" });
    expect(n8n.length).toBeGreaterThan(0);
  });
});

describe("tool ranking still works", () => {
  it("returns three ranked options with explanations", () => {
    const ranked = recommendTools({ problemSlug: "reduce-customer-support-costs" });
    expect(ranked).toHaveLength(3);
    expect(ranked[0]?.tier).toBe("recommended");
    expect(ranked[0]?.reasons.length).toBeGreaterThan(0);
  });
});

describe("score provenance", () => {
  it("labels missing scores as not yet evaluated", () => {
    const tool = getCatalog().listTools()[0]!;
    const missing = formatCapabilityScore(
      { ...tool, capabilities: { ...tool.capabilities, creativity: null } },
      "creativity",
    );
    expect(missing.display).toBe("Not yet evaluated");
    expect(missing.provenance).toBeNull();
  });

  it("defaults existing seed scores to editorial provenance", () => {
    const tool = getCatalog().getToolBySlug("claude");
    expect(tool).toBeTruthy();
    const score = formatCapabilityScore(tool!, "reasoning");
    expect(score.display).toBe("9/10");
    expect(score.provenance).toBe("editorial");
  });
});

describe("brand tokens", () => {
  it("exposes a renameable product name", () => {
    expect(brand.name).toBeTruthy();
    expect(brand.cta.primary.href).toBe("/ai/recommend");
  });
});
