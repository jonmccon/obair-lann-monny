# jonmccon.com Bug Fix Plan — Page Clipping, Overflow & Performance

> **Context:** Audit completed 2026-08-12. Do not execute any of this yet.
> Findings from WebKit/Playwright full-page audit + curl/HTML source inspection.
> All fixes must retain existing functionality and visual design intent.

**Goal:** Fix five documented bugs across jonmccon.com without changing
any design intent, content, or features. All changes land on a branch,
get reviewed, then merge to main → auto-deploy on Vercel.

**Repo:** `~/source/obair-lann-monny`
**Stack:** Eleventy 3.1.x · Nunjucks · CSS (no frameworks) · Tailwind (resume) · Vercel

---

## Issue Index

| # | Issue | Severity | Where |
|---|-------|----------|-------|
| 1 | `/design/` pile images don't load below the fold | 🔴 High | `project-piles.css`, `_includes/projectsPilesGrid.njk` |
| 2 | `.pile-image` overflows +42px on mobile (375px) | 🔴 High | `project-piles.css` |
| 3 | Mobile homepage: 8 sections overflow +12px horizontally | 🟡 Medium | `public/css/index.css` — `home-*` section widths |
| 4 | Desktop: `home-featured-row-media` overflows +14px at 1440px | 🟡 Medium | `public/css/index.css` — `.home-featured-row-media` |
| 5 | NDA page case study text readable in raw HTML source | 🟡 Medium | `_includes/layouts/base.njk` — `protected-content` arch |

---

## Branch Strategy

Create a single feature branch for all five fixes:

```bash
git checkout -b fix/page-overflow-and-pile-images
```

Commit each fix separately with a descriptive message. Open one PR for review.

---

## Fix 1: `/design/` Pile Images Missing Below Fold

### Root Cause
The `projectsPilesGrid.njk` template and `project-piles.css` use hover-reveal
for stacked pile images. WebKit audit shows only the top ~5 projects render
their pile images; lower-in-page projects show blank white placeholder frames.
Likely cause: images are loaded lazily but the IntersectionObserver threshold
or `loading="lazy"` isn't triggering for pile images that are rendered in CSS
`transform`/`position:absolute` stacks (they may have zero bounding-box height
in layout flow, so the browser never marks them as "in viewport").

### Files to Change
- `_includes/projectsPilesGrid.njk` — check `loading` attribute on pile `<img>` tags
- `public/css/project-piles.css` — verify `.pile-image` containers have explicit height

### Plan

**Step 1: Inspect current pile image markup**

Read `_includes/projectsPilesGrid.njk` and identify:
- What `loading` attribute is set on pile `<img>` tags (likely `loading="lazy"`)
- Whether the pile containers (`.pile-image`) have a defined height in CSS
- Whether `position:absolute` children are inside a `position:relative` container with explicit height

**Step 2: Verify the layout-height theory**

In `public/css/project-piles.css`, find `.pile-image` and the parent `.pile`.
If the parent has no explicit `height` or `min-height`, the IntersectionObserver
has nothing to observe (zero-height box). The fix: ensure the pile wrapper has
a defined height (e.g. `aspect-ratio` or `min-height`).

**Step 3: Fix lazy loading**

Option A (preferred — no JS change): Change `loading="lazy"` → `loading="eager"` on
pile images, OR add `loading="lazy"` with a generous `rootMargin` on a
`<img data-src>` pattern so images load well before they're needed.

Option B: If the container-height theory is confirmed, add explicit height to
the `.pile` wrapper so the IntersectionObserver correctly detects viewport
proximity.

**Step 4: Verify**

Run the WebKit audit script (`/tmp/safari_audit.py`) after the fix and confirm
all project cards on `/design/` show images, not white rectangles.

Also check: `npm run build` still succeeds, no console errors on `/design/`.

**Commit:**
```bash
git add _includes/projectsPilesGrid.njk public/css/project-piles.css
git commit -m "fix: ensure pile images load for all projects below fold on /design/"
```

---

## Fix 2: `.pile-image` Mobile Overflow (+42px at 375px)

