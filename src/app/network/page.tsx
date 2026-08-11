import { BuilderCard } from "@/components/network/builder-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Network",
  description: "Builders with proof — capability, proof of work, and outcomes.",
};

const suggestionQueries = [
  "RAG engineer",
  "AI support automation",
  "Agent builder",
  "AI implementation specialist",
  "MCP engineer",
];

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    capability?: string;
    technology?: string;
    useCase?: string;
    availability?: string;
    location?: string;
    projectType?: string;
  }>;
}) {
  const params = await searchParams;
  const catalog = getCatalog();
  const builders = catalog.listBuilders({
    q: params.q,
    capability: params.capability,
    technology: params.technology,
    useCase: params.useCase,
    availability: params.availability,
    location: params.location,
    projectType: params.projectType,
  });
  const useCases = catalog.listUseCases();

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="eyebrow">AI Network</p>
          <h1 className="display text-5xl sm:text-6xl">Builders with proof.</h1>
          <p className="text-lg text-[var(--muted)]">
            Who can actually build this AI Stack? Capability + proof + outcome — not résumés.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/network/shortlist" variant="subtle">
            View shortlist
          </ButtonLink>
          <ButtonLink href="/builders/join">Join the AI Network</ButtonLink>
        </div>
      </div>

      <form className="mt-10 grid gap-3 rounded-[1.75rem] border border-[var(--border)] bg-white/70 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search: RAG engineer, agent builder…"
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm sm:col-span-2 lg:col-span-3"
        />
        <input
          name="capability"
          defaultValue={params.capability}
          placeholder="Capability"
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        />
        <input
          name="technology"
          defaultValue={params.technology}
          placeholder="Technology"
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        />
        <select
          name="useCase"
          defaultValue={params.useCase ?? ""}
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        >
          <option value="">Use case</option>
          {useCases.map((uc) => (
            <option key={uc.id} value={uc.slug}>
              {uc.name}
            </option>
          ))}
        </select>
        <select
          name="availability"
          defaultValue={params.availability ?? ""}
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        >
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="booked">Booked</option>
        </select>
        <input
          name="location"
          defaultValue={params.location}
          placeholder="Location / time zone"
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        />
        <input
          name="projectType"
          defaultValue={params.projectType}
          placeholder="Project type"
          className="h-11 rounded-full border border-[var(--border-strong)] bg-white px-4 text-sm"
        />
        <button
          type="submit"
          className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white sm:col-span-2 lg:col-span-3"
        >
          Discover builders
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestionQueries.map((q) => (
          <Link
            key={q}
            href={`/network?q=${encodeURIComponent(q)}`}
            className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-xs hover:bg-white focus-ring"
          >
            {q}
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">
        {builders.length} builder{builders.length === 1 ? "" : "s"} · seed/demo profiles clearly labeled
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {builders.map((builder) => (
          <BuilderCard key={builder.id} builder={builder} />
        ))}
      </div>

      {!builders.length ? (
        <p className="mt-10 text-[var(--muted)]">No builders matched. Try a broader query.</p>
      ) : null}
    </Container>
  );
}
