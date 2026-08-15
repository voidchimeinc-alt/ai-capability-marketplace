import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ProofOfWorkCard } from "@/components/network/proof-of-work-card";
import { ShortlistButton } from "@/components/network/shortlist-button";
import { getCatalog } from "@/lib/db/catalog";
import { moderationLabel } from "@/lib/network/trust";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getCatalog()
    .listBuilders()
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const builder = getCatalog().getBuilderBySlug(slug);
  return {
    title: builder?.name ?? "Builder",
    description: builder?.bio,
  };
}

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = getCatalog();
  const builder = catalog.getBuilderBySlug(slug);
  if (!builder) notFound();

  const useCases = (builder.useCaseSlugs ?? [])
    .map((s) => catalog.getUseCaseBySlug(s))
    .filter(Boolean);

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{builder.title}</Badge>
            <Badge tone={builder.availability === "available" ? "accent" : "muted"}>
              {builder.availability}
            </Badge>
            <Badge tone="muted">Moderation: {moderationLabel(builder)}</Badge>
            {builder.meta.editorialStatus === "seed_demo" ? (
              <Badge tone="warning">Seed / demo profile</Badge>
            ) : null}
          </div>
          <h1 className="display text-5xl sm:text-6xl">{builder.name}</h1>
          <p className="text-lg text-[var(--muted)]">
            {builder.location} · {builder.timezone}
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted)]">{builder.bio}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShortlistButton slug={builder.slug} size="md" />
          <ButtonLink
            href={`/projects/new?builder=${builder.slug}&from=profile`}
            variant="subtle"
            size="md"
          >
            Build this
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-8">
          <section>
            <h2 className="display text-3xl">Proof of work</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Problem → solution → stack → role → outcome. Verification is labeled; outcomes are never
              invented.
            </p>
            <div className="mt-4 space-y-4">
              {builder.projects.map((project) => (
                <ProofOfWorkCard key={project.id} project={project} />
              ))}
              {!builder.projects.length ? (
                <p className="text-[var(--muted)]">No proof-of-work projects published yet.</p>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
            <p className="eyebrow mb-3">Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {builder.capabilities.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
            <p className="eyebrow mb-3">Technology stack</p>
            <div className="flex flex-wrap gap-2">
              {builder.stack.map((c) => (
                <Badge key={c} tone="muted">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          {useCases.length ? (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
              <p className="eyebrow mb-3">Relevant use cases</p>
              <div className="flex flex-wrap gap-2">
                {useCases.map((uc) => (
                  <Badge key={uc!.id} tone="muted">
                    {uc!.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5">
            <p className="eyebrow mb-3">Preferred project types</p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              {builder.preferredProjectTypes.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 text-sm space-y-2">
            <p>
              <span className="text-[var(--muted)]">Pricing:</span> {builder.pricingNotes}
            </p>
            <p>
              <span className="text-[var(--muted)]">Verified projects:</span>{" "}
              {builder.trust.verifiedProjects}
            </p>
            <p>
              <span className="text-[var(--muted)]">Client rating:</span>{" "}
              {builder.trust.clientRating ?? "Unknown"}
            </p>
            <p>
              <span className="text-[var(--muted)]">Response time:</span>{" "}
              {builder.trust.responseTimeHours == null
                ? "Unknown"
                : `${builder.trust.responseTimeHours}h`}
            </p>
            <p className="pt-2 text-xs text-[var(--muted)]">
              Trust signals are seed/demo where marked. Report profiles via Admin in a later phase.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
