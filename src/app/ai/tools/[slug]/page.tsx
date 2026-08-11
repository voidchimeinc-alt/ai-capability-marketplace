import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CAPABILITY_LABELS } from "@/types/domain";
import { formatUnknown } from "@/lib/utils/cn";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getCatalog()
    .listTools()
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getCatalog().getToolBySlug(slug);
  if (!tool) return { title: "Tool" };
  return {
    title: tool.name,
    description: tool.shortDescription,
  };
}

export default async function ToolProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getCatalog().getToolBySlug(slug);
  if (!tool) notFound();

  const scores = Object.entries(tool.capabilities) as [keyof typeof CAPABILITY_LABELS, number | null | undefined][];

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{tool.category}</Badge>
          <Badge tone="muted">{tool.kind.replaceAll("_", " ")}</Badge>
          <Badge tone="warning">Seed / demo data</Badge>
        </div>
        <h1 className="display text-5xl sm:text-6xl">{tool.name}</h1>
        <p className="text-xl leading-relaxed text-[var(--muted)]">{tool.shortDescription}</p>
        {tool.personality ? (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
            <p className="eyebrow">Personality</p>
            <p className="mt-2 display text-2xl">{tool.personality.label}</p>
            <p className="mt-2 text-[var(--muted)]">{tool.personality.summary}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">Editorial, not a scientific measurement.</p>
          </div>
        ) : null}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <ProfileBlock title="Best for" items={tool.bestFor} />
          <ProfileBlock title="Strengths" items={tool.strengths} />
          <ProfileBlock title="Weaknesses" items={tool.weaknesses} />
          <ProfileBlock title="Best use cases" items={tool.bestUseCases} />
          <ProfileBlock title="Avoid when" items={tool.avoidWhen} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
            <p className="eyebrow mb-4">Capability profile</p>
            <div className="space-y-3">
              {scores.map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{CAPABILITY_LABELS[key]}</span>
                    <span className="text-[var(--muted)]">{value == null ? "Unknown" : `${value}/10`}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/5">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: value == null ? "0%" : `${value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Editorial seed estimates · confidence: {tool.meta.confidence}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 space-y-3 text-sm">
            <Row label="Pricing" value={formatUnknown(tool.pricingNotes)} />
            <Row label="Pricing model" value={tool.pricingModel} />
            <Row label="API" value={tool.hasApi == null ? "Unknown" : tool.hasApi ? "Yes" : "No"} />
            <Row label="Deployment" value={tool.deployment} />
            <Row label="Integrations" value={tool.integrations.length ? tool.integrations.join(", ") : "Unknown"} />
            <Row label="Source" value={tool.meta.source} />
          </div>
        </aside>
      </div>
    </Container>
  );
}

function ProfileBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="display text-2xl">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white/60 px-4 py-3 text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-2 last:border-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-right font-medium capitalize">{value}</span>
    </div>
  );
}
