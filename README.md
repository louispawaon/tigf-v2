# Today I'm Grateful For (TIGF)

**What are you grateful for today?**

A free, local-first gratitude journal that works offline. Write privately in your browser — entries stay on your device (IndexedDB via [Dexie](https://dexie.org/)). There are no accounts; journal content is not collected on a server.

## Features

- **Today’s entry** with autosave
- **History** — desktop sidebar and mobile drawer
- **Modes** — `calm`, `focus`, and `night` (cycles with the app chrome)
- **Installable PWA** — offline-capable after the first load; icons and manifest are configured in `[vite.config.ts](vite.config.ts)`
- **SEO routes** — `[/sitemap.xml](src/routes/sitemap%5B.%5Dxml.tsx)`, `[/robots.txt](src/routes/robots%5B.%5Dtxt.tsx)`, and `[/privacy-policy](src/routes/privacy-policy.tsx)`

## Stack

- [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router) (file-based routes in `src/routes/`)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [Dexie](https://dexie.org/) for IndexedDB — `[src/db/index.ts](src/db/index.ts)`
- [Zustand](https://zustand-demo.pmnd.rs/) for global UI state only — `[src/store/](src/store/)`
- UI: [Radix UI](https://www.radix-ui.com/) primitives, [shadcn](https://ui.shadcn.com/)-style patterns, [Framer Motion](https://www.framer.com/motion/), [Lucide](https://lucide.dev/) icons
- Hosting: [Cloudflare Workers](https://workers.cloudflare.com/) via `[@cloudflare/vite-plugin](https://developers.cloudflare.com/workers/vite-plugin/)` and [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — see `[wrangler.toml](wrangler.toml)`

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

## Environment variables


| Variable               | Description                                                                                                                                                                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_PUBLIC_SITE_URL` | Canonical site origin for production (no trailing slash), e.g. `https://www.example.com`. Used for absolute URLs: canonical links, Open Graph, sitemap, and robots. **Required for production builds** — see `[src/seo/site.ts](src/seo/site.ts)`. In development, the app falls back to `http://localhost:3000`. |


Copy [.env.example](.env.example) to `.env` and set values as needed.

## Scripts


| Script             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `pnpm dev`         | Start Vite dev server (port 3000)                    |
| `pnpm build`       | Production build                                     |
| `pnpm preview`     | Preview the production build locally                 |
| `pnpm test`        | Run [Vitest](https://vitest.dev/)                    |
| `pnpm lint`        | Run ESLint                                           |
| `pnpm format`      | Check formatting with Prettier                       |
| `pnpm check`       | Format with Prettier and fix ESLint issues           |
| `pnpm deploy:dev`  | `pnpm build` then `wrangler deploy --env develop`    |
| `pnpm deploy:prod` | `pnpm build` then `wrangler deploy --env production` |
| `pnpm cf-typegen`  | Generate Wrangler types                              |


## Production build and PWA

Service worker and install behavior are easiest to validate on a **production build**, not `pnpm dev`:

```bash
pnpm build
pnpm preview
```

Then use the browser’s devtools (Application → Service Workers / Manifest) to confirm caching and installability.

## Deployment

`deploy:dev` and `deploy:prod` run a production build and deploy with Wrangler to the `develop` and `production` environments respectively. Ensure those [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/) exist in your Cloudflare account or are defined in `wrangler.toml` — the committed `[wrangler.toml](wrangler.toml)` does not declare `[env.develop]` / `[env.production]` blocks by default.

Set `VITE_PUBLIC_SITE_URL` to your deployed origin before `pnpm build` so SEO and metadata use the correct canonical URL.

## Project layout

```
src/
  routes/        # File-based routes (__root.tsx, index, privacy-policy, sitemap, robots)
  components/    # UI
  db/            # Dexie schema and entry helpers
  seo/           # Meta tags, site URL helpers, constants
  store/         # Zustand (UI-only)
public/          # Static assets (favicon, PWA icons, og.png, etc.)
```

## Further reading

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)

