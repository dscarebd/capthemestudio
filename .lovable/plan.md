## Root cause

Two issues are stacked on top of each other:

1. **Build error → broken `dist/`** — `src/integrations/supabase/auth-middleware.ts` imports from `@tanstack/react-start` (SSR-only). TypeScript fails, the build aborts, so `dist/` is never updated. Whatever you uploaded to `public_html` is either stale or missing files → **blank white page on refresh**.
2. **These files are dead code.** I grepped the entire `src/` — nothing imports `auth-middleware.ts` or `client.server.ts`. They're leftovers from when the app had TanStack Start SSR / server functions. Since we converted to a pure static SPA, they serve no purpose.

The previous attempt installed `@tanstack/react-start` to silence the TS error, but that package belongs to the SSR architecture we already removed. Keeping it re-introduces the original ERESOLVE conflict and bloats the bundle.

## Fix

1. **Delete `src/integrations/supabase/auth-middleware.ts`** — unused SSR middleware.
2. **Delete `src/integrations/supabase/client.server.ts`** — unused service-role admin client (also unsafe to ship in a static SPA — service role key would be exposed). All admin operations in `src/routes/admin.tsx` already use the regular client `@/integrations/supabase/client` with RLS, which is correct.
3. **Remove `@tanstack/react-start` from `package.json`** dependencies (no longer needed in a static SPA).
4. **Run `bun install`** to refresh the lockfile.
5. **Run `bun run build`** to confirm a clean `dist/` is produced.

## After this fix

On your local machine:
```bash
git pull
rm -rf node_modules package-lock.json
npm install
npm run build
```
Then re-upload the **entire** `dist/` contents to `public_html` (including the `.htaccess` file — make sure your FTP shows hidden files). The blank-page-on-refresh issue should be gone because:
- The build now actually completes and produces fresh `index.html` + assets.
- The `.htaccess` we set up earlier rewrites all unknown paths back to `index.html` so client-side routes like `/team` work on refresh.

## Files changed

- ❌ Delete `src/integrations/supabase/auth-middleware.ts`
- ❌ Delete `src/integrations/supabase/client.server.ts`
- ✏️ Edit `package.json` (remove `@tanstack/react-start`)
- 🔄 Regenerate `bun.lockb`
