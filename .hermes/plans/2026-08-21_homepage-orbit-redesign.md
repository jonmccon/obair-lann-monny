# Homepage Orbit Redesign — Implementation Plan

> **For Neuromancer Crew:** Assign phases to agents per role guidance below. Each task is a discrete PR-ready unit. All work is in `~/source/obair-lann-monny`. Repo: `https://github.com/jonmccon/obair-lann-monny`. Deploy target: Vercel (auto-deploys on merge to `main`). Always `git checkout main && git pull origin main` before branching.

**Goal:** Refresh the homepage with (1) a punchy phenomenological headline, (2) a true 3D explorable XYZ scatter chart with the designer at center, and (3) energy-matched varied card formats for the semi-featured projects section.

**Stack:** Eleventy 3.1.x, Nunjucks, vanilla JS (no framework), CSS custom properties + Tailwind utility layer. No new dependencies unless specifically called for.

**Crew Assignments:**
- **Case** (senior dev) — Phases 2 & 3 (3D chart engine, data layer)
- **Molly** (frontend) — Phase 1 (headline/copy), Phase 4 (card system)
- **Riviera** (reviewer) — Final review gate before each PR merge
- **Maelcum** (knowledge keeper) — Document all decisions in vault at `20-projects/BOOK/obair-lann-monny.md`
- **Wintermute** (research) — Project data gathering (Phase 2, Task 1)

---

## ❓ Open Questions — jonmccon's answers

1. **Headline final copy** — Working version: *"The work has its own energy. I give it shape."*
   - Continue iterating on this
   - Use a shorter headline to not stop the work
   - This may change later but don't let it block

2. **Project data values** — Use PDF available in discord (LinkedIn profile — durations now verified, see Task 2.1 table)

3. **Semi-featured project selection** — Add additional projects to total 8

4. **Loud card color** — Yellow red blue green, hit with the pure colors and a shade of the same. Framed with off black and black text. Document the colors used in the global CSS colors.

5. **Portrait in chart center** — Use the same image (GitHub CDN link is fine for now)

---

## Phase 1 — Headline Simplification
**Branch:** `feat/headline-position`
**Assigned to:** Molly

### Task 1.1 — Rewrite the headline copy
**Objective:** Replace the canned "operating at the intersection…" headline with a two-sentence phenomenological position statement.

**Files:**
- Modify: `content/index.njk` (frontmatter `introductionHeading` field)
- Modify: `_data/profile.js` (the `headline` fallback field)

**Current value (both locations):**
- `content/index.njk`: `"Operating at the intersection of product strategy, technology, and human behavior"`
- `_data/profile.js`: `"Design, photography, internet, classrooms, studios, food, boats, tools, process, and everything being made."`

**Target copy — headline (two sentences, 12 words or fewer total):**
Use this as the approved direction. The headline should:
- Make a statement about the *nature of the work*, not about the person's job title
- Carry a phenomenological/positional tone (not Buddhist-explicit, not zen-cliché)
- Sentence 1: A universal observation about where interesting things happen
- Sentence 2: jonmccon's relationship to that place — as a shaper/guide, not a job description

**Candidate to iterate from:** *"The work has its own energy. I give it shape."*

**Step 1:** In `content/index.njk`, update `introductionHeading`:
```yaml
home:
  introductionHeading: "The work has its own energy. I give it shape."
```

**Step 2:** In `_data/profile.js`, update the `headline` fallback to match (used on non-home pages):
```js
headline: "The work has its own energy. I give it shape.",
```

**Step 3:** Run local build to verify no Nunjucks error:
```bash
cd ~/source/obair-lann-monny && npm run build
```
Expected: build completes with 0 errors, headline appears in `_site/index.html`.

**Step 4:** Verify render in browser (`npm start`, open `http://localhost:8080`). Confirm headline sits in the center lockup, text wraps cleanly at mobile breakpoints.

**Step 5:** Commit:
```bash
git add content/index.njk _data/profile.js
git commit -m "copy: replace homepage headline with positional two-sentence statement"
```

---

### Task 1.2 — Typography scale for the new headline
**Objective:** The new headline is shorter and punchier — update its CSS so it renders at a larger type size and tighter leading than the previous multi-clause sentence.

**Files:**
- Modify: `public/css/index.css` (search for `.homepage-headline-axis`)

**Step 1:** Find current headline styles:
```bash
grep -n "homepage-headline-axis" ~/source/obair-lann-monny/public/css/index.css
```

