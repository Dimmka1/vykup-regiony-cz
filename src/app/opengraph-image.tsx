import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Rychlý výkup nemovitostí — Výkup Regiony CZ";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
        padding: "60px",
      }}
    >
      {/* House icon */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        style={{ marginBottom: "30px" }}
      >
        <path
          d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Rychlý výkup nemovitostí
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
          }}
        >
          Nabídka do 24 hodin • Bez poplatků
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          fontSize: "20px",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        vykup-regiony.cz
      </div>
    </div>,
    { ...size },
  );
}
