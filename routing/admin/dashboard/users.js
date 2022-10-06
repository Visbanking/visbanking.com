const { Router } = require("express");
const academics = require("./users/academics");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminDashboardSection: "users"
	});
});

router.use("/academics", academics);

module.exports = router;