### Root Cause
The `.pile-image` absolute-positioned stacked images use offsets, rotations, and
scale transforms that push images outside the parent container on narrow viewports.
The pile container likely doesn't `overflow: hidden` on mobile, letting transformed
images bleed +42px past the card edge.

### Files to Change
- `public/css/project-piles.css` — mobile breakpoint for `.pile-image` / pile container

### Plan

**Step 1: Check current mobile CSS**

In `public/css/project-piles.css`, look for any `@media (max-width: ...)` rules
on `.pile-image`, `.pile`, or the grid card wrapper. Check whether `overflow: hidden`
is set on the containing card at mobile widths.

**Step 2: Apply the fix**

Add or verify `overflow: hidden` on the card/pile wrapper at mobile breakpoints.
Alternatively, reduce the `--offset-x` / `--offset-y` / `--scale` CSS custom property
values for the pile images at narrow viewport. The goal: no image bleeds past its card.

The fix MUST NOT remove the pile/stacking visual effect on desktop — only constrain it
on mobile.

Example approach (inside existing `@media (max-width: 640px)` or similar):
```css
.pile,
.project-pile-card {
  overflow: hidden;
}
```

Or reduce transform offsets on mobile:
```css
@media (max-width: 640px) {
  .pile-image {
    --offset-x: 0px;
    --offset-y: 0px;
  }
}
```

**Step 3: Verify**

Re-run WebKit mobile audit. Confirm `scrollWidth === clientWidth` at 375px on `/design/`.
Visual check: pile images should still stack on mobile, just within card bounds.

**Commit:**
```bash
git add public/css/project-piles.css
git commit -m "fix: contain pile-image transforms within card bounds on mobile"
```

---

## Fix 3: Homepage Mobile Sections Overflow +12px (375px)

### Root Cause
Eight sections on the homepage overflow the 375px viewport by exactly 12px.
The consistent amount across unrelated sections (`home-testimonial-strip`,
`home-featured-grid`, `home-podcast-feature`, etc.) strongly suggests a shared
width mechanism: likely a `width: 100vw` + `margin-left: calc(50% - 50vw)` 
"full-bleed" pattern that adds 12px when the browser counts a scrollbar gutter
on mobile, OR a container/gutter calc that overshoots by 12px on narrow viewports.

### Files to Change
- `public/css/index.css` — `home-featured-grid`, `home-testimonial-strip`,
  `home-podcast-feature` width/margin rules

### Plan

**Step 1: Find the shared pattern**

In `public/css/index.css`, search for `100vw` and `calc(50% - 50vw)`. The
full-bleed trick:
```css
width: 100vw;
margin-left: calc(50% - 50vw);
```
…is a known source of overflow when the page has a vertical scrollbar (the scrollbar
eats ~12–17px on macOS/iOS, making `100vw` wider than the scrollable area).

**Step 2: Apply the fix**

Replace `width: 100vw` with `width: 100%` on affected full-bleed sections, OR
wrap in `overflow-x: hidden` on the body/site-wrapper. 

The safest approach that preserves visual intent:
```css
/* On the full-bleed row sections */
.home-featured-row,
.home-testimonial-strip,
.home-podcast-feature /* etc */ {
  width: 100%;  /* instead of 100vw */
  /* keep margin-left: calc(50% - 50vw) to maintain centering */
}
```

Or at the html/body level (affects whole site):
```css
html {
  overflow-x: hidden;  /* already has overflow-y: scroll — add -x: hidden */
}
```
The `overflow-x: hidden` on `html` is the one-line fix but can mask other issues.
The `width: 100%` replacement is more surgical.

**Step 3: Verify**

WebKit mobile audit: `scrollWidth` should equal `clientWidth` (375px) on `/`.
Visual check: full-bleed sections should still appear edge-to-edge on mobile.

**Commit:**
```bash
git add public/css/index.css
git commit -m "fix: resolve 12px mobile horizontal overflow on homepage full-bleed sections"
```

---

## Fix 4: Desktop Featured Row Media Overflow +14px (1440px)

