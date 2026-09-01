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

## Deployment notes

- Vercel build config is in `vercel.json` (`npm run build`, publish `_site`)
- GitHub Pages workflow starter remains in `.github/workflows/gh-pages.yml.sample`

## Contact form webhook setup

The `/contact/` page posts to `/api/contact`, which forwards inquiries to Discord without storing data in a database.
If Discord delivery fails, the endpoint retries once and then returns an error to the form (which shows the direct-email fallback). Failed delivery attempts are written to Vercel function logs (`console.error`) with inquiry metadata.

Set this environment variable in Vercel:

- `DISCORD_WEBHOOK_URL` — your private Discord incoming webhook URL

Optional:

- `CONTACT_FORM_SOURCE` — source label included in Discord notifications (defaults to `jonmccon.com`)
