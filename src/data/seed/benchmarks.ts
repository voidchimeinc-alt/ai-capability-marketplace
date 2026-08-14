import type { BenchmarkChallenge, BenchmarkResult } from "@/types/domain";

const estimatedNote =
  "Editorial demo estimate for seed data, not a scientific benchmark result or verified performance claim.";

export const benchmarks: BenchmarkChallenge[] = [
  {
    id: "benchmark-business-reasoning",
    slug: "business-reasoning",
    name: "Business reasoning memo",
    category: "business reasoning",
    taskDescription:
      "Analyze a messy business scenario, identify trade-offs, propose a recommendation, and explain assumptions.",
    inputSummary:
      "A mid-market SaaS company is considering AI support automation with budget, customer experience, and compliance constraints.",
    expectedOutputSummary:
      "A concise decision memo with options, risks, implementation sequence, and questions for stakeholders.",
    evaluationCriteria: [
      "Identifies meaningful business trade-offs",
      "Separates assumptions from known facts",
      "Gives actionable next steps",
      "Handles risk and governance clearly",
    ],
    methodology:
      "Seed challenge only. Scores are editorial estimates based on public product positioning and general capability fit; no live runs were performed.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
  {
    id: "benchmark-coding",
    slug: "coding",
    name: "Codebase change task",
    category: "coding",
    taskDescription:
      "Make a scoped TypeScript feature change in an unfamiliar repository while preserving existing patterns.",
    inputSummary:
      "A small Next.js codebase with domain types, path aliases, and a request to add typed seed modules.",
    expectedOutputSummary:
      "Valid TypeScript edits, minimal scope creep, and a clear explanation of verification steps.",
    evaluationCriteria: [
      "Reads existing types before editing",
      "Produces type-safe code",
      "Keeps changes scoped",
      "Explains residual risk",
    ],
    methodology:
      "Seed challenge only. Scores are editorial estimates for marketplace demonstration; no controlled coding benchmark was executed.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
  {
    id: "benchmark-research",
    slug: "research",
    name: "Source-backed research brief",
    category: "research",
    taskDescription:
      "Produce a short research brief with citations, confidence notes, and open questions.",
    inputSummary:
      "A buyer asks which AI tools are plausible for internal knowledge search and wants public-source grounding.",
    expectedOutputSummary:
      "A sourced brief that distinguishes evidence, editorial judgment, and unknowns.",
    evaluationCriteria: [
      "Uses and cites relevant sources",
      "Flags uncertainty",
      "Avoids unsupported factual claims",
      "Summarizes clearly for a business buyer",
    ],
    methodology:
      "Seed challenge only. Results are estimated from tool positioning and common workflows, not from a live research evaluation.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
  {
    id: "benchmark-long-context",
    slug: "long-context",
    name: "Long-context document synthesis",
    category: "long context",
    taskDescription:
      "Read a large bundle of policy, meeting, and customer documents, then answer questions with citations.",
    inputSummary:
      "A synthetic document pack containing overlapping policies, customer notes, and ambiguous requirements.",
    expectedOutputSummary:
      "Grounded answers that cite relevant sections, explain conflicts, and identify missing information.",
    evaluationCriteria: [
      "Maintains context across many documents",
      "Finds conflicting evidence",
      "Cites supporting material",
      "Avoids overconfident synthesis",
    ],
    methodology:
      "Seed challenge only. Scores are editorial estimates for demonstration and should not be read as measured context-window performance.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
  {
    id: "benchmark-creative",
    slug: "creative",
    name: "Creative campaign generation",
    category: "creative",
    taskDescription:
      "Generate campaign concepts, copy variants, and creative direction from a constrained brand brief.",
    inputSummary:
      "A B2B product launch brief with audience, tone, forbidden claims, and channel requirements.",
    expectedOutputSummary:
      "Distinct campaign angles with draft copy, rationale, and review notes for human editors.",
    evaluationCriteria: [
      "Produces distinct concepts",
      "Follows brand and compliance constraints",
      "Balances novelty with usefulness",
      "Leaves room for human creative judgment",
    ],
    methodology:
      "Seed challenge only. Scores are editorial estimates for marketplace examples; no creative panel or live generation test was run.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
  {
    id: "benchmark-agentic",
    slug: "agentic",
    name: "Agentic workflow execution",
    category: "agentic",
    taskDescription:
      "Plan and execute a multi-step workflow using tools, state, review checkpoints, and recovery paths.",
    inputSummary:
      "A workflow request to research accounts, enrich records, draft outreach, and escalate uncertain cases.",
    expectedOutputSummary:
      "A traceable agent plan with tool calls, state transitions, human approval points, and failure handling.",
    evaluationCriteria: [
      "Breaks work into sensible steps",
      "Uses tools only when helpful",
      "Includes human review for risky actions",
      "Handles errors and ambiguous inputs",
    ],
    methodology:
      "Seed challenge only. Scores are editorial estimates of agent-workflow suitability and are not live execution results.",
    evaluator: "Platform editorial seed",
    source: "Editorial seed (demo)",
    executionDate: null,
  },
];

export const benchmarkResults: BenchmarkResult[] = [
  {
    id: "benchmark-result-claude-business-reasoning",
    benchmarkId: "benchmark-business-reasoning",
    toolId: "tool-claude",
    score: 90,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-gpt-business-reasoning",
    benchmarkId: "benchmark-business-reasoning",
    toolId: "tool-gpt",
    score: 89,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-gemini-business-reasoning",
    benchmarkId: "benchmark-business-reasoning",
    toolId: "tool-gemini",
    score: 84,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-chatgpt-business-reasoning",
    benchmarkId: "benchmark-business-reasoning",
    toolId: "tool-chatgpt",
    score: 88,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-cursor-coding",
    benchmarkId: "benchmark-coding",
    toolId: "tool-cursor",
    score: 91,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-github-copilot-coding",
    benchmarkId: "benchmark-coding",
    toolId: "tool-github-copilot",
    score: 86,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-gpt-coding",
    benchmarkId: "benchmark-coding",
    toolId: "tool-gpt",
    score: 88,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-v0-coding",
    benchmarkId: "benchmark-coding",
    toolId: "tool-v0",
    score: 80,
    notes: `${estimatedNote} Score is scoped to frontend UI generation, not broad software engineering.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-perplexity-research",
    benchmarkId: "benchmark-research",
    toolId: "tool-perplexity",
    score: 90,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-elicit-research",
    benchmarkId: "benchmark-research",
    toolId: "tool-elicit",
    score: 88,
    notes: `${estimatedNote} Estimate applies to literature-oriented research rather than general web research.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-gemini-research",
    benchmarkId: "benchmark-research",
    toolId: "tool-gemini",
    score: 82,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-claude-long-context",
    benchmarkId: "benchmark-long-context",
    toolId: "tool-claude",
    score: 92,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-gemini-long-context",
    benchmarkId: "benchmark-long-context",
    toolId: "tool-gemini",
    score: 93,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-pinecone-long-context",
    benchmarkId: "benchmark-long-context",
    toolId: "tool-pinecone",
    score: null,
    notes: `${estimatedNote} Pinecone is retrieval infrastructure, so a direct model-style score is not assigned.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-midjourney-creative",
    benchmarkId: "benchmark-creative",
    toolId: "tool-midjourney",
    score: 92,
    notes: `${estimatedNote} Estimate reflects visual ideation strength, not copywriting or compliance review.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-runway-creative",
    benchmarkId: "benchmark-creative",
    toolId: "tool-runway",
    score: 86,
    notes: `${estimatedNote} Estimate reflects video concept generation and production assistance.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-chatgpt-creative",
    benchmarkId: "benchmark-creative",
    toolId: "tool-chatgpt",
    score: 82,
    notes: estimatedNote,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-langgraph-agentic",
    benchmarkId: "benchmark-agentic",
    toolId: "tool-langgraph",
    score: 91,
    notes: `${estimatedNote} Estimate reflects framework suitability, not a turnkey product score.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-crewai-agentic",
    benchmarkId: "benchmark-agentic",
    toolId: "tool-crewai",
    score: 82,
    notes: `${estimatedNote} Estimate reflects multi-agent prototyping fit with production readiness depending on implementation.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-n8n-agentic",
    benchmarkId: "benchmark-agentic",
    toolId: "tool-n8n",
    score: 78,
    notes: `${estimatedNote} Estimate reflects workflow orchestration with AI steps, not autonomous model reasoning.`,
    executionDate: null,
    isEstimated: true,
  },
  {
    id: "benchmark-result-vapi-agentic",
    benchmarkId: "benchmark-agentic",
    toolId: "tool-vapi",
    score: 80,
    notes: `${estimatedNote} Estimate reflects voice-agent workflow fit rather than general-purpose agents.`,
    executionDate: null,
    isEstimated: true,
  },
];
