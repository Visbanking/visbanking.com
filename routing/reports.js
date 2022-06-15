const { Router } = require("express");
const connection = require("../data/dbconnection");
const banks = require("./reports/banks");
const macro = require("./reports/macro");
const performance = require("./reports/performance");
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Visbanking.AllReports ORDER BY RAND();", (err, results, fields) => {
		if (err) res.redirect("/banks");
		else {
			const singleBankReports = results.filter((bank) => bank.Type === "Bank").slice(0, 9),
				macroReports = results.filter((bank) => bank.Type === "Macro").slice(0, 9),
				performanceReports = results.filter((bank) => bank.Type === "Performance").slice(0, 9);
			res.render("reports", {
				singleBankReports,
				macroReports,
				performanceReports,
				title: "Reports - Visbanking",
				path: req.originalUrl,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.use("/bank", banks);

router.use("/macro", macro);

router.use("/performance", performance);

module.exports = router;
