const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const path = require("path");
const { JSDOM } = require("jsdom");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

function plainTextFromHtml(value) {
	if (!value || typeof value !== "string") {
		return "";
	}

	const dom = JSDOM.fragment(value);
	dom.querySelectorAll("picture, img, iframe, script, style").forEach(function(node) {
		node.remove();
	});

	return dom.textContent
		.replace(/\s+/g, " ")
		.trim();
}

function relativeToInputPath(inputPath, relativeFilePath) {
	let split = inputPath.split("/");
	split.pop();
	return path.resolve(split.join(path.sep), relativeFilePath);
}

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
		"./node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js": "/js/photoswipe-lightbox.esm.min.js",
		"./node_modules/photoswipe/dist/photoswipe.esm.min.js": "/js/photoswipe.esm.min.js",
		"./node_modules/photoswipe/dist/photoswipe.css": "/css/photoswipe.css"
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg,gif}");

	// Watch css for hotlreload.
	eleventyConfig.addWatchTarget("public/**/*.css");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("wordCount", (value) => {
		if (!value || typeof value !== "string") {
			return 0;
		}
		const plain = value
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (!plain) {
			return 0;
		}
		return plain.split(" ").length;
	});

	eleventyConfig.addFilter("excerpt", (value, wordLimit = 35) => {
		const plain = plainTextFromHtml(value);
		if (!plain) {
			return "";
		}

		const words = plain.split(" ");
		const limit = Number(wordLimit) || 35;
		return words.length > limit
			? `${words.slice(0, limit).join(" ")}…`
			: plain;
	});

	// Homepage cards use small frontmatter images, so media embedded in post bodies is stripped here.
	eleventyConfig.addFilter("stripHomepageMedia", (value) => {
		if (!value || typeof value !== "string") {
			return "";
		}

		const dom = JSDOM.fragment(value);
		dom.querySelectorAll("picture, img, iframe, script").forEach(function(node) {
			node.remove();
		});
		const container = new JSDOM("").window.document.createElement("div");
		container.append(dom.cloneNode(true));
		return container.innerHTML;
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	// Return all categories used in a collection
	// eleventyConfig.addFilter("getAllCategories", collection => {
	// 	let categorySet = new Set();
	// 	for(let item of collection) {
	// 		(item.data.category || []).forEach(category => categorySet.add(category));
	// 	}
	// 	return Array.from(categorySet);
	// });

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts", "galleries"].indexOf(tag) === -1);
	});

	// eleventyConfig.addFilter("filterCategoryList", function filterCategoryList(category) {
	// 	return (category || []).filter(category => ["all", "nav", "post", "posts"].indexOf(category) === -1);
	// });

	// custom shuffle filter
	eleventyConfig.addFilter("shuffle", (array) => {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
	});

	// Hero image shortcode to get processed image URL for backgrounds
	eleventyConfig.addAsyncShortcode("heroImage", async function(src) {
		if (!src) return "";
		
		const Image = require("@11ty/eleventy-img");
		const path = require("path");
		
		// Handle the path - frontmatter paths are absolute from project root
		let input = src;
		
		// Clean up the path - remove leading "./" if present
		if (input.startsWith("./")) {
			input = input.substring(2);
		}
		
		try {
			let isGif = src.toLowerCase().endsWith(".gif");
			let imageOptions = {
				widths: [1200],
				formats: isGif ? ["gif"] : ["jpeg"],
				outputDir: path.join(eleventyConfig.dir.output, "img"),
				urlPath: "/img/"
			};
			if (isGif) {
				imageOptions.sharpOptions = { animated: true };
			}

			let metadata = await Image(input, imageOptions);
			
			let format = isGif ? "gif" : "jpeg";
			return metadata[format][0].url;
		} catch (error) {
			console.warn(`Hero image processing failed for ${src}:`, error.message);
			return "";
		}
	});

	eleventyConfig.addAsyncShortcode("homepageImage", async function(src, alt, width = 160, className = "newspaper-image") {
		if (!src) return "";

		let input = src;
		if (src.startsWith("./content/")) {
			input = path.resolve(src.substring(2));
		} else if (src.startsWith("content/")) {
			input = path.resolve(src);
		}

		try {
			let isGif = src.toLowerCase().endsWith(".gif");
			let metadata = await Image(input, {
				widths: [width],
				formats: isGif ? ["gif"] : ["jpeg"],
				outputDir: path.join(eleventyConfig.dir.output, "img"),
				urlPath: "/img/",
				...(isGif ? { sharpOptions: { animated: true } } : {})
			});

			return Image.generateHTML(metadata, {
				alt: alt || "",
				loading: "lazy",
				decoding: "async",
				class: className
			});
		} catch (error) {
			console.warn(`Homepage image processing failed for ${src}:`, error.message);
			return "";
		}
	});

	// Photo gallery shortcodes (adapted from bashlk/adventures-with-tech)
	const GALLERY_IMAGE_WIDTH = 192;
	const LANDSCAPE_LIGHTBOX_IMAGE_WIDTH = 2000;
	const PORTRAIT_LIGHTBOX_IMAGE_WIDTH = 720;

	eleventyConfig.addPairedNunjucksShortcode("gallery", function(content, galleryName) {
		// Newlines removed to prevent Markdown from wrapping output in <p> tags.
		// Gallery JS (PhotoSwipe init, URL sync, deep-link) lives in public/js/gallery-init.js
		// rather than inline here — inline scripts inside paired shortcodes get HTML-entity-encoded
		// (=> becomes &gt;, && becomes &amp;&amp;) which breaks the JavaScript.
		const gallerySlug = String(galleryName)
			.replace(/[^A-Za-z0-9_-]+/g, "-")
			.replace(/^-+|-+$/g, "") || "gallery";
		const galleryId = `gallery-${gallerySlug}`;
		const galleryIdAttribute = galleryId
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return `<div class="photo-gallery" id="${galleryIdAttribute}">${content}</div><script type="module" src="/js/gallery-init.js"></script>`;
	});

	eleventyConfig.addAsyncShortcode("galleryImage", async function(src, alt) {
		let input;
		if (src.startsWith("./")) {
			input = relativeToInputPath(this.page.inputPath, src);
		} else {
			input = src;
		}

		const altText = alt || "Gallery image";

		// Derive a stable per-photo slug from the source filename (e.g. "0022" from "./0022.jpg")
		const photoSlug = path.basename(src, path.extname(src));
		// Use the page's actual URL (which respects any custom permalink) to get the gallery slug.
		// Match the expected /galleries/<slug>/ pattern to guard against unexpected URL shapes.
		// Falls back to fileSlug for galleries without a custom permalink.
		const urlMatch = (this.page.url || "").match(/^\/galleries\/([^/]+)\/?$/);
		const gallerySlug = (urlMatch && urlMatch[1]) || this.page.fileSlug;
		const photoUrl = `/galleries/${gallerySlug}/${photoSlug}/`;
		const deepLinkUrl = `/galleries/${gallerySlug}/#photo-${photoSlug}`;

		// First pass: generate thumbnail only to detect orientation
		const thumbMetadata = await Image(input, {
			widths: [GALLERY_IMAGE_WIDTH],
			formats: ["jpeg"],
			urlPath: "/img/",
			outputDir: "./_site/img/"
		});

		const thumbMeta = thumbMetadata.jpeg[0];

		// Choose lightbox width based on orientation
		const isPortrait = thumbMeta.height > thumbMeta.width;
		const lightboxImageWidth = isPortrait ? PORTRAIT_LIGHTBOX_IMAGE_WIDTH : LANDSCAPE_LIGHTBOX_IMAGE_WIDTH;

		// Second pass: generate full-size image at the appropriate width
		const fullMetadata = await Image(input, {
			widths: [lightboxImageWidth],
			formats: ["jpeg"],
			urlPath: "/img/",
			outputDir: "./_site/img/"
		});

		const fullMeta = fullMetadata.jpeg[0];

		// href points to the standalone photo page so the status bar shows a meaningful gallery URL.
		// data-pswp-src supplies the full-resolution image URL for the PhotoSwipe lightbox.
		return `<a id="photo-${photoSlug}" href="${photoUrl}" data-pswp-src="${fullMeta.url}" data-pswp-width="${fullMeta.width}" data-pswp-height="${fullMeta.height}" data-photo-slug="${photoSlug}" data-photo-url="${photoUrl}" data-deep-link-url="${deepLinkUrl}"><img src="${thumbMeta.url}" alt="${altText}" loading="lazy" decoding="async" /></a>`;
	});

	// Create separate collections for projects and process posts
	eleventyConfig.addCollection("projects", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./content/blog/**/*.md").filter(item => item.data.images);
	});

	eleventyConfig.addCollection("featuredProjects", function(collectionApi) {
		return collectionApi.getFilteredByTag("featured");
	});

	eleventyConfig.addCollection("process", function(collectionApi) {
		return collectionApi.getFilteredByTag("process");
	});

	eleventyConfig.addCollection("aboutPages", function(collectionApi) {
		return collectionApi.getAll().filter(item => item.url === "/about/");
	});

	// Photo galleries collection
	eleventyConfig.addCollection("galleries", function(collectionApi) {
		return collectionApi.getFilteredByTag("galleries");
	});

	// Return all the content images as a collection from frontmatter
	eleventyConfig.addCollection("images", async function(collectionApi) {
		const images = [];
		const items = collectionApi.getAll();
	
		for (const item of items) {
		  if (item.data.images) {
			for (const image of item.data.images) {
			  let isGif = image.src.toLowerCase().endsWith(".gif");
			  let imageOptions = {
				widths: isGif ? [null] : [480, null],
				formats: isGif ? ["gif"] : ["jpeg"], // Temporarily reduce to just JPEG for faster builds
				urlPath: "/img/",
				outputDir: "./_site/img/"
			  };
			  if (isGif) {
				imageOptions.sharpOptions = { animated: true };
			  }

			  let metadata = await Image(image.src, imageOptions);
	
			  let format = isGif ? "gif" : "jpeg";
			  let imageEntries = metadata[format];
			  let imageMeta = imageEntries[imageEntries.length - 1];
			  let pileMeta = imageEntries[0];
	
			  images.push({
				url: item.url,
				src: imageMeta.url,
				width: imageMeta.width,
				height: imageMeta.height,
				pileSrc: pileMeta.url,
				pileWidth: pileMeta.width,
				pileHeight: pileMeta.height,
				alt: image.alt || item.data.title,
				date: item.data.date,
				// category: item.data.categorys
			  });
			}
		  }
		}
	
		return images;
	  });

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	})

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
