const express = require("express");
const path = require("path");
const { readFileSync, read } = require("fs");
const marked = require("marked");
const router = express.Router();

router.get("/privacy", (req, res) => {
    const privacy = readFileSync(path.join(__dirname, "..", "static", "files", "privacy.md"));
    res.render("privacy", {
        title: 'Privacy Policy',
        text: privacy.toString("utf-8")
    });
});

router.get("/terms", (req, res) => {
    const terms = readFileSync(path.join(__dirname, "..", "static", "files", "terms.md"));
    res.render("privacy", {
        title: 'Terms of Use',
        text: terms.toString("utf-8")
    });
});

router.get("/cookies", (req, res) => {
    const cookies = readFileSync(path.join(__dirname, "..", "static", "files", "cookies.md"));
    res.render("privacy", {
        title: 'Cookie Policy',
        text: cookies.toString("utf-8")
    });
});

router.get("/disclaimer", (req, res) => {  
    const disclaimer = readFileSync(path.join(__dirname, "..", "static", "files", "disclaimer.md"));
    res.render("privacy", {
        title: 'Cookie Policy',
        text: disclaimer.toString("utf-8")
    });
});

module.exports = router;