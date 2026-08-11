import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
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
  const builder = getCatalog().getBuilderBySlug(slug);
  if (!builder) notFound();

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl space-y-4">
        <Badge tone="accent">{builder.title}</Badge>
        <h1 className="display text-5xl sm:text-6xl">{builder.name}</h1>
        <p className="text-lg text-[var(--muted)]">
          {builder.location} · {builder.timezone} · {builder.availability}
        </p>
        <p className="text-lg leading-relaxed text-[var(--muted)]">{builder.bio}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section>
            <h2 className="display text-3xl">Proof of work</h2>
            <div className="mt-4 space-y-4">
              {builder.projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <Badge tone={project.verificationStatus === "platform_verified" ? "accent" : "muted"}>
                      {project.verificationStatus.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--foreground)]">Problem:</span> {project.problem}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--foreground)]">Solution:</span> {project.solution}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--foreground)]">Outcome:</span> {project.outcome}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <Badge key={t} tone="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </article>
              ))}
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
            <p className="eyebrow mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {builder.stack.map((c) => (
                <Badge key={c} tone="muted">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 text-sm space-y-2">
            <p>
              <span className="text-[var(--muted)]">Pricing:</span> {builder.pricingNotes}
            </p>
            <p>
              <span className="text-[var(--muted)]">Completed:</span> {builder.trust.projectsCompleted}
            </p>
            <p>
              <span className="text-[var(--muted)]">Verified projects:</span> {builder.trust.verifiedProjects}
            </p>
            <p>
              <span className="text-[var(--muted)]">Client rating:</span>{" "}
              {builder.trust.clientRating ?? "Unknown"}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
