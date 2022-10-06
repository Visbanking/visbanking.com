const { Router } = require("express");
const insights = require("./content/insights");
const faqs = require("./content/faqs");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminDashboardSection: "content"
	});
});

router.use("/insights", insights);

router.use("/faqs", faqs);

module.exports = router;