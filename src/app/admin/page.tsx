import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/db/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  description: "Founder-operable content and moderation console.",
};

export default function AdminPage() {
  const catalog = getCatalog();
  const stats = [
    ["Tools", catalog.listTools().length],
    ["Use cases", catalog.listUseCases().length],
    ["Builders", catalog.listBuilders().length],
    ["Benchmarks", catalog.listBenchmarks().length],
    ["Open projects", catalog.listProjects({ status: "open" }).length],
    ["Applications", catalog.listApplications().length],
  ];

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Admin</p>
        <h1 className="display text-5xl">Operate the marketplace.</h1>
        <p className="text-lg text-[var(--muted)]">
          Foundation console. Full CRUD + moderation lands in Phase 7; this shell shows live seed inventory.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6">
            <p className="eyebrow">{label}</p>
            <p className="mt-3 display text-4xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {[
          ["/ai/tools", "Manage tools (Atlas)"],
          ["/arena", "Manage benchmarks"],
          ["/network", "Review builders"],
          ["/projects", "Marketplace activity"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-[var(--border)] bg-white/70 px-5 py-4 focus-ring hover:bg-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </Container>
  );
}
