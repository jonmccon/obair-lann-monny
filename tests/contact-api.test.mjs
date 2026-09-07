import { beforeEach, afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const contactHandler = require('../api/contact.js');

function createResponse() {
	return {
		statusCode: 200,
		headers: {},
		body: null,
		setHeader(name, value) {
			this.headers[name] = value;
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
		json(payload) {
			this.body = payload;
			return this;
		}
	};
}

function createRequest(overrides = {}) {
	return {
		method: 'POST',
		headers: { 'x-forwarded-for': '203.0.113.8' },
		body: {
			name: 'Test User',
			email: 'test@example.com',
			timeline: 'Next month',
			budget: '$5k-$10k',
			details: 'Need product design support',
			website: '',
			startedAt: String(Date.now() - 2000)
		},
		...overrides
	};
}

describe('api/contact bot protection', () => {
	const originalFetch = globalThis.fetch;
	const originalNow = Date.now;
	const originalWebhook = process.env.DISCORD_WEBHOOK_URL;
	let fetchCalls = [];
	let now = 0;

	beforeEach(() => {
		now = 1_700_000_000_000;
		Date.now = () => now;
		process.env.DISCORD_WEBHOOK_URL = 'https://example.com/webhook';
		fetchCalls = [];
		globalThis.fetch = async (url, options) => {
			fetchCalls.push({ url, options });
			return { ok: true, status: 204 };
		};
		contactHandler.__resetContactRateLimitForTests();
	});

	afterEach(() => {
		Date.now = originalNow;
		globalThis.fetch = originalFetch;
		process.env.DISCORD_WEBHOOK_URL = originalWebhook;
		contactHandler.__resetContactRateLimitForTests();
	});

	test('accepts valid submission and delivers to webhook', async () => {
		const req = createRequest();
		const res = createResponse();

		await contactHandler(req, res);

		assert.equal(res.statusCode, 200);
		assert.deepEqual(res.body, { ok: true, message: 'Message sent.' });
		assert.equal(fetchCalls.length, 1);
		assert.equal(fetchCalls[0].url, 'https://example.com/webhook');
	});

	test('rejects submission when startedAt is missing', async () => {
		const req = createRequest({
			body: { ...createRequest().body, startedAt: '' }
		});
		const res = createResponse();

		await contactHandler(req, res);

		assert.equal(res.statusCode, 400);
		assert.equal(res.body.error, 'Invalid form submission.');
		assert.equal(fetchCalls.length, 0);
	});

	test('rejects submissions sent too quickly', async () => {
		const req = createRequest({
			body: { ...createRequest().body, startedAt: String(Date.now() - 200) }
		});
		const res = createResponse();

		await contactHandler(req, res);

		assert.equal(res.statusCode, 400);
		assert.equal(res.body.error, 'Please take a moment before submitting the form.');
		assert.equal(fetchCalls.length, 0);
	});

	test('silently accepts honeypot hits without delivering', async () => {
		const req = createRequest({
			body: { ...createRequest().body, website: 'https://spam.invalid' }
		});
		const res = createResponse();

		await contactHandler(req, res);

		assert.equal(res.statusCode, 200);
		assert.deepEqual(res.body, { ok: true, message: 'Message sent.' });
		assert.equal(fetchCalls.length, 0);
	});

	test('rate limits repeated submissions from same IP', async () => {
		for (let i = 0; i < 3; i += 1) {
			const req = createRequest();
			const res = createResponse();
			await contactHandler(req, res);
			assert.equal(res.statusCode, 200);
		}

		const blockedReq = createRequest();
		const blockedRes = createResponse();
		await contactHandler(blockedReq, blockedRes);

		assert.equal(blockedRes.statusCode, 429);
		assert.equal(blockedRes.body.error, 'Too many submissions. Please wait and try again.');
		assert.equal(fetchCalls.length, 3);
	});
});
