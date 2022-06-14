const express = require("express");
const path = require("path");
const generateSitemap = require("../data/generateSitemap");
const router = express.Router();

router.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "robots.txt"));
});

router.get("/sitemap.xml", (req, res) => {
	generateSitemap()
	.then(() => {
		res.sendFile(path.join(__dirname, "..", "sitemap.xml"));
	})
	.catch(err => {
		console.log(err);
		res.redirect("/");
	});
});

router.all(["*/robots", "*/robots.txt"], (req, res) => {
    res.redirect("/robots.txt");
});

router.all(["*/sitemap", "*/sitemap.xml"], (req, res) => {
    res.redirect("/sitemap.xml");
});

module.exports = router;