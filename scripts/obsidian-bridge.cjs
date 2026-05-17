#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { execSync } = require("node:child_process");

const REPO_ROOT = process.cwd();
const CONTENT_ROOT = path.resolve(REPO_ROOT, "content");
const BLOG_OUT_ROOT = path.join(CONTENT_ROOT, "blog");
const IN_PROGRESS_OUT_ROOT = path.join(CONTENT_ROOT, "inProgress");
const MS_PER_SECOND = 1000;

function usage() {
  console.log(`Obsidian bridge

Usage:
  node scripts/obsidian-bridge.cjs sync [--vault <path>] [--autopublish] [--branch <name>]
  node scripts/obsidian-bridge.cjs watch [--vault <path>] [--interval <seconds>] [--autopublish] [--branch <name>]

Options:
  --vault       Absolute or relative path to your Obsidian vault root (default: OBSIDIAN_VAULT_PATH or ./obsidian/vault)
  --interval    Watch polling interval in seconds (default: 2)
  --autopublish Run git add/commit/push after successful sync when files changed
  --branch      Optional branch name to push when --autopublish is enabled
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function extractFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;
  return { raw: match[1], body: markdown.slice(match[0].length) };
}

function hasRequiredFrontmatter(raw) {
  const checks = [
    { key: "title", re: /^title\s*:/m },
    { key: "description", re: /^description\s*:/m },
    { key: "date", re: /^date\s*:/m },
    { key: "tags", re: /^tags\s*:/m },
    { key: "category", re: /^category\s*:/m },
    { key: "draft", re: /^draft\s*:\s*(true|false)\s*$/m },
  ];

  const missing = checks.filter((c) => !c.re.test(raw)).map((c) => c.key);

  const tagsInline = /^tags\s*:\s*\[(.*?)\]\s*$/m.test(raw);
  const tagsHeader = /^tags\s*:\s*$/m.test(raw);
  const tagsListItem = /^\s*-\s+.+$/m.test(raw);
  const tagsBlock = tagsHeader && tagsListItem;
  if (!tagsInline && !tagsBlock) {
    missing.push("tags(array)");
  }

  return missing;
}

function extractFrontmatterImageSources(raw) {
  const sources = [];
  const srcMatches = raw.matchAll(/^\s*-\s*src\s*:\s*["']?([^"'\n]+)["']?\s*$/gm);
  for (const match of srcMatches) {
    sources.push(match[1].trim());
  }
  return sources;
}

function extractShortcodeImageSources(body) {
  const sources = [];
  const re = /\{%\s*image\s+["']([^"']+)["']/gm;
  let match = re.exec(body);
  while (match) {
    sources.push(match[1].trim());
    match = re.exec(body);
  }
  return sources;
}

async function validateImageSources({ sourceFile, frontmatterSources, shortcodeSources }) {
  const errors = [];
  const all = [...frontmatterSources, ...shortcodeSources];

  for (const src of all) {
    if (!src) continue;

    let resolved;
    if (src.startsWith("./") || src.startsWith("../")) {
      resolved = path.resolve(path.dirname(sourceFile), src);
    } else {
      resolved = path.resolve(REPO_ROOT, src);
    }

    if (!(await fileExists(resolved))) {
      errors.push(`Missing image: '${src}' (resolved: ${resolved})`);
    }
  }

  return errors;
}

async function getMarkdownFiles(rootDir) {
  const output = [];

  async function walk(dir) {
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        output.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  output.sort();
  return output;
}

function getOutputPath(section, sourceFile) {
  const fileStem = path.parse(sourceFile).name;
  const slug = slugify(fileStem);

  if (!slug) {
    throw new Error(`Could not compute slug for ${sourceFile}`);
  }

  const parentRoot = section === "blog" ? BLOG_OUT_ROOT : IN_PROGRESS_OUT_ROOT;
  const destDir = path.join(parentRoot, slug);
  const destFile = path.join(destDir, `${slug}.md`);

  return { slug, destDir, destFile };
}

async function writeIfChanged(filePath, content) {
  const existing = await fsp.readFile(filePath, "utf8").catch(() => null);
  if (existing === content) {
    return false;
  }

  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, content, "utf8");
  return true;
}

async function processFile(section, sourceFile) {
  const markdown = await fsp.readFile(sourceFile, "utf8");
  const fm = extractFrontmatter(markdown);

  if (!fm) {
    return {
      ok: false,
      sourceFile,
      errors: ["Missing frontmatter block (--- ... ---)."],
    };
  }

  const requiredErrors = hasRequiredFrontmatter(fm.raw);
  const frontmatterSources = extractFrontmatterImageSources(fm.raw);
  const shortcodeSources = extractShortcodeImageSources(fm.body);
  const imageErrors = await validateImageSources({
    sourceFile,
    frontmatterSources,
    shortcodeSources,
  });

  const errors = [...requiredErrors, ...imageErrors];
  if (errors.length > 0) {
    return { ok: false, sourceFile, errors };
  }

  const { destFile, slug } = getOutputPath(section, sourceFile);
  const changed = await writeIfChanged(destFile, markdown);

  return {
    ok: true,
    sourceFile,
    destFile,
    slug,
    changed,
  };
}

async function syncVault(vaultRoot) {
  const blogRoot = path.join(vaultRoot, "blog");
  const inProgressRoot = path.join(vaultRoot, "inProgress");

  const [blogFiles, inProgressFiles] = await Promise.all([
    getMarkdownFiles(blogRoot),
    getMarkdownFiles(inProgressRoot),
  ]);

  const results = [];

  for (const file of blogFiles) {
    results.push(await processFile("blog", file));
  }
  for (const file of inProgressFiles) {
    results.push(await processFile("inProgress", file));
  }

  const failures = results.filter((r) => !r.ok);
  const changed = results.filter((r) => r.ok && r.changed);

  return {
    scanned: blogFiles.length + inProgressFiles.length,
    changed,
    failures,
  };
}

function runAutopublish(changedFiles, branch) {
  if (changedFiles.length === 0) return;

  const scopeArgs = changedFiles
    .map((file) => path.relative(REPO_ROOT, file))
    .filter(Boolean)
    .join(" ");

  execSync(`git --no-pager add ${scopeArgs}`, { stdio: "inherit" });

  let staged = "";
  try {
    staged = execSync("git --no-pager diff --cached --name-only", { encoding: "utf8" }).trim();
  } catch {
    staged = "";
  }

  if (!staged) {
    return;
  }

  const ISO_DATETIME_LENGTH = 19; // YYYY-MM-DD HH:mm:ss
  const stamp = new Date().toISOString().replace("T", " ").slice(0, ISO_DATETIME_LENGTH);
  execSync(`git --no-pager commit -m "chore(obsidian): sync vault content (${stamp})"`, {
    stdio: "inherit",
  });

  if (branch) {
    execSync(`git --no-pager push origin ${branch}`, { stdio: "inherit" });
  } else {
    execSync("git --no-pager push", { stdio: "inherit" });
  }
}

function snapshotSignature(files) {
  return files
    .map((f) => `${f.path}:${f.mtimeMs}:${f.size}`)
    .sort()
    .join("|");
}

async function collectSnapshot(vaultRoot) {
  const roots = [path.join(vaultRoot, "blog"), path.join(vaultRoot, "inProgress")];
  const snapshot = [];

  async function walk(dir) {
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const stat = await fsp.stat(fullPath);
        snapshot.push({ path: fullPath, mtimeMs: stat.mtimeMs, size: stat.size });
      }
    }
  }

  await Promise.all(roots.map((root) => walk(root)));
  return snapshot;
}

async function runSync(opts) {
  const vaultRoot = path.resolve(REPO_ROOT, opts.vaultPath);
  const exists = await fileExists(vaultRoot);
  if (!exists) {
    throw new Error(`Vault path does not exist: ${vaultRoot}`);
  }

  const result = await syncVault(vaultRoot);

  if (result.failures.length > 0) {
    console.error(`\nObsidian sync blocked with ${result.failures.length} validation error(s):`);
    for (const fail of result.failures) {
      console.error(`\n- ${fail.sourceFile}`);
      for (const err of fail.errors) {
        console.error(`  • ${err}`);
      }
    }
    return { ok: false, changedFiles: [] };
  }

  console.log(
    `\nObsidian sync complete. Scanned: ${result.scanned}, Updated: ${result.changed.length}, Errors: 0`
  );

  if (opts.autopublish && result.changed.length > 0) {
    console.log("Running autopublish...");
    runAutopublish(result.changed.map((item) => item.destFile), opts.branch);
  }

  return { ok: true, changedFiles: result.changed.map((item) => item.destFile) };
}

async function runWatch(opts) {
  const vaultRoot = path.resolve(REPO_ROOT, opts.vaultPath);
  const intervalMs = Math.max(1, Number(opts.intervalSeconds || 2)) * MS_PER_SECOND;

  console.log(`Watching vault at: ${vaultRoot}`);
  console.log(`Polling every ${intervalMs / 1000}s`);

  let lastSig = snapshotSignature(await collectSnapshot(vaultRoot));

  const initial = await runSync(opts);
  if (!initial.ok) {
    console.log("Initial sync failed; watcher will continue and retry on next change.");
  }

  setInterval(async () => {
    try {
      const snap = await collectSnapshot(vaultRoot);
      const sig = snapshotSignature(snap);
      if (sig === lastSig) return;
      lastSig = sig;

      console.log("\nChange detected. Running sync...");
      await runSync(opts);
    } catch (err) {
      console.error(`Watch loop error: ${err.message}`);
    }
  }, intervalMs);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || !["sync", "watch"].includes(command)) {
    usage();
    process.exitCode = 1;
    return;
  }

  const vaultPath = args.vault || process.env.OBSIDIAN_VAULT_PATH || "./obsidian/vault";
  const opts = {
    vaultPath,
    autopublish: Boolean(args.autopublish),
    branch: typeof args.branch === "string" ? args.branch : "",
    intervalSeconds: args.interval || "2",
  };

  if (command === "sync") {
    const result = await runSync(opts);
    if (!result.ok) process.exitCode = 2;
    return;
  }

  await runWatch(opts);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
