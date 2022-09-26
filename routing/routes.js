const express = require("express");
const connection = require("../data/dbconnection");
const tiers = require("../data/.pricingTiers.json");
const path = require("path");
const { checkCache, setCache } = require("../data/caching");
const { renderFile } = require("pug");
const { get } = require("./../data/api/APIClient");
const router = express.Router();

router.get("/", (req, res) => {
	if (req.query.formSubmitted === "1") {
		res.cookie("popUpSubmitted", req.query.formSubmitted);
		return res.redirect("/");
	}
	get("/api/insights")
	.then(({ result:insights }) => {
		res.render("index", {
			title: "US Banking Data Visualization | Bank Industry Analysis | Visbanking",
			path: "/",
			insights: insights.sort((a, b) => new Date(b.Date) - new Date(a.Date)).slice(0, 4),
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			loadPopUp: false
		});
	})
	.catch(err => {
		console.error(err);
		res.redirect("/error");
	});
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
