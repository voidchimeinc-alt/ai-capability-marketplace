import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/ai/tools", label: brand.products.atlas.name },
      { href: "/arena", label: brand.products.arena.name },
      { href: "/network", label: brand.products.network.name },
      { href: "/ai/recommend", label: "Find My AI Stack" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/ai/use-cases", label: "Use cases" },
      { href: "/ai/compare", label: "Compare" },
      { href: "/builders", label: "Builders" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/auth/login", label: "Sign in" },
      { href: "/builders/join", label: "Join as a builder" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[color-mix(in_oklab,#0b1220_3%,transparent)]">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Logo size="lg" />
          <p className="text-sm leading-relaxed text-[var(--muted)]">{brand.description}</p>
          <p className="text-xs text-[var(--muted)]">Working name. Brand tokens are centralized for rename.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <p className="eyebrow">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] focus-ring rounded">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-2 border-t border-[var(--border)] py-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {brand.name}. Decision quality over directory size.</p>
        <p>DISCOVER → DECIDE → DEPLOY</p>
      </Container>
    </footer>
  );
}
