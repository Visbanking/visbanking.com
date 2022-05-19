const { Router } = require("express");
const connection = require("../data/dbconnection");
const { JSDOM } = require("jsdom");
const { readFile, getPDFUrl } = require("../data/s3Client");
const { toUpper, toLower, capitalize } = require("lodash");
const router = Router();

router.get("/", (req, res) => {
    connection.query("SELECT State, SectionName FROM Visbanking.AllReports WHERE ReportID = 5 AND State <> '' ORDER BY RAND() LIMIT 0, 9;", (err, results, fields) => {
        if (err) {
            res.redirect("/banks");
        } else {
            res.render("macros", {
                title: "Macro Reports - Visbanking",
                path: req.originalUrl,
                reports: results
            });
        }
    });
});

router.get("/deposits", (req, res) => {
    connection.query("SELECT State, SectionName FROM Visbanking.AllReports WHERE ReportID = 5 AND State <> '' ORDER BY State ASC;", (err, results, fields) => {
        if (err) {
            res.redirect("/banks/macro");
        } else {
            console.log(results);
            res.render("macros", {
                title: "Macro Deposits Reports - Visbanking",
                path: req.originalUrl,
                reports: results
            });
        }
    });
})

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

router.get("/deposits/:id", (req, res) => {
    const id = req.params.id;
    const tiers = ["Free", "Professional", "Premium", "Enterprise"];
    if (id === "general") {
        connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 4;`, (err, results, fields) => {
            if (err || !results[0]) {
                res.redirect("/banks/macro");
            } else {
                const { Tier, resourceTier, URL } = results[0];
                if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                    readFile('ds-allreports', URL.split("/").slice(-3).join("/"))
                    .then(report => {
                        const reportHTML = new JSDOM(report);
                        console.log(reportHTML.window.document.querySelectorAll("head script"));
                        const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
                        res.render("reports/macro", {
                            path: req.originalUrl,
                            access: true,
                            title: "Deposits Overview - Visbanking",
                            reportBody,
                            loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    })
                }
            }
        });
    } else if (id === "composition") {
        connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 5 AND SectionName = 'All_Banks-Deposit_Composition_Table';`, (err, results, fields) => {
            if (err || !results[0]) {
                res.redirect("/banks/macro");
            } else {
                const { Tier: resourceTier, URL } = results[0];
                console.log(URL);
                if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                    getPDFUrl('ds-allreports', URL.split("/").slice(-3).join("/"))
                    .then(pdfSource => {
                        res.render("reports/macro", {
                            title: "Deposit Composition Table - Visbanking",
                            path: req.originalUrl,
                            access: true,
                            pdfSource,
                            loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    })
                    .catch(() => res.redirect("/banks/macro"));
                } else {
                    res.render("reports/macro", {
                        path: req.originalUrl,
                        access: false,
                        userTier: req.cookies.tier,
                        tier: { 
                            ...require("../data/.pricingTiers.json")[toLower(resourceTier)],
                            tier: resourceTier
                        },
                        title: "Deposit Composition Table - Visbanking"
                    });
                }
            }
        });
    } else if (id === "utilization") {
        connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 5 AND SectionName = 'All_Banks-Deposit_Utilization_Table';`, (err, results, fields) => {
            if (err || !results[0]) {
                res.redirect("/banks/macro");
            } else {
                const { Tier: resourceTier, URL } = results[0];
                if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                    getPDFUrl('ds-allreports', URL.split("/").slice(-3).join("/"))
                    .then(pdfSource => {
                        res.render("reports/macro", {
                            title: "Deposit Utilization Table - Visbanking",
                            path: req.originalUrl,
                            access: true,
                            pdfSource,
                            loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    })
                    .catch(() => res.redirect("/banks/macro"));
                } else {
                    res.render("reports/macro", {
                        path: req.originalUrl,
                        access: false,
                        userTier: req.cookies.tier,
                        tier: {
                            ...require("../data/.pricingTiers.json")[toLower(resourceTier)],
                            tier: resourceTier
                        },
                        title: "Deposit Utilization Table - Visbanking"
                    });
                }
            }
        });
    } else {
        if (id.length > 2 && toLower(id) === "micronesia") {
            if (id !== capitalize(id)) res.redirect(`/banks/macro/deposits/${capitalize(id)}`);
            else {
                connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 5 AND SectionName = 'Federated_State_of_Micronesia';`, (err, results, fields) => {
                    if (err || !results[0]) {
                        res.redirect("/banks/macro");
                    } else {
                        const { Tier: resourceTier, URL } = results[0];
                        if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                            getPDFUrl('ds-allreports', URL.split("/").slice(-3).join("/"))
                            .then(pdfSource => {
                                res.render("reports/macro", {
                                    title: `Deposits Report for ${id} - Visbanking`,
                                    path: req.originalUrl,
                                    access: true,
                                    pdfSource,
                                    loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                                });
                            }).catch(() => res.redirect("/banks/macro"));
                        } else {
                            res.render("reports/macro", {
                                path: req.originalUrl,
                                access: false,
                                userTier: req.cookies.tier,
                                tier: {
                                    ...require("../data/.pricingTiers.json")[toLower(resourceTier)],
                                    tier: resourceTier
                                },
                                title: `Deposits Report for ${id} - Visbanking`
                            });
                        }
                    }
                });
            }
        }
        else if (id !== toUpper(id)) res.redirect(`/banks/macro/deposits/${toUpper(id)}`);
        else {
            connection.query(`SELECT Tier, URL FROM Visbanking.AllReports WHERE ReportID = 5 AND State = '${id}';`, (err, results, fields) => {
                if (err || !results[0]) {
                    res.redirect("/banks/macro");
                } else {
                    const { Tier: resourceTier, URL } = results[0];
                    if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(resourceTier)) {
                        getPDFUrl('ds-allreports', URL.split("/").slice(-3).join("/"))
                        .then(pdfSource => {
                            res.render("reports/macro", {
                                title: `Deposits Report for ${id} - Visbanking`,
                                path: req.originalUrl,
                                access: true,
                                pdfSource,
                                loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                            });
                        })
                        .catch(() => res.redirect("/banks/macro"));
                    } else {
                        res.render("reports/macro", {
                            path: req.originalUrl,
                            access: false,
                            userTier: req.cookies.tier,
                            tier: {
                                ...require("../data/.pricingTiers.json")[toLower(resourceTier)],
                                tier: resourceTier
                            },
                            title: `Deposits Report for ${id} - Visbanking`
                        });
                    }
                }
            });
        }
    }
});

module.exports = router;