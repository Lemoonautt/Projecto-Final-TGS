import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#2563eb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "20%",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "translateY(-1px)" }}
        >
          <path
            d="M12 4L4 8L12 12L20 8L12 4Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 10V16L12 20L20 16V10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="7" y1="9" x2="7" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="7" cy="16" r="1.5" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  )
}
