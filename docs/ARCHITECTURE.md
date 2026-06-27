# Site Architecture

Portfolio and process site for [jonmccon.com](https://jonmccon.com), built with Eleventy 3.

---

## Technology stack

| Layer | Technology |
|---|---|
| Static site generator | Eleventy `^3.1.2` |
| Runtime | Node 22 (`.nvmrc`, `package.json` engines) |
| Templates | Nunjucks (`.njk`) + Markdown (`.md`) |
| Markdown template engine | Nunjucks (pre-processes `.md` files) |
| Image pipeline | `@11ty/eleventy-img ^6.0.4` |
| Photo lightboxes | PhotoSwipe `^5.4.4` |
| Syntax highlighting | `@11ty/eleventy-plugin-syntaxhighlight` (Prism/Okaidia theme) |
| Navigation plugin | `@11ty/eleventy-navigation` |
| Bundle plugin | `@11ty/eleventy-plugin-bundle` |
| RSS/JSON feeds | `@11ty/eleventy-plugin-rss` |
| HTML base paths | `EleventyHtmlBasePlugin` |
| HTML parsing (filters) | `jsdom ^26.1.0` |
| Date formatting | `luxon ^3.7.1` |
| Heading anchors | `markdown-it-anchor ^9.2.0` |
| Deployment | Netlify (`netlify.toml`), Lighthouse CI plugin |

---

## Directory layout

```
obair-lann-monny/
├── content/                   # All pages and markdown (Eleventy input dir)
│   ├── index.njk              # Homepage — uses layouts/home.njk
│   ├── about.md               # About page
│   ├── blog.njk               # Design archive (/design/)
│   ├── process.njk            # Process archive (/process/)
│   ├── galleries.njk          # Photo galleries index (/galleries/)
│   ├── tags.njk               # Tag archive pages (/tags/<tag>/)
│   ├── tags-list.njk          # Tag list page
│   ├── 404.md                 # 404 page
│   ├── sitemap/               # Sitemap template
│   ├── feed/                  # RSS + JSON feed templates
│   ├── blog/                  # Design/project posts → /projects/<slug>/
│   │   ├── blog.11tydata.js   # Directory data: tag=posts, layout=post.njk
│   │   └── <Slug>/<Slug>.md   # One folder per post, file matches folder name
│   ├── inProgress/            # Process/journal posts → no permalink set in data file
│   │   ├── inProgress.11tydata.js  # Directory data: tag=process, layout=post.njk
│   │   └── <YYMMDD>/<name>.md # Dated folder, filename is topic-slug
│   ├── galleries/             # Photo gallery pages → /galleries/<slug>/
│   │   ├── galleries.11tydata.js  # Directory data: tag=galleries, layout=gallery.njk
│   │   └── <category-folder>/<name>.md
│   └── stacks/                # Stacked-papers pages
│       └── demo.md            # Demo for stacked.njk layout
│
├── _includes/                 # Templates and partials
│   ├── layouts/               # Page layouts (extend base.njk)
│   │   ├── base.njk           # Root layout: nav, head, CSS/JS injection
│   │   ├── home.njk           # Homepage newspaper card grid
│   │   ├── post.njk           # Blog/process post with metadata header
│   │   ├── archive.njk        # Thin wrapper — just renders content
│   │   ├── gallery.njk        # Photo gallery with PhotoSwipe + sibling nav
│   │   ├── stacked.njk        # Stacked-papers interactive layout
│   │   └── home-archive.njk   # Legacy homepage archive (kept for reference)
│   ├── projectsPilesGrid.njk  # Active design archive: randomly piled image stacks
│   ├── projectsGrid.njk       # Card grid with thumbnail + metadata
│   ├── projectsList.njk       # Compact text+thumbnail list
│   ├── projectsThumbGrid.njk  # Dense image-only thumbnail grid
│   ├── projectsStackGrid.njk  # Stacked-paper preview grid (includes demo card)
│   ├── projectStackPreview.njk # Macro: mini stacked papers card for a single project
│   ├── postslist.njk          # Simple `<ul>` list of posts (used by archive/tags)
│   └── imageBlend.njk         # Full collections.images grid (unused on homepage)
│
├── _data/                     # Global data files (available in all templates)
│   ├── metadata.js            # Site title, URL, language, description, author
│   ├── profile.js             # Portrait URL, headline, card word thresholds
│   ├── photoCategories.js     # Ordered gallery category definitions (key, title, URL, cover)
│   └── password.js            # Optional page password: reads PAGE_PASSWORD env var, returns SHA-256 hash
│
├── public/                    # Static assets (passthrough copied to _site root)
│   ├── css/
│   │   ├── index.css          # Main stylesheet
│   │   ├── message-box.css    # Message/alert box styles
│   │   ├── photoswipe-gallery.css  # Gallery grid layout styles
│   │   ├── prism-diff.css     # Prism diff syntax highlight override
│   │   ├── project-piles.css  # Piled image stacks design archive styles
│   │   ├── project-stacks.css # Stacked-paper grid styles
│   │   └── stacked.css        # Stacked-papers layout styles
│   ├── js/
│   │   ├── stacked.js         # Stacked-papers client-side navigation
│   │   └── view-transitions.js # View Transitions API helper
│   └── img/                   # Static images (logos etc.)
│
├── docs/                      # Project documentation
│   ├── ARCHITECTURE.md        # This file
│   ├── CONTENT-INVENTORY.md   # Post inventory with dates
│   └── STACKED-LAYOUT.md      # Stacked layout usage guide
│
├── eleventy.config.js         # Main Eleventy config (plugins, filters, shortcodes, collections)
├── eleventy.config.drafts.js  # Draft-exclusion plugin
├── eleventy.config.images.js  # Image shortcode plugin
├── netlify.toml               # Netlify build + Lighthouse CI config
├── package.json               # Dependencies and npm scripts
├── .nvmrc                     # Node version pin (22)
└── README.md                  # Quick-start guide
```

---

## Content sections and URLs

| Section | Source directory | URL pattern | Collection tag | Layout |
|---|---|---|---|---|
| Design / Projects | `content/blog/` | `/projects/<slug>/` | `posts` | `post.njk` |
| Process / Journal | `content/inProgress/` | auto (no permalink override) | `process` | `post.njk` |
| Photo galleries | `content/galleries/` | `/galleries/<slug>/` | `galleries` | `gallery.njk` |
| Single photo pages | `content/gallery-photo.njk` (pagination) | `/galleries/<gallery-slug>/<photo-slug>/` | — (excluded) | `photo.njk` |
| Stacked pages | `content/stacks/` | set in frontmatter | — | `stacked.njk` |
| Design archive index | `content/blog.njk` | `/design/` | — | `archive.njk` |
| Process archive index | `content/process.njk` | `/process/` | — | `archive.njk` |
| Galleries index | `content/galleries.njk` | `/galleries/` | — | `archive.njk` |
| Homepage | `content/index.njk` | `/` | — | `home.njk` |
| About | `content/about.md` | `/about/` | — | `base.njk` |
| Tags | `content/tags.njk` | `/tags/<tag>/` | — | `archive.njk` |
| RSS feed | `content/feed/feed.njk` | `/feed/feed.xml` | — | — |
| JSON feed | `content/feed/json.njk` | `/feed/feed.json` | — | — |
| Sitemap | `content/sitemap/` | `/sitemap.xml` | — | — |

> **Note:** `blog.11tydata.js` sets the permalink for `content/blog/` posts to `/projects/{{ page.filePathStem.replace('/blog/', '/') }}/`. The URL section slug comes from the folder name (e.g. `content/blog/AIGA-Seattle/AIGA-Seattle.md` → `/projects/AIGA-Seattle/`).

---

## Eleventy collections

Defined in `eleventy.config.js`:

| Collection name | Source | Purpose |
|---|---|---|
| `projects` | `getFilteredByTag("posts")` | All design/project posts (from `content/blog/`) |
| `featuredProjects` | `getFilteredByTag("featured")` | Posts with `featured: true` frontmatter |
| `process` | `getFilteredByTag("process")` | All process/journal posts (from `content/inProgress/`) |
| `aboutPages` | filter `url == "/about/"` | The about page content (used on homepage) |
| `galleries` | `getFilteredByTag("galleries")` | All gallery pages (from `content/galleries/`) |
| `galleryPhotos` | `_data/galleryPhotos.js` (filesystem scan) | Flat array of all per-photo metadata — drives single-photo page pagination |
| `images` | async — scans all `item.data.images` frontmatter | Processed image URLs for homepage grid and project cards |

The `images` collection is async: it processes every image declared in every page's `images:` frontmatter array through `@11ty/eleventy-img` (output: JPEG at original size, or GIF with animation). Each entry contains `{ url, src, alt, date }`.

---

## Layout inheritance

```
base.njk
├── home.njk          (homepage newspaper grid)
├── post.njk          (design + process posts)
├── archive.njk       (thin — renders content only)
├── gallery.njk       (photo gallery + sibling nav)
├── photo.njk         (standalone single-photo page)
├── stacked.njk       (interactive stacked papers)
└── home-archive.njk  (legacy, kept for reference)
```

All layouts set `layout: layouts/base.njk` in their own front matter.

---

## Shortcodes

Defined in `eleventy.config.js` and `eleventy.config.images.js`:

| Shortcode | Type | Purpose |
|---|---|---|
| `{% image src, alt %}` | async | Standard responsive image (JPEG/GIF). In post context adds `lightbox-trigger` class. Defined in `eleventy.config.images.js`. |
| `{% heroImage src %}` | async | Returns processed image URL (not `<img>` tag) for CSS backgrounds. Used in layouts. |
| `{% homepageImage src, alt %}` | async | 160px-wide JPEG/GIF with `class="newspaper-image"`. Used in homepage cards. |
| `{% gallery "name" %}...{% endgallery %}` | paired | Wraps gallery content in PhotoSwipe-enabled `<div>`. Injects PhotoSwipe init + URL-sync script. |
| `{% galleryImage src, alt %}` | async | Orientation-aware thumbnail+lightbox image pair. Adds `id="photo-<slug>"`, `data-photo-slug`, `data-photo-url`, `data-deep-link-url` attributes for URL sync and deep-linking. |
| `{% currentBuildDate %}` | sync | Returns current ISO timestamp (used in feeds). |

---

## Filters

Defined in `eleventy.config.js`:

| Filter | Purpose |
|---|---|
| `readableDate` | Format JS Date with Luxon token (default: `dd LLLL yyyy`) |
| `htmlDateString` | Format JS Date as `yyyy-LL-dd` for `<time datetime>` |
| `wordCount` | Count words in HTML string (strips tags first) |
| `stripHomepageMedia` | Remove `<picture>`, `<img>`, `<iframe>`, `<script>` from HTML (for homepage card excerpts) |
| `head` | Return first `n` items of array |
| `min` | Return smallest number from args |
| `getAllTags` | Return all unique tags from a collection |
| `filterTagList` | Filter out internal tags: `all`, `nav`, `post`, `posts`, `galleries` |
| `shuffle` | Fisher-Yates shuffle of an array |

---

## Global data (`_data/`)

| File | Key in templates | Contents |
|---|---|---|
| `metadata.js` | `metadata` | `title`, `url`, `language`, `description`, `author` |
| `profile.js` | `profile` | `portraitUrl`, `headline`, `wideCardWordThreshold` (180), `tallCardWordThreshold` (220) |
| `photoCategories.js` | `photoCategories` | Array of `{key, title, description, url, cover}` — defines `/galleries/` landing page and gallery sibling nav |
| `galleryPhotos.js` | `galleryPhotos` | Flat array of all gallery photo metadata. Auto-scanned from `content/galleries/` at build time. Drives single-photo page generation via pagination. |
| `password.js` | `password` | `{hash, enabled}` — reads `PAGE_PASSWORD` env var, SHA-256 hash for optional per-page protection |

---

## Frontmatter conventions

### Blog/design posts (`content/blog/`)

```yaml
---
title: Project Title
description: One-line summary
category: ClientName
date: YYYY-MM-DD
tags:
  - tagname           # at least one; drives tag pages
images:
  - src: "content/blog/<Slug>/image.jpg"
    alt: "Optional alt text"
draft: false          # true = excluded from production builds
---
```

`pileOrder:` (optional) — array of image index integers controlling pile display order in `projectsPilesGrid.njk`.  
`bgColor:` (optional) — CSS suffix for background color class on post articles.  
`featured: true` (optional) — marks post for `featuredProjects` collection and larger card in `projectsGrid.njk`.

### Process/inProgress posts (`content/inProgress/`)

Same fields as above. `category: inprogress` is used for most existing posts. No permalink is set in `inProgress.11tydata.js`, so Eleventy uses the default (`/inProgress/<folder>/<file>/`).

### Gallery pages (`content/galleries/`)

```yaml
---
title: Gallery Title
description: Short description
date: YYYY-MM-DD
---
```

Tags and layout are set by `galleries.11tydata.js`. Gallery images use the `{% galleryImage %}` shortcode inside a `{% gallery %}` block. Each `{% galleryImage %}` call derives a stable photo slug from the source filename (e.g. `./0022.jpg` → slug `0022`).

### Stacked-papers pages (`content/stacks/`)

```yaml
---
layout: layouts/stacked.njk
title: Page Title
permalink: /stacks/my-page/
stackedItems:
  - title: "Paper title"
    date: YYYY-MM-DD        # optional
    content: "<p>HTML content.</p>"
---
```

See `docs/STACKED-LAYOUT.md` for full usage guide.

---

## Gallery photo routing

Every photograph in the `/galleries/*` section has two unique URLs:

| URL form | Pattern | Purpose |
|---|---|---|
| **Standalone page** | `/galleries/<gallery-slug>/<photo-slug>/` | A fully rendered HTML page for the individual photo, indexable by search engines and shareable as a direct link |
| **Deep-link (preview)** | `/galleries/<gallery-slug>/#photo-<photo-slug>` | Opens the parent gallery page with that photo automatically opened in the PhotoSwipe lightbox |

### Photo slug

The photo slug is derived from the source image filename without extension (e.g. `0022.jpg` → `0022`). Slugs are stable as long as filenames are not changed. To override a slug, rename the image file.

### Data source: `_data/galleryPhotos.js`

At build time, `_data/galleryPhotos.js` scans every subdirectory of `content/galleries/`, collects all image files (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`), and emits a flat array of photo metadata objects. Each object includes:

| Field | Value |
|---|---|
| `gallerySlug` | Gallery URL slug (from the `.md` filename in the folder) |
| `slug` | Photo slug (source filename without extension) |
| `src` | `content/`-relative path for use with `{% image %}` |
| `alt` | Default alt text (`<gallery-slug> — photo <slug>`) |
| `index` | 0-based position within the gallery (sorted by filename) |
| `total` | Total photo count for the gallery |
| `prevSlug` / `nextSlug` | Adjacent photo slugs for prev/next navigation |
| `galleryUrl` | Parent gallery URL |
| `url` | Canonical standalone page URL |
| `deepLinkUrl` | Hash URL that opens the gallery with this photo in preview |

### Page generation

`content/gallery-photo.njk` uses Eleventy pagination (`size: 1`) over `galleryPhotos` to generate one standalone HTML page per photo. Pages use `layouts/photo.njk` and are excluded from all collections (`eleventyExcludeFromCollections: true`).

### Gallery rendering

The `{% galleryImage src, alt %}` shortcode adds these attributes to every `<a>` element in the gallery grid:

- `id="photo-<slug>"` — anchor target for the `#photo-<slug>` deep-link
- `data-photo-slug="<slug>"` — used by the URL-sync script to identify the photo
- `data-photo-url="/galleries/<gallery-slug>/<slug>/"` — standalone page URL
- `data-deep-link-url="/galleries/<gallery-slug>/#photo-<slug>"` — preview hash URL

### Lightbox URL sync (client-side)

The `{% gallery %}` shortcode injects inline JavaScript that:

1. **Updates the browser URL** (`history.replaceState`) to `#photo-<slug>` whenever the lightbox navigates to a new photo (via the `pswpOpen` + PhotoSwipe `change` event).
2. **Restores the gallery URL** (no hash) when the lightbox is closed (via the PhotoSwipe `close` event).
3. **Auto-opens the lightbox** at the correct photo on page load if the URL contains a `#photo-<slug>` hash (deep-link behavior).

### Adding photos to a gallery

1. Copy the image file (e.g. `0200.jpg`) into the gallery folder (`content/galleries/<gallery-slug>/`).
2. Add a `{% galleryImage "./0200.jpg", "Alt text" %}` line to the gallery's `.md` file inside the `{% gallery %}` block.
3. The image filename becomes its stable slug. **Do not rename image files** after publishing; doing so breaks both the standalone URL and any existing deep-links.
4. Run `npm run build`. The new photo page is generated at `/galleries/<gallery-slug>/0200/` automatically — no code changes needed.

---

## Draft behavior

Controlled by `eleventy.config.drafts.js`:

- **`npm run build`** — excludes all pages with `draft: true` (sets `eleventyExcludeFromCollections: true` and `permalink: false`)
- **`npm run start`** — includes drafts (sets `BUILD_DRAFTS` env var)
- Folder name (`inProgress/`) does **not** auto-exclude. Only the frontmatter flag matters.

---

## Image pipeline

`@11ty/eleventy-img` handles all image processing at build time:

- Output formats: **JPEG** (all images) or **GIF** (animated, when source is `.gif`)
- Webp/AVIF are intentionally disabled for faster builds
- Output directory: `_site/img/`
- URL path: `/img/`
- Processed images are cached between builds

Image path resolution rules (in `eleventy.config.images.js` `image` shortcode):
1. Full URL → fetch directly
2. `content/` prefix → resolve from repo root
3. Otherwise → resolve relative to the calling template's input path

---

## CSS architecture

All CSS lives in `public/css/` and is passed through to `_site/css/`.

| File | Purpose |
|---|---|
| `index.css` | Main stylesheet: base styles, typography, nav, homepage newspaper grid, post layout |
| `project-piles.css` | Piled image stacks for design archive (`projectsPilesGrid.njk`) |
| `project-stacks.css` | Stacked-paper mini preview grid (`projectsStackGrid.njk`) |
| `stacked.css` | Full stacked-papers layout (`stacked.njk`) |
| `photoswipe-gallery.css` | Photo gallery grid layout |
| `prism-diff.css` | Syntax highlighting diff overrides |
| `message-box.css` | Message/notification box styles |

Some CSS is injected inline via Eleventy's bundle plugin (`{%- css %}{% include ... %}{% endcss %}`). This is used in layout files to conditionally include page-specific CSS:
- `post.njk` inlines Prism and diff CSS
- `gallery.njk` inlines `photoswipe-gallery.css`
- `blog.njk` inlines `project-piles.css`
- `stacked.njk` inlines `stacked.css`

---

## JavaScript

| File | Loaded via | Purpose |
|---|---|---|
| `public/js/stacked.js` | `<script src>` in `stacked.njk` | Stacked-papers nav: prev/next/reset, keyboard shortcuts, flip animation |
| `public/js/view-transitions.js` | `base.njk` (assumed) | View Transitions API for page navigation animations |
| `node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js` | passthrough → `/js/` | PhotoSwipe lightbox init |
| `node_modules/photoswipe/dist/photoswipe.esm.min.js` | passthrough → `/js/` | PhotoSwipe core |
| Inline in `projectsPilesGrid.njk` | embedded `<script>` | Piled image layout: deterministic hash-based transform, tag filtering |

---

## Navigation

The site uses `@11ty/eleventy-navigation`. Nav entries are set via `eleventyNavigation` frontmatter:

| Page | Key | Order |
|---|---|---|
| Process | Process | 1 |
| Design | Design | 2 |
| About | About | 3 |
| Photos | Photos | 6 |

Navigation rendering is in `base.njk`.

---

## Deployment

- **Platform:** Netlify
- **Build command:** `npm run build`
- **Publish dir:** `_site`
- **Lighthouse CI:** runs on all deploys; thresholds are set to 1.0 (100%) for performance, accessibility, best-practices, and SEO — builds fail if any score drops below 100%
- **GitHub Actions:** a sample workflow (`gh-pages.yml.sample`) exists for GitHub Pages but is not active

---

## Design archive component variants

The design archive (`/design/`) currently uses `projectsPilesGrid.njk`. Several alternative components exist and are available:

| Component | Visual style | Used where |
|---|---|---|
| `projectsPilesGrid.njk` | **Active** — randomly piled image stacks with tag filtering | `blog.njk` → `/design/` |
| `projectsGrid.njk` | Card grid with thumbnail + title + description + year | Available for use |
| `projectsList.njk` | Compact thumbnail + title rows | Available for use |
| `projectsThumbGrid.njk` | Dense image-only thumbnail grid | Available for use |
| `projectsStackGrid.njk` | Stacked-paper mini previews | Available for use |

To swap the design archive layout, edit `blog.njk` and replace the included component.

---

## Homepage layout

The homepage (`content/index.njk` → `layouts/home.njk`) renders a newspaper-style grid of cards:

1. **About card** — portrait + headline + about page excerpt (from `collections.aboutPages`)
2. **Project cards** — one card per `collections.projects` entry (reverse chronological). Cards with `> 180 words` get a `newspaper-card-wide` class. Images from `post.data.images` rendered with `homepageImage`.
3. **Process cards** — one card per `collections.process` entry. Cards with `> 220 words` get `newspaper-card-tall`.

Post body content is stripped of `<picture>`, `<img>`, `<iframe>`, `<script>` tags via the `stripHomepageMedia` filter before display in cards.

---

## Password protection

Optional, per-page. Requires:
1. `PAGE_PASSWORD` environment variable set at build/serve time
2. Frontmatter `protected: true` on the page to protect
3. `base.njk` checks `password.enabled` and renders a password prompt if protection is active

Hash is SHA-256 of the password, computed at build time in `_data/password.js`.
