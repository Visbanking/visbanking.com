const express = require("express");
const lodash = require("lodash");
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
            const body = [], topics = [];
            results[0].Body.split("  ").forEach(par => {
                body.push(`<p>${par}</p>`);
            });
            results[0].Topics.split(",").forEach(topic => {
                topics.push(lodash.capitalize(topic.trim()));
            });
            const post = {
                Title: results[0].Title,
                Body: body,
                Image: results[0].Image,
                Date: results[0].Date,
                Topics: topics
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
