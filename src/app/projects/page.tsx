import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Company projects looking for AI implementation specialists.",
};

export default function ProjectsPage() {
  const projects = getCatalog().listProjects({ status: "open" });

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="eyebrow">Marketplace</p>
          <h1 className="display text-5xl">I need this built.</h1>
          <p className="text-lg text-[var(--muted)]">
            Post a problem. Match builders. Review applications. Shortlist. Hire.
          </p>
        </div>
        <ButtonLink href="/projects/new">Post a project</ButtonLink>
      </div>

      <div className="mt-12 grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6 focus-ring hover:bg-white"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{project.engagementType}</Badge>
              <Badge tone="muted">{project.industry}</Badge>
              <Badge>{project.status}</Badge>
            </div>
            <h2 className="mt-3 display text-3xl">{project.title}</h2>
            <p className="mt-2 text-[var(--muted)]">{project.problem}</p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Budget: {project.budgetRange} · Timeline: {project.timeline}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
