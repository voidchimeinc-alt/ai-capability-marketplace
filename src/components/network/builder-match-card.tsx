import { Badge } from "@/components/ui/badge";
import { ShortlistButton } from "@/components/network/shortlist-button";
import { ButtonLink } from "@/components/ui/button-link";
import type { BuilderMatchResult } from "@/types/domain";
import Link from "next/link";

export function BuilderMatchCard({
  match,
  buildHref,
}: {
  match: BuilderMatchResult;
  buildHref?: string;
}) {
  const { builder, scorePercent, breakdownPercent, why, summary, canBuildComponents, matchedTechnologies, relevantProjects } =
    match;

  return (
    <article className="rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Match {scorePercent}%</Badge>
            <Badge tone={builder.availability === "available" ? "accent" : "muted"}>
              {builder.availability}
            </Badge>
            {builder.meta.editorialStatus === "seed_demo" ? (
              <Badge tone="warning">Seed / demo</Badge>
            ) : null}
          </div>
          <h3 className="mt-3 display text-3xl">
            <Link href={`/builders/${builder.slug}`} className="focus-ring rounded">
              {builder.name}
            </Link>
          </h3>
          <p className="mt-1 text-[var(--muted)]">
            {builder.title} · {builder.location} · {builder.timezone}
          </p>
          <p className="mt-3 text-[var(--muted)]">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShortlistButton slug={builder.slug} size="md" />
          <ButtonLink href={`/builders/${builder.slug}`} variant="subtle" size="md">
            Open profile
          </ButtonLink>
        </div>
      </div>

      <div className="mt-6 rounded-[1.25rem] bg-[var(--foreground)] p-5 text-white">
        <p className="eyebrow text-white/60">Why this builder matches</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Capability match" value={`${breakdownPercent.capability}%`} />
          <Metric label="Relevant proof" value={`${breakdownPercent.proofOfWork}%`} />
          <Metric label="Technology match" value={`${breakdownPercent.technology}%`} />
          <Metric label="Availability" value={`${breakdownPercent.availability}%`} />
          <Metric label="Location / TZ" value={`${breakdownPercent.location}%`} />
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-white/80">
          {why.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        {relevantProjects.length ? (
          <p className="mt-3 text-sm text-white/70">
            Relevant experience: {relevantProjects.length} adjacent project
            {relevantProjects.length === 1 ? "" : "s"}
            {relevantProjects[0] ? ` · e.g. “${relevantProjects[0].title}”` : ""}
          </p>
        ) : null}
        {matchedTechnologies.length ? (
          <p className="mt-2 text-sm text-white/70">
            Technology match: {matchedTechnologies.slice(0, 6).join(", ")}
          </p>
        ) : null}
      </div>

      {canBuildComponents.length ? (
        <div className="mt-4">
          <p className="text-sm font-medium">Can build components of this stack</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {canBuildComponents.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </div>
        </div>
      ) : null}

      {buildHref ? (
        <div className="mt-5">
          <ButtonLink href={buildHref} size="sm">
            Build this with {builder.name.split(" ")[0]}
          </ButtonLink>
        </div>
      ) : null}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </div>
  );
}
