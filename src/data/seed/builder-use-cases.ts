/** Curated use-case links for seed builders — editorial, not fabricated claims. */
export const BUILDER_USE_CASE_SLUGS: Record<string, string[]> = {
  "builder-maya-chen": ["analyse-documents", "internal-knowledge-search", "build-ai-agent"],
  "builder-samuel-okafor": [
    "reduce-customer-support-costs",
    "automate-workflows",
    "build-ai-sales-assistant",
  ],
  "builder-elena-morozova": ["build-ai-agent", "build-ai-sales-assistant", "automate-workflows"],
  "builder-ana-ribeiro": ["generate-marketing-content", "automate-workflows"],
  "builder-jordan-patel": ["build-ai-agent", "automate-workflows"],
  "builder-priya-narayanan": ["automate-finance", "analyse-documents"],
  "builder-noah-kim": ["reduce-customer-support-costs", "build-ai-agent"],
  "builder-lina-haddad": ["automate-recruitment", "analyse-documents"],
  "builder-owen-macarthur": ["build-ai-agent", "internal-knowledge-search", "automate-workflows"],
};

export function getUseCasesForBuilder(builderId: string): string[] {
  return BUILDER_USE_CASE_SLUGS[builderId] ?? [];
}
