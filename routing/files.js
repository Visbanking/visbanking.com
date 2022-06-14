const express = require("express");
const path = require("path");
const connection = require("../data/dbconnection");
const { writeFile } = require("fs");
const router = express.Router();

router.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "robots.txt"));
});

router.get("/sitemap.xml", async (req, res) => {
    let sitemap = '<?xml version="1.1" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const static = ["/", "/about", "/about/team", "/services", "/insights", "/contact", "/buy", "/pricing", "/login", "/signup", "/terms", "/privacy", "/cookies", "/disclaimer"];
    for (let path of static) {
        sitemap += `\t<url><loc>https://visbanking.com${path}</loc></url>\n`;
    }
    connection.query('SELECT ID FROM Insights;', (err, insights, fields) => {
        if (err) throw err
        for (let insight of insights) {
            sitemap += `\t<url><loc>https://visbanking.com/insights/insight/${insight.ID}</loc></url>\n`;
        }
        sitemap += '</urlset>';
        writeFile(path.join(__dirname, "..", "sitemap.xml"), sitemap, () => {
            res.sendFile(path.join(__dirname, "..", "sitemap.xml"));
        });
    });
});

router.all(["*/robots", "*/robots.txt"], (req, res) => {
    res.redirect("/robots.txt");
});

router.all(["*/sitemap", "*/sitemap.xml"], (req, res) => {
    res.redirect("/sitemap.xml");
});

module.exports = router;