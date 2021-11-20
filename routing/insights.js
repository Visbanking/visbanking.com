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

router.get("/article/:article_id", (req, res, next) => {
    connection.query(`SELECT * FROM Insights WHERE ID = '${req.params.article_id}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            res.redirect("/insights");
        } else {
            res.render("insight", {
                title: results[0].Title,
                path: req.originalUrl,
                post: results[0]
            });
        }
    });
});

module.exports = router;
