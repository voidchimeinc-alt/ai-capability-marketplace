export type EntityKind =
  | "model"
  | "application"
  | "agent"
  | "developer_tool"
  | "automation"
  | "infrastructure"
  | "api"
  | "framework";

export type EditorialStatus = "draft" | "reviewed" | "published" | "seed_demo";

export type VerificationStatus =
  | "self_reported"
  | "client_verified"
  | "platform_verified"
  | "unverified";

export type PricingModel = "free" | "freemium" | "paid" | "usage" | "enterprise" | "unknown";

export type DeploymentModel = "cloud" | "api" | "local" | "hybrid" | "unknown";

export type CapabilityDimension =
  | "reasoning"
  | "coding"
  | "research"
  | "creativity"
  | "instruction_following"
  | "long_context"
  | "speed"
  | "cost_efficiency"
  | "reliability"
  | "agentic"
  | "enterprise_readiness"
  | "automation";

export type CapabilityScores = Partial<Record<CapabilityDimension, number | null>>;

/** How a quantitative score was produced. Never invent provenance. */
export type ScoreProvenance = "tested" | "sourced" | "editorial" | "community";

export type CapabilityProvenance = Partial<Record<CapabilityDimension, ScoreProvenance>>;

export type CostPosture = "low" | "medium" | "high" | "unknown";

export type ImplementationComplexity = "simple" | "moderate" | "advanced";

export type StackRoleId =
  | "knowledge"
  | "retrieval"
  | "model"
  | "application"
  | "automation"
  | "integration"
  | "agent_orchestration"
  | "voice"
  | "human_escalation"
  | "implementation";

export interface SourceMeta {
  source: string;
  sourceUrl?: string | null;
  lastVerifiedAt?: string | null;
  pricingVerifiedAt?: string | null;
  confidence: "low" | "medium" | "high";
  editorialStatus: EditorialStatus;
}

export interface Personality {
  label: string;
  summary: string;
  toneNotes?: string;
}

export interface ToolEntity {
  id: string;
  slug: string;
  name: string;
  kind: EntityKind;
  category: string;
  shortDescription: string;
  bestFor: string[];
  strengths: string[];
  weaknesses: string[];
  bestUseCases: string[];
  avoidWhen: string[];
  capabilities: CapabilityScores;
  /** Optional per-dimension provenance. Missing entries default to editorial for seed scores. */
  capabilityProvenance?: CapabilityProvenance;
  personality?: Personality;
  pricingModel: PricingModel;
  pricingNotes: string; // may be "Unknown"
  costPosture?: CostPosture;
  enterprisePosture?: "low" | "medium" | "high" | "unknown";
  hasApi: boolean | null;
  deployment: DeploymentModel;
  integrations: string[];
  websiteUrl?: string | null;
  useCaseSlugs: string[];
  tags: string[];
  editorialTake?: string;
  meta: SourceMeta;
}

export interface UseCase {
  id: string;
  slug: string;
  name: string;
  problemStatement: string;
  industryHints: string[];
  desiredOutcomes: string[];
  recommendedCapabilityWeights: Partial<Record<CapabilityDimension, number>>;
  exampleQueries: string[];
}

export interface BenchmarkChallenge {
  id: string;
  slug: string;
  name: string;
  category: string;
  taskDescription: string;
  inputSummary: string;
  expectedOutputSummary: string;
  evaluationCriteria: string[];
  methodology: string;
  evaluator: string;
  source: string;
  executionDate: string | null;
}

export interface BenchmarkResult {
  id: string;
  benchmarkId: string;
  toolId: string;
  score: number | null;
  notes: string;
  executionDate: string | null;
  isEstimated: boolean;
}

export type BuilderRole =
  | "AI Builder"
  | "AI Engineer"
  | "AI Systems Engineer"
  | "AI Implementation Specialist"
  | "AI Architect"
  | "Automation Engineer"
  | "Agent Builder";

export interface BuilderProject {
  id: string;
  slug: string;
  title: string;
  problem: string;
  solution: string;
  technologies: string[];
  role: string;
  complexity: "low" | "medium" | "high";
  outcome: string;
  /** Explicit outcome verification. If omitted, derived from verificationStatus. */
  outcomeVerified?: boolean | null;
  verificationStatus: VerificationStatus;
  demoUrl?: string | null;
}

export type ModerationStatus = "approved" | "pending" | "flagged";

