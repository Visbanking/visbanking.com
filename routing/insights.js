const express = require("express");
const router = express.Router();
const connection = require("./dbconnection");

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Insights;", (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else {
			res.render("insights", {
				title: "Insights - Visbanking",
				path: "/insights",
                posts: results
			});
        }
	});
});

router.get("/:article_id", (req, res, next) => {
	res.send(req.params);
	// Query the database for an article with id = article_id
	// If query return an object, render a template passing the object to show the article
	// If query doesn't return an object, set status code as 404 and redirect
});

module.exports = router;
