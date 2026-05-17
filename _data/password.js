const crypto = require("crypto");

module.exports = function () {
	const password = process.env.PAGE_PASSWORD || "";
	if (!password) {
		return {
			hash: "",
			enabled: false,
		};
	}

	const hash = crypto.createHash("sha256").update(password).digest("hex");
	return {
		hash: hash,
		enabled: true,
	};
};