**Step 2:** Adjust `font-size` up by ~20% and reduce `line-height` to ~1.1. Two sentences at a big size should feel like a monument, not a paragraph. Example target:
```css
.homepage-headline-axis {
  font-size: clamp(1.6rem, 3.5vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
}
```

**Step 3:** Confirm at 320px, 768px, and 1440px viewports. Text must not overflow the center lockup or overlap axis lines at any breakpoint.

**Step 4:** Commit:
```bash
git add public/css/index.css
git commit -m "style: enlarge headline type for shorter two-sentence copy"
```

---

### Task 1.3 — Write tests for Phase 1
**Objective:** Confirm headline content and type scale are verifiable in the test suite.

**Files:**
- Modify: `tests/build.test.mjs` (or create `tests/homepage-headline.test.mjs`)

**Steps:**

1. Add a test that checks the rendered `_site/index.html` contains the new headline text:
```js
import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage headline', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('contains the new position statement headline', () => {
    assert.ok(
      html.includes('The work has its own energy'),
      'headline not found in rendered HTML'
    );
  });

  it('does not contain the old intersection headline', () => {
    assert.ok(
      !html.includes('Operating at the intersection'),
      'old headline still present'
    );
  });
});
```

2. Run tests:
```bash
npm test
```
Expected: both assertions pass.

3. Commit:
```bash
git add tests/
git commit -m "test: headline copy assertions — new vs old content"
```

---

### Task 1.4 — Push Phase 1 branch (do NOT merge to main)
**Steps:**
1. `git push origin feat/headline-position`
2. `gh pr create --base staging/homepage-orbit --head feat/headline-position --title "feat: replace homepage headline with positional statement" --body "Two-sentence phenomenological POV copy. Larger type scale, tighter leading. Tests confirm old copy removed and new copy present. Targets staging branch — do not merge to main directly."`
3. Assign **Riviera** for awareness. Branch merges into `staging/homepage-orbit` in Phase 4 — not into `main`.
4. Address review comments.

---

## Phase 2 — 3D Explorable Project Chart
**Branch:** `feat/3d-orbit-chart`
**Assigned to:** Case (data layer) + Molly (visual/CSS)

### Task 2.1 — Build the project data schema
**Objective:** Add three new metadata fields to every project markdown file's frontmatter so the 3D chart has real data to plot.

**The three axes:**
- `duration` — number (months). **X axis** — projects stretch horizontally; longer projects are rendered as a **line segment** (not a point) whose length is proportional to duration. Short projects (≤ 3 mo) appear as a dot; long projects (67 mo) extend as a visible bar along the X axis.
- `collaboration` — 0–100. `0` = fully solo, `100` = fully team-led. **Z axis** (depth).
- `medium` — 0–100. `0` = purely technical/engineering, `100` = purely visual/craft. **Y axis.**

**Files to modify (one frontmatter block each):**
All `.md` files under `content/design/*/`.

**Estimated values table — durations verified against LinkedIn PDF (2026-08-21):**

> ⚠️ **Duration corrections from PDF cross-check:** Several original estimates were significantly off. Updated to actual LinkedIn timeline data. See notes column for source.

| Project | duration (mo) | collaboration | medium | duration source |
|---|---|---|---|---|
| google-meet | 7 | 85 | 60 | Jun–Dec 2018 (7 mo) |
| amazon-fire-os | 6 | 90 | 30 | Dec 2018–May 2019 (6 mo) |
| android-gemini | 3 | 70 | 65 | estimate (no LinkedIn entry) |
| lumedic | 14 | 75 | 60 | Dec 2019–Jan 2021 (14 mo) |
| metastream | 67 | 60 | 50 | Jan 2014–Aug 2019 (67 mo) |
| microsoft-learning-platform | 3 | 65 | 65 | Wunderman Feb–Mar 2015 (2 mo) |
| decibel-festival | 3 | 30 | 95 | estimate |
| aiga-seattle | 49 | 40 | 60 | Jun 2011–Jun 2015 (49 mo) |
| awake-chocolate | 2 | 20 | 95 | estimate |
| bakedin | 3 | 30 | 80 | estimate |
| bathroom-brad | 2 | 15 | 90 | estimate |
| seattle-creative-directory | 80 | 25 | 40 | Jan 2020–present (~80 mo) |
| job-intelligence-scraper | 4 | 5 | 30 | estimate |
| ai-assisted-workflows | 6 | 20 | 65 | estimate |
| providence | 21 | 80 | 60 | Sep 2016–May 2018 (21 mo) |
| pwc | 18 | 75 | 45 | Oct 2021–Apr 2023 (18 mo) |
| lyfe | 6 | 40 | 70 | estimate |
| photogrammetry | 3 | 10 | 50 | estimate |
| pixels-of-fury | 2 | 25 | 90 | estimate |
| early-work | 24 | 10 | 85 | estimate |
| a-few-from-western | 6 | 100 | 88 | Sep 2008–Apr 2010 (20 mo) |

