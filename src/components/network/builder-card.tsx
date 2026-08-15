import { Badge } from "@/components/ui/badge";
import { ShortlistButton } from "@/components/network/shortlist-button";
import type { Builder } from "@/types/domain";
import { outcomeLabel } from "@/lib/network/trust";
import Link from "next/link";

export function BuilderCard({
  builder,
  highlight,
}: {
  builder: Builder;
  highlight?: string;
}) {
  const featured = builder.projects[0];
  const builds = builder.specializations[0] ?? builder.capabilities[0] ?? builder.title;

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] bg-white/70 p-6 transition hover:border-[var(--border-strong)] hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">Builds</p>
          <h2 className="mt-1 display text-2xl leading-tight">
            <Link href={`/builders/${builder.slug}`} className="focus-ring rounded">
              {builds}
            </Link>
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground)]">
            {builder.name} · {builder.title}
          </p>
        </div>
        <Badge tone={builder.availability === "available" ? "accent" : "muted"}>
          {builder.availability}
        </Badge>
      </div>

      {highlight ? <p className="mt-3 text-sm text-[var(--accent-strong)]">{highlight}</p> : null}

      {featured ? (
        <div className="mt-4 rounded-2xl bg-[var(--background)] p-4 text-sm">
          <p className="font-medium">Proof</p>
          <p className="mt-1 text-[var(--muted)] line-clamp-2">{featured.problem}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">{outcomeLabel(featured)}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">Proof of work not yet published.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {builder.capabilities.slice(0, 4).map((c) => (
          <Badge key={c} tone="muted">
            {c}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="text-xs text-[var(--muted)]">
          {builder.location} · {builder.timezone}
        </p>
        <ShortlistButton slug={builder.slug} />
      </div>
    </article>
  );
}
