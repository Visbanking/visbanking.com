const { Router } = require("express");
const members = require("./company/members");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminDashboardSection: "company"
	});
});

router.use("/members", members);

module.exports = router;