const { Router } = require("express");
const { verify, JsonWebTokenError } = require("jsonwebtoken");
const insights = require("./api/insights");
const admins = require("./api/admins");
const router = Router();

router.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(400).json({
			message: "Authorization header not found in request"
		});
	} else {
		const { authorization: auth } = req.headers;
		if (!auth.startsWith("Bearer ")) {
			return res.status(400).setHeader("WWW-Authenticate", "error='invalid_request'").json({
				error: "The authorization method provided is invalid"
			});
		}
		try {
			const token = verify(auth.slice(7), process.env.JWT_SIGNATURE); 
			if (!(token.iss && token.iat && token.aud)) {
				res.status(401).setHeader("WWW-Authenticate", "error='invalid_token', error_description='The access token is malformed'").json({
					error: "The access token provided is missing required parameters"
				});
			} else if (!require("./../data/.apiTokens.json")[token.name]) {
				res.status(401).setHeader("WWW-Authenticate", "error='invalid_token', error_description='The access token doesn't exist'").json({
					error: "The access token provided doesn't exist"
				});
			} else {
				const { clientId, clientSecret } = require("./../data/.apiTokens.json")[token.name];
				if (clientId===token.id && clientSecret===token.secret) next();
				else {
					res.status(401).setHeader("WWW-Authenticate", "error='invalid_token', error_description='The access token is invalid'").json({
						error: "The token's Client ID and/or Client Secret are invalid"
					});
				}
			}
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				res.status(500).json({
					error: "Internal Server Error"
				});
			}
		}
	}
});

router.use("/insights", insights);

router.use("/admins", admins);

router.use((req, res) => {
	res.status(404).json({
		result: {
			message: "The API endpoint you're looking for doesn't exist"
		}
	});
});

module.exports = router;