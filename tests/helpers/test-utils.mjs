/**
 * Shared test utilities
 */

/**
 * Create a minimal Eleventy config mock for testing
 */
export function createMockEleventyConfig() {
	const config = {
		dir: {
			input: 'content',
			output: '_site',
			includes: '../_includes',
			data: '../_data',
		},
		addFilter: () => {},
		addAsyncShortcode: () => {},
		addShortcode: () => {},
		addPairedNunjucksShortcode: () => {},
		addCollection: () => {},
		addPlugin: () => {},
		addPassthroughCopy: () => {},
		addWatchTarget: () => {},
		amendLibrary: () => {},
		addGlobalData: () => {},
		on: () => {},
		getFilter: () => (str) => str,
		ignores: {
			add: () => {},
		},
	};
	return config;
}

/**
 * Create a mock page context for shortcodes
 */
export function createMockPageContext(overrides = {}) {
	return {
		page: {
			inputPath: './content/design/test.md',
			url: '/design/test/',
			fileSlug: 'test',
			...overrides.page,
		},
		...overrides,
	};
}

/**
 * Create a mock collection item
 */
export function createMockCollectionItem(data = {}) {
	return {
		url: data.url || '/test/',
		date: data.date || new Date('2024-01-01'),
		data: {
			title: 'Test Item',
			tags: ['post'],
			...data,
		},
	};
}

/**
 * Wait for a promise to resolve
 */
export async function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
