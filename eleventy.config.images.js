const path = require("path");
const fs = require("fs");
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

function escapeAttribute(value = "") {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

module.exports = function(eleventyConfig) {
	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths, sizes) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["jpeg"]; // Temporarily reduce to just JPEG for faster builds
		let input;
		if(isFullUrl(src)) {
			input = src;
		} else if (src.startsWith("content/")) {
			input = path.resolve(src);
			if (!fs.existsSync(input)) {
				console.warn(`[image shortcode] Falling back to relative path for missing content path: ${src}`);
				input = relativeToInputPath(this.page.inputPath, src);
			}
		} else {
			input = relativeToInputPath(this.page.inputPath, src);
		}

		// Animated GIFs: use gif format with animated option to preserve animation
		// https://www.11ty.dev/docs/plugins/image/#output-formats
		let isGif = src.toLowerCase().endsWith(".gif");
		let imageOptions = {
			widths: widths || ["auto"],
			formats: isGif ? ["gif"] : formats,
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
		};
		if (isGif) {
			imageOptions.sharpOptions = { animated: true };
		}

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

		try {
			let metadata = await eleventyImage(input, imageOptions);
			if (metadata) {
				return eleventyImage.generateHTML(metadata, imageAttributes);
			}
		} catch (error) {
			console.warn(`[image shortcode] Falling back to raw image for ${src}: ${error.message}`);
		}

		return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" decoding="async">`;
	});
};
