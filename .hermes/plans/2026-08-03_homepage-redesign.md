# Homepage Redesign — Structure-First Plan
**Repo:** `~/source/obair-lann-monny`  
**Files to edit:** `_includes/layouts/home.njk`, `content/index.njk`, `public/css/index.css`  
**Branch:** `feat/homepage-structure-v2`  
**Status:** Questions answered ✅ — ready to execute.

Vault copy (with answers): `20-projects/BOOK/Feedback/homepage-redesign-plan.md`

---

## Goal

Restructure the homepage so a hiring manager landing cold understands who Jonny is, sees the most relevant work, hears the podcast voice, and gets to all work — all in one confident scroll. Content will be fleshed out later; this plan locks in the right structure first.

---

## Proposed Page Flow (top → bottom)

```
1. [AXIS HERO]        — Smaller (~30vh), dot-based scatter chart. Headline + portrait in center.
2. [INTRO TEXT]       — 3–4 sentences. Name, arc, stakes.
3. [FEATURED WORK]    — 4 project slots. Thumbnail + 1-line tagline.
4. [CTA ROW]          — "See all work →"
5. [PODCAST FEATURE]  — Full card treatment. SCD logo cover + description + players.
6. [ASIDE ROW]        — Obsidian plugin, slim footnote-weight, no card.
7. [CONTACT LINKS]    — Email / GitHub / LinkedIn (keep as-is).
```

---

## Decisions (all answered)

### Q1 — Axis dot behavior ✅
**Answer:** Each dot = a circular cropped image (portrait-style, circle mask). On hover: image "opens" from circle to square and a title chip appears. No navigation until click.

**Implementation notes:**
- `.home-axis-project` renders a single `<img>` clipped to `border-radius: 50%`
- Hover CSS: `border-radius` transitions `50% → 4px`, container expands, `.home-axis-project-title` fades in
- Use the project's first image from `post.data.images[0]` (already available in the loop)
- Transition: `border-radius 0.22s ease, width 0.22s ease`
- Title chip: same `.home-axis-project-title` styles but `display: block` on hover (currently `display: none`)

---

### Q2 — Featured project count ✅
**Answer:** Hold 4 slots now. Providence + SCD are live; Google Meet + Resonance AI are placeholders.

**Placeholder card behavior:** If `homeFeatured: true` but no `thumbnail:` and no images, render a card with `--surface-color-alt` background + project title + "Case study coming soon" in muted text. This gives the correct visual weight without broken images.

**4 projects to flag with `homeFeatured: true`:**
1. `content/design/Providence/providence.md`
2. `content/design/Seattle-Creative-Directory/scd.md`
3. `content/design/Google-Meet/google-meet.md`
4. `content/design/resai/resonance-ai.md`

---

### Q3 — Podcast cover image ✅
**Answer:** Use SCD monogram logo from Figma (node `1486:409`).

**Already downloaded to:** `public/img/podcast/scd-podcast-cover.png` (29KB, 1000×1000 PNG)  
**Web path:** `/img/podcast/scd-podcast-cover.png`

The mark: bold "SCD" letterforms inside a tall pill/capsule, black on white. Distinctive, reads at small sizes, ties directly to the Seattle Creative Directory brand. Works as-is — no color treatment needed.

---

### Q4 — Intro text copy ✅
**Answer:** Draft 2–3 options for Jonny to pick from.

**Draft A — Arc-led:**
> I'm Jonny McConnell. I've spent 15 years designing products where the stakes are real — ER platforms for Providence Health, interfaces for Google and Amazon, and systems for communities that don't have a lot of margin for error. I work at the intersection of user research, product strategy, and hands-on prototyping.

**Draft B — Practice-led:**
> Product designer and creative technologist, 15+ years. I've shipped operating system experiences at Amazon, real-time communication tools at Google, and healthcare platforms for clinical teams at Providence. My work lives at the intersection of complex systems and the humans who depend on them.

**Draft C — Voice-led (more conversational):**
> I design products at the intersection of technology, human behavior, and product strategy — which sounds abstract until you're in an ER at 2am trying to read the right record. I've worked at Google, Amazon, and Microsoft, and spent a decade before that on healthcare, civic tech, and enterprise platforms. This is that work.

→ **Store in `index.njk` `introductionText` field.** Jonny picks one and can revise before going live. Wire Draft B as the default placeholder since it's most factual/safe.

---

### Q5 — Tagline field ✅
**Answer:** Use existing `description:` field as-is. No new frontmatter field. Jonny will update the `description:` values on each featured project once the structure is built.

**Template reads:** `post.data.description` directly — no fallback chain needed.

