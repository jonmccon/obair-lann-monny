# Copilot instructions for `obair-lann-monny`

Use this file as the primary repo guide for agent tasks.

## Environment and build

- Runtime: Node `22`
- Install: `npm install`
- Production build: `npm run build`
- Dev server: `npm run start` (http://localhost:8080)
- Debug build: `npm run debug`
- Debug dev server: `npm run debugstart`

Always run `npm run build` before and after code changes.

## What this site is

Eleventy `^3.1.2` portfolio site with:

- Homepage image grid from `collections.images`
- Design archive (`/design/`), Process archive (`/process/`), and photo galleries (`/galleries/`)
- Featured projects + gallery category cards on homepage
- RSS/JSON feeds, tags pages, sitemap
- Obsidian bridge tooling for markdown sync

## Key directories

- `content/` — all pages and markdown content
- `_includes/layouts/` — `base.njk`, `home.njk`, `archive.njk`, `post.njk`, `gallery.njk`
- `_data/` — metadata and shared data
- `public/` — copied static assets
- `scripts/obsidian-bridge.cjs` — sync/watch/autopublish bridge

## Draft and publish behavior

Draft control is `draft: true` frontmatter:

- `npm run build` excludes drafts
- `npm run start` includes drafts

`inProgress/` is a content area and is **not** auto-excluded by folder name.

## Image rules

- Use `{% image "./file.jpg", "Alt text" %}` in markdown content
- Frontmatter `images:` powers homepage image collection
- Current output formats are JPEG (and GIF for animated GIF sources)
- Missing image references break workflows (especially Obsidian sync validation)

Never HTML-comment Nunjucks image shortcodes. Use Nunjucks comments (`{# ... #}`) or remove the shortcode.

## Obsidian workflow

Scripts:

- `npm run obsidian:sync`
- `npm run obsidian:watch`
- `npm run obsidian:watch:publish`

Vault mapping:

- `blog/*.md` → `content/blog/<slug>/<slug>.md`
- `inProgress/*.md` → `content/inProgress/<slug>/<slug>.md`

Default vault root is `OBSIDIAN_VAULT_PATH` or `./obsidian/vault`.
