import { describe, expect, it } from "vitest";
import { getCatalog } from "@/lib/db/catalog";
import { recommendTools, matchBuilders } from "@/lib/matching/recommend";
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

describe("recommendation engine", () => {
  it("returns three ranked options with explanations", () => {
    const ranked = recommendTools({ problemSlug: "reduce-customer-support-costs" });
    expect(ranked).toHaveLength(3);
    expect(ranked[0]?.tier).toBe("recommended");
    expect(ranked[0]?.reasons.length).toBeGreaterThan(0);
  });

  it("matches builders with why text", () => {
    const matches = matchBuilders({ problemSlug: "build-ai-agent" });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]?.why.length).toBeGreaterThan(0);
  });
});

describe("brand tokens", () => {
  it("exposes a renameable product name", () => {
    expect(brand.name).toBeTruthy();
    expect(brand.cta.primary.href).toBe("/ai/recommend");
  });
});