**Current placeholder values (to be updated by Jonny after build):**
- Providence: `"Videochat in the ER"`
- SCD: `"Learning react for fun"`
- Google Meet: *(check current value)*
- Resonance AI: *(check current value)*

---

## Section-by-Section Build Spec

### 1. Axis Hero

**CSS on `.home-axis-stage`:**
```css
min-height: clamp(300px, 30vh, 420px);
max-height: clamp(300px, 30vh, 420px);
```

**Template change in `home.njk`:** Replace the pile article block with a dot-image article:
```njk
<article class="home-axis-project" ...>
  <a class="home-axis-project-link" href="{{ post.url }}">
    <div class="home-axis-dot">
      {% if post.data.images and post.data.images.length %}
        {% homepageImage post.data.images[0].src, post.data.title, 80, "home-axis-dot-img" %}
      {% endif %}
    </div>
    <span class="home-axis-project-title">{{ post.data.title }}</span>
  </a>
</article>
```

**CSS for dot:**
```css
.home-axis-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  transition: border-radius 0.22s ease, width 0.22s ease, height 0.22s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  background: var(--surface-color-alt);
}
.home-axis-dot-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.home-axis-project-link:hover .home-axis-dot {
  border-radius: 4px;
  width: 72px;
  height: 54px;
}
.home-axis-project-title { display: none; }
.home-axis-project-link:hover .home-axis-project-title { display: block; }
```

**Remove from `home.njk`:** The `home-see-all-link` div (currently inside the axis stage). It will be a standalone CTA row instead.

**Axis label CSS:** bump to `font-size: 0.85rem`.

---

### 2. Intro Text Block

**`index.njk` frontmatter:**
```yaml
home:
  introductionHeading: "Operating at the intersection of product strategy, technology, and human behavior"
  introductionText: "Product designer and creative technologist, 15+ years. I've shipped operating system experiences at Amazon, real-time communication tools at Google, and healthcare platforms for clinical teams at Providence. My work lives at the intersection of complex systems and the humans who depend on them."
  featuredProjectThumbnailLimit: 12
```

The `introductionText` renders via the existing `{% if introductionText %}<p class="homepage-about">` block in `home.njk`. No template change needed.

---

### 3. Featured Projects Grid

**New partial:** `_includes/homeFeaturedProjects.njk`

```njk
{% set featuredPosts = collections.projects | selectattr("data.homeFeatured") %}
{% if featuredPosts.length %}
<section class="home-featured-grid" aria-label="Featured work">
  {% for post in featuredPosts | reverse %}
  <a href="{{ post.url }}" class="home-featured-card">
    <div class="home-featured-thumb">
      {% if post.data.thumbnail %}
        <img src="{{ post.data.thumbnail }}" alt="{{ post.data.title }}" loading="lazy" width="400" height="300">
      {% elif post.data.images and post.data.images.length %}
        {% homepageImage post.data.images[0].src, post.data.title, 400, "home-featured-img" %}
      {% else %}
        <div class="home-featured-placeholder"></div>
      {% endif %}
    </div>
    <div class="home-featured-meta">
      <span class="home-featured-title">{{ post.data.title }}</span>
      {% if post.data.description %}<span class="home-featured-tagline">{{ post.data.description }}</span>{% endif %}
    </div>
  </a>
  {% endfor %}
</section>
{% endif %}
```

**CSS:**
```css
.home-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}
.home-featured-card {
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 0.6rem;
}
.home-featured-thumb {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--surface-color-alt);
  border-radius: 6px;
}
.home-featured-thumb img,
.home-featured-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.home-featured-placeholder { width: 100%; height: 100%; background: var(--surface-color-alt); }
.home-featured-title {
  font-size: 0.9375rem;
  font-weight: var(--font-weight-semibold);
  display: block;
}
.home-featured-tagline {
  font-size: 0.8125rem;
  color: var(--text-color-muted);
  display: block;
  line-height: 1.4;
}
@media (max-width: 640px) {
  .home-featured-grid { grid-template-columns: 1fr; }
}
```

**Frontmatter to add to 4 projects:**
```yaml
homeFeatured: true
homeTagline: "..."
```

---

### 4. CTA Row

Add after `{% include "homeFeaturedProjects.njk" %}` in `home.njk`:

```njk
<div class="home-cta-row">
  <a href="/design/">See all work <span aria-hidden="true">→</span></a>
</div>
```

Reuse existing `.home-see-all-link a` styles (or alias `.home-cta-row a` to same values).

---

### 5. Podcast Feature Card

Replace the current `.home-supporting-media-card` block in `home.njk` with:

