const { Router } = require("express");
const connection = require("./data/dbconnection");
const { toUpper, toLower } = require("lodash");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { JSDOM } = require("jsdom");
require("dotenv").config();
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

router.get("/:state_abbreviation/:city_name/:bank_id", (req, res) => {
    res.redirect(`/banks/${req.params.state_abbreviation}/${req.params.city_name}/${req.params.bank_id}/bank`);
});

router.get("/:state_abbreviation/:city_name/:bank_id/:report_page_name", (req, res) => {
    const { state_abbreviation: state, city_name: city, bank_id: bank, report_page_name: page } = req.params;
    connection.query(`SELECT BankName, URL, Tier FROM Visbanking.IndividualBankHTMLReports WHERE State = '${toUpper(state)}' AND City = '${toUpper(city)}' AND IDRSSD = '${toUpper(bank)}';`, async (err, results, fields) => {
        if (err) {
            res.redirect("/error");
        } else {
            const { BankName: bankName, URL: source, Tier: tier } = results[0];
            const tiers = ['Free', 'Professional', 'Premium', 'Enterprise'];
            const title = `${bankName} - Visbanking`;
            if (tiers.indexOf(req.cookies.tier) >= tiers.indexOf(tier)) {
                const s3Client = new S3Client({
                    region: 'us-east-2',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                });
                const streamToString = (stream) => new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('error', reject);
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                });
                const readFile = async (bucket, key) => {
                    const params = {
                        Bucket: bucket,
                        Key: key,
                    };
                    const command = new GetObjectCommand(params);
                    const response = await s3Client.send(command);
                    const { Body } = response; 
                    return streamToString(Body);
                };
                const fileToRequest = (page_name) => {
                    if (page_name === "bank") return "bank-information.html";
                    else if (page_name === "enforcement") return "enforcement-actions.html";
                    else if (page_name === "balance") return "balance-sheet.html";
                    else if (page_name === "income") return "income-statement.html";
                    else if (page_name === "loans") return "loans.html";
                    else return res.redirect(`/banks/${state}/${city}/${bank}/bank`);
                }
                readFile('individual.bank.html.reports', `${bank}/${fileToRequest(page)}`)
                .then(report => {
                    const reportHTML = new JSDOM(report);
                    const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
                    res.render("bank", {
                        path: req.originalUrl,
                        access: true,
                        title,
                        iframeSource: source,
                        reportBody,
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
                    title
                });
            }
        }
    });
});

module.exports = router;