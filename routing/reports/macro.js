const { Router } = require("express");
const connection = require("../../data/dbconnection");
const { JSDOM } = require("jsdom");
const { readFile, getPDFUrl } = require("../../data/s3Client");
const { toUpper, toLower } = require("lodash");
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Visbanking.AllReports WHERE Type = 'Macro';", (err, results, fields) => {
		if (err) {
			res.redirect("/banks");
		} else {
			res.render("macros", {
				title: "Macro Reports - Visbanking",
				path: req.originalUrl,
				reports: results,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.get("/deposits", (req, res) => {
	connection.query("SELECT * FROM Visbanking.AllReports WHERE Type = 'Macro' AND Subtype = 'Deposits';", (err, results, fields) => {
		if (err) {
			res.redirect("/banks/macro");
		} else {
			res.render("macros", {
				title: "Macro Deposits Reports - Visbanking",
				path: req.originalUrl,
				reports: results,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.all("*", (req, res, next) => {
	if (req.cookies.user && req.cookies.tier && req.cookies.session_id) {
		connection.query(`SELECT Email, Tier, Session_ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
			if (err || req.cookies.session_id !== results[0].Session_ID || req.cookies.tier !== results[0].Tier) {
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

router.get("/deposits/:id", (req, res) => {
	const id = req.params.id;
	const tiers = ["Free", "Professional", "Academic", "Premium", "Enterprise"];
	if (id === "general") {
		connection.query("SELECT Tier, URL FROM Visbanking.AllReports WHERE Type = 'Macro' AND Subtype = 'Deposits' AND SectionName = 'General';", (err, results, fields) => {
			if (err || !results[0]) {
				res.redirect("/banks/macro");
			} else {
				const { Tier: resourceTier, URL } = results[0];
				if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
					readFile("ds-allreports", URL.split("/").slice(-3).join("/")).then((report) => {
						const reportHTML = new JSDOM(report);
						const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
						res.render("reports/macro", {
							path: req.originalUrl,
							access: true,
							title: "Deposits Overview - Visbanking",
							reportBody,
							loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
						});
					});
				} else {
					res.render("reports/macro", {
						path: req.originalUrl,
						access: false,
						userTier: req.cookies.tier,
						tier: {
							...require("../../data/.pricingTiers.json")[toLower(resourceTier)],
							tier: resourceTier,
						},
						title: "Deposits Overview - Visbanking",
						loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
					});
				}
			}
		});
	} else if (id === "composition") {
		connection.query("SELECT Tier, URL FROM Visbanking.AllReports WHERE Type = 'Macro' AND Subtype = 'Deposits' AND SectionName = 'Composition';", (err, results, fields) => {
			if (err || !results[0]) {
				res.redirect("/banks/macro");
			} else {
				const { Tier: resourceTier, URL } = results[0];
				if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
					getPDFUrl("ds-allreports", URL.split("/").slice(-3).join("/"))
						.then((pdfSource) => {
							res.render("reports/macro", {
								title: "Deposit Composition Table - Visbanking",
								path: req.originalUrl,
								access: true,
								pdfSource,
								loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
							});
						})
						.catch(() => res.redirect("/banks/macro"));
				} else {
					res.render("reports/macro", {
						path: req.originalUrl,
						access: false,
						userTier: req.cookies.tier,
						tier: {
							...require("../../data/.pricingTiers.json")[toLower(resourceTier)],
							tier: resourceTier,
						},
						title: "Deposit Composition Table - Visbanking",
						loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
					});
				}
			}
		});
	} else if (id === "utilization") {
		connection.query("SELECT Tier, URL FROM Visbanking.AllReports WHERE Type = 'Macro' AND Subtype = 'Deposits' AND SectionName = 'Utilization';", (err, results, fields) => {
			if (err || !results[0]) {
				res.redirect("/banks/macro");
			} else {
				const { Tier: resourceTier, URL } = results[0];
				if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
					getPDFUrl("ds-allreports", URL.split("/").slice(-3).join("/"))
						.then((pdfSource) => {
							res.render("reports/macro", {
								title: "Deposit Utilization Table - Visbanking",
								path: req.originalUrl,
								access: true,
								pdfSource,
								loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
							});
						})
						.catch(() => res.redirect("/banks/macro"));
				} else {
					res.render("reports/macro", {
						path: req.originalUrl,
						access: false,
						userTier: req.cookies.tier,
						tier: {
							...require("../../data/.pricingTiers.json")[toLower(resourceTier)],
							tier: resourceTier,
						},
						title: "Deposit Utilization Table - Visbanking",
						loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
					});
				}
			}
		});
	} else {
		if (id !== toUpper(id)) res.redirect(`/banks/macro/deposits/${toUpper(id)}`);
		else {
			connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE Type = 'Macro' AND Subtype = 'Deposits' AND State = '${id}';`, (err, results, fields) => {
				if (err || !results[0]) {
					res.redirect("/banks/macro");
				} else {
					const { Tier: resourceTier, URL } = results[0];
					if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
						getPDFUrl("ds-allreports", URL.split("/").slice(-3).join("/"))
							.then((pdfSource) => {
								res.render("reports/macro", {
									title: `Deposits Report for ${id} - Visbanking`,
									path: req.originalUrl,
									access: true,
									pdfSource,
									loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
								});
							})
							.catch(() => res.redirect("/banks/macro"));
					} else {
						res.render("reports/macro", {
							path: req.originalUrl,
							access: false,
							userTier: req.cookies.tier,
							tier: {
								...require("../../data/.pricingTiers.json")[toLower(resourceTier)],
								tier: resourceTier,
							},
							title: `Deposits Report for ${id} - Visbanking`,
							loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
						});
					}
				}
			});
		}
	}
});

module.exports = router;
