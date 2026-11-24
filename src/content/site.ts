/**
 * Single source of truth for identity and links.
 * Every fact here is taken from Priyanshu's résumé or public GitHub profile.
 */
export const site = {
  name: "Priyanshu Parasar",
  shortName: "Priyanshu",
  role: "Software engineer — backend systems & applied AI",
  location: "Bangalore, India",
  education: "B.Tech CSE, BML Munjal University · Class of 2027",
  description:
    "Priyanshu Parasar is a computer science student (Class of 2027) who builds backend systems and applied-AI infrastructure — most recently AegisOps, a human-approved, multi-agent incident-investigation platform.",
  // Override with NEXT_PUBLIC_SITE_URL once a production domain exists.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
