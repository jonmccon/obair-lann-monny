function eleventyComputedPermalink() {
	// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
	// `addGlobalData` acts like a global data file and runs the top level function it receives.
	return (data) => {
		// Always skip during non-watch/serve builds
		if(data.draft && !process.env.BUILD_DRAFTS) {
			return false;
		}

		return data.permalink;
	}
};

function eleventyComputedExcludeFromCollections() {
	// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
	// `addGlobalData` acts like a global data file and runs the top level function it receives.
	return (data) => {
		// Always exclude from non-watch/serve builds
		if(data.draft && !process.env.BUILD_DRAFTS) {
			return true;
		}

		return data.eleventyExcludeFromCollections;
	}
};

module.exports.eleventyComputedPermalink = eleventyComputedPermalink;
module.exports.eleventyComputedExcludeFromCollections = eleventyComputedExcludeFromCollections;

module.exports = eleventyConfig => {
	eleventyConfig.addGlobalData("eleventyComputed.permalink", eleventyComputedPermalink);
	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", eleventyComputedExcludeFromCollections);

	let logged = false;
	eleventyConfig.on("eleventy.before", ({runMode}) => {
		let text = "Excluding";
		
		// Check if BUILD_DRAFTS is explicitly set in environment
		if (process.env.BUILD_DRAFTS !== undefined) {
			// Normalize string "true"/"false" to boolean or delete if false
			if (process.env.BUILD_DRAFTS === "true" || process.env.BUILD_DRAFTS === true) {
				process.env.BUILD_DRAFTS = true;
				text = "Including";
			} else {
				// Delete the env var so !process.env.BUILD_DRAFTS is true
				delete process.env.BUILD_DRAFTS;
				text = "Excluding";
			}
		} else {
			// Default behavior: only show drafts in serve/watch modes
			if(runMode === "serve" || runMode === "watch") {
				process.env.BUILD_DRAFTS = true;
				text = "Including";
			}
		}

		// Only log once.
		if(!logged) {
			console.log( `[11ty/eleventy-base-blog] ${text} drafts.` );
		}

		logged = true;
	});
}
