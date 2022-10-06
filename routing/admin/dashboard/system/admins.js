const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const hash = require("hash.js");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT ID, Username FROM Admins;", (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.json({
				error: {
					summary: "An error occurred while retrieving admins",
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

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Admin") {
		const username = req.body.username.trim(),
			pass = hash.sha512().update(process.env.DEFAULT_ADMIN_PASS).digest("hex");
		connection.query(`INSERT INTO Admins (Username, Password) VALUES ('${username}', '${pass}');`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.cookie("adminActionResponse", "New admin couldn't be created. Please try again.");
				res.redirect("/admin/dashboard/system");
			} else {
				res.cookie("adminActionResponse", "New admin created successfully.");
				res.redirect("/admin/dashboard/system");
			}
		});
	}
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove Admin") {
		connection.query(`SELECT ID FROM Admins WHERE Username = '${req.body.username}';`, (err, results, fields) => {
			if (err || !results[0]) {
				console.error(err);
				res.cookie("adminActionResponse", "Admin couldn't be deleted. Please try again.");
				res.redirect("/admin/dashboard/system");
			} else {
				const id = results[0].ID;
				connection.query(`DELETE FROM Admins WHERE ID = '${id}';`, (err, results, fields) => {
					if (err) {
						console.error(err);
						res.cookie("adminActionResponse", "Admin couldn't be deleted. Please try again.");
						res.redirect("/admin/dashboard/system");
					} else {
						res.cookie("adminActionResponse", "Admin deleted successfully.");
						res.redirect("/admin/dashboard/system");
					}
				});
			}
		});
	}
});

module.exports = router;