> **Note for Wintermute:** Accuracy matters most for `duration` (PDF-verified) then `collaboration`. `medium` estimates are acceptable for v1.

**Step 1:** Add the three fields to each project's frontmatter. Example (`content/design/google-meet/google-meet.md`):
```yaml
chart:
  duration: 7
  collaboration: 85
  medium: 60
```

**Step 2:** Verify Eleventy picks up the fields without error:
```bash
npm run build 2>&1 | grep -i error
```
Expected: 0 errors.

**Step 3:** Commit:
```bash
git add content/design/
git commit -m "data: add chart.duration/collaboration/medium to all project frontmatter"
```

---

### Task 2.2 — Pass chart data to the Nunjucks template
**Objective:** Expose `chart.*` frontmatter fields on each `home-axis-project` article element as `data-*` attributes so the JS engine can read them.

**Files:**
- Modify: `_includes/layouts/home.njk` (the `{% for post in collections.featuredProjects %}` loop)

**Current article markup:**
```html
<article class="home-axis-project" data-axis-project 
  data-project-index="{{ loop.index0 }}" 
  data-project-title="{{ post.data.title | slugify }}" 
  data-project-tags="{{ (post.data.tags | filterTagList | join(',')) | lower }}">
```

**Target — add three new data attributes:**
```html
<article class="home-axis-project" data-axis-project
  data-project-index="{{ loop.index0 }}"
  data-project-title="{{ post.data.title | slugify }}"
  data-project-tags="{{ (post.data.tags | filterTagList | join(',')) | lower }}"
  data-chart-duration="{{ post.data.chart.duration | default(6) }}"
  data-chart-collaboration="{{ post.data.chart.collaboration | default(50) }}"
  data-chart-medium="{{ post.data.chart.medium | default(50) }}">
```

**Step 1:** Make the edit to `_includes/layouts/home.njk`.

**Step 2:** Build and inspect output HTML:
```bash
npm run build && grep -A3 "data-axis-project" _site/index.html | head -30
```
Expected: three new `data-chart-*` attributes visible on each article element.

**Step 3:** Commit:
```bash
git add _includes/layouts/home.njk
git commit -m "template: expose chart data attributes on home axis project elements"
```

---

### Task 2.3 — Rewrite the axis placement engine for true 3D orbit
**Objective:** Replace the current tag-based cluster/centroid placement script with a real 3D coordinate engine. Projects orbit the center. Duration renders as a line width (X). Collaboration drives Z depth. Medium drives Y elevation. The chart is explorable (mouse/touch drag to rotate the 3D space).

**Files:**
- Modify: `_includes/layouts/home.njk` — the `<script>` block at the bottom of the file
- Modify: `public/css/index.css` — new CSS for 3D perspective stage

**Conceptual model:**
```
X axis (left ↔ right)  = duration       (months → rendered as a LINE SEGMENT, not a dot)
Y axis (up ↔ down)     = medium         (0=technical, 100=visual)
Z axis (depth)         = collaboration  (0=solo, 100=team)
```

**Duration as a line, not a point:** Each project node is rendered as a `<div>` with a `width` proportional to its duration. The element stretches along the local X axis in 3D space. Minimum width = 6px (1-month reference); `width = max(6, (duration / MAX_DURATION) * LINE_MAX_PX)`. The line communicates time investment as visual length — long engagements (Metastream 67mo, AIGA 49mo) read as bars; short projects read as near-dots. The center/origin point for each line is at the project's computed coordinate; the line extends from center ±width/2 along the X axis.

**Implementation approach — CSS 3D + JS (no WebGL/Three.js required):**
- `radius = 80px + (collaboration / 100) * 200px` (Z depth from center)
- Collaboration → angle θ on XZ plane (depth)
- Medium → elevation φ (Y)
- Duration → `element.style.width` (X stretch as a line, min 6px, max 200px)
- Mouse/touch drag rotates the stage

**Step 1:** Add perspective CSS to `public/css/index.css`:
```css
.home-axis-stage {
  perspective: 900px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
}
.home-axis-scene {
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
  will-change: transform;
}
```

**Step 2:** Wrap the axis grid and projects in a new `<div class="home-axis-scene" data-axis-scene>` inside the stage in `home.njk`.

