import { ToolCard } from "@/components/atlas/tool-card";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Atlas",
  description: "Discover AI models, applications, agents, and platforms.",
};

export default async function ToolsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string }>;
}) {
  const params = await searchParams;
  const tools = getCatalog().listTools({ q: params.q, kind: params.kind });

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">AI Atlas</p>
        <h1 className="display text-5xl sm:text-6xl">Find the right few.</h1>
        <p className="text-lg text-[var(--muted)]">
          Decision cards — best-for, strengths, cost posture, and editorial personality. Not a vanity
          catalog.
        </p>
      </div>

      <form className="mt-10 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search tools, capabilities, use cases…"
          className="h-12 min-w-[240px] flex-1 rounded-full border border-[var(--border-strong)] bg-white/80 px-5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          name="kind"
          defaultValue={params.kind ?? ""}
          className="h-12 rounded-full border border-[var(--border-strong)] bg-white/80 px-4 text-sm"
        >
          <option value="">All kinds</option>
          <option value="model">Models</option>
          <option value="application">Applications</option>
          <option value="agent">Agents</option>
          <option value="developer_tool">Developer tools</option>
          <option value="automation">Automation</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="api">APIs</option>
          <option value="framework">Frameworks</option>
        </select>
        <button
          type="submit"
          className="h-12 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 ? (
        <p className="mt-12 text-[var(--muted)]">No tools matched. Try a broader query.</p>
      ) : null}
    </Container>
  );
}
