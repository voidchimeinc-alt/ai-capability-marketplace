import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "accent" | "warning" | "muted";
}) {
  const tones = {
    default: "bg-black/5 text-[var(--foreground)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
    warning: "bg-amber-100 text-amber-900",
    muted: "bg-white/60 text-[var(--muted)] border border-[var(--border)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