**Step 3:** Rewrite the placement script. Replace the entire `<script>` block:
```js
(function () {
  'use strict';

  const stage = document.querySelector('[data-axis-stage]');
  const scene = document.querySelector('[data-axis-scene]');
  const projects = Array.from(document.querySelectorAll('[data-axis-project]'));
  if (!stage || !scene || !projects.length) return;

  const MIN_RADIUS = 80;
  const MAX_RADIUS = 280;
  const MAX_DURATION = 70;   // ~67mo for Metastream is the ceiling
  const LINE_MAX_PX  = 200;  // maximum line width for longest projects

  function toRad(deg) { return deg * Math.PI / 180; }

  function placeProjects() {
    projects.forEach((el) => {
      const duration = Math.min(parseInt(el.dataset.chartDuration     || '6',  10), MAX_DURATION);
      const collab   = parseInt(el.dataset.chartCollaboration || '50', 10) / 100;
      const medium   = parseInt(el.dataset.chartMedium        || '50', 10) / 100;

      // Z axis = collaboration (depth / orbit distance from center)
      const r     = MIN_RADIUS + collab * (MAX_RADIUS - MIN_RADIUS);
      const theta = collab * 2 * Math.PI;
      const phi   = (medium - 0.5) * toRad(126);

      const x = r * Math.cos(phi) * Math.cos(theta);
      const y = r * Math.sin(phi);
      const z = r * Math.cos(phi) * Math.sin(theta);

      // X axis = duration → rendered as a horizontal line segment
      // Minimum 6px so even 1-month projects are visible; scales to LINE_MAX_PX
      const lineWidth = Math.max(6, (duration / MAX_DURATION) * LINE_MAX_PX);

      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      el.style.width      = `${lineWidth}px`;
    });
  }

  let isDragging = false;
  let startX = 0, startY = 0;
  let rotX = -20, rotY = 15;

  function applyRotation() {
    scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  stage.addEventListener('mousedown',  (e) => { isDragging = true; startX = e.clientX; startY = e.clientY; });
  window.addEventListener('mouseup',   ()  => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    rotY += (e.clientX - startX) * 0.4;
    rotX -= (e.clientY - startY) * 0.4;
    startX = e.clientX; startY = e.clientY;
    applyRotation();
  });

  stage.addEventListener('touchstart', (e) => { isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend',  ()  => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    rotY += (e.touches[0].clientX - startX) * 0.4;
    rotX -= (e.touches[0].clientY - startY) * 0.4;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    applyRotation();
  }, { passive: true });

  placeProjects();
  applyRotation();
  window.addEventListener('resize', placeProjects, { passive: true });
})();
```

**Step 4:** Verify in browser — drag the chart. Projects should orbit the face/headline. Confirm nothing overflows the viewport or overlaps the center lockup.

**Step 5:** Commit:
```bash
git add _includes/layouts/home.njk public/css/index.css
git commit -m "feat: replace tag-based axis placement with true 3D orbit engine (CSS transform3d + drag)"
```

---

### Task 2.4 — Axis visual refinement (labels, lines, origin dot)
**Objective:** Update the three axis labels to match the new axis definitions. Remove old label copy ("technology", "human behavior", "product strategy"). Labels appear on hover/idle.

**Files:**
- Modify: `_includes/layouts/home.njk` — the `.home-axis-label` spans
- Modify: `public/css/index.css` — `.home-axis-label` styles

**New labels (intentionally minimal, not fully explanatory):**
```html
<span class="home-axis-label home-axis-label-x">duration ←→</span>
<span class="home-axis-label home-axis-label-y">technical ↔ visual</span>
<span class="home-axis-label home-axis-label-z">solo ↔ team</span>
```

**Step 1:** Update the label spans in `home.njk`.

**Step 2:** Update label CSS — labels should be very small, low-opacity, only readable up close:
```css
.home-axis-label {
  font-size: 0.6rem;
  opacity: 0.35;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.home-axis-stage:hover .home-axis-label {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
```

**Step 3:** Build and verify. Labels should barely read at rest, reveal on hover.

**Step 4:** Commit:
```bash
git add _includes/layouts/home.njk public/css/index.css
git commit -m "style: update axis labels to match new duration/medium/collaboration schema"
```

---

### Task 2.5 — Write tests for Phase 2
**Objective:** Verify chart data attributes are rendered correctly and the 3D scene wrapper exists.

**Files:**
- Create or extend: `tests/homepage-chart.test.mjs`

**Steps:**

