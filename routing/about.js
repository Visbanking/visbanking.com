const express = require("express");
const connection = require("../data/dbconnection");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("about", {
		title: "Who We Are | Visbanking",
		path: "/about",
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
});

router.get("/team", (req, res) => {
	connection.query("SELECT * FROM Members;", (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else {
			res.render("team", {
				title: "Our Team | Visbanking",
				path: "/about/team",
				members: results,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

module.exports = router;
