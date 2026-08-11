"use client";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils/cn";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/ai/tools", label: "Atlas" },
  { href: "/ai/compare", label: "Compare" },
  { href: "/arena", label: "Arena" },
  { href: "/network", label: "Network" },
  { href: "/network/shortlist", label: "Shortlist" },
  { href: "/projects", label: "Projects" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors focus-ring",
                    active
                      ? "bg-black/5 text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/search" variant="ghost" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </ButtonLink>
          <ButtonLink href={brand.cta.primary.href} size="sm">
            {brand.cta.primary.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/70 md:hidden focus-ring"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--background-elevated)] md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base focus-ring"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search" className="rounded-xl px-3 py-3 text-base focus-ring" onClick={() => setOpen(false)}>
              Search
            </Link>
            <ButtonLink href={brand.cta.primary.href} className="mt-2" onClick={() => setOpen(false)}>
              {brand.cta.primary.label}
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
