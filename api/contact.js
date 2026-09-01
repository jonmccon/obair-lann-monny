const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const EMBED_COLOR = 0x5865f2;
const MAX_LEN = {
	name: 120,
	email: 254,
	projectType: 120,
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

module.exports = async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed." });
	}

	const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
	if (!webhookUrl) {
		return res.status(500).json({ error: "Contact form is not configured." });
	}

	const body = parseBody(req);
	if (!body) {
		return res.status(400).json({ error: "Invalid request body." });
	}

	const inquiry = {
		name: clean(body.name, MAX_LEN.name),
		email: clean(body.email, MAX_LEN.email),
		projectType: clean(body.projectType, MAX_LEN.projectType),
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

	const sourceHost = clean(process.env.CONTACT_FORM_SOURCE || "jonmccon.com", 120);

	const safeInquiry = {
		name: escapeDiscord(inquiry.name),
		email: `\`${inquiry.email}\``,
		projectType: escapeDiscord(inquiry.projectType || "Not specified"),
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
					{ name: "Project type", value: safeInquiry.projectType, inline: true },
					{ name: "Timeline", value: safeInquiry.timeline, inline: true },
					{ name: "Budget", value: safeInquiry.budget, inline: true }
				],
				footer: {
					text: "Source: /contact form"
				}
			}
		]
	};

	try {
		const discordResponse = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(discordPayload)
		});

		if (!discordResponse.ok) {
			return res.status(502).json({ error: "Unable to deliver message right now." });
		}
	} catch {
		return res.status(502).json({ error: "Unable to deliver message right now." });
	}

	return res.status(200).json({ ok: true, message: "Message sent." });
};
