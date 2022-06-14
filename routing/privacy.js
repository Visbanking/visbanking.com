const express = require("express");
const path = require("path");
const { readFileSync } = require("fs");
const { checkCache, setCache } = require("../data/caching");
const { renderFile } = require("pug");
const router = express.Router();

router.get("/privacy", checkCache, (req, res) => {
    const privacy = readFileSync(path.join(__dirname, "..", "static", "files", "policies", "privacy.md"));
    res.render("privacy", {
        title: 'Privacy Policy',
        text: privacy.toString("utf-8"),
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
    });
    setCache(`visbanking.com${req.originalUrl}`, renderFile(path.join(__dirname, "..", "views", "privacy.pug"), {
        title: 'Privacy Policy',
        text: privacy.toString("utf-8")
    }));
});

router.get("/terms", checkCache, (req, res) => {
    const terms = readFileSync(path.join(__dirname, "..", "static", "files", "policies", "terms.md"));
    res.render("privacy", {
        title: 'Terms and Conditions',
        text: terms.toString("utf-8"),
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
    });
    setCache(`visbanking.com${req.originalUrl}`, renderFile(path.join(__dirname, "..", "views", "privacy.pug"), {
        title: 'Terms and Conditions',
        text: terms.toString("utf-8")
    }));
});

router.get("/cookies", checkCache, (req, res) => {
    const cookies = readFileSync(path.join(__dirname, "..", "static", "files", "policies", "cookies.md"));
    res.render("privacy", {
        title: 'Cookies Policy',
        text: cookies.toString("utf-8"),
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
    });
    setCache(`visbanking.com${req.originalUrl}`, renderFile(path.join(__dirname, "..", "views", "privacy.pug"), {
        title: 'Cookies Policy',
        text: cookies.toString("utf-8")
    }));
});

router.get("/disclaimer", checkCache, (req, res) => {  
    const disclaimer = readFileSync(path.join(__dirname, "..", "static", "files", "policies", "disclaimer.md"));
    res.render("privacy", {
        title: 'Disclaimer',
        text: disclaimer.toString("utf-8"),
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
    });
    setCache(`visbanking.com${req.originalUrl}`, renderFile(path.join(__dirname, "..", "views", "privacy.pug"), {
        title: 'Disclaimer',
        text: disclaimer.toString("utf-8")
    }));
});

module.exports = router;