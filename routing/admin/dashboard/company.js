const { Router } = require("express");
const members = require("./company/members");
const services = require("./company/services");
const pressReleases = require("./company/pressReleases");
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

router.use("/services", services);

router.use("/pressReleases", pressReleases);

module.exports = router;