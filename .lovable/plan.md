## Goal

Make `bun run build` (or `npm run build`) output a **flat static site** into `dist/` — `index.html`, `assets/`, `favicon.png`, `team/...`, `.htaccess` — with **no `client/` and no `server/` subfolders**. You can then upload everything inside `dist/` straight into `public_html` on your shared hosting and the full site (including the `/admin` panel) will work.

This is safe because your app is already a pure SPA:
- All data comes from Lovable Cloud (Supabase) over HTTPS from the browser.
- The admin panel reads/writes through `@/integrations/supabase/client` directly.
- There are no server functions (`createServerFn`) or API routes used.
- SSR is not needed for functionality — only for SEO, which static prerender will preserve.

## What changes

### 1. Switch the framework to SPA / static output

Currently the project uses `@tanstack/react-start` (SSR) which builds into `dist/client` + `dist/server` for Cloudflare Workers. We will switch to a plain **Vite + TanStack Router** SPA build, which emits everything flat into `dist/`.

**`vite.config.ts`** — replace the Lovable TanStack Start config with a plain Vite SPA config:
- Use `@vitejs/plugin-react`
- Use `@tanstack/router-plugin/vite` (file-based routing, same `src/routes/` layout — no route files need to change)
- Use `@tailwindcss/vite`
- Use `vite-tsconfig-paths` for the `@/*` alias
- Set `build.outDir = "dist"` (default, flat — no client/server split)
- Keep `componentTagger` for dev (no-op in production)

### 2. Replace the SSR bootstrap with a SPA bootstrap

- **Add `index.html`** at project root (Vite SPA entry) with:
  - All `<head>` tags currently in `__root.tsx` `head()` (title, description, OG tags, favicon, fonts, stylesheet link removed since Vite injects it)
  - `<div id="root"></div>`
  - `<script type="module" src="/src/main.tsx"></script>`
- **Add `src/main.tsx`** — creates the QueryClient + TanStack Router and mounts `<RouterProvider />` into `#root`.
- **Update `src/routes/__root.tsx`**:
  - Remove `shellComponent`, `HeadContent`, `Scripts`, `<html>/<body>` wrapper (no longer needed without SSR).
  - Keep route definition, `notFoundComponent`, `QueryClientProvider`, and `<Outlet />`.
  - Per-route `head()` metadata stays — we'll use `@tanstack/react-router`'s `useRouterState` + a tiny `<HeadManager />` (or `react-helmet-async`, already in `package.json`) to update `document.title` and meta tags client-side. This keeps your per-route titles working in the browser.
- **Delete server-only files**: `src/integrations/supabase/client.server.ts` and `src/integrations/supabase/auth-middleware.ts` (they import server-only modules and are unused by the client).

### 3. Static SEO via prerendering (so each route still has its own `<title>`/OG tags in the HTML)

Without SSR, search engines and link-preview crawlers would only see the root `index.html`. To preserve the per-route SEO you set up earlier (`/team`, `/our-work`, `/portfolio`, `/contact`, etc.), we'll add **`vite-plugin-prerender`** (or `vite-plugin-ssg`-style static generation) to:
- Crawl your route list at build time
- Emit `dist/team/index.html`, `dist/our-work/index.html`, `dist/contact/index.html`, etc., each with the correct `<title>` and OG tags baked in
- Dynamic team profile routes (`/team/$slug`) will be prerendered by fetching the slug list from Supabase at build time

The `/admin` route is excluded from prerendering (it's behind auth, and already marked `noindex,nofollow`).

### 4. Apache routing on shared hosting

Your `public/.htaccess` already handles SPA fallback correctly (`RewriteRule ^ index.html [L]`). After prerendering, real `/team/index.html`, `/contact/index.html` etc. exist as static files, so Apache will serve them directly on first load and the SPA takes over after hydration. Refreshing any deep link (e.g. `/team/elena-rossi`) keeps working — either a prerendered HTML file is served, or the `.htaccess` SPA fallback kicks in.

### 5. Build script

`package.json` `scripts.build` stays as `vite build`. The new Vite config produces:

```
dist/
├── index.html
├── about/index.html         (prerendered)
├── team/index.html          (prerendered)
├── team/elena-rossi/index.html  (prerendered per slug)
├── our-work/index.html      (prerendered)
├── portfolio/index.html     (prerendered)
├── contact/index.html       (prerendered)
├── admin/index.html         (SPA shell only)
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── favicon.png
├── team/                    (your portrait images from public/)
│   ├── elena-rossi.jpg
│   └── ...
└── .htaccess
```

You upload **everything inside `dist/`** into `public_html/` and the site runs end-to-end, including the admin panel writing to Lovable Cloud.

## What stays the same

- All your route files in `src/routes/` (no rewrites needed)
- All components in `src/components/`
- Lovable Cloud / Supabase database, auth, storage, `team_members` table
- The admin panel functionality (it's already pure client-side Supabase calls)
- `.htaccess` (already correct for SPA on Apache)
- Favicon and team photos in `public/`

## Trade-offs you should know

- **No SSR**: Initial HTML for non-prerendered routes will be a blank shell that hydrates in the browser. Prerendering covers your current static pages, but if you later add new routes you must add them to the prerender list.
- **Dynamic routes**: For `/team/$slug`, the prerender step queries Supabase at build time. New team members added via admin **after** the build will work in the SPA but won't have their own prerendered HTML until you rebuild and re-upload.
- **No edge/server functions**: You won't be able to add `createServerFn` workflows later without re-introducing a server runtime. All backend work must go through Lovable Cloud (Supabase).

## Files I will create / change

- ✏️ `vite.config.ts` — switch to plain Vite SPA config with router + tailwind plugins
- ✏️ `package.json` — remove `@tanstack/react-start` and `@cloudflare/vite-plugin`; add `vite-plugin-prerender` (or equivalent) and `react-helmet-async` usage
- 🆕 `index.html` — SPA entry at project root
- 🆕 `src/main.tsx` — client bootstrap (QueryClient + RouterProvider)
- ✏️ `src/routes/__root.tsx` — remove SSR shell, keep route + providers, add client-side head manager
- 🗑️ `src/integrations/supabase/client.server.ts` — delete (server-only, unused on client)
- 🗑️ `src/integrations/supabase/auth-middleware.ts` — delete (server-only, unused)
- 🗑️ `wrangler.jsonc` — delete (no longer deploying to Cloudflare Workers)
- ✅ `public/.htaccess` — keep as-is (already correct)

## After you approve

1. I'll make the changes above.
2. Run `bun run build`.
3. You'll get a flat `dist/` folder. Copy its contents into `public_html/` on your hosting and the site (with admin) will work immediately against your Lovable Cloud backend.

⚠️ Note: the **Lovable preview** in this editor will still work after the switch (it just runs Vite's dev server in SPA mode instead of SSR). But this is a one-way architectural change — going back to SSR/server functions later would require reverting these files.