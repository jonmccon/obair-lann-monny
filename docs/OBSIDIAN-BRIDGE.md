# Obsidian Bridge

The Obsidian bridge (`scripts/obsidian-bridge.cjs`) is a fully implemented Node.js script that syncs content from an external Obsidian vault into the site's `content/` directory.

---

## Current status

The bridge is **implemented and working** but is **not actively in use for existing content**.

- All current blog posts (`content/blog/`) and process posts (`content/inProgress/`) were added manually, not via the bridge.
- The `obsidian/vault/` folder inside the repo is a sample scaffold with empty `blog/` and `inProgress/` directories. It is not a real vault.
- The bridge is ready to use once pointed at an external Obsidian vault via the `OBSIDIAN_VAULT_PATH` environment variable.

---

## How it works

The bridge reads markdown files from an Obsidian vault and writes them into the Eleventy `content/` directory. It validates each file before writing and can optionally auto-commit and push changes.

### Vault → site mapping

| Vault folder | Site destination |
|---|---|
| `<vault>/blog/<name>.md` | `content/blog/<slug>/<slug>.md` |
| `<vault>/inProgress/<name>.md` | `content/inProgress/<slug>/<slug>.md` |

The destination slug is derived from the vault filename: lowercased, spaces/underscores replaced with hyphens, non-alphanumeric characters removed.

**Example:** vault file `My Project.md` → `content/blog/my-project/my-project.md`

### Write behavior

The bridge uses a **write-if-changed** approach: it only writes a destination file if its contents differ from the source. This prevents unnecessary Eleventy rebuilds.

---

## Validation

Before writing any file, the bridge validates:

1. **Frontmatter block** — a `--- ... ---` YAML block must be present
2. **Required frontmatter fields:**
   - `title`
   - `description`
   - `date`
   - `tags` (must be an array — either inline `[tag1, tag2]` or block list `- tag1`)
   - `category`
   - `draft` (must be `true` or `false`)
3. **Image source existence** — checks all `src:` values under `images:` frontmatter and all `{% image %}` shortcode references. Missing files block the sync.

If any file fails validation, **no files from the vault are written** (the sync is aborted for that run). This prevents partial or broken content from reaching the build.

---

## Vault frontmatter template

Every file in the vault must include:

```yaml
---
title: Post Title
description: One sentence summary
date: YYYY-MM-DD
tags:
  - tagname
category: categoryname
draft: false
images:
  - src: "content/blog/<slug>/image.jpg"
    alt: "Optional alt"
---
```

> `draft: true` will exclude the post from production builds but include it in `npm run start`.

---

## npm scripts

| Script | What it does |
|---|---|
| `npm run obsidian:sync` | One-time sync from vault to `content/` |
| `npm run obsidian:watch` | Polling watch (default 2s interval); syncs on vault file changes |
| `npm run obsidian:watch:publish` | Watch + sync + `git add/commit/push` on each successful sync with changes |

### Watch mode

The watch command polls the vault at a configurable interval (default 2 seconds) by computing a snapshot signature (path + mtime + size) of all vault markdown files. When the signature changes, it runs a full sync.

### Autopublish

When `--autopublish` is set, after a successful sync with changes the bridge:
1. `git add` the changed destination files only
2. `git commit -m "chore(obsidian): sync vault content (YYYY-MM-DD HH:mm:ss)"`
3. `git push` (to the specified branch or the default remote)

---

## CLI usage

```bash
# One-time sync from default vault path
node scripts/obsidian-bridge.cjs sync

# One-time sync from a specific vault
node scripts/obsidian-bridge.cjs sync --vault /path/to/my/obsidian/vault

# Watch mode
node scripts/obsidian-bridge.cjs watch --vault /path/to/vault --interval 5

# Watch + autopublish to a named branch
node scripts/obsidian-bridge.cjs watch --autopublish --branch main
```

---

## Configuration

| Option | Default | Notes |
|---|---|---|
| `--vault <path>` | `OBSIDIAN_VAULT_PATH` env var, or `./obsidian/vault` | Absolute or relative path to vault root |
| `--interval <seconds>` | `2` | Polling interval for watch mode |
| `--autopublish` | off | Run git add/commit/push after successful sync |
| `--branch <name>` | none (uses `git push` default) | Target branch for autopublish push |

---

## Why existing content doesn't follow the bridge convention

The `content/inProgress/` posts use a `YYMMDD/topic-slug.md` naming pattern (e.g., `250618/home-studio.md`). The bridge would produce `inProgress/home-studio/home-studio.md`. These two patterns are incompatible.

The `content/blog/` posts use the bridge's expected convention (`AIGA-Seattle/AIGA-Seattle.md`) but were committed manually before the bridge was set up.

**If you want to use the bridge for inProgress posts going forward**, either:
- Rename vault files to match the desired slug (the bridge will create `inProgress/<slug>/<slug>.md`)
- Or add dated-slug naming in Obsidian (`250618-home-studio.md` → `inProgress/250618-home-studio/250618-home-studio.md`)

Existing manually-added posts will not be affected by the bridge as long as the vault doesn't contain files with the same slugs.

---

## Sample vault structure

The repo includes a scaffold at `obsidian/vault/` showing the expected structure:

```
obsidian/vault/
├── README.md          # Explains the structure
├── blog/              # Empty — add your published project files here
└── inProgress/        # Empty — add your process/draft files here
```

Point `OBSIDIAN_VAULT_PATH` at your real Obsidian vault root instead of this folder.
