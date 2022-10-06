const { Router } = require("express");
const connection = require("../../data/dbconnection");
const content = require("./dashboard/content");
const company = require("./dashboard/company");
const system = require("./dashboard/system");
const users = require("./dashboard/users");
require("dotenv").config();
const router = Router();

router.get("/*", (req, res, next) => {
	if (!req.cookies.admin) {
		res.redirect("/admin");
	} else {
		connection.query(`SELECT * FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else if (results.length === 0) {
				res.redirect("/admin/login");
			} else {
				next()
			}
		});
	}
});

router.get("/", (req, res) => {
	const message = req.cookies.adminActionResponse || "";
	res.clearCookie("adminActionResponse");
	res.render("admin/dashboard", {
		title: "Admin Dashboard | Visbanking",
		path: req.originalUrl,
		message,
		adminUsername: req.cookies.admin
	});
});

router.get("/*/*", (req, res, next) => {
	if (!req.cookies.admin) {
		res.json({
			error: "Admin not logged in",
		});
	} else {
		connection.query(`SELECT * FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err || results.length === 0) {
				res.json({
					error: "Admin not logged in",
				});
			} else next();
		});
	}
});

router.post("/*/*", (req, res, next) => {
	if (req.cookies.admin) {
		connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err || results[0]["COUNT(*)"] === 0) {
				res.clearCookie("admin");
				res.redirect("/admin");
			} else {
				next();
			}
		});
	} else res.redirect("/admin");
});

router.use("/content", content);

router.use("/company", company);

router.use("/system", system);

router.use("/users", users);

module.exports = router;