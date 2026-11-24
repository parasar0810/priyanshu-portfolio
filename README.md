# Priyanshu Parasar — portfolio

Personal site for Priyanshu Parasar: backend systems and applied AI. Theme: **The Engineering Editorial**.

- **Stack:** Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, Geist / Geist Mono
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
| `experience.ts` | internships and skills | résumé (Nov 2026) |
| `projects.ts` | project cards and facts | project repositories |
| `aegis-data.ts` | every number in the AegisOps charts | `AEGISBENCH_RESULTS.md`, `AEGISOPS_FINAL_TEST_REPORT.md` in the AegisOps repo |
| `writing/*.tsx` | engineering notes | written from the project docs |

Screenshots in `public/images/aegisops/` are unedited captures copied from the AegisOps repository (`docs/screenshots/`).
The résumé PDF is `public/Priyanshu_Parasar_Resume.pdf`.

## Deploy (Vercel)

1. Push this repository to GitHub.
2. Import it in Vercel — the Next.js preset needs no changes.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL (for example `https://<project>.vercel.app`) so canonical URLs, the sitemap and Open Graph tags use the right origin. Redeploy after setting it.
