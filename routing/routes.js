const express = require("express");
const connection = require("../data/dbconnection");
const tiers = require("../data/.pricingTiers.json");
const path = require("path");
const { checkCache, setCache } = require("../data/caching");
const { renderFile } = require("pug");
const router = express.Router();

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Insights ORDER BY Date DESC LIMIT 0, 3;", (err, results, fields) => {
		const latest = results;
		connection.query("SELECT * FROM Insights ORDER BY Views DESC LIMIT 0, 3;", (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else {
				res.render("index", {
					title: "US Banking Data Visualization | Bank Industry Analysis | Visbanking",
					path: "/",
					latest,
					featured: results,
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
				});
			}
		});
	});
});

router.get("/services", checkCache, (req, res) => {
	res.render("services", {
		title: "Credit Quality Trends in Banking | US Bank Market Share | Visbanking",
		path: "/services",
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services.pug"), {
			title: "Credit Quality Trends in Banking | US Bank Market Share | Visbanking",
			path: "/services",
		})
	);
});

router.get("/pricing", checkCache, (req, res) => {
	res.render("pricing", {
		title: "Pricing Plans | Visbanking",
		path: "/pricing",
		tiers,
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "pricing.pug"), {
			title: "Pricing Plans | Visbanking",
			path: "/pricing",
			tiers,
		})
	);
});

router.get("/faq", (req, res) => {
	connection.query("SELECT * FROM Questions;", (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else {
			res.render("faq", {
				title: "Frequently Asked Questions | Visbanking",
				path: "/faq",
				questions: results,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

module.exports = router;
