const { Router } = require("express");
const connection = require("../../data/dbconnection");
const hash = require("hash.js");
const router = Router();

let error = null;

router.get("/", (req, res) => {
	if (req.cookies.admin) {
		connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else if (results[0]["COUNT(*)"] !== 0) {
				res.redirect("/admin/dashboard");
			}
		});
	} else {
		res.render("admin/login", {
			title: "Admin Login | Visbanking",
			error: error,
		});
		error = "";
	}
});

router.post("/", (req, res) => {
	const username = req.body.username,
		pass = hash.sha512().update(req.body.pass).digest("hex");
	connection.query(`SELECT * FROM Admins WHERE Username = '${username}';`, (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else if (results.length === 0) {
			res.redirect("/");
		} else if (results[0].Password !== pass) {
			error = "The username or password entered were invalid";
			res.redirect("/admin/login");
		} else {
			res.cookie("admin", username, {
				httpOnly: true,
				secure: true,
				expires: new Date(Date.now() + 8640000),
			});
			res.redirect("/admin/dashboard");
		}
	});
});

module.exports = router;