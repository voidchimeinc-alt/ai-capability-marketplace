import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Arena",
  description: "Practical AI benchmark challenges with clear methodology.",
};

export default function ArenaPage() {
  const catalog = getCatalog();
  const benchmarks = catalog.listBenchmarks();

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">AI Arena</p>
        <h1 className="display text-5xl sm:text-6xl">Compare capability, not hype.</h1>
        <p className="text-lg text-[var(--muted)]">
          Seed results are editorial demo estimates. Methodology is labeled. Scores are not scientific truth.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {benchmarks.map((b) => (
          <Link
            key={b.id}
            href={`/ai/benchmarks/${b.slug}`}
            className="rounded-[1.75rem] border border-[var(--border)] bg-white/70 p-6 focus-ring hover:bg-white"
          >
            <Badge tone="accent">{b.category}</Badge>
            <h2 className="mt-4 display text-3xl">{b.name}</h2>
            <p className="mt-3 text-[var(--muted)]">{b.taskDescription}</p>
            <p className="mt-4 text-xs text-[var(--muted)]">Evaluator: {b.evaluator}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
