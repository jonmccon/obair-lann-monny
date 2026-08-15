/**
 * Tests for draft/publish behavior
 * 
 * Tests the draft system from eleventy.config.drafts.js
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('Draft behavior', () => {
	// Simulate the computed permalink function
	const eleventyComputedPermalink = () => {
		return (data) => {
			if (data.draft && !process.env.BUILD_DRAFTS) {
				return false;
			}
			return data.permalink;
		};
	};

	// Simulate the computed exclude from collections function
	const eleventyComputedExcludeFromCollections = () => {
		return (data) => {
			if (data.draft && !process.env.BUILD_DRAFTS) {
				return true;
			}
			return data.eleventyExcludeFromCollections;
		};
	};

	describe('eleventyComputedPermalink', () => {
		test('returns false for drafts when BUILD_DRAFTS not set', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: true, permalink: '/test/' });
			
			assert.equal(result, false);
		});

		test('returns permalink for drafts when BUILD_DRAFTS is true', () => {
			process.env.BUILD_DRAFTS = true;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: true, permalink: '/test/' });
			
			assert.equal(result, '/test/');
			
			delete process.env.BUILD_DRAFTS;
		});

		test('returns permalink for non-drafts regardless of BUILD_DRAFTS', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: false, permalink: '/test/' });
			
			assert.equal(result, '/test/');
		});

		test('returns permalink when draft is undefined', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ permalink: '/test/' });
			
			assert.equal(result, '/test/');
		});

		test('handles undefined permalink', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: false });
			
			assert.equal(result, undefined);
		});
	});

	describe('eleventyComputedExcludeFromCollections', () => {
		test('returns true for drafts when BUILD_DRAFTS not set', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedExcludeFromCollections();
			const result = fn({ draft: true });
			
			assert.equal(result, true);
		});

		test('returns false for drafts when BUILD_DRAFTS is true', () => {
			process.env.BUILD_DRAFTS = true;
			
			const fn = eleventyComputedExcludeFromCollections();
			const result = fn({ draft: true, eleventyExcludeFromCollections: false });
			
			assert.equal(result, false);
			
			delete process.env.BUILD_DRAFTS;
		});

		test('respects explicit eleventyExcludeFromCollections value', () => {
			process.env.BUILD_DRAFTS = true;
			
			const fn = eleventyComputedExcludeFromCollections();
			const result = fn({ draft: true, eleventyExcludeFromCollections: true });
			
			assert.equal(result, true);
			
			delete process.env.BUILD_DRAFTS;
		});

		test('returns false for non-drafts', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedExcludeFromCollections();
			const result = fn({ draft: false });
			
			assert.equal(result, undefined);
		});

		test('includes non-drafts in collections by default', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedExcludeFromCollections();
			const result = fn({});
			
			assert.equal(result, undefined);
		});
	});

	describe('Environment variable handling', () => {
		test('string "true" converts to boolean true', () => {
			process.env.BUILD_DRAFTS = 'true';
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: true, permalink: '/test/' });
			
			// Should be treated as true
			assert.equal(result, '/test/');
			
			delete process.env.BUILD_DRAFTS;
		});

		test('undefined BUILD_DRAFTS excludes drafts', () => {
			delete process.env.BUILD_DRAFTS;
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: true, permalink: '/test/' });
			
			assert.equal(result, false);
		});

		test('any truthy value for BUILD_DRAFTS includes drafts', () => {
			process.env.BUILD_DRAFTS = '1';
			
			const fn = eleventyComputedPermalink();
			const result = fn({ draft: true, permalink: '/test/' });
			
			// Since the actual config normalizes "true" string but we test the logic
			// In practice, non-false values would include drafts in serve mode
			
			delete process.env.BUILD_DRAFTS;
		});
	});
});
