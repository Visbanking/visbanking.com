const { Router } = require("express");
const connection = require("../data/dbconnection");
const { toUpper, toLower, capitalize } = require("lodash");
const { JSDOM } = require("jsdom");
const { readFile, getPDFUrl } = require("../data/s3Client");
const router = Router();

router.get("/", (req, res) => {
    if (!req.query.state && !req.query.city && !req.query.status && !req.query.bankName) {
        connection.query("SELECT * FROM Visbanking.AllReports WHERE BankName IS NOT NULL AND State <> '' GROUP BY IDRSSD ORDER BY BankName ASC;", (err, results, fields) => {
            if (err) {
                res.redirect("/banks/bank");
            } else {
                res.render("banks", {
                    banks: results,
                    title: "Banks - Visbanking",
                    path: req.originalUrl,
                    loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                });
            }
        });
    } else {
        const { bankName, state, city, status } = req.query;
        if (bankName && state && city && status) res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}?status=${status}&bankName=${bankName}`);
        else if (bankName && state && city) res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}?bankName=${bankName}`);
        else if (bankName && state && status) res.redirect(`/banks/bank/${toUpper(state)}?status=${status}&bankName=${bankName}`);
        else if (state && city && status) res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}?status=${status}`);
        else if (bankName && state) res.redirect(`/banks/bank/${toUpper(state)}?bankName=${bankName}`);
        else if (state && city) res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}`);
        else if (state && status) res.redirect(`/banks/bank/${toUpper(state)}?status=${status}`);
        else if (state) res.redirect(`/banks/bank/${toUpper(state)}`);
        else res.redirect("/banks/bank");
    }
});

router.get("/:state_abbrevitation", (req, res) => {
    const { state_abbrevitation: state } = req.params;
    if (state !== toUpper(state)) return res.redirect(`/banks/bank/${toUpper(state)}`);
    connection.query(`SELECT * FROM Visbanking.AllReports WHERE BankName IS NOT NULL AND State = '${toUpper(state)}' GROUP BY IDRSSD ORDER BY BankName ASC;`, (err, results, fields) => {
        if (err) {
            res.redirect("/banks/bank");
        } else {
            if (results.length === 0) {
                return res.redirect("/banks/bank");
            }
            res.render("banks", {
                banks: results,
                title: `Banks in ${toUpper(state)}, US - Visbanking`,
                path: req.originalUrl,
                state,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
            });
        }
    });
});

router.get("/:state_abbreviation/:city_name", (req, res) => {
    const { state_abbreviation: state, city_name: city } = req.params;
    if (state !== toUpper(state) || city !== city.split(" ").map(word => capitalize(word)).join(" ")) return res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}`);
    connection.query(`SELECT * FROM Visbanking.AllReports WHERE BankName IS NOT NULL AND State = '${toUpper(state)}' AND City = '${toUpper(city)}' GROUP BY IDRSSD ORDER BY BankName ASC;`, (err, results, fields) => {
        if (err) {
            res.redirect("/banks/bank");
        } else {
            if (results.length === 0) {
                return res.redirect(`/banks/bank/${state}`);
            }
            res.render("banks", {
                banks: results,
                title: `Banks in ${city.split(" ").map(word => capitalize(word)).join(" ")}, ${toUpper(state)}, US - Visbanking`,
                path: req.originalUrl,
                state,
                city: city.split(" ").map(word => capitalize(word)).join(" "),
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
            });
        }
    });
});

router.all("*", (req, res, next) => {
    if (req.originalUrl.split("/").slice(-1)[0] === "general") next();
    else if (req.cookies.user && req.cookies.tier && req.cookies.session_id) {
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

router.get("/:state_abbreviation/:city_name/:bank_id", (req, res) => {
    const { state_abbreviation: state, city_name: city, bank_id: bank } = req.params;
    if (state !== toUpper(state) || city !== city.split(" ").map(word => capitalize(word)).join(" ")) return res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}/${bank}`);
    connection.query(`SELECT BankName, Tier FROM Visbanking.AllReports WHERE FileExtension = 'pdf' AND State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = ${toUpper(bank)};`, async (err, results, fields) => {
        if (err) {
            res.redirect(`/banks/bank/${state}/${city}`);
        } else {
            const { BankName: bankName, Tier: tier } = results[0];
            const tiers = ['Free', 'Professional', 'Premium', 'Enterprise'];
            const title = `${bankName.split(" ").map(word => capitalize(word)).join(" ")} - Visbanking`;
            if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(tier)) {
                getPDFUrl('ds-allreports', `individual-bank/pdf/call-report/${bank}.pdf`)
                .then(pdfSource => {
                    res.render("reports/bank", {
                        path: req.originalUrl,
                        access: true,
                        title,
                        pdfSource,
                        state,
                        city,
                        bank,
                        loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                    });
                })
                .catch(() => {
                    connection.query(`SELECT BankName, City, State, IDRSSD, Status FROM Visbanking.AllReports WHERE FileExtension = 'html' AND Tier <> 'Free' AND State = '${state}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`, (err, results, fields) => {
                        res.render("reports/bank", {
                            path: req.originalUrl,
                            access: true,
                            title,
                            error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
                            alternativeBanks: results,
							loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    });
                });
            } else {
                res.render("reports/bank", {
                    path: req.originalUrl,
                    access: false,
                    userTier: req.cookies.tier,
                    tier: { 
                        ...require("../data/.pricingTiers.json")[toLower(tier)],
                        tier: tier
                    },
                    title,
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                });
            }
        }
    });
});