### Root Cause
The `home-featured-row-media` spans (hover background images for "PROVIDENCE",
"GOOGLE MEET" etc. title rows) overflow the right edge by 14px at 1440px viewport.
The rows use `width: 100vw; margin-left: calc(50% - 50vw)` for full-bleed effect,
same root cause as Fix 3 — scrollbar gutter on desktop adding ~14–17px.

### Files to Change
- `public/css/index.css` — `.home-featured-row`, `.home-featured-row-media`

### Plan

**Step 1: Locate the rule**

In `public/css/index.css`, find `.home-featured-row`. Confirm it uses
`width: 100vw` and the negative-margin centering trick.

**Step 2: Apply the fix**

Same approach as Fix 3 — replace `width: 100vw` with `width: 100%` on
`.home-featured-row` and/or `.home-featured-row-media`. The visual effect
(edge-to-edge title rows with hover image reveal) must be preserved.

Check that `.home-featured-row-media` (the `position: absolute; inset: 0` child)
uses `inset: 0` rather than pixel widths — it should naturally fit within the
parent once the parent is correctly sized.

**Step 3: Verify**

Desktop audit: `right` property of `.home-featured-row-media` elements should
not exceed 1440px. Full-bleed rows should still stretch to browser edges.

Note: Fix 3 and Fix 4 likely share the same CSS change — fixing `.home-featured-row`
`width: 100vw → 100%` may resolve both in one edit. Validate both viewports after
the same change before committing separately.

**Commit:**
```bash
git add public/css/index.css
git commit -m "fix: resolve home-featured-row-media overflow at desktop viewport"
```

---

## Fix 5: NDA Protected Content Readable in HTML Source

### Current Behavior
`/design/pwc-concourse-platform/` and `/design/android-gemini-interaction/` have
`protected: true` in frontmatter. The base layout wraps the case study content in:
```html
<div id="protected-content" hidden>
  [full case study HTML]
</div>
```
Any bot/scraper/AI crawler that reads raw HTML without executing JavaScript
sees the full protected content, bypassing the NDA gate.

`<meta name="robots" content="noindex, nofollow">` is correctly set, which
prevents Google indexing — but Perplexity, ChatGPT, and other AI crawlers
may not honor `noindex`. The underlying issue is that the security model
relies entirely on JS (`hidden` attribute + password form), not server-side.

### Constraint
**Retain full NDA gate functionality** — the splash page, password form,
session storage unlock, and correct visual presentation must all continue
to work after this fix.

### Files to Change
- `_includes/layouts/base.njk` — the `protected` content rendering block
- Possibly `_data/` or a new Eleventy filter — for the hash-compare logic

### Plan

**Step 1: Evaluate the options**

Three approaches, in order of increasing complexity:

**Option A (simplest — X-Robots-Tag header):**  
Add a Vercel `vercel.json` `headers` config to send `X-Robots-Tag: noindex, nofollow`
on protected pages. This supplements the `<meta>` tag. Many AI crawlers honor
HTTP headers more reliably than meta tags. Does NOT fix HTML source exposure —
just improves signal to crawlers.

**Option B (recommended — strip body content from HTML, keep NDA UI):**  
For `protected: true` pages, the Nunjucks template should NOT render the full
`{{ content | safe }}` inside the `protected-content` div at all. Instead,
render a minimal placeholder:
```html
<div id="protected-content" hidden>
  <p>Content available after password verification.</p>
</div>
```
The password-unlock JS currently unhides this div — it would instead need to
**fetch** the actual content after verification. This requires either:
- A separate password-gated content endpoint, OR
- Serving the full content only via a Netlify/Vercel serverless function after
  password hash check

This is a meaningful architecture change. Verify that the client-side password
hash (`crypto.subtle.digest('SHA-256', ...)`) can be preserved — it should be,
since the hash comparison still happens client-side, but the delivery mechanism
changes from "hidden div in HTML" to "fetch on unlock."

**Option C (client-side encryption):**  
Encrypt the protected content at build time using the password as the key
(or a build-time derived key), embed the ciphertext in the HTML, and decrypt
client-side on password entry. This keeps the SSG model but makes the HTML
source unreadable without the key. Adds build-time complexity.

