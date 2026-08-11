import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 focus-ring rounded-lg", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[var(--foreground)] text-white">
        <span className="display text-[0.95rem] leading-none">W</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
      </span>
      <span className="display text-xl tracking-tight">{brand.name}</span>
    </Link>
  );
}