router.get("/:state_abbreviation/:city_name/:bank_id/:report_page_name", (req, res) => {
    const { state_abbreviation: state, city_name: city, bank_id: bank, report_page_name: page } = req.params;
    if (state !== toUpper(state) || city !== city.split(" ").map(word => capitalize(word)).join(" ")) return res.redirect(`/banks/bank/${toUpper(state)}/${city.split(" ").map(word => capitalize(word)).join(" ")}/${bank}/${page}`);
    connection.query(`SELECT BankName, Tier, URL FROM Visbanking.AllReports WHERE State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = ${toUpper(bank)} AND FileExtension = 'html' AND Tier <> 'Free';`, async (err, results, fields) => {
        if (err) {
            res.redirect(`/banks/bank/${state}/${city}/${bank}/${page}`);
        } else {
            const { BankName: bankName, Tier: tier, URL: url } = results[0];
            const tiers = ['Free', 'Professional', 'Premium', 'Enterprise'];
            const title = `${bankName.split(" ").map(word => capitalize(word)).join(" ")} - Visbanking`;
            if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(tier)) {
                const fileToRequest = (page_name) => {
                    if (page_name === "bank") return "index.html";
                    else if (page_name === "enforcement") return "enforcement-actions.html";
                    else if (page_name === "balance") return "balance-sheet.html";
                    else if (page_name === "income") return "income-statement.html";
                    else if (page_name === "loans") return "loans.html";
                    else return res.redirect(`/banks/bank/${state}/${city}/${bank}/bank`);
                }
                const renderHTMLReport = () => {
                    readFile('ds-allreports', `${url.split("/").slice(3, -1).join("/")}/${fileToRequest(page)}`)
                    .then(report => {
                        const reportHTML = new JSDOM(report);
                        const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
                        res.render("reports/bank", {
                            path: req.originalUrl,
                            access: true,
                            title,
                            reportBody,
                            state,
                            city,
                            bank,
                            loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                        });
                    })
                    .catch(() => {
                        connection.query(`SELECT BankName, City, State, IDRSSD, Status FROM Visbanking.AllReports WHERE FileExtension = 'html' AND Tier <> 'Free' AND State = '${state}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`, (err, results, fields) => {
                            res.render("reports/bank", {
                                path: req.originalUrl,
                                access: true,
                                title,
                                error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
                                alternativeBanks: results,
								loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                            });
                        });
                    });
                };
                renderHTMLReport();
            } else {
                if ((req.cookies.tier === "Free") || !req.cookies.tier) {
                    if (page !== "general") return res.redirect(`/banks/bank/${state}/${city}/${bank}/general`);
                    connection.query(`SELECT BankName, URL from Visbanking.AllReports WHERE FileExtension = 'html' AND Tier = 'Free' AND State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = ${toUpper(bank)};`, (err, results, fields) => {
                        if (err) {
                            res.redirect(`/banks/bank/${state}/${city}/${bank}/general`);
                        } else {
                            readFile('ds-allreports-free', `call-report/${bank}/index.html`)
                            .then(report => {
                                const reportHTML = new JSDOM(report);
                                const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
                                res.render("reports/bank", {
                                    path: req.originalUrl,
                                    access: true,
                                    title,
                                    reportBody,
                                    state,
                                    city,
                                    bank,
                                    loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                                });
                            })
                            .catch(() => {
                                connection.query(`SELECT BankName, City, State, IDRSSD, Status FROM Visbanking.IndividualBankHTMLReports WHERE BankName IS NOT NULL State = '${state}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`, (err, results, fields) => {
                                    res.render("reports/bank", {
                                        path: req.originalUrl,
                                        access: true,
                                        title,
                                        error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
                                        alternativeBanks: results,
										loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                                    });
                                });
                            });
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;