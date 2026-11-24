# Priyanshu Parasar — portfolio

Personal site for Priyanshu Parasar: backend systems and applied AI. Theme: **The Engineering Editorial**.

- **Stack:** Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, Geist / Geist Mono, simple-icons (CC0)
- **Output:** every route is prerendered as static HTML; no server-side data, no secrets, no environment variables required to build

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm run start
```

## Content

All copy lives in `src/content/` so facts are edited in one place:

| File | What it holds | Source of truth |
|---|---|---|
| `site.ts` | name, links, email, résumé path | résumé |
| `experience.ts` | internships and skills | résumé (Gurugram revision) and public repositories |
| `projects.ts` | featured projects and smaller systems | each project's GitHub repository |
| `aegis-data.ts` | every number in the AegisOps charts | `AEGISBENCH_RESULTS.md`, `AEGISOPS_FINAL_TEST_REPORT.md` in the AegisOps repo |
| `writing/*.tsx` | engineering notes | written from the project docs |

Screenshots in `public/images/aegisops/` are unedited captures copied from the AegisOps repository (`docs/screenshots/`).
The résumé PDF is `public/Priyanshu_Parasar_Resume.pdf`.

## Deploy (Vercel)

1. Push this repository to GitHub.
2. Import it in Vercel — the Next.js preset needs no changes.
3. No environment variables are required: canonical URLs, the sitemap and Open Graph tags use Vercel's production domain automatically. Set `NEXT_PUBLIC_SITE_URL` only if you add a custom domain.
