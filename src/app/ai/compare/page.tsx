import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CAPABILITY_LABELS, type ToolEntity } from "@/types/domain";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare AI",
  description: "Compare 2–5 AI systems across capability, deployment, and personality.",
};

function averageCapabilities(tool: ToolEntity) {
  const vals = Object.values(tool.capabilities).filter((v): v is number => typeof v === "number");
  return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : 0;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ tools?: string }>;
}) {
  const params = await searchParams;
  const catalog = getCatalog();
  const all = catalog.listTools();
  const selectedSlugs = (params.tools?.split(",").filter(Boolean) ?? []).slice(0, 5);
  const selectedFromQuery = selectedSlugs
    .map((slug) => catalog.getToolBySlug(slug))
    .filter((tool): tool is ToolEntity => Boolean(tool));

  const compared: ToolEntity[] =
    selectedFromQuery.length >= 2
      ? selectedFromQuery
      : all.filter((t) => ["claude", "gpt", "gemini"].includes(t.slug)).slice(0, 3);

  const safeCompared = compared.length >= 2 ? compared : all.slice(0, 3);
  const dimensions = Object.keys(CAPABILITY_LABELS) as (keyof typeof CAPABILITY_LABELS)[];
  const bestOverall = [...safeCompared].sort(
    (a, b) => averageCapabilities(b) - averageCapabilities(a),
  )[0];

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Comparison</p>
        <h1 className="display text-5xl sm:text-6xl">Compare with clarity.</h1>
        <p className="text-lg text-[var(--muted)]">
          Data, editorial opinion, and benchmark estimates stay labeled. Select tools via{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-sm">?tools=slug-a,slug-b</code>.
        </p>
      </div>

      <form className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
        <p className="mb-3 text-sm font-medium">Add tool slugs (comma-separated, 2–5)</p>
        <div className="flex flex-wrap gap-3">
          <input
            name="tools"
            defaultValue={selectedSlugs.join(",") || safeCompared.map((t) => t.slug).join(",")}
            className="h-11 min-w-[240px] flex-1 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
          />
          <button type="submit" className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white">
            Compare
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {all.slice(0, 12).map((t) => (
            <Badge key={t.id} tone="muted">
              {t.slug}
            </Badge>
          ))}
        </div>
      </form>

      <div className="mt-10 overflow-x-auto rounded-[1.75rem] border border-[var(--border)] bg-white/80">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="p-4 font-medium text-[var(--muted)]">Dimension</th>
              {safeCompared.map((tool) => (
                <th key={tool.id} className="p-4">
                  <Link href={`/ai/tools/${tool.slug}`} className="font-medium focus-ring rounded">
                    {tool.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim} className="border-b border-[var(--border)]">
                <td className="p-4 text-[var(--muted)]">{CAPABILITY_LABELS[dim]}</td>
                {safeCompared.map((tool) => {
                  const value = tool.capabilities[dim];
                  return (
                    <td key={tool.id + dim} className="p-4">
                      {value == null ? "Unknown" : `${value}/10`}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-b border-[var(--border)]">
              <td className="p-4 text-[var(--muted)]">Pricing</td>
              {safeCompared.map((tool) => (
                <td key={tool.id + "price"} className="p-4">
                  {tool.pricingNotes}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)]">
              <td className="p-4 text-[var(--muted)]">Deployment</td>
              {safeCompared.map((tool) => (
                <td key={tool.id + "dep"} className="p-4 capitalize">
                  {tool.deployment}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[var(--muted)]">Personality</td>
              {safeCompared.map((tool) => (
                <td key={tool.id + "pers"} className="p-4 italic text-[var(--accent-strong)]">
                  {tool.personality?.label ?? "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <section className="mt-10 rounded-[1.75rem] border border-[var(--border)] bg-[var(--foreground)] p-6 text-white sm:p-8">
        <p className="eyebrow text-white/60">Our take · editorial opinion</p>
        <h2 className="mt-2 display text-3xl">Synthesis</h2>
        <ul className="mt-4 space-y-2 text-white/85">
          <li>Best overall: {bestOverall?.name ?? "Unknown"}</li>
          <li>
            Best value:{" "}
            {safeCompared.find((t) => t.pricingModel === "freemium" || t.pricingModel === "free")?.name ??
              "Unknown (pricing unverified)"}
          </li>
          <li>
            Most powerful:{" "}
            {[...safeCompared].sort(
              (a, b) => (b.capabilities.reasoning ?? 0) - (a.capabilities.reasoning ?? 0),
            )[0]?.name ?? "Unknown"}
          </li>
          <li>
            Best for developers:{" "}
            {[...safeCompared].sort(
              (a, b) => (b.capabilities.coding ?? 0) - (a.capabilities.coding ?? 0),
            )[0]?.name ?? "Unknown"}
          </li>
          <li>
            Best for enterprise deployment:{" "}
            {[...safeCompared].sort(
              (a, b) =>
                (b.capabilities.enterprise_readiness ?? 0) - (a.capabilities.enterprise_readiness ?? 0),
            )[0]?.name ?? "Unknown"}
          </li>
        </ul>
      </section>
    </Container>
  );
}
