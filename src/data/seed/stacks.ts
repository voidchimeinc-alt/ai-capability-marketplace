import type { AiStack } from "@/types/domain";

export const exampleStacks: AiStack[] = [
  {
    id: "ai-stack-support-rag-triage",
    slug: "support-rag-triage",
    name: "Support RAG triage stack",
    useCaseSlug: "reduce-customer-support-costs",
    components: [
      {
        role: "Reasoning model",
        toolId: "tool-claude",
        notes:
          "Drafts grounded replies and explains escalation reasons for support agents.",
      },
      {
        role: "Retrieval layer",
        toolId: "tool-pinecone",
        notes:
          "Indexes approved help docs and policy content for source-backed answers.",
      },
      {
        role: "Workflow automation",
        toolId: "tool-n8n",
        notes:
          "Routes tickets, handles Slack escalation, and logs review outcomes.",
      },
    ],
    estimatedMonthlySoftwareCost:
      "Unknown; depends on support volume, API usage, vector storage, and existing help desk integrations.",
    estimatedImplementationCost:
      "Discovery-first pilot recommended; exact implementation cost not included in seed data.",
    builderId: "builder-maya-chen",
  },
  {
    id: "ai-stack-sales-research-assistant",
    slug: "sales-research-assistant",
    name: "Sales research assistant stack",
    useCaseSlug: "build-ai-sales-assistant",
    components: [
      {
        role: "Research surface",
        toolId: "tool-perplexity",
        notes: "Finds public account context with source links for rep review.",
      },
      {
        role: "Drafting and reasoning API",
        toolId: "tool-openai-api",
        notes:
          "Generates structured prep notes and outreach drafts from approved context.",
      },
      {
        role: "SaaS workflow automation",
        toolId: "tool-zapier",
        notes:
          "Moves approved summaries into CRM and rep notification workflows.",
      },
      {
        role: "Agent orchestration",
        toolId: "tool-langgraph",
        notes:
          "Keeps research, drafting, approval, and CRM writeback as separate traceable steps.",
      },
    ],
    estimatedMonthlySoftwareCost:
      "Unknown; depends on research volume, API usage, CRM plan, and automation task volume.",
    estimatedImplementationCost:
      "Pilot implementation should be scoped after CRM fields, source policy, and approval workflow are confirmed.",
    builderId: "builder-elena-morozova",
  },
  {
    id: "ai-stack-marketing-content-studio",
    slug: "marketing-content-studio",
    name: "Marketing content studio stack",
    useCaseSlug: "generate-marketing-content",
    components: [
      {
        role: "Copy and campaign assistant",
        toolId: "tool-chatgpt",
        notes:
          "Creates draft angles, copy variants, and campaign outlines from a brand brief.",
      },
      {
        role: "Long-form editor",
        toolId: "tool-claude-ai",
        notes:
          "Refines strategy memos, launch narratives, and review-ready copy.",
      },
      {
        role: "Visual concept generator",
        toolId: "tool-midjourney",
        notes:
          "Explores campaign moodboards and visual directions for human creative review.",
      },
      {
        role: "Workspace and review hub",
        toolId: "tool-notion-ai",
        notes:
          "Stores briefs, review comments, prompt templates, and reusable content playbooks.",
      },
    ],
    estimatedMonthlySoftwareCost:
      "Unknown; depends on seat counts, creative generation volume, and workspace plan choices.",
    estimatedImplementationCost:
      "Packaged starter engagement is plausible, but exact pricing is not verified in seed data.",
    builderId: "builder-ana-ribeiro",
  },
];
