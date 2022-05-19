const { Router } = require("express");
const connection = require("./data/dbconnection");
const banks = require("./reports/banks");
const macro = require("./reports/macro");
const router = Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM Visbanking.AllReports WHERE BankName IS NOT NULL AND State <> '' GROUP BY IDRSSD ORDER BY RAND() LIMIT 0, 15;", (err, results, fields) => {
        if (err) {
            res.redirect("/banks");
        } else {
            const singleBankReports = results;
            connection.query("SELECT State, SectionName FROM Visbanking.AllReports WHERE ReportID = 5 ORDER BY RAND();", (err, results, fields) => {
                if (err) {
                    res.redirect("/banks");
                } else {
                    const macroReports = results.filter(result => result.State!=='');
                    res.render("reports", {
                        singleBankReports,
                        macroReports,
                        title: "Bank Reports - Visbanking",
                        path: req.originalUrl,
                        loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf()
                    });
                }
            })
        }
    });
});

router.use("/bank", banks);

router.use("/macro", macro);

module.exports = router;