# critical-dummy

Personal developer website for `critical-dummy` built with Next.js App Router, TypeScript, Tailwind CSS, and the GitHub REST API.

## Customization

All editable copy, navigation links, development interests, highlighted repository names, theme accent tokens, and contact channels live in `config/site.ts`.

## Environment Variables

- `GITHUB_TOKEN` (optional, server/build-time only): raises the GitHub REST API rate limit from 60 to 5,000 requests/hour. Never expose this token with a `NEXT_PUBLIC_` prefix.
- `NEXT_PUBLIC_SITE_URL` (optional): sets the canonical `metadataBase` URL when serving behind a primary custom domain.

## Deployment

### Option 1: GitHub Pages (`critical-dummy.github.io` + GitHub Actions)

1. Push to `main` in your `critical-dummy.github.io` repository.
2. Open **Settings -> Pages** on GitHub and set **Build and deployment -> Source** to **GitHub Actions**.
3. The included `.github/workflows/nextjs.yml` workflow runs `npm run build:pages`, exports a static site to `./out` (with `.nojekyll`), and deploys it automatically.
4. Client-side **Refresh** buttons on `/projects` and `/activity` automatically fall back to public GitHub REST API requests when `/api/github` is not hosted.

### Option 2: Vercel (`critical-dummy.github.io` + Custom Domain)

1. Deploy this repository to Vercel (`npm run build` / standard Next.js preset).
2. Add both your custom domain and `critical-dummy.github.io` in the Vercel project's **Domains** settings without forcing a redirect between them so both domains serve the exact same website.
3. All internal routes use relative paths and `metadataBase` adapts automatically via `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL`.
