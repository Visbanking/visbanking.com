const express = require("express");
const connection = require("../data/dbconnection");
const tiers = require("../data/.pricingTiers.json");
const path = require("path");
const { checkCache, setCache } = require("../data/caching");
const { renderFile } = require("pug");
const router = express.Router();

router.get("/", (req, res) => {
	console.log(req.query);
	if (req.query.formSubmitted === "1") {
		res.cookie("popUpSubmitted", req.query.formSubmitted);
		return res.redirect("/");
	}
	connection.query("SELECT * FROM Insights ORDER BY Date DESC LIMIT 0, 3;", (err, results, fields) => {
		const latest = results;
		connection.query("SELECT * FROM Insights ORDER BY Views DESC LIMIT 0, 3;", (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else {
				console.log(new Boolean(req.cookies.popUpSubmitted).valueOf());
				res.render("index", {
					title: "US Banking Data Visualization | Bank Industry Analysis | Visbanking",
					path: "/",
					latest,
					featured: results,
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
					loadPopUp: !new Boolean(req.cookies.popUpSubmitted).valueOf()
				});
			}
		});
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
