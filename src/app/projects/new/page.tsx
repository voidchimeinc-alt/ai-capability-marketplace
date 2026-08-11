import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a project",
};

export default function NewProjectPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Marketplace</p>
        <h1 className="display text-5xl">I need this built.</h1>
        <p className="text-lg text-[var(--muted)]">
          Project posting writes to the database when Supabase schema is applied. For Gate 1, this form is the UX shell —
          seed projects demonstrate the marketplace flow.
        </p>
      </div>

      <form className="mt-10 grid max-w-2xl gap-4 rounded-[2rem] border border-[var(--border)] bg-white/70 p-6 sm:p-8">
        {[
          ["title", "Project title", "text"],
          ["problem", "Problem", "textarea"],
          ["desiredOutcome", "Desired outcome", "textarea"],
          ["industry", "Industry", "text"],
          ["companySize", "Company size", "text"],
          ["budgetRange", "Budget range", "text"],
          ["timeline", "Timeline", "text"],
        ].map(([name, label, type]) => (
          <label key={name} className="grid gap-2 text-sm">
            <span className="font-medium">{label}</span>
            {type === "textarea" ? (
              <textarea
                name={name}
                rows={3}
                className="rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3"
              />
            ) : (
              <input name={name} className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4" />
            )}
          </label>
        ))}
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Engagement type</span>
          <select name="engagementType" className="h-12 rounded-2xl border border-[var(--border-strong)] bg-white px-4">
            <option value="fixed">Fixed project</option>
            <option value="hourly">Hourly</option>
            <option value="retainer">Retainer</option>
            <option value="advisory">Advisory</option>
            <option value="poc">Proof of concept</option>
          </select>
        </label>
        <p className="text-sm text-[var(--muted)]">
          Submissions will persist after auth + Supabase migrations are enabled. Browse seed projects meanwhile.
        </p>
        <ButtonLink href="/projects">View open projects</ButtonLink>
      </form>
    </Container>
  );
}
