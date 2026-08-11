import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Network",
  description: "AI Builders with capability, proof, and outcomes.",
};

export default function NetworkPage() {
  const builders = getCatalog().listBuilders();

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="eyebrow">AI Network</p>
          <h1 className="display text-5xl sm:text-6xl">Builders with proof.</h1>
          <p className="text-lg text-[var(--muted)]">
            Capability + proof + outcome. Not résumés. Not LinkedIn cosplay.
          </p>
        </div>
        <ButtonLink href="/builders/join">Join the AI Network</ButtonLink>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {builders.map((builder) => (
          <Link
            key={builder.id}
            href={`/builders/${builder.slug}`}
            className="rounded-[1.75rem] border border-[var(--border)] bg-white/70 p-6 focus-ring hover:bg-white"
          >
            <p className="eyebrow">{builder.title}</p>
            <h2 className="mt-2 display text-3xl">{builder.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {builder.location} · {builder.availability}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">{builder.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {builder.capabilities.slice(0, 4).map((c) => (
                <Badge key={c} tone="muted">
                  {c}
                </Badge>
              ))}
            </div>
            <p className="mt-5 text-xs text-[var(--muted)]">
              {builder.trust.verifiedProjects} verified projects · rating{" "}
              {builder.trust.clientRating ?? "Unknown"}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
