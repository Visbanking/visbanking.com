const { Router } = require("express");
const connection = require("../data/dbconnection");
const { capitalize } = require("lodash");
const banks = require("./reports/banks");
const macro = require("./reports/macro");
const performance = require("./reports/performance");
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT DISTINCT(Type) FROM Visbanking.AllReports;", (err, results, fields) => {
		if (err) res.redirect("/reports");
		else res.render("reports", {
			title: "Reports - Visbanking",
			path: req.originalUrl,
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			reportTypes: [{ Type:"Bank" }, { Type:"Macro" }, { Type:"Performance" }]
		});
	});
});

router.use("/bank", banks);

router.use("/macro", macro);

router.use("/performance", performance);

module.exports = router;
