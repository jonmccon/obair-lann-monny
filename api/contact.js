const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const EMBED_COLOR = 0x5865f2;
const DISCORD_MAX_ATTEMPTS = 2;
const MIN_SUBMIT_TIME_MS = 1500;
const MAX_SUBMIT_AGE_MS = 1000 * 60 * 60 * 8;
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 10;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_RETENTION_MS = RATE_LIMIT_WINDOW_MS * 2;
const submissionHistoryByIp = new Map();
const MAX_LEN = {
	name: 120,
	email: 254,
	// projectType: 120,
	timeline: 140,
	budget: 140,
	details: 4000
};

function clean(value, max) {
	if (typeof value !== "string") {
		return "";
	}
	return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function escapeDiscord(value) {
	return value
		.replace(/\\/g, "\\\\")
		.replace(/([`*~|[\]()])/g, "\\$1");
}

function parseBody(req) {
	if (typeof req.body === "string") {
		try {
			return JSON.parse(req.body);
		} catch {
			return null;
		}
	}
	if (req.body && typeof req.body === "object") {
		return req.body;
	}
	return null;
}

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function getClientIp(req) {
	const forwardedFor = req.headers?.["x-forwarded-for"];
	if (typeof forwardedFor === "string" && forwardedFor.trim()) {
		return forwardedFor.split(",")[0].trim().slice(0, 120);
	}
	if (Array.isArray(forwardedFor) && forwardedFor[0]) {
		return String(forwardedFor[0]).trim().slice(0, 120);
	}
	return (
		req.headers?.["x-real-ip"] ||
		req.socket?.remoteAddress ||
		req.connection?.remoteAddress ||
		"unknown"
	)
		.toString()
		.trim()
		.slice(0, 120);
}

function isRateLimited(clientIp, now = Date.now()) {
	const cutoff = now - RATE_LIMIT_WINDOW_MS;
	const retentionCutoff = now - RATE_LIMIT_RETENTION_MS;

	for (const [ip, timestamps] of submissionHistoryByIp.entries()) {
		const recent = timestamps.filter((ts) => ts >= retentionCutoff);
		if (recent.length === 0) {
			submissionHistoryByIp.delete(ip);
		} else if (recent.length !== timestamps.length) {
			submissionHistoryByIp.set(ip, recent);
		}
	}

	const timestamps = submissionHistoryByIp.get(clientIp) || [];
	const recentSubmissions = timestamps.filter((ts) => ts >= cutoff);
	if (recentSubmissions.length >= RATE_LIMIT_MAX) {
		submissionHistoryByIp.set(clientIp, recentSubmissions);
		return true;
	}

	recentSubmissions.push(now);
	submissionHistoryByIp.set(clientIp, recentSubmissions);
	return false;
}

async function postToDiscord(DISCORD_WEBHOOK, payload, maxAttempts) {
	let lastError = null;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			const response = await fetch(DISCORD_WEBHOOK, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				return { ok: true };
			}

			lastError = new Error(`discord_status_${response.status}`);
		} catch (error) {
			lastError = error;
		}

		if (attempt < maxAttempts) {
			await delay(250 * attempt);
		}
	}

	return { ok: false, error: lastError };
}

module.exports = async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed." });
	}

	const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK;
	if (!webhookUrl) {
		return res.status(503).json({ error: "Contact form is unavailable on this deployment. Please email directly." });
	}

	const body = parseBody(req);
	if (!body) {
		return res.status(400).json({ error: "Invalid request body." });
	}

	const inquiry = {
		name: clean(body.name, MAX_LEN.name),
		email: clean(body.email, MAX_LEN.email),
		// projectType: clean(body.projectType, MAX_LEN.projectType),
		timeline: clean(body.timeline, MAX_LEN.timeline),
		budget: clean(body.budget, MAX_LEN.budget),
		details: clean(body.details, MAX_LEN.details)
	};

	if (!inquiry.name || !inquiry.email || !inquiry.details) {
		return res.status(400).json({ error: "Please complete name, email, and project details." });
	}

	if (!EMAIL_PATTERN.test(inquiry.email)) {
		return res.status(400).json({ error: "Please provide a valid email address." });
	}

	const trapField = clean(body.website, 120);
	if (trapField) {
		return res.status(200).json({ ok: true, message: "Message sent." });
	}

	const startedAtRaw = body.startedAt;
	const startedAt = Number(startedAtRaw);
	if (!Number.isFinite(startedAt) || startedAt <= 0) {
		return res.status(400).json({ error: "Invalid form submission." });
	}

	const submissionAge = Date.now() - startedAt;
	if (submissionAge < MIN_SUBMIT_TIME_MS) {
		return res.status(400).json({ error: "Please take a moment before submitting the form." });
	}
	if (submissionAge > MAX_SUBMIT_AGE_MS) {
		return res.status(400).json({ error: "Form expired. Please refresh and try again." });
	}

	const clientIp = getClientIp(req);
	if (isRateLimited(clientIp)) {
		return res.status(429).json({ error: "Too many submissions. Please wait and try again." });
	}

	const sourceHost = clean(process.env.CONTACT_FORM_SOURCE || "jonmccon.com", 120);

	const safeInquiry = {
		name: escapeDiscord(inquiry.name),
		email: `\`${inquiry.email}\``,
		// projectType: escapeDiscord(inquiry.projectType || "Not specified"),
		timeline: escapeDiscord(inquiry.timeline || "Not specified"),
		budget: escapeDiscord(inquiry.budget || "Not specified"),
		details: escapeDiscord(inquiry.details)
	};

	const discordPayload = {
		// Prevent any mentions from user-submitted content in the webhook post.
		allowed_mentions: { parse: [] },
		content: `New contact form inquiry from ${escapeDiscord(sourceHost)}`,
		embeds: [
			{
				title: "Project inquiry",
				color: EMBED_COLOR,
				timestamp: new Date().toISOString(),
				description: safeInquiry.details,
				fields: [
					{ name: "Name", value: safeInquiry.name, inline: true },
					{ name: "Email", value: safeInquiry.email, inline: true },
					// { name: "Project type", value: safeInquiry.projectType, inline: true },
					{ name: "Timeline", value: safeInquiry.timeline, inline: true },
					{ name: "Budget", value: safeInquiry.budget, inline: true }
				],
				footer: {
					text: "Source: /contact form"
				}
			}
		]
	};

	const delivery = await postToDiscord(webhookUrl, discordPayload, DISCORD_MAX_ATTEMPTS);
	if (!delivery.ok) {
		console.error("Contact form Discord delivery failed", {
			source: sourceHost,
			error: delivery.error ? String(delivery.error.message || delivery.error) : "unknown",
			// projectType: inquiry.projectType || "Not specified",
			timestamp: new Date().toISOString()
		});
		return res.status(502).json({ error: "Unable to deliver message right now." });
	}

	return res.status(200).json({ ok: true, message: "Message sent." });
};

module.exports.__resetContactRateLimitForTests = function resetContactRateLimitForTests() {
	submissionHistoryByIp.clear();
};
