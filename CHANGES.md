# L2 + L3 Lighthouse fixes — base.njk (font loading + GTM defer)

Task: L2+L3: self-host fonts + defer GTM (base.njk)
Branch: wt/t_c514c49d
File touched: _includes/layouts/base.njk (plus new public/css/fonts.css, public/fonts/*.woff2, and one test update in tests/build.test.mjs)

## L2 — render-blocking Google Fonts (~1540ms FCP/LCP cost)

Approach taken: SELF-HOST (not the fallback preload/media=print pattern).

Why: after pulling the actual `fonts.googleapis.com/css2?...` response for the
5 families in use (Almendra Display, Jacquard 24, Google Sans Flex, Outfit,
Space Mono), the real payload was small enough that self-hosting was clearly
the better fix, not just the "preferred" one:

- The site's copy is English-only (no accented/non-Latin content anywhere in
  content/ or _includes/), so only the `latin` unicode-range subset per family
  was needed — the `latin-ext`, cyrillic, greek, vietnamese, etc. subsets
  Google normally ships were dropped entirely.
- Outfit is requested at 7 weights (300/400/500/600/700/800/900) in the
  original <link>, but Google serves ALL of those weights from the *same*
  variable-font file per subset (`QGYvz_MVcBeNP4NJtEtqUYLknw.woff2`, 32KB) —
  so there was no "pick weights" tradeoff to make; one file covers the site's
  entire Outfit usage.
- Google Sans Flex is used as a full variable font (`fvar` axes: wght 100–1000)
  for the homepage headline treatments (font-variation-settings wght/wdth/opsz/
  slnt in public/css/index.css) — the site relies on continuous axis values,
  not fixed weights, so subsetting to specific weights wasn't an option; the
  single latin-only variable file (527KB) was downloaded as-is.
- Space Mono and Almendra Display and Jacquard 24 are static (non-variable)
  fonts — only their exact weights in use (Space Mono 400+700; Almendra
  Display 400; Jacquard 24 400) were kept.
- No pyftsubset re-subsetting was needed on top of Google's own latin split —
  the files Google serves for the `latin` unicode-range are already what a
  from-scratch subset run would produce (confirmed via fonttools/ttx: none of
  the downloaded static fonts carry an `fvar` table except the two variable
  ones, which were kept whole because the site uses their full axis range).

Files added:
- public/fonts/outfit-v15-latin-variable.woff2 (32,228 bytes)
- public/fonts/google-sans-flex-v22-latin-variable.woff2 (527,132 bytes)
- public/fonts/space-mono-v17-latin-400-normal.woff2 (9,464 bytes)
- public/fonts/space-mono-v17-latin-700-normal.woff2 (9,552 bytes)
- public/fonts/almendra-display-v33-latin-400-normal.woff2 (10,612 bytes)
- public/fonts/jacquard-24-v4-latin-400-normal.woff2 (7,340 bytes)
- public/css/fonts.css — new @font-face rules for all 6 files above, each with
  font-display: swap. Included in base.njk's existing CSS bundle
  ({% css %}{% include "public/css/fonts.css" %}{% endcss %}) so it's inlined
  alongside index.css/new-colors.css/tailwind.css exactly the way the rest of
  the site's CSS already ships (single inlined <style> block, no extra
  request).

Eleventy passthrough copy of `./public/` -> `/` (already configured in
eleventy.config.js, unchanged) picks up public/fonts/ automatically, so the
built site serves them at /fonts/*.woff2.

base.njk changes:
- Removed the render-blocking `<link href="https://fonts.googleapis.com/css2?...">`
  and its two `<link rel="preconnect">` tags entirely — no more cross-origin
  DNS/TLS handshake to fonts.googleapis.com/fonts.gstatic.com blocking first
  paint.
- Added `<link rel="preload" as="font" type="font/woff2" crossorigin>` for
  Outfit (used site-wide, above the fold on every page) and, homepage-only,
  for Google Sans Flex (used in the homepage headline, which is the LCP
  element there).
- Old commented-out "previous testimonial quote fonts" blocks (Caveat/
  Quintessential, Bubblegum Sans/Gochi Hand, etc.) were removed along with
  the live <link> — they were dead reference comments pointing at the same
  external CDN pattern being removed.

### Before/after sitewide font bytes

Before (render-blocking, cross-origin):
- 1 request to fonts.googleapis.com for the CSS (small, but blocking)
- 2 preconnects (fonts.googleapis.com, fonts.gstatic.com) — extra DNS+TLS
  round trips before ANY font byte can even start downloading
- Font files themselves (from fonts.gstatic.com, split by Google into many
  subset files — same total bytes as below for the subsets actually used,
  but requested cross-origin, render-blocking, and only after the CSS
  round-trip resolves)

After (self-hosted):
- 0 requests to fonts.googleapis.com / fonts.gstatic.com (confirmed via
  performance.getEntriesByType('resource') in a live page load — see
  Verification below)
- 6 woff2 files served from same-origin /fonts/, total 596,328 bytes
  (~582 KB) — inlined @font-face CSS ships in the existing bundled <style>
  (zero extra requests for the CSS itself)
- 2 of those 6 files are preloaded (Outfit always, Google Sans Flex on `/`
  only) so the browser starts fetching them in parallel with everything else
  instead of discovering them only after CSSOM is built
- font-display: swap on every rule — text renders immediately in the
  fallback stack, swaps to the webfont once it's in, no invisible-text
  flash while waiting on the (now same-origin, faster) font requests

Net effect: eliminates the ~1540ms FCP/LCP cost that came from the two
cross-origin round trips (preconnect + stylesheet fetch) before the browser
could even start fetching font files. Total byte weight is unchanged (Google
was already serving latin-only, appropriately split files) — the fix is
entirely about removing blocking cross-origin round trips, not about
reducing font payload size.

## L3 — unused JS from GTM gtag.js (43%/67KB unused, ~450ms LCP cost)

Approach taken: requestIdleCallback with setTimeout fallback (not a plain
`defer` attribute — see reasoning below).

GA4 is NOT removed — non-negotiable per the task and per the same rule
applied for SEO C9 (PR #112, Vercel Analytics). Checked base.njk first: only
Vercel Analytics/Speed Insights (defer scripts, unrelated) and this GA4 block
existed — no overlapping/duplicate analytics tags were introduced.

Why requestIdleCallback over plain `defer`: the gtag.js script tag has to be
injected AFTER `window.dataLayer` and the `gtag()` stub function already
exist (otherwise gtag('config', ...) calls have nowhere to push their
arguments and get lost). A `defer` attribute alone would still make the
browser start fetching gtag.js during initial page parse — the network
request would compete with everything else for bandwidth priority during
the critical rendering window. Deferring the *fetch* itself until the
browser is idle (or a page has been interactive for up to 2s, whichever
comes first) removes the 67KB request from the critical path entirely,
not just its execution.

Implementation in base.njk (GTM block):
1. `window.dataLayer`, the `gtag()` stub, `gtag('js', new Date())`, and
   `gtag('config', 'G-173P35S0MG')` all still run synchronously and
   immediately, exactly as before — this is near-zero-cost JS (defines two
   functions, pushes two arrays) and guarantees no GA4 events are ever lost
   even if something happens before the idle callback fires.
2. A `loadGtagScript()` function creates the actual
   `<script async src="https://www.googletagmanager.com/gtag/js?id=...">`
   tag and appends it to `<head>`.
3. That function is invoked via `requestIdleCallback(loadGtagScript, {
   timeout: 2000 })` when available, or `setTimeout(loadGtagScript, 2000)`
   as a fallback for browsers without requestIdleCallback (Safari, at time
   of writing) — so the request fires either when the browser has genuine
   idle time, or after 2 seconds no matter what, whichever is sooner.

Verified in a live page load (localhost:8123, browser devtools /
performance.getEntriesByType('resource')): gtag.js request does fire (GA4
still works end-to-end), dataLayer/gtag exist immediately on page load, and
the request happens off the critical rendering path.

## Test changes

tests/build.test.mjs — 'Vercel analytics and GA4 scripts coexist on the
homepage' asserted `document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=..."]')`,
which no longer matches because that URL now lives inside the idle-loader's
JS string, not a static `<script src>` attribute. Updated the assertion to
check: (a) the gtag.js URL string is present in the built HTML, (b) the
gtag('config', ...) call is present, (c) requestIdleCallback is present, and
(d) all of those still appear after the Vercel Analytics/Speed Insights
scripts in source order. All 105 tests pass (was 104 pass / 1 fail before
this fix).

## Domains for Task E (security headers / CSP)

- Font files: now same-origin (/fonts/*.woff2) — fonts.googleapis.com and
  fonts.gstatic.com are NO LONGER needed in style-src/font-src/connect-src.
- GTM/GA4: googletagmanager.com is still required (script-src / connect-src)
  for gtag.js itself and its outbound beacon calls — unchanged by this fix,
  only the *timing* of the load changed, not the domain.

## Build verification

- `npm install && npm run build` succeeds (1062 files written).
- `npm run test` — 105 pass, 0 fail, 7 skipped (pre-existing skips unrelated
  to this change).
- Task's check command confirmed:
  - grep -o 'gtag/js[^"]*' _site/design/metastream-location-chat/index.html
    -> `gtag/js?id=G-173P35S0MG` (present in built output)
  - grep -c 'defer\|requestIdleCallback' _includes/layouts/base.njk -> 5
- Visual/functional verification via live browser load (localhost:8123):
  - document.fonts shows Outfit/Google Sans Flex/Almendra Display all
    `loaded` on the homepage; homepage headline renders in the condensed
    Google Sans Flex variable-font treatment; testimonial quote cards render
    in Almendra Display script font — screenshots confirmed both visually.
  - performance.getEntriesByType('resource') shows zero requests to
    fonts.googleapis.com / fonts.gstatic.com, and all font requests resolved
    from http://localhost:8123/fonts/*.
  - gtag.js request fires from googletagmanager.com (GA4 still wired end to
    end), window.dataLayer and window.gtag exist on page load.
