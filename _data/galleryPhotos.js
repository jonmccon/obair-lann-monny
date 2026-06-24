const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

/**
 * Generates a flat array of photo metadata objects — one entry per image file
 * found in each gallery subfolder under content/galleries/.
 *
 * Each object contains:
 *   gallerySlug  — matches the .md filename (and URL slug) for the parent gallery
 *   folderName   — actual filesystem folder name (same as gallerySlug in all current galleries)
 *   slug         — photo identifier derived from filename without extension (e.g. "0022")
 *   filename     — original filename (e.g. "0022.jpg")
 *   src          — content-relative path for use with the {% image %} shortcode
 *   alt          — default alt text
 *   index        — 0-based position within the gallery (sorted by filename)
 *   total        — total photo count for the gallery
 *   prevSlug     — slug of the previous photo (null for first)
 *   nextSlug     — slug of the next photo (null for last)
 *   galleryUrl   — URL of the parent gallery page
 *   url          — canonical URL for the standalone photo page
 *   deepLinkUrl  — URL that opens the parent gallery page with this photo open in preview
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

		// Derive gallery slug from the .md filename inside the folder
		let gallerySlug = folderName;
		try {
			const mdFiles = fs
				.readdirSync(folderPath)
				.filter((f) => f.endsWith(".md"));
			if (mdFiles.length === 1) {
				gallerySlug = path.basename(mdFiles[0], ".md");
			}
		} catch {
			// keep folderName as fallback
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
				folderName,
				slug: photoSlug,
				filename,
				src: `content/galleries/${folderName}/${filename}`,
				alt: `${gallerySlug} — photo ${photoSlug}`,
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
