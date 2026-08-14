import { pitonMark } from "@/lib/brand-mark";
import { cn } from "@/lib/utils/cn";

export function PitonMark({
  className,
  title,
  ink = "currentColor",
  teal = "var(--brand-teal)",
}: {
  className?: string;
  title?: string;
  ink?: string;
  teal?: string;
}) {
  return (
    <svg
      viewBox={pitonMark.viewBox}
      fill="none"
      className={cn("overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d={pitonMark.arrow} fill={ink} />
      <circle cx={pitonMark.dot.cx} cy={pitonMark.dot.cy} r={pitonMark.dot.r} fill={teal} />
      <path
        d={pitonMark.stem}
        stroke={teal}
        strokeWidth={pitonMark.stemWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
