const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

function relativeToInputPath(inputPath, relativeFilePath) {
	let split = inputPath.split("/");
	split.pop();

	return path.resolve(split.join(path.sep), relativeFilePath);

}

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = function(eleventyConfig) {
	// Transform: process standard markdown images (![alt](image)) through eleventy-img.
	// This enables Obsidian users to write standard markdown image syntax and have
	// images optimized on build, just like the {% image %} shortcode.
	eleventyConfig.addTransform("markdownImageOptimize", async function(content, legacyOutputPath) {
		const outputPath = legacyOutputPath || this.page?.outputPath || "";
		if (!outputPath.endsWith(".html")) return content;

		// Quick bail-out: skip if there are no unprocessed img tags.
		// Processed images (from {% image %}) already have a loading= attribute.
		if (!content.includes("<img ")) return content;

		const path = require("path");
		const eleventyImage = require("@11ty/eleventy-img");

		const inputPath = this.page?.inputPath || "";
		if (!inputPath) return content;
		const inputDir = path.dirname(inputPath);

		// Collect all <img> tags that need processing.
		// Note: markdown-it and the {% image %} shortcode always emit single-line <img> tags,
		// so a single-line regex is appropriate here. Multi-line img attributes are not
		// produced by this pipeline.
		const imgTagRegex = /<img\b([^>]*)>/gi;
		const replacements = [];
		let match;

		while ((match = imgTagRegex.exec(content)) !== null) {
			const [fullMatch, attrs] = match;

			// Skip already-processed images: {% image %} shortcode adds loading="lazy"
			if (/\bloading=/.test(attrs)) continue;

			const srcMatch = attrs.match(/\bsrc="([^"]*)"/);
			if (!srcMatch) continue;
			const src = srcMatch[1];

			// Skip absolute, external, data, or empty paths
			if (!src || src.startsWith("/") || src.startsWith("http") || src.startsWith("data:")) continue;

			const altMatch = attrs.match(/\balt="([^"]*)"/);
			const alt = altMatch ? altMatch[1] : "";

			replacements.push({ fullMatch, absoluteSrc: path.resolve(inputDir, src), alt });
		}

		if (replacements.length === 0) return content;

		// Process images (potentially in parallel) then apply replacements
		const processed = await Promise.all(
			replacements.map(async ({ fullMatch, absoluteSrc, alt }) => {
				try {
					// Use "jpeg" to match the output format used by the {% image %} shortcode.
					// PNG transparency is not used in this portfolio, and JPEG keeps
					// build times consistent across both image-insertion methods.
					const metadata = await eleventyImage(absoluteSrc, {
						widths: ["auto"],
						formats: ["jpeg"],
						outputDir: "./_site/img/",
						urlPath: "/img/",
					});
					const generated = eleventyImage.generateHTML(metadata, {
						alt,
						loading: "lazy",
						decoding: "async",
						class: "lightbox-trigger",
					});
					return { fullMatch, generated };
				} catch (e) {
					console.warn(`Could not optimize markdown image ${absoluteSrc}:`, e.message);
					return null;
				}
			})
		);

		let result = content;
		for (const item of processed) {
			if (item) {
				// Use a function replacement to avoid $-special-char issues in replacement strings
				result = result.replace(item.fullMatch, () => item.generated);
			}
		}

		return result;
	});

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths, sizes) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["jpeg"]; // Temporarily reduce to just JPEG for faster builds
		let input;
		if(isFullUrl(src)) {
			input = src;
		} else {
			input = relativeToInputPath(this.page.inputPath, src);
		}

		let metadata = await eleventyImage(input, {
			widths: widths || ["auto"],
			formats,
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
		});

		// TODO loading=eager and fetchpriority=high
		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};

		// Add lightbox functionality for post content (not home gallery)
		// Check if this is being called from a post page
		if (this.page && this.page.inputPath && 
			(this.page.inputPath.includes('/blog/') || this.page.inputPath.includes('/inProgress/'))) {
			imageAttributes.class = "lightbox-trigger";
		}

		return eleventyImage.generateHTML(metadata, imageAttributes);
	});
};