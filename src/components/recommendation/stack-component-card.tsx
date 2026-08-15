import { Badge } from "@/components/ui/badge";
import { COST_POSTURE_LABELS, COMPLEXITY_LABELS } from "@/types/domain";
import type { StackComponentRecommendation } from "@/types/domain";
import Link from "next/link";

export function StackComponentCard({ component }: { component: StackComponentRecommendation }) {
  const title = component.tool?.name ?? component.processLabel ?? component.role.label;
  const href = component.tool ? `/ai/tools/${component.tool.slug}` : null;

  return (
    <article className="rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{component.role.label}</Badge>
        <Badge tone="muted">{COMPLEXITY_LABELS[component.complexity]}</Badge>
        <Badge tone="warning">Cost: {COST_POSTURE_LABELS[component.costPosture]}</Badge>
        {component.tool ? (
          <Badge tone="muted">Match {component.matchScore.toFixed(1)}</Badge>
        ) : (
          <Badge>Process layer</Badge>
        )}
      </div>

      <h3 className="mt-4 display text-3xl">
        {href ? (
          <Link href={href} className="focus-ring rounded">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>

      {component.tool ? (
        <p className="mt-2 text-[var(--muted)]">{component.tool.shortDescription}</p>
      ) : (
        <p className="mt-2 text-[var(--muted)]">{component.role.purpose}</p>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium">Why this component</p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--muted)]">
            {component.why.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">What it does in the stack</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{component.roleInStack}</p>
          <p className="mt-4 text-sm font-medium">Watch-outs</p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--muted)]">
            {component.watchOuts.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {component.alternatives.length ? (
        <div className="mt-5 rounded-2xl bg-[var(--background)] p-4">
          <p className="text-sm font-medium">Possible alternatives</p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
            {component.alternatives.map((alt) => (
              <li key={alt.tool.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <Link href={`/ai/tools/${alt.tool.slug}`} className="font-medium text-[var(--foreground)] focus-ring rounded">
                  {alt.tool.name}
                </Link>
                <span>— {alt.why}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
