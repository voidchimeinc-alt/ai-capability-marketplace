import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { pitonMark } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.canvas,
        }}
      >
        <svg
          width="128"
          height="141"
          viewBox={pitonMark.viewBox}
          fill="none"
        >
          <path d={pitonMark.arrow} fill={brand.colors.ink} />
          <circle
            cx={pitonMark.dot.cx}
            cy={pitonMark.dot.cy}
            r={pitonMark.dot.r}
            fill={brand.colors.teal}
          />
          <path
            d={pitonMark.stem}
            stroke={brand.colors.teal}
            strokeWidth={pitonMark.stemWidth}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
