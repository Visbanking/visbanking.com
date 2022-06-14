const { Router } = require("express");
const connection = require("../../data/dbconnection");
const { toUpper, toLower, capitalize } = require("lodash");
const { JSDOM } = require("jsdom");
const { readFile, getPDFUrl } = require("../../data/s3Client");
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Visbanking.AllReports WHERE Type = 'Performance';", (err, results, fields) => {
		if (err) res.redirect("/banks");
		else {
			res.render("performance", {
				title: "Performance Reports - Visbanking",
				path: req.originalUrl,
				reports: results,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
			});
		}
	});
});

router.all("*", (req, res, next) => {
    if (req.cookies.user && req.cookies.tier && req.cookies.session_id) {
        connection.query(`SELECT Email, Tier, Session_ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err || (req.cookies.session_id !== results[0].Session_ID) || (req.cookies.tier !== results[0].Tier)) {
                res.clearCookie("user");
                res.clearCookie("tier");
                res.clearCookie("session_id");
                res.redirect("/login");
            } else if (!results[0]) {
                res.clearCookie("user");
                res.clearCookie("tier");
                res.clearCookie("session_id");
                res.redirect("/signup");
            } else next();
        });
    } else {
        res.clearCookie("user");
        res.clearCookie("tier");
        res.clearCookie("session_id");
        res.redirect("/login");
    }
});

router.get("/:report_id", (req, res) => {
    const report_id = req.params.report_id;
    const tiers = ["Free", "Professional", "Premium", "Enterprise"];
    if (report_id === "general") {
        connection.query("SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 6;", (err, results, fields) => {
            if (err) {
                res.redirect("/banks/performance");
            } else {
                const { Tier: resourceTier, URL } = results[0];
                if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                    const bucket = URL.split("/")[2], key = URL.split("/").slice(3).join("/");
                    readFile(bucket, key)
                    .then(report => {
                        const reportHTML = new JSDOM(report);
                        const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
                        res.render("reports/performance", {
                            path: req.originalUrl,
                            access: true,
                            title: "Performance Overview - Visbanking",
                            reportBody,
                            loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    });
                } else {
                    res.render("reports/performance", {
                        path: req.originalUrl,
                        access: false,
                        userTier: req.cookies.tier,
                        tier: { 
                            ...require("../../data/.pricingTiers.json")[toLower(resourceTier)],
                            tier: resourceTier
                        },
                        title,
						loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                    });
                }
            }
        });
    } else res.redirect("/banks/performance");
});

module.exports = router;