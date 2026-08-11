import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search",
  description: "Search tools, builders, use cases, and projects.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? getCatalog().search(q) : null;

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Search</p>
        <h1 className="display text-5xl">What are you looking for?</h1>
      </div>

      <form className="mt-8">
        <input
          name="q"
          defaultValue={q}
          placeholder='Try “best AI for customer support” or “RAG engineer”'
          className="h-14 w-full rounded-full border border-[var(--border-strong)] bg-white/80 px-6 text-base outline-none focus:border-[var(--accent)]"
          autoFocus
        />
      </form>

      {results ? (
        <div className="mt-12 space-y-10">
          <ResultGroup title="Use cases">
            {results.useCases.map((uc) => (
              <Link key={uc.id} href={`/ai/recommend?problem=${uc.slug}`} className="block rounded-2xl bg-white/70 p-4 hover:bg-white">
                <p className="font-medium">{uc.name}</p>
                <p className="text-sm text-[var(--muted)]">{uc.problemStatement}</p>
              </Link>
            ))}
            {!results.useCases.length ? <Empty /> : null}
          </ResultGroup>
          <ResultGroup title="Tools">
            {results.tools.map((tool) => (
              <Link key={tool.id} href={`/ai/tools/${tool.slug}`} className="block rounded-2xl bg-white/70 p-4 hover:bg-white">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{tool.name}</p>
                  <Badge tone="muted">{tool.category}</Badge>
                </div>
                <p className="text-sm text-[var(--muted)]">{tool.shortDescription}</p>
              </Link>
            ))}
            {!results.tools.length ? <Empty /> : null}
          </ResultGroup>
          <ResultGroup title="Builders">
            {results.builders.map((b) => (
              <Link key={b.id} href={`/builders/${b.slug}`} className="block rounded-2xl bg-white/70 p-4 hover:bg-white">
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-[var(--muted)]">{b.title} · {b.specializations.join(", ")}</p>
              </Link>
            ))}
            {!results.builders.length ? <Empty /> : null}
          </ResultGroup>
          <ResultGroup title="Projects">
            {results.projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="block rounded-2xl bg-white/70 p-4 hover:bg-white">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-[var(--muted)]">{p.problem}</p>
              </Link>
            ))}
            {!results.projects.length ? <Empty /> : null}
          </ResultGroup>
        </div>
      ) : (
        <p className="mt-10 text-[var(--muted)]">Natural language and keyword search across the catalog.</p>
      )}
    </Container>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display text-2xl">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="text-sm text-[var(--muted)]">No matches.</p>;
}
