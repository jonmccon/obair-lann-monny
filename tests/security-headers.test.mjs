import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Security Headers (vercel.json)', () => {
	const vercelJsonPath = path.resolve('vercel.json');
	const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

	test('vercel.json has a valid headers configuration', () => {
		assert.ok(Array.isArray(config.headers), 'headers should be an array');
		assert.ok(config.headers.length > 0, 'headers array should not be empty');
		const globalHeaderGroup = config.headers.find(h => h.source === '/(.*)');
		assert.ok(globalHeaderGroup, 'global catch-all header rule (source: "/(.*)") should exist');
		assert.ok(Array.isArray(globalHeaderGroup.headers), 'global headers list should be an array');
	});

	test('Strict-Transport-Security header is configured with max-age, includeSubDomains, and preload', () => {
		const globalHeaderGroup = config.headers.find(h => h.source === '/(.*)');
		const hsts = globalHeaderGroup.headers.find(h => h.key === 'Strict-Transport-Security');
		assert.ok(hsts, 'Strict-Transport-Security header must exist');
		assert.match(hsts.value, /max-age=\d+/, 'HSTS should define max-age');
		assert.match(hsts.value, /includeSubDomains/, 'HSTS should include includeSubDomains');
		assert.match(hsts.value, /preload/, 'HSTS should include preload');
	});

	test('Cross-Origin-Opener-Policy header is set to same-origin', () => {
		const globalHeaderGroup = config.headers.find(h => h.source === '/(.*)');
		const coop = globalHeaderGroup.headers.find(h => h.key === 'Cross-Origin-Opener-Policy');
		assert.ok(coop, 'Cross-Origin-Opener-Policy header must exist');
		assert.equal(coop.value, 'same-origin');
	});

	test('Content-Security-Policy header contains required security directives and domains', () => {
		const globalHeaderGroup = config.headers.find(h => h.source === '/(.*)');
		const csp = globalHeaderGroup.headers.find(h => h.key === 'Content-Security-Policy');
		assert.ok(csp, 'Content-Security-Policy header must exist');

		const value = csp.value;
		assert.match(value, /default-src\s+'self'/, 'default-src should be set to self');
		assert.match(value, /frame-ancestors\s+'none'/, 'frame-ancestors should be set to none');
		assert.match(value, /base-uri\s+'self'/, 'base-uri should be set to self');
		assert.match(value, /form-action\s+'self'/, 'form-action should be set to self');
		assert.match(value, /script-src[^;]*'self'/, 'script-src must include self');
		assert.match(value, /script-src[^;]*https:\/\/www\.googletagmanager\.com/, 'script-src must allow googletagmanager.com');
		assert.match(value, /script-src[^;]*https:\/\/esm\.sh/, 'script-src must allow esm.sh');
		assert.match(value, /style-src[^;]*https:\/\/fonts\.googleapis\.com/, 'style-src must allow fonts.googleapis.com');
		assert.match(value, /font-src[^;]*https:\/\/fonts\.gstatic\.com/, 'font-src must allow fonts.gstatic.com');
		assert.match(value, /connect-src[^;]*https:\/\/www\.google-analytics\.com/, 'connect-src must allow google-analytics.com');
		assert.match(value, /connect-src[^;]*https:\/\/analytics\.google\.com/, 'connect-src must allow analytics.google.com');
		assert.match(value, /connect-src[^;]*https:\/\/\*\.google-analytics\.com/, 'connect-src must allow subdomains of google-analytics.com');
		assert.match(value, /connect-src[^;]*https:\/\/\*\.analytics\.google\.com/, 'connect-src must allow subdomains of analytics.google.com');
		assert.match(value, /connect-src[^;]*https:\/\/esm\.sh/, 'connect-src must allow esm.sh');
		assert.match(value, /frame-src[^;]*https:\/\/player\.simplecast\.com/, 'frame-src must allow simplecast player');
	});
});