1. Write tests:
```js
import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage 3D chart', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('renders the axis scene wrapper', () => {
    assert.ok(html.includes('data-axis-scene'), 'data-axis-scene wrapper missing');
  });

  it('renders data-chart-duration on at least one project', () => {
    assert.ok(html.includes('data-chart-duration'), 'no data-chart-duration attributes found');
  });

  it('renders data-chart-collaboration on at least one project', () => {
    assert.ok(html.includes('data-chart-collaboration'), 'no data-chart-collaboration attributes found');
  });

  it('renders data-chart-medium on at least one project', () => {
    assert.ok(html.includes('data-chart-medium'), 'no data-chart-medium attributes found');
  });

  it('uses new axis labels', () => {
    assert.ok(html.includes('solo'), 'new axis label "solo" not found');
    assert.ok(!html.includes('human behavior'), 'old axis label "human behavior" still present');
  });
});
```

2. Run: `npm test` — all assertions pass.

3. Commit:
```bash
git add tests/
git commit -m "test: 3D chart data attributes and scene wrapper assertions"
```

---

### Task 2.6 — Push Phase 2 branch (do NOT merge to main)
**Steps:**
1. `git push origin feat/3d-orbit-chart`
2. `gh pr create --base staging/homepage-orbit --head feat/3d-orbit-chart --title "feat: 3D orbit chart — real coordinate space with drag navigation" --body "Replaces tag-based scatter with CSS transform3d orbit. Duration=X (line segment width), collaboration=Z (depth), medium=Y. Duration renders as a line — long projects (Metastream 67mo) visibly wider than short ones. Center = jonmccon portrait + headline. Drag to explore. Tests verify data attributes and scene wrapper. Targets staging branch — do not merge to main directly."`
3. Assign **Riviera** for awareness. Branch merges into `staging/homepage-orbit` in Phase 4 — not into `main`.

---

## Phase 3 — Energy-Matched Card System for Semi-Featured Projects
**Branch:** `feat/energy-cards`
**Assigned to:** Molly

### Task 3.1 — Audit and curate the semi-featured projects list
**Objective:** Decide which projects appear in the bottom card section and what energy each one carries. This determines which card format gets applied. Target: 8 projects total.

**Files:**
- Read: `_includes/homeFeaturedProjects.njk` (current rendering logic)
- Read: any project `.md` file that sets `semiFeatured: true` in frontmatter

**Energy taxonomy (5 types):**

| Type | Visual language | Use for |
|---|---|---|
| `loud` | Bold color block, large type, high contrast | Brand work, event work, visual-forward projects |
| `quiet` | Minimal, typographic, lots of white/dark space, micro-detail | Process work, systems work, research |
| `image` | Full-bleed thumbnail, title overlaid | Photo-rich case studies, UI work |
| `badge` | Circular or crest format, tight, almost logo-like | Awards, community orgs, featured talks |
| `artifact` | Dense spec/receipt/document feel, mono type | Technical projects, tools, data work |

**Loud card color direction (jonmccon):** Yellow, red, blue, green — hit with the pure color and a shade of the same. Framed with off-black; black text. Document all colors used in global CSS variables.

**Step 1:** Identify current `semiFeatured` projects. Run:
```bash
grep -rl "semiFeatured" ~/source/obair-lann-monny/content/design/ | sort
```

**Step 2:** For each current semi-featured project, assign an energy type. Add `cardEnergy: loud|quiet|image|badge|artifact` to frontmatter. Example:
- `decibel-festival` → `loud`
- `job-intelligence-scraper` → `artifact`
- `seattle-creative-directory` → `badge`
- `google-meet` → `image`
- `ai-assisted-workflows` → `quiet`

**Step 3:** Ensure there are 8 semi-featured projects total, covering at least 3 different energy types.

**Step 4:** Commit frontmatter changes:
```bash
git add content/design/
git commit -m "data: add cardEnergy field to semi-featured project frontmatter"
```

---

### Task 3.2 — Build the energy card component templates
**Objective:** Create a new Nunjucks include that renders a different card format per `cardEnergy` type.

**Files:**
- Create: `_includes/homeEnergyCard.njk`
- Modify: `_includes/homeFeaturedProjects.njk` (swap current row render for energy card)

