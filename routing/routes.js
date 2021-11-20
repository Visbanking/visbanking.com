const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Visbanking - US Banking Data Visualized",
        path: "/"
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
	});
});

module.exports = router;