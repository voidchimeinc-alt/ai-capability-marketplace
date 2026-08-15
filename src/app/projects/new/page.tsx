import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build this",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    problem?: string;
    stack?: string;
    builder?: string;
    from?: string;
  }>;
}) {
  const params = await searchParams;
  const catalog = getCatalog();
  const useCase = params.problem ? catalog.getUseCaseBySlug(params.problem) : null;
  const builder = params.builder ? catalog.getBuilderBySlug(params.builder) : null;
  const shortlistedHint = params.from === "stack" || params.from === "profile";

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Marketplace · lightweight</p>
        <h1 className="display text-5xl">Build this.</h1>
        <p className="text-lg text-[var(--muted)]">
          Move from AI Stack → project brief. Payments, escrow, and hiring transactions are out of
          scope for this phase.
        </p>
      </div>

      {(params.stack || useCase || builder || params.q) && (
        <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 space-y-2 text-sm">
          <p className="font-medium">From your AI Stack flow</p>
          {params.stack ? <p className="text-[var(--muted)]">Stack: {params.stack}</p> : null}
          {useCase ? <p className="text-[var(--muted)]">Use case: {useCase.name}</p> : null}
          {params.q ? <p className="text-[var(--muted)]">Problem: {params.q}</p> : null}
          {builder ? (
            <p className="text-[var(--muted)]">
              Preferred builder: {builder.name}{" "}
              <Badge tone="muted" className="ml-2">
                {builder.availability}
              </Badge>
            </p>
          ) : null}
          {shortlistedHint ? (
            <p className="text-xs text-[var(--muted)]">
              You can also manage shortlisted builders in the Network shortlist.
            </p>
          ) : null}
        </div>
      )}

      <form className="mt-10 grid max-w-2xl gap-4 rounded-[2rem] border border-[var(--border)] bg-white/70 p-6 sm:p-8">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Project title</span>
          <input
            name="title"
            defaultValue={params.stack ? `Build: ${params.stack}` : ""}
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Problem</span>
          <textarea
            name="problem"
            rows={3}
            defaultValue={params.q ?? useCase?.problemStatement ?? ""}
            className="rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Desired outcome</span>
          <textarea
            name="desiredOutcome"
            rows={2}
            defaultValue={useCase?.desiredOutcomes.join("; ") ?? ""}
            className="rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">AI Stack</span>
          <input
            name="aiStack"
            defaultValue={params.stack ?? ""}
            placeholder="Paste or name your recommended stack"
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Required capabilities</span>
          <input
            name="capabilities"
            defaultValue={builder?.capabilities.slice(0, 4).join(", ") ?? ""}
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Budget range</span>
            <input
              name="budgetRange"
              placeholder="Unknown / exploratory"
              className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Timeline</span>
            <input
              name="timeline"
              placeholder="This quarter"
              className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Engagement type</span>
          <select
            name="engagementType"
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          >
            <option value="poc">Proof of concept</option>
            <option value="fixed">Fixed project</option>
            <option value="hourly">Hourly</option>
            <option value="retainer">Retainer</option>
            <option value="advisory">Advisory</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Status</span>
          <select
            name="status"
            defaultValue="open"
            className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4"
          >
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
          </select>
        </label>
        <p className="text-sm text-[var(--muted)]">
          Submissions persist after auth + Supabase migrations. For Gate 3, this captures the brief and
          preferred builder handoff.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/projects">View open projects</ButtonLink>
          <ButtonLink href="/network/shortlist" variant="subtle">
            Return to shortlist
          </ButtonLink>
        </div>
      </form>
    </Container>
  );
}
