const { Router } = require("express");
const { verify } = require("jsonwebtoken");
const lodash = require("lodash");
const PressReleaseController = require("../../controllers/pressRelease.controller");
const ResourceNotFoundError = require("../../data/errors/ResourceNotFoundError");
const fs = require("fs");
const path = require("path");
const errorLogger = require("../../data/log/error.log");
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
	PressReleaseController.getAllPressReleases(req.query.fields?.split(",").join(" "))
	.then(pressReleases => {
		res.status(200)
		.setHeader("Content-Type", "application/json")
		.setHeader("Cache-Control", "no-cache")
		.json({
			result: pressReleases || []
		});
	})
	.catch(err => {
		res.status(500).json({
			error: "Internal Server Error",
			description: err
		});
	});
});

router.head("/", (req, res) => {
	PressReleaseController.getAllPressReleases(req.query.fields?.split(",").join(" "))
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

router.post("/pressRelease", (req, res) => {
	const pressReleaseData = {};
	for (const key in req.body) pressReleaseData[key] = req.body[key];
	PressReleaseController.createNewPressRelease(pressReleaseData)
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
		errorLogger.error(err);
		console.log(err);
		res.status(500).json({
			error: "Internal Server Error",
			description: err
		});
	});
});

router.get("/pressRelease/:press_release_id", (req, res) => {
	PressReleaseController.getPressReleaseById(req.params.press_release_id, req.query.fields?.split(",").join(" "))
	.then(pressRelease => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.status(pressRelease ? 200 : 204)
			.json({
				result: pressRelease || []
			});
	})
	.catch(err => {
		res.status(500).json({
			error: "Internal Server Error",
			description: err
		});
	});
});

router.head("/pressRelease/:press_release_id", (req, res) => {
	PressReleaseController.getPressReleaseById(req.params.press_release_id, req.query.fields?.split(",").join(" "))
	.then(pressRelease => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.sendStatus(pressRelease ? 200 : 204)
	})
	.catch(() => {
		res.sendStatus(500);
	});
});

router.patch("/pressRelease/:press_release_id", (req, res) => {
	const updateOptions = {}
	for (const key in req.body) updateOptions[key] = req.body[key];
	PressReleaseController.updatePressReleaseById(req.params.press_release_id, updateOptions)
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

router.delete("/pressRelease/:press_release_id", (req, res) => {
	fs.rmSync(path.join(__dirname, "..", "..", "static", "images", "pressReleases", `${lodash.kebabCase(req.params.press_release_id)}`), {
		recursive: true,
		force: true,
	});
	PressReleaseController.deletePressReleaseById(req.params.press_release_id)
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