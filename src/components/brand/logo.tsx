import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 focus-ring rounded-lg", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[var(--foreground)] text-white">
        {/* Piton mark: an upward anchor wedge */}
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
          <path d="M12 2 L19 20 L12 15.5 L5 20 Z" fill="currentColor" />
          <circle cx="12" cy="10.5" r="1.8" fill="var(--accent)" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
      </span>
      <span className="display text-xl tracking-tight">{brand.name}</span>
    </Link>
  );
}
