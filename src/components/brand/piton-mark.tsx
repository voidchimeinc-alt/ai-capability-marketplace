import { pitonMark } from "@/lib/brand-mark";
import { cn } from "@/lib/utils/cn";

export function PitonMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    // Exact founder artwork — do not replace with a reconstructed glyph.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pitonMark.src}
      alt={title ?? ""}
      width={64}
      height={64}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}
