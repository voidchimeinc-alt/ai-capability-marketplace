import type { UseCase } from "@/types/domain";

export const useCases: UseCase[] = [
  {
    id: "uc-customer-support",
    slug: "reduce-customer-support-costs",
    name: "Reduce customer support costs",
    problemStatement:
      "Deflect repetitive tickets, draft higher-quality replies, and route complex issues to humans faster.",
    industryHints: ["SaaS", "E-commerce", "Fintech"],
    desiredOutcomes: ["Lower cost per ticket", "Faster first response", "Higher CSAT"],
    recommendedCapabilityWeights: {
      instruction_following: 0.2,
      reliability: 0.2,
      enterprise_readiness: 0.15,
      long_context: 0.15,
      agentic: 0.15,
      cost_efficiency: 0.15,
    },
    exampleQueries: ["best AI for customer support", "support automation stack"],
  },
  {
    id: "uc-recruitment",
    slug: "automate-recruitment",
    name: "Automate recruitment",
    problemStatement:
      "Screen candidates, summarize résumés, and assist recruiters without turning hiring into a black box.",
    industryHints: ["HR Tech", "Professional services"],
    desiredOutcomes: ["Faster screening", "Consistent shortlists", "Less busywork"],
    recommendedCapabilityWeights: {
      reasoning: 0.2,
      instruction_following: 0.2,
      automation: 0.2,
      reliability: 0.2,
      enterprise_readiness: 0.2,
    },
    exampleQueries: ["AI tool for automating recruitment", "résumé screening AI"],
  },
  {
    id: "uc-sales-assistant",
    slug: "build-ai-sales-assistant",
    name: "Build an AI sales assistant",
    problemStatement:
      "Help reps research accounts, draft outreach, and prepare for calls with grounded company context.",
    industryHints: ["B2B SaaS", "Agency"],
    desiredOutcomes: ["More qualified outreach", "Better meeting prep", "Shorter sales cycles"],
    recommendedCapabilityWeights: {
      research: 0.25,
      creativity: 0.15,
      agentic: 0.2,
      reasoning: 0.2,
      reliability: 0.2,
    },
    exampleQueries: ["AI sales automation", "sales assistant agent"],
  },
  {
    id: "uc-documents",
    slug: "analyse-documents",
    name: "Analyse documents",
    problemStatement:
      "Extract structure, risks, and answers from contracts, policies, and large document sets.",
    industryHints: ["Legal", "Finance", "Healthcare ops"],
    desiredOutcomes: ["Faster review", "Consistent extraction", "Auditability"],
    recommendedCapabilityWeights: {
      long_context: 0.3,
      reasoning: 0.25,
      reliability: 0.2,
      enterprise_readiness: 0.15,
      research: 0.1,
    },
    exampleQueries: ["document analysis AI", "contract review LLM"],
  },
  {
    id: "uc-finance",
    slug: "automate-finance",
    name: "Automate finance",
    problemStatement:
      "Reconcile, classify, and summarize financial operations with strong controls.",
    industryHints: ["Finance", "Accounting"],
    desiredOutcomes: ["Less manual entry", "Faster close", "Clearer exception handling"],
    recommendedCapabilityWeights: {
      reliability: 0.25,
      enterprise_readiness: 0.25,
      automation: 0.2,
      reasoning: 0.15,
      cost_efficiency: 0.15,
    },
    exampleQueries: ["AI for finance automation", "invoice processing AI"],
  },
  {
    id: "uc-knowledge-search",
    slug: "internal-knowledge-search",
    name: "Build internal knowledge search",
    problemStatement:
      "Make company knowledge findable with grounded answers and citations.",
    industryHints: ["Enterprise", "SaaS"],
    desiredOutcomes: ["Answers with sources", "Less tribal knowledge", "Faster onboarding"],
    recommendedCapabilityWeights: {
      research: 0.2,
      long_context: 0.2,
      reliability: 0.2,
      enterprise_readiness: 0.2,
      agentic: 0.2,
    },
    exampleQueries: ["internal knowledge search", "RAG engineer"],
  },
  {
    id: "uc-workflows",
    slug: "automate-workflows",
    name: "Automate workflows",
    problemStatement:
      "Connect systems and replace brittle manual handoffs with reliable automation.",
    industryHints: ["Ops", "Startups"],
    desiredOutcomes: ["Fewer manual steps", "Integrations that stick", "Observable runs"],
    recommendedCapabilityWeights: {
      automation: 0.35,
      agentic: 0.2,
      reliability: 0.2,
      cost_efficiency: 0.15,
      enterprise_readiness: 0.1,
    },
    exampleQueries: ["workflow automation AI", "n8n vs zapier AI"],
  },
  {
    id: "uc-marketing",
    slug: "generate-marketing-content",
    name: "Generate marketing content",
    problemStatement:
      "Produce on-brand drafts faster while keeping humans in the creative loop.",
    industryHints: ["Marketing", "E-commerce", "Media"],
    desiredOutcomes: ["Faster drafts", "More variants", "Consistent brand voice"],
    recommendedCapabilityWeights: {
      creativity: 0.35,
      instruction_following: 0.2,
      speed: 0.15,
      cost_efficiency: 0.15,
      reliability: 0.15,
    },
    exampleQueries: ["marketing content AI", "campaign concept generator"],
  },
  {
    id: "uc-agent",
    slug: "build-ai-agent",
    name: "Build an AI agent",
    problemStatement:
      "Design a multi-step agent that uses tools, memory, and guardrails for a real workflow.",
    industryHints: ["Product", "Platform"],
    desiredOutcomes: ["Working prototype", "Clear tool use", "Measurable task completion"],
    recommendedCapabilityWeights: {
      agentic: 0.35,
      coding: 0.2,
      reasoning: 0.2,
      reliability: 0.15,
      long_context: 0.1,
    },
    exampleQueries: ["AI agent builder", "MCP developer"],
  },
];
