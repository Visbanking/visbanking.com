const { Router } = require("express");
const { verify } = require("jsonwebtoken");
const AdminController = require("../../controllers/admin.controller");
const ResourceNotFoundError = require("../../data/errors/ResourceNotFoundError");
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
	AdminController.getAllAdmins(req.query.fields?.split(",").join(" "))
	.then(admins => {
		res.status(200)
		.setHeader("Content-Type", "application/json")
		.setHeader("Cache-Control", "no-cache")
		.json({
			result: admins || []
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
	AdminController.getAllAdmins(req.query.fields?.split(",").join(" "))
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

router.post("/admin", (req, res) => {
	const adminData = {};
	for (const key in req.body) adminData[key] = req.body[key];
	AdminController.createNewAdmin(adminData)
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

router.get("/admin/:admin_id", (req, res) => {
	AdminController.getAdminById(req.params.admin_id, req.query.fields?.split(",").join(" "))
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

router.head("/admin/:admin_id", (req, res) => {
	AdminController.getAdminById(req.params.admin_id, req.query.fields?.split(",").join(" "))
	.then(admin => {
		res
			.setHeader("Content-Type", "application/json")
			.setHeader("Cache-Control", "no-cache")
			.sendStatus(insight ? 200 : 204)
	})
	.catch(() => {
		res.sendStatus(500);
	});
});

router.patch("/admin/:admin_id", (req, res) => {
	const updateOptions = {}
	for (const key in req.body) updateOptions[key] = req.body[key];
	AdminController.updateAdminById(req.params.admin_id, updateOptions)
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

router.delete("/admin/:admin_id", (req, res) => {
	AdminController.deleteAdminById(req.params.admin_id)
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