const express = require("express");
const lodash = require("lodash");
const router = express.Router();
const connection = require("./dbconnection");

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Insights ORDER BY Views DESC;", (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else {
            const business = results.filter(result => {
                return result.Topics.split(", ").includes("business")
            });
            const banks = results.filter(result => {
                return result.Topics.split(", ").includes("banks")
            });
            const financial = results.filter(result => {
                return result.Topics.split(", ").includes("financial")
            });
            const market = results.filter(result => {
                return result.Topics.split(", ").includes("market")
            });
            const politics = results.filter(result => {
                return result.Topics.split(", ").includes("politics")
            });
			res.render("insights", {
				title: "Insights - Visbanking",
				path: "/insights",
                posts: results,
                business,
                banks,
                financial,
                market,
                politics
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
            connection.query(`UPDATE Insights SET Views = ${results[0].Views+1} WHERE ID = '${req.params.article_id}';`, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    res.redirect("/error");
                }
            });
            const body = [], topics = [];
            results[0].Body.split("  ").forEach(par => {
                body.push(par);
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
