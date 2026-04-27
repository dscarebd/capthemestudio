
## Why you get 403 Forbidden on `/team` refresh

When you visit `https://capthemestudio.xyz/` and click "Team", React Router handles the navigation client-side — Apache is never asked for `/team`. But when you **refresh** `/team`, the browser asks Apache for a real folder/file at `/team`. Since:

- There is no `team` folder in your `public_html`
- Directory listing is disabled (correctly)
- `.htaccess` SPA fallback is **not being applied**

…Apache returns **403 Forbidden** instead of serving `index.html`.

This is **not a code bug** — your `public/.htaccess` is correctly written. The problem is on your hosting / upload side. One of these is true:

1. **`.htaccess` was not uploaded** to `public_html` (most common — hidden files are skipped by default in FTP and cPanel File Manager).
2. **`mod_rewrite` is not enabled** on your Apache hosting.
3. **`AllowOverride`** is set to `None` in the server config, so `.htaccess` is ignored.

---

## What I'll change in code

I'll make the `.htaccess` more robust and self-diagnosing so it works on more hosts:

### 1. Make `.htaccess` more compatible
- Remove the `<FilesMatch "^\.">` block (some shared hosts misinterpret it and lock out `.htaccess` itself)
- Add `DirectoryIndex index.html` explicitly (prevents 403 when Apache can't find a default file)
- Add `Options +FollowSymLinks` (required by `mod_rewrite` on some hosts)
- Use `RewriteRule ^ /index.html [L]` with leading slash (more reliable on subdirectory installs)
- Keep `ErrorDocument 404 /index.html` as a final fallback (handles cases where `mod_rewrite` is disabled)

### 2. Add an `index.html` fallback rule
Even if `mod_rewrite` is fully disabled, `ErrorDocument 404 /index.html` will catch the 404 and serve the SPA shell. We'll make sure the response status stays correct.

### Files modified
- `public/.htaccess` — hardened version

---

## What YOU need to do on your hosting (critical)

After I update the file and you run `bun run build`, when you upload the contents of `dist/` to `public_html`:

### ✅ Step 1 — Make sure `.htaccess` is actually uploaded
- In **cPanel File Manager**: click **Settings** (top right) → check **"Show Hidden Files (dotfiles)"** → click Save. Then verify `.htaccess` exists in `public_html`.
- In **FileZilla / FTP**: menu **Server → Force showing hidden files**.
- The file MUST be at `public_html/.htaccess`, not inside a subfolder.

### ✅ Step 2 — Confirm `mod_rewrite` is enabled
- Most shared hosts (Hostinger, Namecheap, Bluehost, SiteGround, GoDaddy cPanel) have it on by default.
- If unsure, create a test file `public_html/test.php` with `<?php phpinfo(); ?>`, visit it, and search for `mod_rewrite` in the loaded modules list. Delete it after.
- If not enabled, contact your host's support — they enable it instantly.

### ✅ Step 3 — Confirm `AllowOverride All` is set
- This is a server-config setting only your host controls. On 99% of shared hosts, it's already `All` for `public_html`. If `.htaccess` is being ignored despite being uploaded, ask support: *"Please confirm AllowOverride is set to All for my public_html directory."*

### ✅ Step 4 — Test
After upload, visit `https://capthemestudio.xyz/team` directly in a new tab (or refresh). It should now load the React app instead of 403.

---

## After approval

I will update `public/.htaccess` with the hardened version and you can rebuild + re-upload (making sure hidden files are shown).
