const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const path = require("path");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

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

	// Photo gallery shortcodes (adapted from bashlk/adventures-with-tech)
	const GALLERY_IMAGE_WIDTH = 192;
	const LANDSCAPE_LIGHTBOX_IMAGE_WIDTH = 2000;
	const PORTRAIT_LIGHTBOX_IMAGE_WIDTH = 720;

	eleventyConfig.addPairedNunjucksShortcode("gallery", function(content, name) {
		// Newlines removed to prevent Markdown from wrapping output in <p> tags
		return `
			<div class="photo-gallery" id="gallery-${name}">
				${content}
			</div>
			<script type="module">
				import PhotoSwipeLightbox from '/js/photoswipe-lightbox.esm.min.js';
				import PhotoSwipe from '/js/photoswipe.esm.min.js';
				const lightbox = new PhotoSwipeLightbox({
					gallery: '#gallery-${name}',
					children: 'a',
					pswpModule: PhotoSwipe,
					preload: [1, 1]
				});
				lightbox.init();
			</script>
		`.replace(/(\r\n|\n|\r)/gm, "");
	});

	eleventyConfig.addAsyncShortcode("galleryImage", async function(src, alt) {
		let input;
		if (src.startsWith("./")) {
			input = relativeToInputPath(this.page.inputPath, src);
		} else {
			input = src;
		}

		const altText = alt || "Gallery image";

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

		return `<a href="${fullMeta.url}" data-pswp-width="${fullMeta.width}" data-pswp-height="${fullMeta.height}" target="_blank"><img src="${thumbMeta.url}" alt="${altText}" loading="lazy" decoding="async" /></a>`;
	});

	// Create separate collections for projects and process posts
	eleventyConfig.addCollection("projects", function(collectionApi) {
		return collectionApi.getFilteredByTag("posts");
	});

	eleventyConfig.addCollection("process", function(collectionApi) {
		return collectionApi.getFilteredByTag("process");
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
				widths: [null],
				formats: isGif ? ["gif"] : ["jpeg"], // Temporarily reduce to just JPEG for faster builds
				urlPath: "/img/",
				outputDir: "./_site/img/"
			  };
			  if (isGif) {
				imageOptions.sharpOptions = { animated: true };
			  }

			  let metadata = await Image(image.src, imageOptions);
	
			  let format = isGif ? "gif" : "jpeg";
			  let imageUrl = metadata[format][0].url;
	
			  images.push({
				url: item.url,
				src: imageUrl,
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
