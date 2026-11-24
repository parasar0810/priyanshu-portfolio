import { ImageResponse } from "next/og";

export const alt = "Priyanshu Parasar — Software Engineer, Backend Systems & Applied AI · Gurugram, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const chip = { padding: "8px 16px", border: "1px solid #CBD5E1", borderRadius: 6, background: "#FFFFFF", color: "#334155" };
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F8FAFC", padding: "64px 80px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#0F766E", fontSize: 22 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#0D9488" }} />
          Open to SWE internships and 2027 graduate roles
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, color: "#0F172A", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1 }}>Priyanshu Parasar</div>
          <div style={{ marginTop: 22, fontSize: 36, color: "#334155" }}>Software Engineer · Backend Systems & Applied AI</div>
          <div style={{ marginTop: 14, fontSize: 26, color: "#5B6A80" }}>Gurugram, Haryana, India · B.Tech CSE, Class of 2027</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, fontSize: 22 }}>
            <div style={chip}>AegisOps · multi-agent incident response</div>
            <div style={chip}>8/8 live AWS fault scenarios</div>
          </div>
          <div style={{ display: "flex", height: 6, width: 120, background: "#0D9488", borderRadius: 3 }} />
        </div>
      </div>
    ),
    size,
  );
}
