const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const hash = require("hash.js");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	connection.query(`SELECT ID, Username FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
		if (err) {
			return res.json({
				error: {
					summary: "An error occurred while retrieving admin profile",
					detail: err,
				},
			});
		} else {
			return res.json({
				success: true,
				data: results,
			});
		}
	});
});

router.post("/edit", (req, res) => {
	const action = req.body.action;
	if (action === "Update Profile") {
		if (req.body.newUsername.trim() !== "" && req.body.newPassword.trim() !== "") {
			const username = req.body.newUsername.trim(),
				pass = hash.sha512().update(req.body.newPassword.trim()).digest("hex");
			connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
				if (err) {
					console.error(err);
					res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
					res.redirect("/admin/dashboard/system");
				} else {
					const id = results[0].ID;
					connection.query(`UPDATE Admins SET Username = '${username}', Password = '${pass}' WHERE ID = '${id}';`, (err, results, fields) => {
						if (err) {
							console.error(err);
							res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
							res.redirect("/admin/dashboard/system");
						} else {
							res.clearCookie("admin");
							res.redirect("/admin");
						}
					});
				}
			});
		} else if (req.body.newPassword.trim() !== "") {
			const pass = hash.sha512().update(req.body.newPassword.trim()).digest("hex");
			connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
				if (err) {
					console.error(err);
					res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
					res.redirect("/admin/dashboard/system");
				} else {
					const id = results[0].ID;
					connection.query(`UPDATE Admins SET Password = '${pass}' WHERE ID = '${id}';`, (err, results, fields) => {
						if (err) {
							console.error(err);
							res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
							res.redirect("/admin/dashboards/system");
						} else {
							res.clearCookie("admin");
							res.redirect("/admin");
						}
					});
				}
			});
		} else if (req.body.newUsername.trim() !== "") {
			const username = req.body.newUsername.trim();
			connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
				if (err) {
					console.error(err);
					res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
					res.redirect("/admin/dashboard/system");
				} else {
					const id = results[0].ID;
					connection.query(`UPDATE Admins SET Username = '${username}' WHERE ID = '${id}';`, (err, results, fields) => {
						if (err) {
							console.error(err);
							res.cookie("adminActionResponse", "Profile information couldn't be updated. Please try again.")
							res.redirect("/admin/dashboard/system");
						} else {
							res.clearCookie("admin");
							res.redirect("/admin");
						}
					});
				}
			});
		} else res.redirect("/admin/dashboard/system");
	}
});

module.exports = router;