**Step 1:** Create `_includes/homeEnergyCard.njk`:
```njk
{# homeEnergyCard.njk — receives: post #}
{% set energy = post.data.cardEnergy | default('image') %}

{% if energy == 'loud' %}
<a href="{{ post.url }}" class="energy-card energy-card--loud">
  <span class="energy-card-label">{{ post.data.client | default('') }}</span>
  <h2 class="energy-card-title">{{ post.data.pageHeadline }}</h2>
  <span class="energy-card-tag">{{ post.data.tags[0] | default('') }}</span>
</a>

{% elif energy == 'quiet' %}
<a href="{{ post.url }}" class="energy-card energy-card--quiet">
  <h2 class="energy-card-title">{{ post.data.pageHeadline }}</h2>
  <p class="energy-card-excerpt">{{ post.data.description | truncate(80) }}</p>
</a>

{% elif energy == 'image' %}
<a href="{{ post.url }}" class="energy-card energy-card--image">
  {% if post.data.thumbnail %}
    <img class="energy-card-img" src="{{ post.data.thumbnail }}" alt="{{ post.data.title }}" loading="lazy" width="600" height="400">
  {% endif %}
  <h2 class="energy-card-title-overlay">{{ post.data.pageHeadline }}</h2>
</a>

{% elif energy == 'badge' %}
<a href="{{ post.url }}" class="energy-card energy-card--badge">
  <span class="energy-card-badge-ring" aria-hidden="true"></span>
  <h2 class="energy-card-title">{{ post.data.pageHeadline }}</h2>
  <span class="energy-card-year">{{ post.data.year | default('') }}</span>
</a>

{% elif energy == 'artifact' %}
<a href="{{ post.url }}" class="energy-card energy-card--artifact">
  <pre class="energy-card-meta">{{ post.data.title }} / {{ post.data.year | default('') }}</pre>
  <h2 class="energy-card-title">{{ post.data.pageHeadline }}</h2>
  <ul class="energy-card-specs">
    {% if post.data.chart %}
      <li>{{ post.data.chart.duration }}mo</li>
      <li>{{ post.data.tags[0] | default('') }}</li>
    {% endif %}
  </ul>
</a>

{% else %}
<a href="{{ post.url }}" class="energy-card energy-card--image">
  <h2 class="energy-card-title">{{ post.data.pageHeadline }}</h2>
</a>
{% endif %}
```

**Step 2:** Update `_includes/homeFeaturedProjects.njk` to use the new component:
Replace the current `<a href... home-featured-row>` block with:
```njk
{% for post in featuredPosts | reverse %}
  {% include "homeEnergyCard.njk" %}
{% endfor %}
```

**Step 3:** Build and check for render errors:
```bash
npm run build 2>&1 | grep -i "error\|warn"
```

**Step 4:** Commit:
```bash
git add _includes/homeEnergyCard.njk _includes/homeFeaturedProjects.njk
git commit -m "feat: add energy card component with 5 format types (loud/quiet/image/badge/artifact)"
```

---

### Task 3.3 — Style the energy card types
**Objective:** Write CSS for all five card formats. Cards should feel like different artifacts — not a uniform grid with slight variations.

**Files:**
- Create: `public/css/energy-cards.css`
- Modify: `public/css/index.css` — add `@import` for `energy-cards.css`

**Step 1:** Create `public/css/energy-cards.css` with these base styles and per-type variants:

