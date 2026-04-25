import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 5,
          background: "#1c1c1c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(44,102,226,0.9)",
            top: -10,
            left: -8,
            filter: "blur(10px)",
          }}
        />
        {/* Purple glow */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(117,71,202,0.9)",
            bottom: -10,
            right: -8,
            filter: "blur(10px)",
          }}
        />
        {/* CA text */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            position: "relative",
            zIndex: 1,
          }}
        >
          CA
        </div>
      </div>
    ),
    { ...size }
  );
}
