const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("about", {
        title: "Who We Are - Visbanking",
        path: "/about"
    });
});

router.get("/team", (req, res) => {
    res.render("team", {
        title: "Our Team - Visbanking",
        path: "/about/team"
    });
});

module.exports = router;