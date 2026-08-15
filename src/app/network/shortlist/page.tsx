"use client";

import { BuilderCard } from "@/components/network/builder-card";
import { useShortlist } from "@/components/network/shortlist-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import { useMemo } from "react";

export default function ShortlistPage() {
  const { slugs, clear } = useShortlist();
  const builders = useMemo(() => {
    const catalog = getCatalog();
    return slugs
      .map((slug) => catalog.getBuilderBySlug(slug))
      .filter((b): b is NonNullable<typeof b> => Boolean(b));
  }, [slugs]);

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="eyebrow">Shortlist</p>
          <h1 className="display text-5xl">Compare builders</h1>
          <p className="max-w-xl text-[var(--muted)]">
            Discovery and shortlist only in this phase — no payments or hiring transactions yet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/network" variant="subtle">
            Discover more
          </ButtonLink>
          <ButtonLink href="/projects/new">Build this / start project</ButtonLink>
          {slugs.length ? (
            <button
              type="button"
              onClick={clear}
              className="h-11 rounded-full border border-[var(--border-strong)] bg-white/70 px-5 text-sm"
            >
              Clear shortlist
            </button>
          ) : null}
        </div>
      </div>

      {builders.length ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {builders.map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[1.75rem] border border-[var(--border)] bg-white/70 p-8">
          <p className="text-[var(--muted)]">
            No builders shortlisted yet. Generate an AI Stack and use{" "}
            <strong>Find Builders</strong>, or browse the Network.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/ai/recommend">Find My AI Stack</ButtonLink>
            <ButtonLink href="/network" variant="subtle">
              Browse AI Network
            </ButtonLink>
          </div>
        </div>
      )}
    </Container>
  );
}
