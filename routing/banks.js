const { Router } = require("express");
const connection = require("./data/dbconnection");
const { toUpper, toLower } = require("lodash");
const router = Router();

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

router.get("/:state_abbreviation/:city_name/:bank_id", (req, res) => {
    const { state_abbreviation: state, city_name: city, bank_id: bank } = req.params;
    connection.query(`SELECT BankName, URL, Tier FROM Visbanking.IndividualBankHTMLReports WHERE State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = '${toUpper(bank)}';`, (err, results, fields) => {
        if (err) {
            res.redirect("/error");
        } else {
            const { BankName: bankName, URL: source, Tier: tier } = results[0];
            const tiers = ['Free', 'Professional', 'Premium', 'Enterprise'];
            if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(tier)) {
                res.render("bank", {
                    path: req.originalUrl,
                    access: true,
                    title: bankName,
                    iframeSource: source
                });
            } else {
                res.render("bank", {
                    path: req.originalUrl,
                    access: false,
                    userTier: req.cookies.tier,
                    tier: { 
                        ...require("./data/.pricingTiers.json")[toLower(tier)],
                        tier: tier
                    },
                    title: bankName
                });
            }
        }
    });
});

module.exports = router;