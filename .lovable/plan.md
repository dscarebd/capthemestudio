## Why `npm install` fails on your Mac

When we converted the project from TanStack Start (SSR) to a static SPA, `package.json` was updated, but **`package-lock.json` still contains the old SSR packages**:

- `@tanstack/react-start@1.167.39`
- `@tanstack/react-start-client`, `react-start-server`, `react-start-rsc`
- `@tanstack/start-plugin-core@1.167.34`
- `@lovable.dev/vite-tanstack-config@1.2.0`

These older packages pin `@tanstack/router-plugin@1.167.22`, but our SPA setup needs `@tanstack/router-plugin@^1.167.27` (which itself needs `@tanstack/react-router@^1.168.24`). npm refuses to resolve these conflicting requirements.

`bun install` (used inside Lovable) is more lenient about peer dependency mismatches, which is why it didn't surface there.

## Fix

1. **Delete the stale `package-lock.json`** — it's the source of truth for the conflict and is now out of sync with our SPA `package.json`.
2. **Remove `bun.lockb`** for the same reason (so both package managers regenerate cleanly).
3. **Regenerate a fresh lockfile** by running `bun install` once inside the project (Lovable's standard).
4. (Optional) Verify `package.json` no longer references any `@tanstack/react-start*` or `@lovable.dev/vite-tanstack-config` — already confirmed clean.

After that, on your local Mac you have two options:

**Option A (recommended): use bun locally too**
```
bun install
bun run build
```

**Option B: keep using npm** — then locally run:
```
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps   # only needed first time, then plain npm install works
npm run build
```

The `--legacy-peer-deps` flag is a safety net only required if a transitive package still has a strict peer range; with the lockfile regenerated, plain `npm install` should also succeed.

## Files that will change
- Delete: `package-lock.json`
- Delete: `bun.lockb`
- Regenerate: `bun.lockb` (auto, via `bun install`)

No source code changes — this is purely a dependency-cleanup task.

## After deploy
Re-run `bun run build`, then upload everything from `dist/` (including hidden `.htaccess`) to your `public_html/`. Your admin panel and routing will work exactly the same.
