/**
 * Tests for Eleventy collections
 * 
 * Tests collection generation and filtering logic
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createMockCollectionItem } from './helpers/test-utils.js';

// ─── projects collection ──────────────────────────────────────────────────────

describe('projects collection', () => {
	// Simulates the collection logic from eleventy.config.js
	const projectsCollection = (collectionApi) => {
		const items = collectionApi.getFilteredByGlob("./content/design/**/*.md");
		return items.filter(item => item.data.images);
	};

	test('filters items that have images frontmatter', () => {
		const mockApi = {
			getFilteredByGlob: () => [
				createMockCollectionItem({ images: [{ src: 'test.jpg' }] }),
				createMockCollectionItem({ images: null }),
				createMockCollectionItem({ images: [{ src: 'test2.jpg' }] }),
			],
		};
		
		const result = projectsCollection(mockApi);
		assert.equal(result.length, 2);
		assert.ok(result.every(item => item.data.images));
	});

	test('returns empty array when no items have images', () => {
		const mockApi = {
			getFilteredByGlob: () => [
				createMockCollectionItem({}),
				createMockCollectionItem({}),
			],
		};
		
		const result = projectsCollection(mockApi);
		assert.equal(result.length, 0);
	});

	test('uses correct glob pattern for design folder', () => {
		let capturedGlob;
		const mockApi = {
			getFilteredByGlob: (glob) => {
				capturedGlob = glob;
				return [];
			},
		};
		
		projectsCollection(mockApi);
		assert.equal(capturedGlob, "./content/design/**/*.md");
	});
});

// ─── featuredProjects collection ──────────────────────────────────────────────

describe('featuredProjects collection', () => {
	const featuredProjectsCollection = (collectionApi) => {
		return collectionApi.getAll().filter(item => item.data.featured === true);
	};

	test('filters items where featured is true', () => {
		const mockApi = {
			getAll: () => [
				createMockCollectionItem({ featured: true }),
				createMockCollectionItem({ featured: false }),
				createMockCollectionItem({ featured: true }),
				createMockCollectionItem({}),
			],
		};
		
		const result = featuredProjectsCollection(mockApi);
		assert.equal(result.length, 2);
		assert.ok(result.every(item => item.data.featured === true));
	});

	test('returns empty array when no featured items', () => {
		const mockApi = {
			getAll: () => [
				createMockCollectionItem({ featured: false }),
				createMockCollectionItem({}),
			],
		};
		
		const result = featuredProjectsCollection(mockApi);
		assert.equal(result.length, 0);
	});
});

// ─── semiFeaturedProjects collection ──────────────────────────────────────────

describe('semiFeaturedProjects collection', () => {
	const semiFeaturedProjectsCollection = (collectionApi) => {
		return collectionApi.getAll().filter(item => item.data.semiFeatured === true);
	};

	test('filters items where semiFeatured is true', () => {
		const mockApi = {
			getAll: () => [
				createMockCollectionItem({ semiFeatured: true }),
				createMockCollectionItem({ semiFeatured: false }),
				createMockCollectionItem({ semiFeatured: true }),
			],
		};
		
		const result = semiFeaturedProjectsCollection(mockApi);
		assert.equal(result.length, 2);
		assert.ok(result.every(item => item.data.semiFeatured === true));
	});
});

// ─── process collection ───────────────────────────────────────────────────────

describe('process collection', () => {
	const processCollection = (collectionApi) => {
		return collectionApi.getFilteredByTag("process");
	};

	test('uses correct tag filter', () => {
		let capturedTag;
		const mockApi = {
			getFilteredByTag: (tag) => {
				capturedTag = tag;
				return [];
			},
		};
		
		processCollection(mockApi);
		assert.equal(capturedTag, "process");
	});

	test('returns items tagged with process', () => {
		const mockApi = {
			getFilteredByTag: () => [
				createMockCollectionItem({ tags: ['process', 'design'] }),
				createMockCollectionItem({ tags: ['process'] }),
			],
		};
		
		const result = processCollection(mockApi);
		assert.equal(result.length, 2);
	});
});

// ─── aboutPages collection ────────────────────────────────────────────────────

describe('aboutPages collection', () => {
	const aboutPagesCollection = (collectionApi) => {
		return collectionApi.getAll().filter(item => item.url === "/about/");
	};

	test('filters items with /about/ URL', () => {
		const mockApi = {
			getAll: () => [
				createMockCollectionItem({ url: '/about/' }),
				createMockCollectionItem({ url: '/design/' }),
				createMockCollectionItem({ url: '/about/' }),
			],
		};
		
		const result = aboutPagesCollection(mockApi);
		assert.equal(result.length, 2);
		assert.ok(result.every(item => item.url === '/about/'));
	});

	test('returns empty array when no about pages', () => {
		const mockApi = {
			getAll: () => [
				createMockCollectionItem({ url: '/design/' }),
			],
		};
		
		const result = aboutPagesCollection(mockApi);
		assert.equal(result.length, 0);
	});
});

// ─── galleries collection ─────────────────────────────────────────────────────

describe('galleries collection', () => {
	const galleriesCollection = (collectionApi) => {
		if (process.env.SKIP_GALLERIES) {
			return [];
		}
		return collectionApi.getFilteredByTag("galleries");
	};

	test('returns empty array when SKIP_GALLERIES is set', () => {
		process.env.SKIP_GALLERIES = 'true';
		
		const mockApi = {
			getFilteredByTag: () => [
				createMockCollectionItem({ tags: ['galleries'] }),
			],
		};
		
		const result = galleriesCollection(mockApi);
		assert.equal(result.length, 0);
		
		delete process.env.SKIP_GALLERIES;
	});

	test('returns galleries when SKIP_GALLERIES not set', () => {
		delete process.env.SKIP_GALLERIES;
		
		const mockApi = {
			getFilteredByTag: () => [
				createMockCollectionItem({ tags: ['galleries'] }),
				createMockCollectionItem({ tags: ['galleries'] }),
			],
		};
		
		const result = galleriesCollection(mockApi);
		assert.equal(result.length, 2);
	});

	test('uses correct tag filter', () => {
		delete process.env.SKIP_GALLERIES;
		let capturedTag;
		const mockApi = {
			getFilteredByTag: (tag) => {
				capturedTag = tag;
				return [];
			},
		};
		
		galleriesCollection(mockApi);
		assert.equal(capturedTag, "galleries");
	});
});
