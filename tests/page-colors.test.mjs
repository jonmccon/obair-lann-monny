import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const css = readFileSync('public/css/index.css', 'utf8');
const palette = readFileSync('public/css/new-colors.css', 'utf8');
const archive = readFileSync('content/archive.njk', 'utf8');
const contact = readFileSync('content/contact.njk', 'utf8');
const resume = readFileSync('content/resume.njk', 'utf8');

function declarations(source, selector) {
	const start = source.indexOf(`${selector} {`);
	assert.notEqual(start, -1, `missing ${selector} rule`);
	return source.slice(start + selector.length + 2, source.indexOf('}', start));
}

function color(rule, property) {
	const value = rule.match(new RegExp(`${property}:\\s*var\\((--[\\w-]+)\\)`));
	assert.ok(value, `missing ${property}`);
	const token = palette.match(new RegExp(`${value[1]}:\\s*(#[0-9a-f]{6})`, 'i'));
	assert.ok(token, `missing ${value[1]}`);
	return token[1];
}

function contrast(a, b) {
	const luminance = hex => {
		const channels = hex.match(/[0-9a-f]{2}/gi).map(value => {
			const n = parseInt(value, 16) / 255;
			return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
		});
		return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
	};
	const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('page colors', () => {
	test('built pages select the requested themes', () => {
		for (const [file, theme] of [
			['index.html', 'theme-home'],
			['design/priority-tax-relief/index.html', 'theme-content'],
			['resume/index.html', 'theme-resume'],
			['contact/index.html', 'theme-contact'],
			['archive/index.html', 'theme-archive'],
		]) {
			const document = new JSDOM(readFileSync(`_site/${file}`, 'utf8'), {
				virtualConsole: new VirtualConsole(),
			}).window.document;
			assert.ok(document.documentElement.classList.contains(theme), `${file}: missing ${theme}`);
		}
	});

	test('page text, links and controls meet normal-text contrast', () => {
		const home = declarations(css, 'html.theme-home');
		const project = declarations(css, 'html.theme-content');
		const dark = declarations(css, 'html.theme-archive');
		assert.match(css, /html\.theme-resume,\s*html\.theme-contact,\s*html\.theme-archive\s*\{/);
		const lightBackground = color(home, '--background-color');
		const darkBackground = color(dark, '--background-color');
		assert.equal(lightBackground, '#fae5d1');
		assert.equal(color(project, '--background-color'), lightBackground);
		assert.equal(darkBackground, '#392d2d');

		for (const rule of [home, project, dark]) {
			for (const property of ['--text-color', '--text-color-muted', '--text-color-subtle', '--text-color-link', '--text-color-link-active', '--text-color-link-visited', '--nav-link-color']) {
				if (property === '--nav-link-color') {
					assert.match(rule, /--nav-link-color:\s*var\(--text-color\)/);
					continue;
				}
				assert.ok(contrast(color(rule, property), color(rule, '--background-color')) >= 4.5, property);
			}
		}
		const surface = color(dark, '--surface-color');
		for (const property of ['--text-color', '--text-color-muted', '--text-color-link']) {
			assert.ok(contrast(color(dark, property), surface) >= 4.5, `${property} on controls`);
		}
		const accent = color(declarations(archive, '.archive-page'), '--archive-accent');
		assert.ok(contrast(accent, darkBackground) >= 4.5, 'active archive tab');
		assert.match(contact, /input::placeholder,[\s\S]*?textarea::placeholder\s*\{[^}]*color:\s*var\(--text-color-muted\)/);
		assert.match(declarations(archive, '.archive-grid .thumb-grid-item::after'), /rgba\(28,\s*23,\s*23,\s*0\.9\)/);
	});

	test('resume print restores dark text and links on white', () => {
		const printRule = declarations(resume, 'html.theme-resume');
		assert.ok(contrast(color(printRule, '--text-color'), '#ffffff') >= 4.5);
		assert.ok(contrast(color(printRule, '--text-color-link'), '#ffffff') >= 4.5);
	});
});
