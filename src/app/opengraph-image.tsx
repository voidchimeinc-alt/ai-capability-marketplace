import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { pitonMark } from "@/lib/brand-mark";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 88px",
          background: brand.colors.canvas,
          color: brand.colors.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="92" height="101" viewBox={pitonMark.viewBox} fill="none">
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
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: 16,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {brand.name}
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: "#5B677A",
            letterSpacing: 0.2,
            maxWidth: 920,
            lineHeight: 1.35,
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
