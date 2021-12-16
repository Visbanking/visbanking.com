const express = require("express");
const path = require("path");
const { readFileSync, read } = require("fs");
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
        title: 'Terms and Conditions',
        text: terms.toString("utf-8")
    });
});

router.get("/cookies", (req, res) => {
    const cookies = readFileSync(path.join(__dirname, "..", "static", "files", "cookies.md"));
    res.render("privacy", {
        title: 'Cookies Policy',
        text: cookies.toString("utf-8")
    });
});

router.get("/disclaimer", (req, res) => {  
    const disclaimer = readFileSync(path.join(__dirname, "..", "static", "files", "disclaimer.md"));
    res.render("privacy", {
        title: 'Disclaimer',
        text: disclaimer.toString("utf-8")
    });
});

module.exports = router;