export interface Builder {
  id: string;
  slug: string;
  name: string;
  title: BuilderRole;
  location: string;
  timezone: string;
  availability: "available" | "limited" | "booked";
  specializations: string[];
  capabilities: string[];
  stack: string[];
  /** Curated use-case slugs this builder has demonstrated. */
  useCaseSlugs?: string[];
  experienceYears: number | null;
  hourlyRateUsd: number | null;
  pricingNotes: string;
  preferredProjectTypes: string[];
  bio: string;
  projects: BuilderProject[];
  trust: {
    projectsCompleted: number;
    clientRating: number | null;
    verifiedProjects: number;
    responseTimeHours: number | null;
    completionRate: number | null;
  };
  moderationStatus?: ModerationStatus;
  meta: SourceMeta;
}

export interface BuilderMatchBreakdown {
  capability: number;
  proofOfWork: number;
  technology: number;
  availability: number;
  location: number;
}

export interface BuilderMatchResult {
  builder: Builder;
  score: number;
  scorePercent: number;
  breakdown: BuilderMatchBreakdown;
  breakdownPercent: BuilderMatchBreakdown;
  matchedCapabilities: string[];
  matchedTechnologies: string[];
  relevantProjects: BuilderProject[];
  canBuildComponents: string[];
  why: string[];
  summary: string;
}

export interface CompanyProject {
  id: string;
  slug: string;
  title: string;
  problem: string;
  desiredOutcome: string;
  industry: string;
  companySize: string;
  requiredCapabilities: string[];
  preferredTechnology: string[];
  budgetRange: string;
  timeline: string;
  engagementType: "fixed" | "hourly" | "retainer" | "advisory" | "poc";
  status: "open" | "reviewing" | "shortlisted" | "hired" | "closed";
  createdAt: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  builderId: string;
  pitch: string;
  proposedRate: string;
  status: "applied" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
}

export interface AiStack {
  id: string;
  slug: string;
  name: string;
  useCaseSlug?: string;
  components: { role: string; toolId: string; notes?: string }[];
  estimatedMonthlySoftwareCost: string;
  estimatedImplementationCost: string;
  builderId?: string | null;
}

export interface RecommendationContext {
  problemSlug?: string;
  customProblem?: string;
  q?: string;
  companySize?: string;
  industry?: string;
  currentTools?: string[];
  budget?: string;
  desiredOutcome?: string;
  urgency?: string;
}

export interface StackRoleSpec {
  id: StackRoleId;
  label: string;
  purpose: string;
  /** Entity kinds preferred for this role */
  preferredKinds: EntityKind[];
  /** Soft keyword hints for ranking */
  tagHints: string[];
  required: boolean;
}

export interface StackComponentRecommendation {
  role: StackRoleSpec;
  tool: ToolEntity | null;
  /** Human / process layer with no catalog tool */
  processLabel?: string;
  why: string[];
  roleInStack: string;
  alternatives: { tool: ToolEntity; why: string }[];
  complexity: ImplementationComplexity;
  costPosture: CostPosture;
  watchOuts: string[];
  matchScore: number;
}

export interface AlternativeStackSummary {
  name: string;
  summary: string;
  whenBetter: string;
  components: { roleLabel: string; toolName: string }[];
}

export interface StackRecommendationResult {
  interpretedProblem: string;
  useCaseSlug: string | null;
  useCaseName: string | null;
  confidence: "low" | "medium" | "high";
  interpretationNotes: string[];
  stackName: string;
  components: StackComponentRecommendation[];
  whyThisStack: string[];
  alternatives: AlternativeStackSummary[];
  complexity: ImplementationComplexity;
  costPosture: CostPosture;
  risks: string[];
  builderHints: string[];
}

export const CAPABILITY_LABELS: Record<CapabilityDimension, string> = {
  reasoning: "Reasoning",
  coding: "Coding",
  research: "Research",
  creativity: "Creativity",
  instruction_following: "Instruction following",
  long_context: "Long context",
  speed: "Speed",
  cost_efficiency: "Cost efficiency",
  reliability: "Reliability",
  agentic: "Agentic capability",
  enterprise_readiness: "Enterprise readiness",
  automation: "Automation",
};

export const SCORE_PROVENANCE_LABELS: Record<ScoreProvenance, string> = {
  tested: "Tested",
  sourced: "Sourced",
  editorial: "Editorial",
  community: "Community",
};

export const COST_POSTURE_LABELS: Record<CostPosture, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  unknown: "Unknown",
};

export const COMPLEXITY_LABELS: Record<ImplementationComplexity, string> = {
  simple: "Simple",
  moderate: "Moderate",
  advanced: "Advanced",
};
