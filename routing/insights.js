const express = require("express");
const router = express.Router();
const connection = require("./data/dbconnection");

router.get("/", (req, res) => {
    connection.query("SELECT * FROM Insights ORDER BY Date DESC", (err, results, fields) => {
        const newest = results;
        connection.query("SELECT * FROM Insights ORDER BY Views DESC;", (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else {
                const business = results.filter(result => {
                    return result.Topic === "Business";
                });
                const banks = results.filter(result => {
                    return result.Topic === "Banks";
                });
                const financial = results.filter(result => {
                    return result.Topic === "Financial";
                });
                const market = results.filter(result => {
                    return result.Topic === "Market";
                });
                const politics = results.filter(result => {
                    return result.Topic === "Politics";
                });
                res.render("insights", {
                    title: "Insights - Visbanking",
                    path: "/insights",
                    top: results,
                    newest,
                    business,
                    banks,
                    financial,
                    market,
                    politics
                });
            }
        });
    })
});

router.get("/insight/:article_id", (req, res) => {
    connection.query(`SELECT * FROM Insights WHERE ID != '${req.params.article_id}' LIMIT 0, 3`, (err, results, fields) => {
        const latest = results;
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
                const body = [];
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
                connection.query(`SELECT * FROM Insights WHERE ID != '${req.params.article_id}' AND Topics LIKE '%${results[0].Topics.split(", ")[0]}%' LIMIT 0, 3;`, (err, results, fields) => {
                    const related = results;
                    res.render("insight", {
                        title: post.Title,
                        path: req.originalUrl,
                        post,
                        latest,
                        related
                    });
                });
            }
        });
    })
});

module.exports = router;
