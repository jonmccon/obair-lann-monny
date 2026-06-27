const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

/**
 * Extract the `title:` value from a YAML frontmatter block.
 * Handles unquoted, single-quoted, and double-quoted values.
 */
function parseFrontmatterTitle(content) {
	const match = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
	return match ? match[1].trim() : null;
}

/**
 * Extract the `permalink:` value from a YAML frontmatter block and derive the
 * gallery slug from it.  Only recognises gallery-level permalinks of the form
 * `/galleries/<slug>/` (or without the trailing slash) — returns null for
 * anything else (e.g. `/galleries/`, a root path, or no permalink at all).
 * e.g. "permalink: /galleries/landscapes/" → "landscapes"
 */
function parseFrontmatterGallerySlug(content) {
	const match = content.match(/^permalink:\s*["']?(.+?)["']?\s*$/m);
	if (!match) return null;
	const galleryMatch = match[1].trim().match(/^\/galleries\/([^/]+)\/?$/);
	return galleryMatch ? galleryMatch[1] : null;
}

/**
 * Generates a flat array of photo metadata objects — one entry per image file
 * found in each gallery subfolder under content/galleries/.
 *
 * Each object contains:
 *   gallerySlug    — matches the .md filename (and URL slug) for the parent gallery
 *   galleryTitle   — human-readable gallery title parsed from the .md frontmatter
 *   folderName     — actual filesystem folder name (same as gallerySlug in current galleries)
 *   slug           — photo identifier derived from filename without extension (e.g. "0022")
 *   filename       — original filename (e.g. "0022.jpg")
 *   src            — content-relative path for use with the {% image %} shortcode
 *                    (uses folderName for the filesystem path, not gallerySlug, so that
 *                    the physical file location is always correct even if the URL slug
 *                    were ever to diverge from the folder name)
 *   alt            — default alt text
 *   index          — 0-based position within the gallery (sorted by filename)
 *   total          — total photo count for the gallery
 *   prevSlug       — slug of the previous photo (null for first)
 *   nextSlug       — slug of the next photo (null for last)
 *   galleryUrl     — URL of the parent gallery page
 *   url            — canonical URL for the standalone photo page
 *   deepLinkUrl    — URL that opens the parent gallery page with this photo open in preview
 */
module.exports = function () {
	const galleriesDir = path.join(__dirname, "..", "content", "galleries");
	const results = [];

	let entries;
	try {
		entries = fs.readdirSync(galleriesDir, { withFileTypes: true });
	} catch {
		return results;
	}

	const galleryDirs = entries
		.filter((e) => e.isDirectory())
		.map((e) => e.name)
		.sort();

	for (const folderName of galleryDirs) {
		const folderPath = path.join(galleriesDir, folderName);

		// Derive gallery slug from the .md filename inside the folder.
		// Also read the frontmatter title for display purposes.
		let gallerySlug = folderName;
		let galleryTitle = folderName.replace(/-/g, " ");
		try {
			const mdFiles = fs
				.readdirSync(folderPath)
				.filter((f) => f.endsWith(".md"));
			if (mdFiles.length === 1) {
				gallerySlug = path.basename(mdFiles[0], ".md");
				const mdContent = fs.readFileSync(
					path.join(folderPath, mdFiles[0]),
					"utf8"
				);
				galleryTitle = parseFrontmatterTitle(mdContent) || galleryTitle;
				// If the gallery .md has a custom permalink, use the slug from that
				// permalink as gallerySlug so photo page URLs match the actual gallery URL.
				// e.g. permalink: /galleries/landscapes/ → gallerySlug = "landscapes"
				const permalinkSlug = parseFrontmatterGallerySlug(mdContent);
				if (permalinkSlug) gallerySlug = permalinkSlug;
			}
		} catch {
			// keep folderName-based fallbacks
		}

		// Collect and sort image files
		let imageFiles;
		try {
			imageFiles = fs
				.readdirSync(folderPath)
				.filter((f) =>
					IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase())
				)
				.sort();
		} catch {
			continue;
		}

		for (let i = 0; i < imageFiles.length; i++) {
			const filename = imageFiles[i];
			const photoSlug = path.basename(filename, path.extname(filename));
			const galleryUrl = `/galleries/${gallerySlug}/`;

			results.push({
				gallerySlug,
				galleryTitle,
				// folderName is the actual filesystem directory; used for src paths.
				// gallerySlug is the URL-facing slug; used for href construction.
				// In all current galleries these are identical, but keeping them
				// separate ensures the file path never breaks if a URL slug changes.
				folderName,
				slug: photoSlug,
				filename,
				src: `content/galleries/${folderName}/${filename}`,
				alt: `${galleryTitle} — photo ${photoSlug}`,
				index: i,
				total: imageFiles.length,
				prevSlug:
					i > 0
						? path.basename(
								imageFiles[i - 1],
								path.extname(imageFiles[i - 1])
							)
						: null,
				nextSlug:
					i < imageFiles.length - 1
						? path.basename(
								imageFiles[i + 1],
								path.extname(imageFiles[i + 1])
							)
						: null,
				galleryUrl,
				url: `/galleries/${gallerySlug}/${photoSlug}/`,
				deepLinkUrl: `${galleryUrl}#photo-${photoSlug}`,
			});
		}
	}

	return results;
};
