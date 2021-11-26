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

router.get("/insight/:article_id", (req, res) => {
    connection.query(`SELECT * FROM Insights WHERE ID = '${req.params.article_id}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            res.redirect("/insights");
        } else {
            const body = [];
            results[0].Body.split("  ").forEach(par => {
                body.push(`<p>${par}</p>`);
            });
            const post = {
                Title: results[0].Title,
                Body: body,
                Image: results[0].Image,
                Date: results[0].Date,
                Topics: results[0].Topics
            }
            res.render("insight", {
                title: results[0].Title,
                path: req.originalUrl,
                post
            });
        }
    });
});

module.exports = router;