```njk
<section class="home-podcast-feature" aria-label="Podcast">
  <div class="home-podcast-grid">
    <div class="home-podcast-cover">
      <img src="/img/podcast/scd-podcast-cover.png" alt="Seattle Creative Directory Podcast" width="300" height="300">
    </div>
    <div class="home-podcast-copy">
      <h2 class="home-podcast-title">Seattle Creative Directory Podcast</h2>
      <p class="home-podcast-desc">Conversations with Seattle's working creative community — designers, founders, makers, and the people building culture in the Pacific Northwest.</p>
      <iframe class="home-supporting-player" height="200" width="100%" frameborder="no" scrolling="no" seamless src="https://player.simplecast.com/9fc38fe1-df84-4a61-8348-b4a888606182?dark=false" title="SCD Podcast episode 1"></iframe>
      <iframe class="home-supporting-player" height="200" width="100%" frameborder="no" scrolling="no" seamless src="https://player.simplecast.com/a8c63034-9b6c-4d56-b3ed-e440f6a3e031?dark=false" title="SCD Podcast episode 2"></iframe>
      <a class="home-supporting-link home-podcast-all-link" href="https://seattlecreative.directory/podcast" target="_blank" rel="noreferrer">All episodes ↗</a>
    </div>
  </div>
</section>
```

**CSS:**
```css
.home-podcast-feature {
  padding: 2rem 0;
  border-top: 1px solid var(--anp-crust);
}
.home-podcast-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
}
.home-podcast-cover {
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-color-alt);
}
.home-podcast-cover img { width: 100%; display: block; }
.home-podcast-title {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: var(--font-weight-bold);
  margin: 0 0 0.5rem;
}
.home-podcast-desc {
  font-size: 0.9375rem;
  color: var(--text-color-muted);
  line-height: 1.5;
  max-width: 52ch;
  margin: 0 0 1rem;
}
.home-podcast-all-link { margin-top: 0.5rem; display: inline-block; }
@media (max-width: 640px) {
  .home-podcast-grid { grid-template-columns: 1fr; }
  .home-podcast-cover { max-width: 160px; }
}
```

---

### 6. Obsidian Plugin Aside

Replace the entire `.home-supporting-feature` article with:

```njk
<aside class="home-aside-row">
  <span class="home-aside-label">Also</span>
  <a href="https://community.obsidian.md/plugins/time-blocks" target="_blank" rel="noreferrer">
    Obsidian Time Blocks — a lightweight time-blocking plugin for focused work in Obsidian.
  </a>
</aside>
```

**CSS:**
```css
.home-aside-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  padding: 1rem 0;
  border-top: 1px solid var(--anp-crust);
  font-size: 0.85rem;
  color: var(--text-color-muted);
}
.home-aside-label {
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  flex-shrink: 0;
}
.home-aside-row a {
  color: var(--text-color-muted);
}
.home-aside-row a:hover { color: var(--text-color-link); }
```

---

## Files to Change (final list)

| File | Change |
|------|--------|
| `content/index.njk` | Add `introductionText` (Draft B) |
| `_includes/layouts/home.njk` | Dots in axis; remove `home-see-all-link` from stage; add `homeFeaturedProjects` include + CTA row; replace podcast section with new card; replace Featured Tool with aside |
| `public/css/index.css` | Axis hero height; dot styles; featured grid; podcast card; aside row |
| `content/design/Providence/providence.md` | Add `homeFeatured: true` (update `description:` separately) |
| `content/design/Seattle-Creative-Directory/scd.md` | Add `homeFeatured: true` (update `description:` separately) |
| `content/design/Google-Meet/google-meet.md` | Add `homeFeatured: true` (update `description:` separately) |
| `content/design/resai/resonance-ai.md` | Add `homeFeatured: true` (update `description:` separately) |
| `_includes/homeFeaturedProjects.njk` | New partial |
| `public/img/podcast/scd-podcast-cover.png` | Already downloaded ✅ |

---

## Build Verification Checklist

- [ ] Axis hero renders at ~30vh, dots with circular images, hover expands to square + shows title chip
- [ ] Axis labels legible (0.85rem)
- [ ] Intro text block visible below hero
- [ ] Featured grid: 4 cards, Providence + SCD with real thumbnails, Google Meet + Resonance AI with placeholder bg + "Case study coming soon"
- [ ] CTA row "See all work →" links to `/design/`, outside the axis stage
- [ ] Podcast card: SCD logo cover left, title + description + embeds right
- [ ] Aside row: single line with Obsidian plugin link
- [ ] Contact links still present at bottom
- [ ] Mobile: stack order correct, no overflow

---

## What This Plan Defers

- Content rewrites (Google Meet, Resonance AI, Fire OS)
- PwC password-protected page
- AI practice page
- About page updates (MIT Media Lab, WWU teaching)
- `/design/` index intro paragraph
- Jonny's final intro text copy (Draft B is the build placeholder)
