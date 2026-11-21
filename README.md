# lazysecure homepage

The official organization homepage for lazysecure.

## Stack

- Next.js App Router
- TypeScript
- Static HTML export
- Cloudflare Pages

## Local development

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Next.js exports the static site to `out/`. Deploy the contents of that directory to Cloudflare Pages.

## Cloudflare Pages

- Production branch: `main`
- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: `/`

The site is a static homepage and does not require a Cloudflare Worker runtime.

## Project structure

- `app/` — routes, metadata, and global styles
- `components/` — shared site chrome
- `lib/services.ts` — service directory content

## Content and safety

The Virus Archive is intended for defensive reference and research context. The homepage does not provide executable malware samples or instructions for deploying malware.

## Language

The site is English-first, with a separately maintained Korean route at `/ko`.
