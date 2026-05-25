
## Why Vercel returns 404

Your project is a Lovable TanStack Start template configured for **Cloudflare Workers**:

- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which bundles `@cloudflare/vite-plugin`.
- `wrangler.jsonc` declares `main: "src/server.ts"` — a Workers `fetch` handler.
- `src/server.ts` exports `export default { fetch }` (Workers shape), not a Node server.

The Vercel build succeeds because Vite still produces `dist/client/*` and `dist/server/*`, but Vercel has:
- no Worker runtime to execute `src/server.ts`,
- no `index.html` at the output root (TanStack Start is SSR-only, it never emits one),
- no framework preset that knows how to serve TanStack Start.

So every URL — including `/` — resolves to nothing and Vercel returns `404 NOT_FOUND`. This is a runtime/output mismatch, not a routing typo, missing permission, or deleted deployment.

There is no small `vercel.json` tweak that fixes this. The Lovable template does not ship a Vercel adapter, and swapping the Cloudflare plugin for a Vercel/Node adapter would diverge from the Lovable preset and likely break preview + future Lovable updates.

## Recommended path (pragmatic, keeps Vercel as your front door)

Use Vercel as a **redirect/proxy layer** in front of the Lovable-hosted app, which already runs SSR correctly at `https://zyra-elin-studio.lovable.app`.

Two viable Vercel-only setups:

### Option A — Vercel rewrite proxy (recommended)

Keep the repo as-is. Add a single `vercel.json` at the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "https://zyra-elin-studio.lovable.app/$1" }
  ]
}
```

In Vercel project settings:
- Framework Preset: **Other**
- Build Command: *(leave empty)*
- Output Directory: *(leave empty)*
- Install Command: *(leave empty)*

Result: visitors hitting `your-vercel-domain.com/...` get the SSR HTML from Lovable, but the URL bar stays on Vercel. Your custom domain can be attached on Vercel as usual.

### Option B — Vercel redirect (simpler, URL changes)

```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://zyra-elin-studio.lovable.app/$1", "permanent": false }
  ]
}
```

Visitors are sent to the `.lovable.app` URL. Easiest to set up, but the address bar changes — usually not desired if you've already wired Vercel to a custom domain.

## What I will change in the repo

Only one file:

1. **Create `vercel.json`** at the project root with the Option A rewrite config above.

I will not touch:
- `vite.config.ts`, `wrangler.jsonc`, `src/server.ts`, or `src/start.ts` (they keep the project building cleanly on Lovable and Cloudflare).
- Any application code, routes, or styling.

## What you need to do on Vercel after I push

1. Open the Vercel project → **Settings → General**.
2. Set Framework Preset to **Other** and clear Build/Install/Output commands.
3. Redeploy (Deployments → ⋯ → Redeploy).
4. Visit your Vercel domain — it should now serve the full site.

## If you instead want true Vercel-native hosting (no Lovable backend in the loop)

That requires removing `@cloudflare/vite-plugin`, switching to a Node/Vercel adapter for TanStack Start, rewriting `src/server.ts`, and adding `vercel.json` with a Node function. This diverges from the Lovable template and is likely to break with future Lovable updates. I do not recommend it unless you plan to fork off Lovable hosting entirely. Tell me if you want this path and I will plan it out separately.
