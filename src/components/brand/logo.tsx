import { PitonMark } from "@/components/brand/piton-mark";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function Logo({
  className,
  markOnly = false,
  size = "md",
}: {
  className?: string;
  markOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markClass = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const wordClass =
    size === "lg" ? "text-[1.85rem]" : size === "sm" ? "text-[0.95rem]" : "text-[1.22rem]";

  return (
    <Link
      href="/"
      aria-label={brand.name}
      className={cn("group inline-flex items-center gap-2.5 focus-ring rounded-lg", className)}
    >
      <PitonMark className={markClass} title={markOnly ? brand.name : undefined} />
      {markOnly ? null : (
        <span className={cn("logo-wordmark text-[var(--brand-ink)]", wordClass)}>{brand.name}</span>
      )}
    </Link>
  );
}
