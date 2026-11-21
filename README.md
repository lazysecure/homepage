# lazysecure homepage

The official organization homepage for lazysecure.

## Stack

- Next.js App Router
- TypeScript
- OpenNext adapter for Cloudflare Workers
- Cloudflare Workers for deployment

## Local development

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Cloudflare preview

```bash
npx wrangler login
npm run preview
```

## Deploy

```bash
npm run deploy
```

Before deploying, review the Cloudflare account, Worker name, compatibility date, and custom-domain configuration in `wrangler.jsonc` and the Cloudflare dashboard.

## Project structure

- `app/` — routes, metadata, and global styles
- `components/` — shared site chrome
- `lib/services.ts` — service directory content
- `wrangler.jsonc` — Cloudflare Workers configuration

## Content and safety

The Virus Archive is intended for defensive reference and research context. The homepage does not provide executable malware samples or instructions for deploying malware.

## Language

The site is English-first. Korean localization will be added as a separate, maintained language experience rather than an automatic machine-translated copy.
