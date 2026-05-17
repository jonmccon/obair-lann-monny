# obair-lann-monny

Portfolio and process site for [jonmccon.com](https://jonmccon.com), built with Eleventy.

## Current stack

- Eleventy `^3.1.2`
- Node `22` (see `.nvmrc` and `package.json` engines)
- Nunjucks + Markdown content
- `@11ty/eleventy-img` image pipeline
- PhotoSwipe for gallery lightboxes

## Site features

- Homepage with image grid sourced from frontmatter `images` metadata (`collections.images`)
- Featured projects section (`collections.featuredProjects`)
- Process archive (`/process/`, `collections.process`)
- Design archive (`/design/`, `collections.projects`)
- Photo category pages (`/galleries/` + individual gallery pages)
- RSS + JSON feeds (`/feed/feed.xml`, `/feed/feed.json`)
- Tag pages and sitemap
- Optional per-page password protection (frontmatter `protected` + `password.hash`)

## Project structure

- `/content` — pages, projects, process notes, and galleries
- `/_includes` — layouts and shared templates
- `/_data` — global data files (`metadata`, `photoCategories`, etc.)
- `/public` — passthrough static assets
- `/scripts/obsidian-bridge.cjs` — Obsidian sync/watch tooling
- `/.github/copilot-instructions.md` — agent-specific operating instructions

## Local development

```bash
npm install
npm run build
npm run start
```

Dev server: `http://localhost:8080`

## Scripts

- `npm run build` — production build to `_site`
- `npm run start` — local dev server (`--serve --quiet`)
- `npm run debug` — verbose Eleventy build logs
- `npm run debugstart` — verbose dev server logs
- `npm run benchmark` — Eleventy benchmark output
- `npm run build-ghpages` — build with GitHub Pages path prefix
- `npm run obsidian:sync` — one-time Obsidian content sync
- `npm run obsidian:watch` — polling watch + sync
- `npm run obsidian:watch:publish` — watch + sync + git autopublish

## Content conventions

### Draft behavior

Draft handling is frontmatter-driven (`draft: true`), not folder-driven:

- `npm run build` excludes content with `draft: true`
- `npm run start` includes drafts in serve/watch mode

### Image handling

- Use `{% image "./file.jpg", "Alt text" %}` (or absolute repo path from root)
- Frontmatter gallery images are declared under `images:`
- Current image outputs are optimized JPEG (and GIF passthrough for animated GIFs)

> Do not wrap Nunjucks shortcodes in HTML comments (`<!-- -->`); Nunjucks still evaluates them.
> Use Nunjucks comments (`{# ... #}`) or delete the line.

## Obsidian authoring bridge

Default vault path:

- `OBSIDIAN_VAULT_PATH`, or fallback `./obsidian/vault`

Expected vault folders:

- `blog/` → `content/blog/<slug>/<slug>.md`
- `inProgress/` → `content/inProgress/<slug>/<slug>.md`

Sync validations include:

- required frontmatter (`title`, `description`, `date`, `tags`, `category`, `draft`)
- `tags` format validation
- existence checks for `images:` sources and `{% image %}` shortcode sources

## Deployment notes

- Netlify build config is in `netlify.toml` (`npm run build`, publish `_site`)
- GitHub Pages workflow starter remains in `.github/workflows/gh-pages.yml.sample`
