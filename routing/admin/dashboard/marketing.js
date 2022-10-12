const { Router } = require("express");
const newsDigest = require("./marketing/newsDigest");
const newsletter = require("./marketing/newsletter");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminDashboardSection: "marketing"
	});
});

router.use("/newsDigest", newsDigest);

router.use("/newsletter", newsletter);

module.exports = router;