import { brand } from "@/lib/brand";

/** Shared geometry for the Piton A-arrow + teal i. ViewBox 80×88. */
export const pitonMark = {
  viewBox: "0 0 80 88",
  arrow: "M40 3 L76.8 84.8 H60.2 L40 14.8 L19.8 84.8 H3.2 Z",
  dot: { cx: 41.15, cy: 36.8, r: 4.28 },
  stem:
    "M42.15 43.5 C43.1 54.2 47.05 68.4 53.4 79.6 C54.85 82.15 56.7 83.55 58.55 83.9",
  stemWidth: 4.65,
} as const;

export function pitonMarkSvgMarkup(ink = brand.colors.ink, teal = brand.colors.teal) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${pitonMark.viewBox}" fill="none">
  <path d="${pitonMark.arrow}" fill="${ink}"/>
  <circle cx="${pitonMark.dot.cx}" cy="${pitonMark.dot.cy}" r="${pitonMark.dot.r}" fill="${teal}"/>
  <path d="${pitonMark.stem}" stroke="${teal}" stroke-width="${pitonMark.stemWidth}" stroke-linecap="round" fill="none"/>
</svg>`;
}
