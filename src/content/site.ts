/**
 * Single source of truth for identity and links.
 * Source: résumé (Gurugram revision, Nov 2026) and public GitHub profile.
 */
export const site = {
  name: "Priyanshu Parasar",
  shortName: "Priyanshu",
  designation: "Software Engineer · Backend Systems & Applied AI",
  location: "Gurugram, Haryana, India",
  availability: "Open to software engineering internships and 2027 graduate roles",
  education: "B.Tech CSE, BML Munjal University · Class of 2027",
  description:
    "Priyanshu Parasar is a software engineer (B.Tech CSE, Class of 2027) in Gurugram, India, building backend systems and applied-AI infrastructure — including AegisOps, a multi-agent incident-investigation platform with human-approved, verified remediation.",
  // NEXT_PUBLIC_SITE_URL wins (e.g. a custom domain); otherwise Vercel's production
  // domain, which Vercel injects into every build; otherwise local development.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  email: "pparasar2004@gmail.com",
  github: "https://github.com/parasar0810",
  githubHandle: "parasar0810",
  linkedin: "https://www.linkedin.com/in/parasar-priyanshu",
  linkedinHandle: "parasar-priyanshu",
  resumePath: "/Priyanshu_Parasar_Resume.pdf",
} as const;

export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Verified, sourced highlights shown on the home page. */
export const highlights = [
  { value: "8 / 8", label: "live AWS fault scenarios diagnosed, fixed and verified", source: "AegisOps" },
  { value: "1.10% → 0.35%", label: "dangerous ticket misrouting after per-class thresholds", source: "iSON Technologies" },
  { value: "~45–90 s → ~4.5 ms", label: "per-ticket inference after refactoring to a service", source: "iSON Technologies" },
  { value: "129", label: "automated tests across AegisOps and NovaCart", source: "AegisOps" },
  { value: "95%+", label: "traffic-sign accuracy across 43+ classes", source: "Tata Technologies" },
] as const;
