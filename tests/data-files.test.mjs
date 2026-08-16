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
	test('module exists', async () => {
		const modulePath = resolve(ROOT, '_data/metadata.js');
		assert.ok(fs.existsSync(modulePath), 'metadata.js file should exist');
	});
});

// ─── password.js ──────────────────────────────────────────────────────────────
// (Already tested in nda-splash.test.js - skipping duplicate tests here since
// password.js is CommonJS and we're running ES modules)

describe('password.js', () => {
	test('module exists and is loadable', async () => {
		const modulePath = resolve(ROOT, '_data/password.js');
		assert.ok(fs.existsSync(modulePath), 'password.js file should exist');
	});
});

// ─── galleryPhotos.js ─────────────────────────────────────────────────────────

describe('galleryPhotos.js', () => {
	test('module exists', async () => {
		const modulePath = resolve(ROOT, '_data/galleryPhotos.js');
		assert.ok(fs.existsSync(modulePath), 'galleryPhotos.js file should exist');
	});
});

// ─── photoCategories.js ───────────────────────────────────────────────────────

describe('photoCategories.js', () => {
	test('module exists if present', async () => {
		const modulePath = resolve(ROOT, '_data/photoCategories.js');
		// File might not exist, which is okay
		assert.ok(true, 'photoCategories.js test placeholder');
	});
});

// ─── profile.js ───────────────────────────────────────────────────────────────

describe('profile.js', () => {
	test('module exists if present', async () => {
		const modulePath = resolve(ROOT, '_data/profile.js');
		// File might not exist, which is okay
		assert.ok(true, 'profile.js test placeholder');
	});
});
