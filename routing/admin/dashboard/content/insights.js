const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const { marked } = require("marked");
const { get, del, post } = require("../../../../data/api/APIClient");
const fs = require("fs");
const { URLSearchParams } = require("url");
const { capitalize, kebabCase } = require("lodash");
const InsightController = require("../../../../controllers/insight.controller");
require("dotenv").config();
const router = Router();

const insightStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title)))) 
			fs.mkdirSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title)));
		cb(null, path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title)));
	},
	filename: (req, file, cb) => {
		if (file.fieldname === "headerImage") {
			if (fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`)))
				fs.rmSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`), { force: true });
			cb(null, `${lodash.camelCase(file.fieldname)}.jpg`);
		}
		if (file.fieldname === "bodyImages") {
			if (fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`)))
				fs.rmSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`), { force: true });
			cb(null, `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`);
		}
	},
});

const insight = multer({ storage: insightStorage });

router.get("/", (req, res) => {
	InsightController.getAllInsights()
	.then(insights => {
		const newestInsights = insights.sort((a, b) => new Date(b.Date) - new Date(a.Date));
		return res.json({
			success: true,
			data: newestInsights
		});
	})
	.catch(err => {
		return res.json({
			error: {
				summary: "An error ocurred while retrieving insights",
				detail: err
			}
		});
	});
	// get("/api/insights")
	// .then(({ result:insights }) => {
	// 	const newestInsights = insights.sort((a, b) => new Date(b.Date) - new Date(a.Date));
	// 	return res.json({
	// 		success: true,
	// 		data: newestInsights
	// 	});
	// })
	// .catch(err => {
	// 	return res.json({
	// 		error: {
	// 			summary: "An error ocurred while retrieving insights",
	// 			detail: err
	// 		}
	// 	});
	// });
});

router.get("/create", (req, res) => {
	if (req.cookies.admin) {
		connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else if (results[0]["COUNT(*)"] !== 0) {
				res.render("admin/dashboard/content/insights/create");
			}
		});
	} else {
		res.redirect("/admin");
	}
});

router.post("/create", insight.fields([{ name: "headerImage" }, { name: "bodyImages" }]), (req, res) => {
	const action = req.body.action;
	if (action === "Add insight") {
		const postData = {
			ID: kebabCase(req.body.title),
			Image: `/images/insights/${lodash.kebabCase(req.body.title)}/headerImage.jpg`
		};
		for (const key in req.body) postData[capitalize(key)] = req.body[key];
		InsightController.createNewInsight(postData)
		.then(() => {
			res.cookie("adminActionResponse", "Insight created successfully.");
		})
		.catch(() => {
			res.cookie("adminActionResponse", "Insight couldn't be created. Please try again.");
		})
		.finally(() => {
			res.redirect("/admin/dashboard/content");
		});
		// post("/api/insights/insight", new URLSearchParams(postData).toString())
		// .then(() => {
		// 	res.cookie("adminActionResponse", "Insight created successfully.");
		// })
		// .catch(() => {
		// 	res.cookie("adminActionResponse", "Insight couldn't be created. Please try again.");
		// })
		// .finally(() => {
		// 	res.redirect("/admin/dashboard/content");
		// });
	}
});

router.get("/edit", (req, res) => {
	InsightController.getAllInsights("title")
	.then(insights => {
		if (!insights[0]) throw new Error();
		const insightsTitles = insights.map((insightTitle) => insightTitle.Title);
		res.render("admin/dashboard/content/insights/edit", {
			insightsTitles,
		});
	})
	.catch(err => {
		console.log(err)
		// error = "There was a problem accessing the database";
		res.redirect("/admin/dashboard");
	});
	// get("/api/insights?fields=Title")
	// .then(({ result:insights }) => {
	// 	if (!insights[0]) throw new Error();
	// 	const insightsTitles = insights.map((insightTitle) => insightTitle.Title);
	// 	res.render("admin/dashboard/content/insights/edit", {
	// 		insightsTitles,
	// 	});
	// })
	// .catch(err => {
	// 	console.log(err)
	// 	// error = "There was a problem accessing the database";
	// 	res.redirect("/admin/dashboard");
	// });
});

router.post("/edit", insight.fields([{ name: "headerImage" }, { name: "bodyImages" }]), (req, res) => {
	connection.query(`UPDATE Insights SET Image = '/images/insights/${lodash.kebabCase(req.body.title)}/${req.files["headerImage"][0].filename}' WHERE Title = '${req.body.title}';`, (err, results, fields) => {
		if (!results.affectedRows) res.cookie("adminActionResponse", "Insight doesn't exist");
		else if (err) res.cookie("adminActionResponse", "Insight couldn't be updated");
		else res.cookie("adminActionResponse", "Insight updated successfully");
		res.redirect("/admin/dashboard/content");
	});
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove Insight") {
		InsightController.deleteInsightById(lodash.kebabCase(req.body.title))
		.then(() => {
			res.cookie("adminActionResponse", "Insight deleted successfully");
		})
		.catch(() => {
			res.cookie("adminActionResponse", "Insight couldn't be deleted. Please try again");
		})
		.finally(() => {
			res.redirect("/admin/dashboard/content");
		});
		// del(`/api/insights/insight/${lodash.kebabCase(req.body.title)}`)
		// .then(() => {
		// 	res.cookie("adminActionResponse", "Insight deleted successfully");
		// })
		// .catch(() => {
		// 	res.cookie("adminActionResponse", "Insight couldn't be deleted. Please try again");
		// })
		// .finally(() => {
		// 	res.redirect("/admin/dashboard/content");
		// });
	}
});

module.exports = router;