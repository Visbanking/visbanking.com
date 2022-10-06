const { Router } = require("express");
const profile = require("./system/profile");
const admins = require("./system/admins");
const status = require("./system/status");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminDashboardSection: "system"
	});
});

router.use("/profile", profile);

router.use("/admins", admins);

router.use("/status", status);

module.exports = router;