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
			website: ''
		},
		...overrides
	};
}

describe('api/contact bot protection', () => {
	const originalFetch = globalThis.fetch;
	const originalWebhook = process.env.DISCORD_WEBHOOK_URL;
	let fetchCalls = [];

	beforeEach(() => {
		process.env.DISCORD_WEBHOOK_URL = 'https://example.com/webhook';
		fetchCalls = [];
		globalThis.fetch = async (url, options) => {
			fetchCalls.push({ url, options });
			return { ok: true, status: 204 };
		};
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		process.env.DISCORD_WEBHOOK_URL = originalWebhook;
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
});
