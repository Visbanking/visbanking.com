const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const hash = require("hash.js");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT FirstName, LastName, Email FROM Users WHERE Tier = 'Academic';", (err, results, fields) => {
		if (err) {
			return res.json({
				error: {
					summary: "An error ocurred while retrieving Academics",
					detail: err
				}
			});
		} else {
			return res.json({
				success: true,
				data: results
			});
		}
	});
});

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Academics Account") {
		connection.query(`INSERT INTO Users (FirstName, LastName, Email, Password, Tier, Signup_Code) VALUES ('${req.body.fName}', '${req.body.lName}', '${req.body.email}', '${hash.sha512().update(process.env.DEFAULT_ACADEMIC_PASS).digest("hex")}', 'Academic', 0);`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.cookie("adminActionResponse", "Academics plan couldn't be created. Please try again.");
				res.redirect("/admin/dashboard/users");
			} else {
				res.cookie("adminActionResponse", "Academics plan created successfully");
				res.redirect("/admin/dashboard/users");
			}
		});
	}
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove Academics Account") {
		connection.query(`SELECT ID FROM Users WHERE Tier = 'Academic' AND Email = '${req.body.email}';`, (err, results, fields) => {
			if (err || !results[0]) {
				console.error(err);
				res.cookie("adminActionResponse", "Academics plan couldn't be deleted. Please try again.");
				res.redirect("/admin/dashboard/users");
			} else {
				const id = results[0].ID;
				connection.query(`DELETE FROM Users WHERE ID = ${id};`, (err, results, fields) => {
					if (err) {
						console.error(err);
						res.cookie("adminActionResponse", "Academics plan couldn't be deleted. Please try again.");
						res.redirect("/admin/dashboard/users");
					} else {
						res.cookie("adminActionResponse", "Academics plan deleted successfully");
						res.redirect("/admin/dashboard/users");
					}
				});
			}
		});
	}
});

module.exports = router;