**Recommendation: Start with Option A + add a `<template>` wrapper.**

A middle path between A and B without a serverless function:
- Wrap the protected content in a `<template>` tag instead of a `hidden` div.
- `<template>` content is in the DOM but **not rendered** and **not accessible
  via standard scraping** (it's inert — no images load, no scripts run, and many
  crawlers don't read it).
- JS reads `template.content` and appends it to a target div on unlock.

```html
<template id="protected-content">
  {{ content | safe }}
</template>
<div id="protected-target"></div>
```

JS change:
```js
// Instead of: content.hidden = false;
const tmpl = document.getElementById('protected-content');
const target = document.getElementById('protected-target');
target.appendChild(tmpl.content.cloneNode(true));
```

This is a ~10-line change in `base.njk` + the inline script, preserves all
existing functionality, and makes the content invisible to most scrapers
(though a determined parser reading raw HTML can still find `<template>` tags).

**Step 2: Confirm approach with jonmccon before implementing**

Options A+template is low-risk. Option B requires more work but is more secure.
Confirm which to proceed with before touching `base.njk`.

**Step 3: Implement chosen option**

For the `<template>` approach:
- In `base.njk`, change `<div id="protected-content" hidden>` → `<template id="protected-content">`
- Update the inline `<script>` block: replace `overlay.hidden = true; content.hidden = false;`
  with the `template.content.cloneNode(true)` append pattern
- Test that session storage re-unlock still works on page reload (the
  `sessionStorage.getItem(STORAGE_KEY) === 'true'` path must also clone from template)

**Step 4: Verify**

- `curl -s https://jonmccon.com/design/pwc-concourse-platform/ | grep -i "PwC Concourse" | head -5`
  should return no matches (or only the `<title>` / meta description)
- Browser test: password entry still unlocks the page and shows full content
- Session storage test: refresh after unlock still shows content

**Commit:**
```bash
git add _includes/layouts/base.njk
git commit -m "fix: use <template> for protected content to prevent scraper exposure"
```

---

## PR & Deployment

```bash
git push origin fix/page-overflow-and-pile-images
# Open PR on GitHub: jonmccon/obair-lann-monny
# Title: "fix: page overflow, pile images, and NDA content visibility"
# Link this plan in PR description
```

Vercel auto-deploys preview URL from the branch — test all 5 fixes on the
preview before merging to main.

**Post-merge verification checklist:**
- [ ] `/design/` — all project cards show pile images (scroll to bottom)
- [ ] `/design/` mobile (375px) — no horizontal scroll
- [ ] `/` mobile — no horizontal scroll on any section
- [ ] `/` desktop — featured row hover images don't trigger scrollbar
- [ ] `/design/pwc-concourse-platform/` — NDA splash shows, password unlocks
- [ ] `curl https://jonmccon.com/design/pwc-concourse-platform/ | grep -c "Concourse"` returns 1 (title only)
- [ ] Simplecast podcast players still render (no regression from CSS changes)

---

## Out of Scope (documented, not planned)

- **Simplecast iframe blank space:** The podcast player iframes render correctly
  in WebKit/Safari. The visual blank area seen in Chrome-based browsers may be a
  Simplecast iframe height issue (their embed outputs extra internal whitespace).
  This is a third-party problem. Possible workaround: wrap iframes in a container
  with `overflow: hidden` and a fixed height, but this risks cutting off the player
  on larger screens. Defer until Simplecast embed behavior is better understood.

- **robots.txt:** Currently returns 404. Could add `public/robots.txt` with
  `User-agent: *\nAllow: /`. Low priority — Vercel's default is permissive.
  Not in scope for this PR.

- **Inline CSS payload (58% of page):** This is Eleventy's bundle inlining
  pattern. It's intentional (avoids render-blocking CSS request). Not a bug.

- **`inProgress/` pages in sitemap:** Two in-progress pages are indexed. Review
  whether they should be excluded from `sitemap.xml` (add `eleventyExcludeFromCollections`
  or `noindex` frontmatter). Out of scope for this PR.
