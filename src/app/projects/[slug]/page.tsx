import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return getCatalog()
    .listProjects()
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getCatalog().getProjectBySlug(slug);
  return { title: project?.title ?? "Project", description: project?.problem };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = getCatalog();
  const project = catalog.getProjectBySlug(slug);
  if (!project) notFound();
  const applications = catalog.listApplications(project.id);

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">{project.engagementType}</Badge>
        <Badge tone="muted">{project.companySize}</Badge>
        <Badge>{project.status}</Badge>
      </div>
      <h1 className="mt-4 display text-5xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{project.problem}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Info label="Desired outcome" value={project.desiredOutcome} />
        <Info label="Industry" value={project.industry} />
        <Info label="Budget" value={project.budgetRange} />
        <Info label="Timeline" value={project.timeline} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.requiredCapabilities.map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
      </div>

      <div className="mt-10">
        <ButtonLink href={`/projects/${project.slug}/apply`}>Apply as a builder</ButtonLink>
      </div>

      <section className="mt-14">
        <h2 className="display text-3xl">Applications</h2>
        <div className="mt-4 space-y-3">
          {applications.map((app) => {
            const builder = catalog.listBuilders().find((b) => b.id === app.builderId);
            return (
              <div key={app.id} className="rounded-2xl border border-[var(--border)] bg-white/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {builder ? (
                    <Link href={`/builders/${builder.slug}`} className="font-medium focus-ring rounded">
                      {builder.name}
                    </Link>
                  ) : (
                    <span>{app.builderId}</span>
                  )}
                  <Badge tone="muted">{app.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{app.pitch}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">Proposed: {app.proposedRate}</p>
              </div>
            );
          })}
          {!applications.length ? <p className="text-[var(--muted)]">No applications yet.</p> : null}
        </div>
      </section>
    </Container>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2">{value}</p>
    </div>
  );
}
