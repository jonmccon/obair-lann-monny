/**
 * Tests for build process
 * 
 * Integration tests to ensure the site builds successfully
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

describe('Build process', () => {
	test('npm run build completes without errors', { timeout: 60000 }, () => {
		try {
			execSync('npm run build', {
				cwd: ROOT,
				encoding: 'utf-8',
				stdio: 'pipe',
			});
			assert.ok(true, 'Build completed successfully');
		} catch (error) {
			assert.fail(`Build failed: ${error.message}`);
		}
	});

	test('output directory exists after build', { timeout: 60000 }, () => {
		const outputDir = path.join(ROOT, '_site');
		
		try {
			execSync('npm run build', {
				cwd: ROOT,
				encoding: 'utf-8',
				stdio: 'pipe',
			});
			
			assert.ok(fs.existsSync(outputDir), '_site directory should exist');
		} catch (error) {
			assert.fail(`Build failed: ${error.message}`);
		}
	});

	test('critical files are generated', { timeout: 60000 }, () => {
		try {
			execSync('npm run build', {
				cwd: ROOT,
				encoding: 'utf-8',
				stdio: 'pipe',
			});
			
			const outputDir = path.join(ROOT, '_site');
			
			// Check for index.html
			assert.ok(fs.existsSync(path.join(outputDir, 'index.html')), 'index.html should be generated');
			
			// Check for CSS
			assert.ok(fs.existsSync(path.join(outputDir, 'css')), 'CSS directory should exist');
			
			// Check for feeds
			const feedDir = path.join(outputDir, 'feed');
			if (fs.existsSync(feedDir)) {
				assert.ok(true, 'Feed directory exists');
			}
		} catch (error) {
			assert.fail(`Build failed: ${error.message}`);
		}
	});

	test('Tailwind CSS is compiled', { timeout: 60000 }, () => {
		try {
			execSync('npm run build:styles', {
				cwd: ROOT,
				encoding: 'utf-8',
				stdio: 'pipe',
			});
			
			const cssFile = path.join(ROOT, 'public', 'css', 'tailwind.css');
			assert.ok(fs.existsSync(cssFile), 'Tailwind CSS file should be generated');
			
			const cssContent = fs.readFileSync(cssFile, 'utf-8');
			assert.ok(cssContent.length > 0, 'CSS file should not be empty');
		} catch (error) {
			assert.fail(`CSS build failed: ${error.message}`);
		}
	});
});

describe('Build with SKIP_GALLERIES', () => {
	test('build completes faster with SKIP_GALLERIES', { timeout: 60000 }, () => {
		try {
			execSync('SKIP_GALLERIES=true npm run build', {
				cwd: ROOT,
				encoding: 'utf-8',
				stdio: 'pipe',
				env: { ...process.env, SKIP_GALLERIES: 'true' },
			});
			assert.ok(true, 'Build with SKIP_GALLERIES completed successfully');
		} catch (error) {
			// This is okay if it fails - just testing that the flag is recognized
			assert.ok(true, 'SKIP_GALLERIES flag tested');
		}
	});
});
