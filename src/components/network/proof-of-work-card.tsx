import { Badge } from "@/components/ui/badge";
import { formatOutcome, outcomeLabel, verificationLabel } from "@/lib/network/trust";
import type { BuilderProject } from "@/types/domain";

export function ProofOfWorkCard({ project }: { project: BuilderProject }) {
  const verified = outcomeLabel(project);

  return (
    <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-medium">{project.title}</h3>
        <Badge
          tone={
            project.verificationStatus === "platform_verified" ||
            project.verificationStatus === "client_verified"
              ? "accent"
              : "muted"
          }
        >
          {verificationLabel(project.verificationStatus)}
        </Badge>
        <Badge tone="warning">{verified}</Badge>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium">Problem</dt>
          <dd className="mt-1 text-[var(--muted)]">{project.problem}</dd>
        </div>
        <div>
          <dt className="font-medium">Solution</dt>
          <dd className="mt-1 text-[var(--muted)]">{project.solution}</dd>
        </div>
        <div>
          <dt className="font-medium">Stack</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <Badge key={t} tone="muted">
                {t}
              </Badge>
            ))}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Role</dt>
          <dd className="mt-1 text-[var(--muted)]">{project.role}</dd>
        </div>
        <div>
          <dt className="font-medium">Outcome</dt>
          <dd className="mt-1 text-[var(--muted)]">{formatOutcome(project)}</dd>
        </div>
      </dl>
    </article>
  );
}
