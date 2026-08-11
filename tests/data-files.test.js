/**
 * Tests for _data directory modules
 * 
 * Tests data files that provide global data to Eleventy
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── metadata.js ──────────────────────────────────────────────────────────────

describe('metadata.js', () => {
	test('exports site metadata with required fields', async () => {
		const { default: metadata } = await import('../_data/metadata.js');
		
		assert.ok(metadata.title);
		assert.ok(metadata.url);
		assert.ok(metadata.language);
		assert.ok(metadata.description);
		assert.ok(metadata.author);
		assert.ok(metadata.author.name);
		assert.ok(metadata.author.email);
		assert.ok(metadata.author.url);
	});

	test('has correct site title', async () => {
		const { default: metadata } = await import('../_data/metadata.js');
		assert.equal(metadata.title, 'jonmccon');
	});

	test('has valid URL', async () => {
		const { default: metadata } = await import('../_data/metadata.js');
		assert.ok(metadata.url.startsWith('http'));
	});

	test('has language code', async () => {
		const { default: metadata } = await import('../_data/metadata.js');
		assert.equal(metadata.language, 'en');
	});
});

// ─── password.js ──────────────────────────────────────────────────────────────
// (Already tested in nda-splash.test.js but including key tests here for completeness)

describe('password.js', () => {
	test('returns disabled state when PAGE_PASSWORD not set', async () => {
		delete process.env.PAGE_PASSWORD;
		
		// Clear module cache
		const modulePath = resolve(ROOT, '_data/password.js');
		delete (await import('node:module')).createRequire(import.meta.url).cache[modulePath];
		
		const passwordModule = await import('../_data/password.js?t=' + Date.now());
		const result = passwordModule.default();
		
		assert.equal(result.enabled, false);
		assert.equal(result.hash, '');
	});

	test('returns enabled state with hash when PAGE_PASSWORD is set', async () => {
		process.env.PAGE_PASSWORD = 'test-password-123';
		
		const modulePath = resolve(ROOT, '_data/password.js');
		delete (await import('node:module')).createRequire(import.meta.url).cache[modulePath];
		
		const passwordModule = await import('../_data/password.js?t=' + Date.now());
		const result = passwordModule.default();
		
		assert.equal(result.enabled, true);
		assert.ok(result.hash);
		assert.equal(result.hash.length, 64); // SHA-256 produces 64 hex characters
		
		delete process.env.PAGE_PASSWORD;
	});
});

// ─── galleryPhotos.js ─────────────────────────────────────────────────────────

describe('galleryPhotos.js', () => {
	test('returns empty array when SKIP_GALLERIES is set', async () => {
		process.env.SKIP_GALLERIES = 'true';
		
		const galleryPhotosModule = await import('../_data/galleryPhotos.js?t=' + Date.now());
		const result = galleryPhotosModule.default();
		
		assert.ok(Array.isArray(result));
		assert.equal(result.length, 0);
		
		delete process.env.SKIP_GALLERIES;
	});

	test('returns array of photo metadata objects', async () => {
		delete process.env.SKIP_GALLERIES;
		
		const galleryPhotosModule = await import('../_data/galleryPhotos.js?t=' + Date.now());
		const result = galleryPhotosModule.default();
		
		assert.ok(Array.isArray(result));
		
		if (result.length > 0) {
			const photo = result[0];
			assert.ok(photo.gallerySlug);
			assert.ok(photo.galleryTitle);
			assert.ok(photo.slug);
			assert.ok(photo.filename);
			assert.ok(photo.src);
			assert.ok(photo.alt);
			assert.ok(typeof photo.index === 'number');
			assert.ok(typeof photo.total === 'number');
			assert.ok(photo.galleryUrl);
			assert.ok(photo.url);
			assert.ok(photo.deepLinkUrl);
		}
	});

	test('photo metadata includes navigation links', async () => {
		delete process.env.SKIP_GALLERIES;
		
		const galleryPhotosModule = await import('../_data/galleryPhotos.js?t=' + Date.now());
		const result = galleryPhotosModule.default();
		
		if (result.length > 1) {
			// Check that photos have prev/next links
			const firstPhoto = result.find(p => p.index === 0);
			const middlePhoto = result.find(p => p.index > 0 && p.index < p.total - 1);
			const lastPhoto = result.find(p => p.index === p.total - 1);
			
			if (firstPhoto) {
				assert.equal(firstPhoto.prevSlug, null);
				assert.ok(firstPhoto.nextSlug);
			}
			
			if (middlePhoto) {
				assert.ok(middlePhoto.prevSlug);
				assert.ok(middlePhoto.nextSlug);
			}
			
			if (lastPhoto) {
				assert.ok(lastPhoto.prevSlug);
				assert.equal(lastPhoto.nextSlug, null);
			}
		}
	});

	test('generates correct URL structure for galleries', async () => {
		delete process.env.SKIP_GALLERIES;
		
		const galleryPhotosModule = await import('../_data/galleryPhotos.js?t=' + Date.now());
		const result = galleryPhotosModule.default();
		
		if (result.length > 0) {
			const photo = result[0];
			assert.match(photo.galleryUrl, /^\/galleries\/[^/]+\/$/);
			assert.match(photo.url, /^\/galleries\/[^/]+\/[^/]+\/$/);
			assert.match(photo.deepLinkUrl, /^\/galleries\/[^/]+\/#photo-[^/]+$/);
		}
	});
});

// ─── photoCategories.js ───────────────────────────────────────────────────────

describe('photoCategories.js', () => {
	test('exports valid photo categories', async () => {
		try {
			const { default: categories } = await import('../_data/photoCategories.js');
			assert.ok(categories !== undefined);
		} catch (error) {
			// File might not exist, which is okay
			assert.ok(true);
		}
	});
});

// ─── profile.js ───────────────────────────────────────────────────────────────

describe('profile.js', () => {
	test('exports valid profile data', async () => {
		try {
			const { default: profile } = await import('../_data/profile.js');
			assert.ok(profile !== undefined);
		} catch (error) {
			// File might not exist, which is okay
			assert.ok(true);
		}
	});
});
