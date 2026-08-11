import type { CompanyProject, ProjectApplication } from "@/types/domain";

export const companyProjects: CompanyProject[] = [
  {
    id: "company-project-support-deflection-agent",
    slug: "support-deflection-agent",
    title: "Support deflection agent with human escalation",
    problem:
      "A B2B SaaS support team wants to reduce repetitive tickets while keeping escalation paths clear for account-impacting issues.",
    desiredOutcome:
      "A working pilot that answers common questions from approved docs, drafts replies, and routes uncertain cases to humans with context.",
    industry: "B2B SaaS",
    companySize: "Mid-market",
    requiredCapabilities: [
      "RAG",
      "Support workflow design",
      "Escalation policy",
      "Evaluation",
    ],
    preferredTechnology: ["Claude", "Pinecone", "Zendesk", "n8n"],
    budgetRange:
      "Prototype budget; buyer wants transparent scoping before fixed implementation.",
    timeline:
      "Discovery, pilot build, evaluation checkpoint, then rollout decision.",
    engagementType: "poc",
    status: "open",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "company-project-recruiting-screening-copilot",
    slug: "recruiting-screening-copilot",
    title: "Recruiting screening copilot",
    problem:
      "Recruiters spend too much time summarizing resumes and coordinating candidate handoffs across spreadsheets and email.",
    desiredOutcome:
      "A recruiter-controlled assistant that summarizes candidates, highlights role fit, and avoids automated hiring decisions.",
    industry: "Professional services",
    companySize: "Growth-stage",
    requiredCapabilities: [
      "Responsible AI workflow",
      "Resume summarization",
      "Airtable automation",
      "Human review",
    ],
    preferredTechnology: ["Claude", "Zapier", "Airtable", "Google Workspace"],
    budgetRange:
      "Unknown; buyer requested proposals with implementation options.",
    timeline:
      "Workflow audit, prototype, recruiter feedback pass, and governance review.",
    engagementType: "fixed",
    status: "open",
    createdAt: "2026-08-02T13:30:00.000Z",
  },
  {
    id: "company-project-sales-account-research-assistant",
    slug: "sales-account-research-assistant",
    title: "Sales account research assistant",
    problem:
      "Account executives need faster company research and first-draft outreach without losing source links or CRM context.",
    desiredOutcome:
      "An assistant that gathers public account context, drafts outreach angles, and logs a concise prep note to the CRM.",
    industry: "B2B software",
    companySize: "Scale-up",
    requiredCapabilities: [
      "Web research",
      "CRM integration",
      "Outreach drafting",
      "Source citations",
    ],
    preferredTechnology: ["Perplexity", "OpenAI API", "HubSpot", "Zapier"],
    budgetRange: "Pilot budget; implementation budget depends on CRM scope.",
    timeline:
      "Account research workflow mapping, pilot assistant, rep feedback, CRM hardening.",
    engagementType: "poc",
    status: "open",
    createdAt: "2026-08-04T10:15:00.000Z",
  },
  {
    id: "company-project-finance-invoice-exception-review",
    slug: "finance-invoice-exception-review",
    title: "Finance invoice exception review",
    problem:
      "Finance operations needs a safer way to classify invoice exceptions and prepare variance notes before approval.",
    desiredOutcome:
      "A controlled review queue that extracts invoice data, explains likely exceptions, and requires human approval before action.",
    industry: "Finance operations",
    companySize: "Enterprise department",
    requiredCapabilities: [
      "Document extraction",
      "Approval workflow",
      "Audit trail",
      "Exception handling",
    ],
    preferredTechnology: ["Claude", "n8n", "PostgreSQL", "Google Sheets"],
    budgetRange:
      "Unknown; buyer wants staged discovery before committing implementation budget.",
    timeline:
      "Controls review, extraction prototype, approval workflow test, audit-readiness check.",
    engagementType: "advisory",
    status: "open",
    createdAt: "2026-08-05T08:45:00.000Z",
  },
  {
    id: "company-project-marketing-content-engine",
    slug: "marketing-content-engine",
    title: "Marketing content engine with brand review",
    problem:
      "A lean marketing team wants more campaign variants, landing page drafts, and visual concepts without diluting brand voice.",
    desiredOutcome:
      "A repeatable content workflow with brand prompts, review checkpoints, and reusable templates for campaign launches.",
    industry: "E-commerce",
    companySize: "Small business",
    requiredCapabilities: [
      "Brand voice design",
      "Copy generation",
      "Creative asset workflow",
      "Editorial review",
    ],
    preferredTechnology: ["ChatGPT", "Claude.ai", "Midjourney", "Notion AI"],
    budgetRange:
      "Small pilot budget; buyer prefers a packaged starter engagement.",
    timeline:
      "Brand brief, template build, campaign dry run, handoff playbook.",
    engagementType: "fixed",
    status: "open",
    createdAt: "2026-08-06T15:20:00.000Z",
  },
];

