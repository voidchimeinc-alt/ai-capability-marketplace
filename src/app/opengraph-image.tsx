import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const icon = await readFile(join(process.cwd(), "public/brand/piton-icon.png"));

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
          <img src={icon} width={112} height={112} alt="" />
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
