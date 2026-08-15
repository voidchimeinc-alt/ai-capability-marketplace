import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import { getCatalog } from "@/lib/db/catalog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function Section({
  eyebrow,
  title,
  body,
  children,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="border-t border-[var(--border)] py-20 sm:py-28">
      <Container className="space-y-10">
        <div className="max-w-2xl space-y-4">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display text-4xl sm:text-5xl">{title}</h2>
          <p className="text-lg leading-relaxed text-[var(--muted)]">{body}</p>
          {cta ? (
            <ButtonLink href={cta.href} variant="subtle" className="mt-2">
              {cta.label}
            </ButtonLink>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function LandingSections() {
  const catalog = getCatalog();
  const tools = catalog.listTools().slice(0, 6);
  const builders = catalog.listBuilders().slice(0, 3);
  const benchmarks = catalog.listBenchmarks().slice(0, 3);

  return (
    <>
      <Section
        eyebrow="Problem → solution"
        title="Not another AI directory."
        body="The internet already lists thousands of tools. We help you identify the right few for your situation — then who can implement them."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Discover", "Map the AI systems that actually fit the job."],
            ["Decide", "Compare capability, cost posture, and fit — with opinions clearly labeled."],
            ["Deploy", "Match AI Builders who show proof of work, not résumés."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 p-6">
              <h3 className="display text-2xl">{title}</h3>
              <p className="mt-3 text-[var(--muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={brand.products.atlas.name}
        title="AI discovery with judgment."
        body="Rich profiles for models, applications, agents, and platforms — strengths, weaknesses, personality, and honest unknowns."
        cta={{ href: "/ai/tools", label: "Explore AI Atlas" }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/ai/tools/${tool.slug}`}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 transition hover:border-[var(--border-strong)] hover:bg-white focus-ring"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-medium">{tool.name}</h3>
                <Badge tone="muted">{tool.category}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{tool.shortDescription}</p>
              {tool.personality ? (
                <p className="mt-4 text-sm italic text-[var(--accent-strong)]">{tool.personality.label}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Comparison"
        title="Compare what actually matters."
        body="Capability, deployment, enterprise readiness, and personality — with DATA, EDITORIAL OPINION, and BENCHMARK RESULTS kept distinct."
        cta={{ href: "/ai/compare", label: "Open comparison" }}
      />

      <Section
        eyebrow={brand.products.arena.name}
        title="Benchmarks with methodology, not mythology."
        body="A framework for practical challenges. Seed results are labeled as editorial demo estimates — never presented as scientific truth."
        cta={{ href: "/arena", label: "Enter AI Arena" }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {benchmarks.map((b) => (
            <Link
              key={b.id}
              href={`/ai/benchmarks/${b.slug}`}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 focus-ring hover:bg-white"
            >
              <Badge tone="accent" className="mb-3">
                {b.category}
              </Badge>
              <h3 className="display text-2xl">{b.name}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{b.taskDescription}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={brand.products.network.name}
        title="Builders with proof."
        body="Capability + proof + outcome. Prefer show-me-what-you-built over certificates and LinkedIn endorsements."
        cta={{ href: "/network", label: "Browse AI Network" }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {builders.map((builder) => (
            <Link
              key={builder.id}
              href={`/builders/${builder.slug}`}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-5 focus-ring hover:bg-white"
            >
              <p className="eyebrow">{builder.title}</p>
              <h3 className="mt-2 display text-2xl">{builder.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {builder.location} · {builder.timezone}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {builder.specializations.slice(0, 3).map((s) => (
                  <Badge key={s} tone="muted">
                    {s}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Marketplace"
        title="From recommendation to implementation."
        body="Post a project. Match builders. Shortlist. Hire. Payment rails stay simple in V1 — the workflow and data model are ready to grow."
        cta={{ href: "/projects/new", label: "I need this built" }}
      />

      <Section
        eyebrow="Vision"
        title="An AI decision + implementation network."
        body="Companies, business problems, capabilities, tools, builders, projects, and verified outcomes — connected so better decisions become better deployments."
      />
    </>
  );
}