export const projectApplications: ProjectApplication[] = [
  {
    id: "project-application-support-maya",
    projectId: "company-project-support-deflection-agent",
    builderId: "builder-maya-chen",
    pitch:
      "I would start with a small answer-quality evaluation set, wire retrieval to approved support docs, and make escalation reasons visible to agents.",
    proposedRate: "Unknown pending scope; proposes discovery-first pricing.",
    status: "shortlisted",
    createdAt: "2026-08-07T11:00:00.000Z",
  },
  {
    id: "project-application-support-samuel",
    projectId: "company-project-support-deflection-agent",
    builderId: "builder-samuel-okafor",
    pitch:
      "I can map the current queue logic, build a monitored n8n triage pilot, and keep human escalation as the default for uncertain cases.",
    proposedRate: "Unknown pending integration review.",
    status: "applied",
    createdAt: "2026-08-07T12:10:00.000Z",
  },
  {
    id: "project-application-recruiting-lina",
    projectId: "company-project-recruiting-screening-copilot",
    builderId: "builder-lina-haddad",
    pitch:
      "I would design this as a recruiter copilot with structured summaries, policy checkpoints, and no automated reject decisions.",
    proposedRate:
      "Packaged discovery plus implementation proposal after workflow review.",
    status: "shortlisted",
    createdAt: "2026-08-08T09:20:00.000Z",
  },
  {
    id: "project-application-sales-elena",
    projectId: "company-project-sales-account-research-assistant",
    builderId: "builder-elena-morozova",
    pitch:
      "A graph-based assistant can separate research, source capture, outreach drafting, and rep approval before anything touches the CRM.",
    proposedRate: "Unknown pending CRM and source requirements.",
    status: "applied",
    createdAt: "2026-08-08T14:45:00.000Z",
  },
  {
    id: "project-application-finance-priya",
    projectId: "company-project-finance-invoice-exception-review",
    builderId: "builder-priya-narayanan",
    pitch:
      "I would begin with controls and exception taxonomy, then build extraction and review steps around the finance team's approval policy.",
    proposedRate: "Advisory scoping first; implementation proposal to follow.",
    status: "shortlisted",
    createdAt: "2026-08-09T10:05:00.000Z",
  },
  {
    id: "project-application-marketing-ana",
    projectId: "company-project-marketing-content-engine",
    builderId: "builder-ana-ribeiro",
    pitch:
      "I can create brand-safe prompt templates, a campaign review board, and reusable workflows for copy, visuals, and handoff.",
    proposedRate:
      "Packaged starter engagement; exact pricing not included in seed data.",
    status: "applied",
    createdAt: "2026-08-09T16:30:00.000Z",
  },
  {
    id: "project-application-marketing-jordan",
    projectId: "company-project-marketing-content-engine",
    builderId: "builder-jordan-patel",
    pitch:
      "If the team wants a custom internal tool, I can build a lightweight web app around approved prompts, review states, and reusable outputs.",
    proposedRate: "Unknown pending product scope.",
    status: "applied",
    createdAt: "2026-08-10T08:25:00.000Z",
  },
];
