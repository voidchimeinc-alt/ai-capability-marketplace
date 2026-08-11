import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use cases",
};

export default function UseCasesPage() {
  const useCases = getCatalog().listUseCases();
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">AI Atlas</p>
        <h1 className="display text-5xl">Business problems, mapped.</h1>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {useCases.map((uc) => (
          <Link
            key={uc.id}
            href={`/ai/recommend?problem=${uc.slug}`}
            className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6 focus-ring hover:bg-white"
          >
            <h2 className="display text-2xl">{uc.name}</h2>
            <p className="mt-3 text-[var(--muted)]">{uc.problemStatement}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
