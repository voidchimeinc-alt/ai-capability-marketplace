"use client";

import { Button } from "@/components/ui/button";
import { useShortlist } from "@/components/network/shortlist-provider";
import { cn } from "@/lib/utils/cn";

export function ShortlistButton({
  slug,
  className,
  size = "sm",
}: {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { has, toggle } = useShortlist();
  const active = has(slug);

  return (
    <Button
      type="button"
      size={size}
      variant={active ? "secondary" : "subtle"}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
    >
      {active ? "Shortlisted" : "Shortlist"}
    </Button>
  );
}
