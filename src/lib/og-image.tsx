import { ImageResponse } from "next/og";
import { getRegionByKey } from "@/lib/config";

const WIDTH = 1200;
const HEIGHT = 630;

export function renderOgImage(regionKey: string | null): ImageResponse {
  const region = getRegionByKey(regionKey);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #064e3b 0%, #065f46 45%, #0f172a 100%)",
        color: "#ffffff",
        padding: "56px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <span style={{ fontSize: 34, opacity: 0.9 }}>Výkup Regiony CZ</span>
        <h1
          style={{ fontSize: 64, lineHeight: 1.1, margin: 0, maxWidth: "85%" }}
        >
          {region.h1}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>
            {region.locative}
          </span>
          <span style={{ fontSize: 24, opacity: 0.9 }}>
            Nezávazná nabídka do 24 hodin
          </span>
        </div>
        <span
          style={{
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 999,
            padding: "12px 20px",
            fontSize: 22,
          }}
        >
          {region.phone}
        </span>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
