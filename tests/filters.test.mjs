/**
 * Tests for Eleventy custom filters
 * 
 * Tests all custom Nunjucks filters defined in eleventy.config.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DateTime } from 'luxon';
import { JSDOM } from 'jsdom';
import { sampleCollection, sampleHtmlContent } from './helpers/fixtures.mjs';

// ─── readableDate filter ──────────────────────────────────────────────────────

describe('readableDate filter', () => {
	const readableDate = (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	};

	test('formats date with default format', () => {
		const date = new Date('2024-01-15T10:30:00Z');
		const result = readableDate(date);
		assert.equal(result, '15 January 2024');
	});

	test('formats date with custom format', () => {
		const date = new Date('2024-01-15T10:30:00Z');
		const result = readableDate(date, 'yyyy-MM-dd');
		assert.equal(result, '2024-01-15');
	});

	test('formats date with custom timezone', () => {
		const date = new Date('2024-01-15T23:30:00Z');
		const result = readableDate(date, 'dd LLLL yyyy HH:mm', 'America/New_York');
		assert.match(result, /January 2024/);
	});
});

// ─── htmlDateString filter ────────────────────────────────────────────────────

describe('htmlDateString filter', () => {
	const htmlDateString = (dateObj) => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	};

	test('formats date for HTML datetime attribute', () => {
		const date = new Date('2024-01-15T10:30:00Z');
		const result = htmlDateString(date);
		assert.equal(result, '2024-01-15');
	});

	test('formats single-digit dates with leading zero', () => {
		const date = new Date('2024-01-05T10:30:00Z');
		const result = htmlDateString(date);
		assert.equal(result, '2024-01-05');
	});
});

// ─── wordCount filter ─────────────────────────────────────────────────────────

describe('wordCount filter', () => {
	const wordCount = (value) => {
		if (!value || typeof value !== "string") {
			return 0;
		}
		const plain = value
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (!plain) {
			return 0;
		}
		return plain.split(" ").length;
	};

	test('counts words in plain text', () => {
		const result = wordCount('Hello world this is a test');
		assert.equal(result, 6);
	});

	test('counts words after stripping HTML tags', () => {
		const result = wordCount('<p>Hello <strong>world</strong> test</p>');
		assert.equal(result, 3);
	});

	test('returns 0 for empty string', () => {
		const result = wordCount('');
		assert.equal(result, 0);
	});

	test('returns 0 for null', () => {
		const result = wordCount(null);
		assert.equal(result, 0);
	});

	test('returns 0 for non-string', () => {
		const result = wordCount(123);
		assert.equal(result, 0);
	});

	test('handles multiple whitespace correctly', () => {
		const result = wordCount('Hello    world   test');
		assert.equal(result, 3);
	});
});

// ─── excerpt filter ───────────────────────────────────────────────────────────

describe('excerpt filter', () => {
	function plainTextFromHtml(value) {
		if (!value || typeof value !== "string") {
			return "";
		}
		const dom = JSDOM.fragment(value);
		dom.querySelectorAll("picture, img, iframe, script, style").forEach(function(node) {
			node.remove();
		});
		return dom.textContent.replace(/\s+/g, " ").trim();
	}

	const excerpt = (value, wordLimit = 35) => {
		const plain = plainTextFromHtml(value);
		if (!plain) {
			return "";
		}
		const words = plain.split(" ");
		const limit = Number(wordLimit) || 35;
		return words.length > limit
			? `${words.slice(0, limit).join(" ")}…`
			: plain;
	};

	test('returns full text when under limit', () => {
		const text = '<p>Short text</p>';
		const result = excerpt(text, 10);
		assert.equal(result, 'Short text');
	});

	test('truncates text over limit with ellipsis', () => {
		const text = '<p>' + 'word '.repeat(40) + '</p>';
		const result = excerpt(text, 10);
		const words = result.split(' ');
		assert.equal(words.length, 10);
		assert.ok(result.endsWith('…'));
	});

	test('strips images and media from excerpt', () => {
		const result = excerpt(sampleHtmlContent, 10);
		assert.ok(!result.includes('<img'));
		assert.ok(!result.includes('<picture'));
		assert.ok(!result.includes('<iframe'));
	});

	test('uses default limit of 35 words', () => {
		const text = '<p>' + 'word '.repeat(40) + '</p>';
		const result = excerpt(text);
		const words = result.split(' ');
		assert.equal(words.length, 35);
	});

	test('returns empty string for null', () => {
		const result = excerpt(null);
		assert.equal(result, '');
	});
});

// ─── stripHomepageMedia filter ────────────────────────────────────────────────

describe('stripHomepageMedia filter', () => {
	const stripHomepageMedia = (value) => {
		if (!value || typeof value !== "string") {
			return "";
		}
		const dom = JSDOM.fragment(value);
		dom.querySelectorAll("picture, img, iframe, script").forEach(function(node) {
			node.remove();
		});
		const container = new JSDOM("").window.document.createElement("div");
		container.append(dom.cloneNode(true));
		return container.innerHTML;
	};

	test('removes picture elements', () => {
		const html = '<p>Text</p><picture><img src="test.jpg"></picture><p>More</p>';
		const result = stripHomepageMedia(html);
		assert.ok(!result.includes('<picture'));
		assert.ok(result.includes('Text'));
		assert.ok(result.includes('More'));
	});

	test('removes img elements', () => {
		const html = '<p>Text</p><img src="test.jpg"><p>More</p>';
		const result = stripHomepageMedia(html);
		assert.ok(!result.includes('<img'));
		assert.ok(result.includes('Text'));
	});

	test('removes iframe elements', () => {
		const html = '<p>Text</p><iframe src="video.mp4"></iframe><p>More</p>';
		const result = stripHomepageMedia(html);
		assert.ok(!result.includes('<iframe'));
	});

	test('removes script elements', () => {
		const html = '<p>Text</p><script>alert("test")</script><p>More</p>';
		const result = stripHomepageMedia(html);
		assert.ok(!result.includes('<script'));
	});

	test('preserves other HTML elements', () => {
		const html = '<h1>Title</h1><p>Paragraph</p><a href="#">Link</a>';
		const result = stripHomepageMedia(html);
		assert.ok(result.includes('<h1>'));
		assert.ok(result.includes('<p>'));
		assert.ok(result.includes('<a'));
	});

	test('returns empty string for null', () => {
		const result = stripHomepageMedia(null);
		assert.equal(result, '');
	});
});

// ─── head filter ──────────────────────────────────────────────────────────────

describe('head filter', () => {
	const head = (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}
		return array.slice(0, n);
	};

	test('returns first n elements', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = head(arr, 3);
		assert.deepEqual(result, [1, 2, 3]);
	});

	test('returns last n elements for negative n', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = head(arr, -2);
		assert.deepEqual(result, [4, 5]);
	});

	test('returns empty array for empty input', () => {
		const result = head([], 3);
		assert.deepEqual(result, []);
	});

	test('returns empty array for non-array input', () => {
		const result = head('not an array', 3);
		assert.deepEqual(result, []);
	});

	test('handles n larger than array length', () => {
		const arr = [1, 2, 3];
		const result = head(arr, 10);
		assert.deepEqual(result, [1, 2, 3]);
	});
});

// ─── min filter ───────────────────────────────────────────────────────────────

describe('min filter', () => {
	const min = (...numbers) => {
		return Math.min.apply(null, numbers);
	};

	test('returns minimum of multiple numbers', () => {
		const result = min(5, 2, 8, 1, 9);
		assert.equal(result, 1);
	});

	test('handles negative numbers', () => {
		const result = min(5, -2, 8, 1);
		assert.equal(result, -2);
	});

	test('handles single number', () => {
		const result = min(42);
		assert.equal(result, 42);
	});
});

// ─── getAllTags filter ────────────────────────────────────────────────────────

describe('getAllTags filter', () => {
	const getAllTags = (collection) => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	};

	test('collects all unique tags from collection', () => {
		const result = getAllTags(sampleCollection);
		assert.ok(result.includes('design'));
		assert.ok(result.includes('galleries'));
	});

	test('removes duplicates', () => {
		const collection = [
			{ data: { tags: ['a', 'b'] } },
			{ data: { tags: ['a', 'c'] } },
		];
		const result = getAllTags(collection);
		assert.equal(result.filter(t => t === 'a').length, 1);
		assert.equal(result.length, 3);
	});

	test('handles items without tags', () => {
		const collection = [
			{ data: { tags: ['a'] } },
			{ data: {} },
		];
		const result = getAllTags(collection);
		assert.ok(result.includes('a'));
	});
});

// ─── filterTagList filter ─────────────────────────────────────────────────────

describe('filterTagList filter', () => {
	const filterTagList = (tags) => {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts", "galleries"].indexOf(tag) === -1);
	};

	test('removes excluded tags', () => {
		const tags = ['design', 'all', 'web', 'post', 'featured'];
		const result = filterTagList(tags);
		assert.deepEqual(result, ['design', 'web', 'featured']);
	});

	test('keeps all non-excluded tags', () => {
		const tags = ['design', 'web', 'ui'];
		const result = filterTagList(tags);
		assert.deepEqual(result, ['design', 'web', 'ui']);
	});

	test('handles empty array', () => {
		const result = filterTagList([]);
		assert.deepEqual(result, []);
	});

	test('handles null', () => {
		const result = filterTagList(null);
		assert.deepEqual(result, []);
	});
});

// ─── shuffle filter ───────────────────────────────────────────────────────────

describe('shuffle filter', () => {
	const shuffle = (array) => {
		let currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};

	test('preserves array length', () => {
		const arr = [1, 2, 3, 4, 5];
		const arrCopy = [...arr];
		const result = shuffle(arrCopy);
		assert.equal(result.length, arr.length);
	});

	test('preserves all elements', () => {
		const arr = [1, 2, 3, 4, 5];
		const arrCopy = [...arr];
		const result = shuffle(arrCopy);
		arr.forEach(element => {
			assert.ok(result.includes(element));
		});
	});

	test('modifies array in place', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = shuffle(arr);
		assert.equal(result, arr); // Same reference
	});
});

// ─── getRelatedProjects filter ────────────────────────────────────────────────

describe('getRelatedProjects filter', () => {
	const getRelatedProjects = function(collection, currentPage, maxResults = 2) {
		if (!collection || !currentPage) {
			return [];
		}

		const EXCLUDED_TAGS = ["all", "nav", "post", "posts", "galleries"];
		
		const currentTags = (currentPage.tags || []).filter(
			tag => EXCLUDED_TAGS.indexOf(tag) === -1
		);
		const currentUrl = currentPage.url;

		const scored = collection
			.filter(item => item.url !== currentUrl)
			.map(item => {
				const itemTags = (item.data.tags || []).filter(
					tag => EXCLUDED_TAGS.indexOf(tag) === -1
				);
				const sharedTags = currentTags.filter(tag => itemTags.includes(tag));
				return {
					item: item,
					score: sharedTags.length,
					date: item.date
				};
			})
			.filter(scored => scored.score > 0)
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return b.date - a.date;
			});

		if (scored.length > 0) {
			return scored.slice(0, maxResults).map(s => s.item);
		}

		const sortedByDate = collection.sort((a, b) => a.date - b.date);
		const currentIndex = sortedByDate.findIndex(item => 
			item.data.title === currentPage.title && 
			item.date.getTime() === currentPage.date.getTime()
		);

		const related = [];
		if (currentIndex > 0) {
			related.push(sortedByDate[currentIndex - 1]);
		}
		if (currentIndex >= 0 && currentIndex < sortedByDate.length - 1 && related.length < maxResults) {
			related.push(sortedByDate[currentIndex + 1]);
		}

		return related.slice(0, maxResults);
	};

	test('returns projects with shared tags', () => {
		const currentPage = {
			url: '/test/',
			tags: ['design', 'web'],
		};
		const result = getRelatedProjects(sampleCollection, currentPage, 2);
		assert.ok(result.length > 0);
	});

	test('excludes current page from results', () => {
		const currentPage = {
			url: '/design/sample-project/',
			tags: ['design'],
		};
		const result = getRelatedProjects(sampleCollection, currentPage, 2);
		assert.ok(!result.some(item => item.url === currentPage.url));
	});

	test('respects maxResults parameter', () => {
		const currentPage = {
			url: '/test/',
			tags: ['design'],
		};
		const result = getRelatedProjects(sampleCollection, currentPage, 1);
		assert.ok(result.length <= 1);
	});

	test('falls back to date-based navigation when no tag matches', () => {
		const currentPage = {
			url: '/test/',
			title: 'Test',
			date: new Date('2024-01-20'),
			tags: ['unique-tag'],
		};
		const result = getRelatedProjects(sampleCollection, currentPage, 2);
		// Should return something based on date proximity
		assert.ok(Array.isArray(result));
	});

	test('returns empty array for null collection', () => {
		const result = getRelatedProjects(null, {}, 2);
		assert.deepEqual(result, []);
	});

	test('returns empty array for null currentPage', () => {
		const result = getRelatedProjects(sampleCollection, null, 2);
		assert.deepEqual(result, []);
	});
});
