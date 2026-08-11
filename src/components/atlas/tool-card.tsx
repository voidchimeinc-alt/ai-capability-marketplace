import { Badge } from "@/components/ui/badge";
import {
  deriveCostPosture,
  deriveEnterprisePosture,
  formatCapabilityScore,
} from "@/lib/matching/scoring";
import { SCORE_PROVENANCE_LABELS, COST_POSTURE_LABELS, type ToolEntity } from "@/types/domain";
import Link from "next/link";

export function ToolCard({ tool }: { tool: ToolEntity }) {
  const reasoning = formatCapabilityScore(tool, "reasoning");
  const coding = formatCapabilityScore(tool, "coding");
  const agentic = formatCapabilityScore(tool, "agentic");

  return (
    <Link
      href={`/ai/tools/${tool.slug}`}
      className="flex h-full flex-col rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 transition hover:border-[var(--border-strong)] hover:bg-white focus-ring"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">{tool.name}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">
            {tool.kind.replaceAll("_", " ")}
          </p>
        </div>
        <Badge tone="muted">{tool.category}</Badge>
      </div>

      <p className="text-sm leading-relaxed text-[var(--muted)]">{tool.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.bestFor.slice(0, 2).map((item) => (
          <Badge key={item} tone="muted">
            {item}
          </Badge>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-[var(--muted)]">
        <div>
          <dt>Reasoning</dt>
          <dd className="font-medium text-[var(--foreground)]">{reasoning.display}</dd>
        </div>
        <div>
          <dt>Coding</dt>
          <dd className="font-medium text-[var(--foreground)]">{coding.display}</dd>
        </div>
        <div>
          <dt>Agentic</dt>
          <dd className="font-medium text-[var(--foreground)]">{agentic.display}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Badge tone="warning">Cost {COST_POSTURE_LABELS[deriveCostPosture(tool)]}</Badge>
        <Badge tone="muted">Enterprise {deriveEnterprisePosture(tool)}</Badge>
        {reasoning.provenance ? (
          <Badge tone="muted">{SCORE_PROVENANCE_LABELS[reasoning.provenance]} scores</Badge>
        ) : null}
      </div>

      {tool.personality ? (
        <p className="mt-4 text-sm italic text-[var(--accent-strong)]">{tool.personality.label}</p>
      ) : null}

      {tool.editorialTake ? (
        <p className="mt-2 text-xs text-[var(--muted)] line-clamp-2">{tool.editorialTake}</p>
      ) : tool.strengths[0] ? (
        <p className="mt-2 text-xs text-[var(--muted)] line-clamp-2">
          Strength: {tool.strengths[0]} · Watch: {tool.weaknesses[0] ?? "None listed"}
        </p>
      ) : null}
    </Link>
  );
}
