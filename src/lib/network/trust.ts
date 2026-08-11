import type { Builder, BuilderProject, VerificationStatus } from "@/types/domain";

export function isOutcomeVerified(project: BuilderProject): boolean {
  if (typeof project.outcomeVerified === "boolean") return project.outcomeVerified;
  return (
    project.verificationStatus === "platform_verified" ||
    project.verificationStatus === "client_verified"
  );
}

export function formatOutcome(project: BuilderProject): string {
  if (!project.outcome?.trim()) return "Outcome not yet verified.";
  if (!isOutcomeVerified(project)) {
    // Keep the editorial note visible, but clearly label verification state.
    return project.outcome;
  }
  return project.outcome;
}

export function outcomeLabel(project: BuilderProject): string {
  return isOutcomeVerified(project) ? "Verified outcome" : "Outcome not yet verified.";
}

export function verificationLabel(status: VerificationStatus): string {
  switch (status) {
    case "platform_verified":
      return "Platform verified";
    case "client_verified":
      return "Client verified";
    case "self_reported":
      return "Self-reported";
    default:
      return "Unverified";
  }
}

export function moderationLabel(builder: Builder): string {
  return builder.moderationStatus ?? (builder.meta.editorialStatus === "seed_demo" ? "approved" : "pending");
}
