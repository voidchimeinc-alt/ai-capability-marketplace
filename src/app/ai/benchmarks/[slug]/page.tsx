import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return getCatalog()
    .listBenchmarks()
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getCatalog().getBenchmarkBySlug(slug);
  return { title: b?.name ?? "Benchmark", description: b?.taskDescription };
}

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = getCatalog();
  const benchmark = catalog.getBenchmarkBySlug(slug);
  if (!benchmark) notFound();
  const results = catalog.listBenchmarkResults(benchmark.id);

  return (
    <Container className="py-14 sm:py-20">
      <Badge tone="accent">{benchmark.category}</Badge>
      <h1 className="mt-4 display text-5xl">{benchmark.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{benchmark.taskDescription}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6 space-y-3 text-sm">
          <p className="eyebrow">Challenge</p>
          <p><span className="font-medium">Input:</span> {benchmark.inputSummary}</p>
          <p><span className="font-medium">Expected output:</span> {benchmark.expectedOutputSummary}</p>
          <ul className="list-disc pl-5 text-[var(--muted)]">
            {benchmark.evaluationCriteria.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6 space-y-3 text-sm">
          <p className="eyebrow">Methodology</p>
          <p className="text-[var(--muted)]">{benchmark.methodology}</p>
          <p><span className="font-medium">Evaluator:</span> {benchmark.evaluator}</p>
          <p><span className="font-medium">Source:</span> {benchmark.source}</p>
        </div>
      </div>

      <h2 className="mt-12 display text-3xl">Results</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">Estimated demo scores — not independent lab results.</p>
      <div className="mt-6 space-y-3">
        {results.map((r) => {
          const tool = catalog.listTools().find((t) => t.id === r.toolId);
          return (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/70 px-5 py-4"
            >
              <div>
                {tool ? (
                  <Link href={`/ai/tools/${tool.slug}`} className="font-medium focus-ring rounded">
                    {tool.name}
                  </Link>
                ) : (
                  <span>{r.toolId}</span>
                )}
                <p className="text-sm text-[var(--muted)]">{r.notes}</p>
              </div>
              <div className="text-right">
                <p className="display text-2xl">{r.score == null ? "—" : r.score}</p>
                {r.isEstimated ? <Badge tone="warning">Estimated</Badge> : null}
              </div>
            </div>
          );
        })}
        {results.length === 0 ? (
          <p className="text-[var(--muted)]">No results published for this challenge yet.</p>
        ) : null}
      </div>
    </Container>
  );
}
