import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chirayu Arya — Marketing · Design · Photography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Blue blob — top left */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(44,102,226,0.55) 0%, transparent 70%)",
            top: -280,
            left: -180,
            filter: "blur(60px)",
          }}
        />

        {/* Purple blob — bottom right */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(117,71,202,0.5) 0%, transparent 70%)",
            bottom: -220,
            right: -160,
            filter: "blur(60px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "#1c1c1c",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#f5f5f7",
                letterSpacing: "-0.02em",
              }}
            >
              CA
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#f5f5f7",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginBottom: 20,
            }}
          >
            Chirayu Arya
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 26,
              color: "#86868b",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Marketing · Design · Photography
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
