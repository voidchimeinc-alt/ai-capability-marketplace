import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] shadow-[0_10px_30px_color-mix(in_oklab,var(--accent)_28%,transparent)]",
  secondary: "bg-[var(--foreground)] text-white hover:opacity-90",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-black/5",
  subtle:
    "bg-white/70 text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-white backdrop-blur",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base min-h-[3.25rem]",
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-ring",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
