const { Router } = require("express");
const { verify } = require("jsonwebtoken");
const lodash = require("lodash");
const InsightController = require("../../controllers/insight.controller");
const ResourceNotFoundError = require("../../data/errors/ResourceNotFoundError");
const fs = require("fs");
const path = require("path");
const router = Router();

router.use((req, res, next) => {
	const apiToken = require("./../../data/.apiTokens.json")[verify(req.headers.authorization.slice(7), process.env.JWT_SIGNATURE).name];
	if (!Object.keys(apiToken.tokenAccess).includes("insights")) {
		res.status(403).setHeader("WWW-Authenticate", "error='insufficient_scope', error_description='The access token doesn't have the required scope'").json({
			error: "The token's doesn't have the required access scope for this resource(s)"
		});
	} else if (apiToken.tokenAccess.insights!=="*" && !apiToken.tokenAccess.insights.split(",").includes(req.method.toUpperCase())) {
		res.status(403).setHeader("WWW-Authenticate", "error='insufficient_scope', error_description='The access token doesn't have the required scope'").json({
			error: `The token doesn't have the required access scope to request this action (${req.method.toUpperCase()}) for this resource(s)`
		});
	} else if (apiToken.tokenAccess.insights==="*" || apiToken.tokenAccess.insights.split(",").includes(req.method.toUpperCase())) next();
});

router.get("/", (req, res) => {
	if (req.query.page) {
		if (req.query.topic) {
			InsightController.getInsightsByTopicAndPage(req.query.topic, req.query.page > 0 ? req.query.page-1 : 0)
			.then(insights => {
				res.status(200)
				.setHeader("Content-Type", "application/json")
				.setHeader("Cache-Control", "no-cache")
				.json({
					result: insights || []
				});
			})
			.catch(err => {
				res.status(500).json({
					error: "Internal Server Error",
					description: err
				});
			});
		} else if (!req.query.topic) {
			InsightController.getInsightsByPage(req.query.page > 0 ? req.query.page-1 : 0)
			.then(insights => {
				res.status(200)
				.setHeader("Content-Type", "application/json")
				.setHeader("Cache-Control", "no-cache")
				.json({
					result: insights || []
				});
			})
			.catch(err => {
				res.status(500).json({
					error: "Internal Server Error",
					description: err
				});
			});
		}
	} else if (!req.query.page) {
		InsightController.getAllInsights(req.query.fields?.split(",").join(" "))
		.then(insights => {
			res.status(200)
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.json({
				result: insights || []
			});
		})
		.catch(err => {
			res.status(500).json({
				error: "Internal Server Error",
				description: err
			});
		});
	}
});

router.head("/", (req, res) => {
	InsightController.getAllInsights(req.query.fields?.split(",").join(" "))
	.then(() => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.sendStatus(200);
	})
	.catch(() => {
		res.sendStatus(500);
	});
});

router.post("/insight", (req, res) => {
	const insightData = {};
	for (const key in req.body) insightData[key] = req.body[key];
	InsightController.createNewInsight(insightData)
	.then(result => {
		res 
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.status(201)
			.json({
				result: result
			});
	})
	.catch(err => {
		res.status(500).json({
			error: "Internal Server Error",
			description: err
		});
	});
});

router.get("/insight/:insight_id", (req, res) => {
	InsightController.getInsightById(req.params.insight_id, req.query.fields?.split(",").join(" "))
	.then(insight => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.status(insight ? 200 : 204)
			.json({
				result: insight || []
			});
	})
	.catch(err => {
		res.status(500).json({
			error: "Internal Server Error",
			description: err
		});
	});
});

router.head("/insight/:insight_id", (req, res) => {
	InsightController.getInsightById(req.params.insight_id, req.query.fields?.split(",").join(" "))
	.then(insight => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.sendStatus(insight ? 200 : 204)
	})
	.catch(() => {
		res.sendStatus(500);
	});
});

router.patch("/insight/:insight_id", (req, res) => {
	const updateOptions = {}
	for (const key in req.body) updateOptions[key] = req.body[key];
	InsightController.updateInsightById(req.params.insight_id, updateOptions)
	.then(result => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.status(200)
			.json({
				result: result
			});
	})
	.catch(err => {
		if (err instanceof ResourceNotFoundError) {
			res.status(404).json({
				error: "Not Found",
				description: err
			});
		} else {
			res.status(500).json({
				error: "Internal Server Error",
				description: err
			});
		}
	});
});

router.delete("/insight/:insight_id", (req, res) => {
	fs.rmSync(path.join(__dirname, "..", "..", "static", "images", "insights", `${lodash.kebabCase(req.params.insight_id)}`), {
		recursive: true,
		force: true,
	});
	InsightController.deleteInsightById(req.params.insight_id)
	.then(result => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.status(200)
			.json({
				result: result
			});
	})
	.catch(err => {
		if (err instanceof ResourceNotFoundError) {
			res.status(404).json({
				error: "Not Found",
				description: err
			});
		} else {
			res.status(500).json({
				error: "Internal Server Error",
				description: err
			});
		}
	});
});

router.all("/*", (req, res) => {
	res.status(501).json({
		error: `${req.method.toUpperCase()} requests aren't supported for ${req.originalUrl}`
	});
});

module.exports = router;