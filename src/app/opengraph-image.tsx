import { ImageResponse } from "next/og";

export const alt = "Priyanshu Parasar — backend systems and applied AI";
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
          justifyContent: "space-between",
          background: "#F8FAFC",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#0F172A",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            PP
          </div>
          <div style={{ fontSize: 28, color: "#0F172A", fontWeight: 600 }}>Priyanshu Parasar</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, color: "#0F172A", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.08, maxWidth: 980 }}>
            I build backend systems that make AI accountable.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#64748B" }}>
            Backend engineering · Applied AI · B.Tech CSE, Class of 2027
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#0D9488", borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
