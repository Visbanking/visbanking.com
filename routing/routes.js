const express = require("express");
const connection = require("./data/dbconnection");
const tiers = require("./data/.pricingTiers.json");
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
                    title: "Visbanking - US Banking Data Visualized",
                    path: "/",
                    latest,
                    featured: results
                });
            }
        });
    });
});

router.get("/services", (req, res) => {
    res.render("services", {
        title: "Our Services - Visbanking",
        path: "/services"
    });
});

router.get("/pricing", (req, res) => {
	res.render("pricing", {
		title: "Pricing Plans - Visbanking",
        path: "/pricing",
        tiers
	});
});

router.get("/faq", (req, res) => {
    connection.query("SELECT * FROM Questions;", (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else {
            res.render("faq", {
                title: 'Frequently Asked Questions - Visbanking',
                path: "/faq",
                questions: results
            });
        }
    });
});

module.exports = router;