const { Router } = require("express");
const UAParser = require("ua-parser-js");
const login = require("./admin/login");
const dashboard = require("./admin/dashboard");
const logout = require("./admin/logout");
require("dotenv").config();
const router = Router();

router.use((req, res, next) => {
	if (UAParser(req.headers["user-agent"]).device.type) {
		return res.render("admin/redirect", {
			title: "Page Unavailable",
		});
	}
	next();
});

router.all("/", (req, res) => {
	res.redirect("/admin/login");
});

router.use("/login", login);

router.use("/dashboard", dashboard);

router.use("/logout", logout);

module.exports = router;
