import type { StackRoleSpec } from "@/types/domain";

const knowledge: StackRoleSpec = {
  id: "knowledge",
  label: "Knowledge / documentation",
  purpose: "Approved source content the system is allowed to use.",
  preferredKinds: ["application", "infrastructure"],
  tagHints: ["knowledge", "docs", "notion", "wiki", "documentation", "workspace", "policy"],
  required: true,
};

const retrieval: StackRoleSpec = {
  id: "retrieval",
  label: "Retrieval / knowledge layer",
  purpose: "Find the right passages before the model answers.",
  preferredKinds: ["infrastructure", "api"],
  tagHints: ["retrieval", "vector", "rag", "pinecone", "search", "embedding"],
  required: true,
};

const model: StackRoleSpec = {
  id: "model",
  label: "AI model",
  purpose: "Reason, draft, classify, or decide within guardrails.",
  preferredKinds: ["model", "api"],
  tagHints: ["llm", "reasoning", "model", "api"],
  required: true,
};

const application: StackRoleSpec = {
  id: "application",
  label: "AI application surface",
  purpose: "Where people interact with the system day to day.",
  preferredKinds: ["application"],
  tagHints: ["assistant", "chat", "application"],
  required: false,
};

const automation: StackRoleSpec = {
  id: "automation",
  label: "Automation / workflow",
  purpose: "Connect steps, triggers, and system handoffs.",
  preferredKinds: ["automation"],
  tagHints: ["automation", "workflow", "n8n", "zapier"],
  required: true,
};

const integration: StackRoleSpec = {
  id: "integration",
  label: "System integration",
  purpose: "Plug into the systems of record your team already uses.",
  preferredKinds: ["automation", "api", "application"],
  tagHints: ["integration", "crm", "support", "api"],
  required: false,
};

const agent: StackRoleSpec = {
  id: "agent_orchestration",
  label: "Agent orchestration",
  purpose: "Coordinate multi-step tool use with state and guardrails.",
  preferredKinds: ["framework", "agent"],
  tagHints: ["agent", "langgraph", "orchestration", "mcp"],
  required: false,
};

const human: StackRoleSpec = {
  id: "human_escalation",
  label: "Human escalation",
  purpose: "Keep people in the loop for complex, risky, or ambiguous cases.",
  preferredKinds: [],
  tagHints: ["human", "escalation", "review"],
  required: true,
};

const implementation: StackRoleSpec = {
  id: "implementation",
  label: "Implementation",
  purpose: "Someone who can wire the stack into your environment.",
  preferredKinds: [],
  tagHints: [],
  required: true,
};

/** Role blueprints per use case — only include components relevant to the problem. */
export const STACK_BLUEPRINTS: Record<string, StackRoleSpec[]> = {
  "reduce-customer-support-costs": [
    knowledge,
    retrieval,
    model,
    automation,
    { ...integration, label: "Support-system integration", required: true, tagHints: ["support", "ticket", "zendesk", "intercom"] },
    human,
    implementation,
  ],
  "automate-recruitment": [
    knowledge,
    model,
    automation,
    { ...integration, label: "ATS / recruiting integration", required: true, tagHints: ["recruit", "ats", "hiring"] },
    human,
    implementation,
  ],
  "build-ai-sales-assistant": [
    { ...application, label: "Research surface", required: true, tagHints: ["research", "perplexity", "sales"] },
    model,
    automation,
    { ...integration, label: "CRM integration", required: true, tagHints: ["crm", "salesforce", "hubspot"] },
    agent,
    human,
    implementation,
  ],
  "analyse-documents": [
    knowledge,
    { ...model, tagHints: ["long-context", "document", "reasoning"] },
    { ...application, required: false },
    human,
    implementation,
  ],
  "automate-finance": [
    knowledge,
    model,
    automation,
    { ...integration, label: "Finance-system integration", required: true, tagHints: ["finance", "invoice", "erp"] },
    human,
    implementation,
  ],
  "internal-knowledge-search": [
    knowledge,
    retrieval,
    model,
    { ...application, required: true, tagHints: ["search", "assistant"] },
    human,
    implementation,
  ],
  "automate-workflows": [
    automation,
    model,
    agent,
    integration,
    human,
    implementation,
  ],
  "generate-marketing-content": [
    { ...application, label: "Drafting surface", required: true, tagHints: ["content", "marketing", "chatgpt"] },
    { ...model, label: "Long-form editor model", tagHints: ["writing", "claude"] },
    { ...application, id: "application", label: "Visual / creative tool", preferredKinds: ["application"], tagHints: ["image", "midjourney", "creative"], required: false },
    knowledge,
    human,
    implementation,
  ],
  "build-ai-agent": [
    model,
    agent,
    automation,
    retrieval,
    human,
    implementation,
  ],
};

export const DEFAULT_BLUEPRINT: StackRoleSpec[] = [
  model,
  automation,
  human,
  implementation,
];

export function getBlueprint(useCaseSlug: string | null | undefined): StackRoleSpec[] {
  if (!useCaseSlug) return DEFAULT_BLUEPRINT;
  return STACK_BLUEPRINTS[useCaseSlug] ?? DEFAULT_BLUEPRINT;
}
