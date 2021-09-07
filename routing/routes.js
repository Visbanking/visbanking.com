const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Visbanking - US Banking Data Visualized",
        path: "/"
    });
});

router.get("/about", (req, res) => {
    res.render("about", {
        title: "Who We Are - Visbanking",
        path: "/about"
    });
});

router.get("/services", (req, res) => {
    res.render("services", {
        title: "Our Services - Visbanking",
        path: "/services"
    });
});

module.exports = router;