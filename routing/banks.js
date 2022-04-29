const { Router } = require("express");
const connection = require("./data/dbconnection");
const { toUpper, toLower, capitalize } = require("lodash");
const { get } = require("axios");
const router = Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM Visbanking.IndividualBankHTMLReports ORDER BY BankName ASC;", (err, results, fields) => {
        if (err) {
            res.status(500).redirect("/error");
        } else {
            res.render("banks", {
                banks: results,
                title: "Banks - Visbanking",
                path: req.originalUrl
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

router.get("/bank/:state_abbreviation/:city_name/:bank_id", (req, res) => {
    const { state_abbreviation: state, city_name: city, bank_id: bank } = req.params;
    connection.query(`SELECT BankName, URL, Tier FROM Visbanking.IndividualBankHTMLReports WHERE State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = '${toUpper(bank)}';`, (err, results, fields) => {
        if (err) {
            res.redirect("/error");
        } else {
            const { BankName: bankName, URL: source, Tier: tier } = results[0];
            const tiers = ['Free', 'Professional', 'Premium', 'Enterprise'];
            const title = `${bankName} - Visbanking`;
            if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(tier)) {
                get(source)
                .then(() => {
                    res.render("bank", {
                        path: req.originalUrl,
                        access: true,
                        title,
                        iframeSource: source,
                        bankName
                    });
                })
                .catch(() => {
                    connection.query(`SELECT BankName, City, State, IDRSSD, Status FROM Visbanking.IndividualBankHTMLReports WHERE State = '${state}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`, (err, results, fields) => {
                        res.render("bank", {
                            path: req.originalUrl,
                            access: true,
                            title,
                            iframeSource: source,
                            error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
                            alternativeBanks: results
                        });
                    });
                })
            } else {
                res.render("bank", {
                    path: req.originalUrl,
                    access: false,
                    userTier: req.cookies.tier,
                    tier: { 
                        ...require("./data/.pricingTiers.json")[toLower(tier)],
                        tier: tier
                    },
                    title
                });
            }
        }
    });
});

module.exports = router;