```css
/* ── Base card shell ────────────────────────────── */
.energy-card {
  display: block;
  position: relative;
  text-decoration: none;
  overflow: hidden;
  border-radius: 2px;
  transition: transform 0.18s ease;
}
.energy-card:hover { transform: translateY(-2px); }

/* ── Layout: auto-flow masonry-ish grid ────────── */
.home-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-auto-rows: 200px;
  gap: 12px;
}
/* Loud + image cards span 2 columns when room exists */
.energy-card--loud,
.energy-card--image { grid-column: span 2; }

/* ── LOUD card ──────────────────────────────────── */
/* Colors: pure yellow/red/blue/green + shade, framed with off-black, black text */
/* Document each color used as a CSS custom property in :root in index.css */
.energy-card--loud {
  background: #f0d000; /* --card-loud-yellow — override per-project with inline style */
  color: #111;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.energy-card--loud .energy-card-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}
.energy-card--loud .energy-card-title {
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  line-height: 1.05;
  font-weight: 700;
  margin: 0.25rem 0 0;
}

/* ── QUIET card ─────────────────────────────────── */
.energy-card--quiet {
  background: var(--color-surface, #1a1a1a);
  color: var(--color-text, #e8e8e8);
  padding: 1.75rem;
  border: 1px solid rgba(255,255,255,0.08);
}
.energy-card--quiet .energy-card-title {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.3;
}
.energy-card--quiet .energy-card-excerpt {
  font-size: 0.75rem;
  opacity: 0.5;
  margin-top: 0.75rem;
  line-height: 1.5;
}

/* ── IMAGE card ─────────────────────────────────── */
.energy-card--image {
  background: #111;
  grid-row: span 2;
}
.energy-card--image .energy-card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}
.energy-card--image:hover .energy-card-img { opacity: 1; }
.energy-card--image .energy-card-title-overlay {
  position: absolute;
  bottom: 1rem; left: 1rem; right: 1rem;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

/* ── BADGE card ─────────────────────────────────── */
.energy-card--badge {
  background: #0d0d0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.12);
  text-align: center;
  padding: 1.5rem;
}
.energy-card-badge-ring {
  width: 80px; height: 80px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.25);
  margin-bottom: 0.75rem;
}
.energy-card--badge .energy-card-title {
  font-size: 0.8rem;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #e8e8e8;
}
.energy-card--badge .energy-card-year {
  font-size: 0.6rem;
  opacity: 0.4;
  margin-top: 0.5rem;
  letter-spacing: 0.1em;
}

/* ── ARTIFACT card ──────────────────────────────── */
.energy-card--artifact {
  background: #0c0c0c;
  padding: 1.25rem;
  border: 1px solid rgba(255,255,255,0.06);
  font-family: var(--font-mono, monospace);
}
.energy-card-meta {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.04em;
  white-space: pre;
  margin: 0 0 0.75rem;
}
.energy-card--artifact .energy-card-title {
  font-size: 0.85rem;
  color: #e8e8e8;
  line-height: 1.3;
}
.energy-card-specs {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: flex;
  gap: 0.75rem;
}
.energy-card-specs li {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

**Step 2:** Add import to `public/css/index.css`:
```css
@import 'energy-cards.css';
```

**Step 3:** Verify build. Spot-check 3 card types render correctly at desktop and mobile.

**Step 4:** Commit:
```bash
git add public/css/energy-cards.css public/css/index.css
git commit -m "style: energy card CSS — 5 card formats (loud, quiet, image, badge, artifact)"
```

---

### Task 3.4 — Responsive collapse for energy grid
**Objective:** On mobile, all cards collapse to a single column. Span-2 cards lose their span. Tall image cards reduce height.

**Files:**
- Modify: `public/css/energy-cards.css`

**Step 1:** Add mobile overrides at the bottom of `energy-cards.css`:
```css
@media (max-width: 640px) {
  .home-featured-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 180px;
  }
  .energy-card--loud,
  .energy-card--image {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

**Step 2:** Test at 320px viewport. All cards should be readable, no overflow.

**Step 3:** Commit:
```bash
git add public/css/energy-cards.css
git commit -m "style: responsive collapse for energy card grid at mobile"
```

---

### Task 3.5 — Write tests for Phase 3
**Objective:** Verify energy card component renders correctly.

**Files:**
- Create: `tests/homepage-energy-cards.test.mjs`

**Steps:**

1. Write tests:
```js
import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage energy cards', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('renders at least one energy card', () => {
    assert.ok(html.includes('energy-card'), 'no energy card elements found');
  });

  it('does not render old home-featured-row elements', () => {
    assert.ok(
      !html.includes('home-featured-row'),
      'old home-featured-row still present — energy cards may not have replaced them'
    );
  });

  it('renders at least two different card energy types', () => {
    const types = ['energy-card--loud', 'energy-card--quiet', 'energy-card--image', 'energy-card--badge', 'energy-card--artifact'];
    const found = types.filter(t => html.includes(t));
    assert.ok(found.length >= 2, `Only ${found.length} card type(s) rendered — need at least 2`);
  });
});
```

2. Run: `npm test` — all assertions pass.

3. Commit:
```bash
git add tests/
git commit -m "test: energy card render assertions — types, count, old markup removal"
```

---

### Task 3.6 — Push Phase 3 branch (do NOT merge to main)
**Steps:**
1. `git push origin feat/energy-cards`
2. `gh pr create --base staging/homepage-orbit --head feat/energy-cards --title "feat: energy-matched card system for semi-featured projects" --body "Five card formats (loud/quiet/image/badge/artifact) driven by cardEnergy frontmatter. Replaces uniform home-featured-row. Responsive grid collapse at 640px. Tests verify card types and old markup removal. Targets staging branch — do not merge to main directly."`
3. Assign **Riviera** for awareness. Branch merges into `staging/homepage-orbit` in Phase 4 — not into `main`.

---

## Phase 4 — Integration & QA → Staging PR
**Branch:** `feat/homepage-integration`
**Assigned to:** Case + Riviera

> 🚨 **Merge strategy:** No phase branch merges directly to `main`. All three feature branches (`feat/headline-position`, `feat/3d-orbit-chart`, `feat/energy-cards`) are merged into a single **`staging/homepage-orbit`** integration branch. Phase 4 tests run against that combined branch. Only the staging branch gets a PR to `main`, and only after Riviera signs off on full integration and then assigns to jonmccon to merge.

### Staging branch setup
```bash
git checkout main && git pull origin main
git checkout -b staging/homepage-orbit
git merge feat/headline-position
git merge feat/3d-orbit-chart
git merge feat/energy-cards
# Resolve any conflicts, then push
git push origin staging/homepage-orbit
```

### Task 4.1 — Integration checklist
- [ ] Headline renders in 3D chart center at all breakpoints
- [ ] 3D chart drag works on desktop (mouse) and mobile (touch)
- [ ] Duration renders as a **line segment** — long projects (Metastream, AIGA) are visibly wider than short ones
- [ ] Z axis (collaboration) correctly controls orbit depth
- [ ] Energy cards appear below chart with correct format per project
- [ ] No CSS variable conflicts between `energy-cards.css` and `index.css`
- [ ] Build time < 30s (`time npm run build`)
- [ ] Accessibility — run `axe` in DevTools or `npx axe-core-cli http://localhost:8080`
- [ ] Vercel preview smoke-tested on iOS Safari

### Task 4.2 — Performance check
**Objective:** Confirm the 3D JS and new card CSS don't meaningfully degrade LCP or CLS.

1. Run Lighthouse on `http://localhost:8080` via Chrome DevTools
2. Target: LCP < 2.5s, CLS < 0.1
3. If 3D placement runs before images load, defer it with `requestAnimationFrame`

### Task 4.3 — Write integration tests for Phase 4
**Objective:** Full build smoke test verifying all three features coexist.

**Files:**
- Modify: `tests/build.test.mjs`

**Steps:**

1. Add an integration assertion block:
```js
describe('homepage integration', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('headline, 3D chart, and energy cards all present', () => {
    assert.ok(html.includes('The work has its own energy'), 'headline missing');
    assert.ok(html.includes('data-axis-scene'), '3D scene wrapper missing');
    assert.ok(html.includes('energy-card'), 'energy cards missing');
  });

  it('at least one project has data-chart-duration set', () => {
    assert.ok(html.includes('data-chart-duration'), 'no duration attributes found');
  });
});
```

2. Run full suite: `npm test`
3. Commit:
```bash
git add tests/
git commit -m "test: integration smoke test — headline + 3D chart + energy cards coexist"
```

### Task 4.4 — Open the single staging PR to main
```bash
git push origin staging/homepage-orbit
gh pr create \
  --base main \
  --head staging/homepage-orbit \
  --title "feat: homepage orbit redesign — headline + 3D chart + energy cards" \
  --body "Integrates all three homepage update branches into one testable PR before merge to main.

## Included
- feat/headline-position — two-sentence phenomenological headline, larger type scale
- feat/3d-orbit-chart — CSS transform3d orbit; duration=X line, medium=Y, collaboration=Z
- feat/energy-cards — 5 card format types (loud/quiet/image/badge/artifact)

## Axis design
Duration renders as a **horizontal line segment** (not a point). Long projects (Metastream 67mo, AIGA 49mo) appear as bars; short projects appear as near-dots. Z axis = collaboration depth.

## Tests
All phase tests + integration smoke test pass on this branch.

## Review
Do NOT merge to main until: Riviera approves, Vercel preview verified on iOS Safari, Lighthouse LCP < 2.5s. Then assign to jonmccon for final approval."
```
Assign **Riviera** for review. Do NOT merge. When all integration checklist items are ✅, assign to jonmccon for final merge to main.

---

## File Change Summary

| File | Change |
|---|---|
| `content/index.njk` | Headline copy update |
| `_data/profile.js` | Headline fallback update |
| `content/design/*/[project].md` | Add `chart:` frontmatter block (all ~21 projects) |
| `_includes/layouts/home.njk` | Data attributes + 3D script + scene wrapper |
| `_includes/homeFeaturedProjects.njk` | Delegate to energy card component |
| `_includes/homeEnergyCard.njk` | **New** — energy card component (5 formats) |
| `public/css/index.css` | Headline type scale + 3D perspective CSS + energy-cards import |
| `public/css/energy-cards.css` | **New** — all five card format styles |
| `tests/homepage-headline.test.mjs` | **New** — headline copy assertions |
| `tests/homepage-chart.test.mjs` | **New** — 3D chart data attribute assertions |
| `tests/homepage-energy-cards.test.mjs` | **New** — energy card render assertions |

---

*Plan created: 2026-08-21. Author: Hermes Agent. Project: BOOK. Session: homepage orbit redesign ideation → plan. Last synced from vault: 2026-08-21.*
