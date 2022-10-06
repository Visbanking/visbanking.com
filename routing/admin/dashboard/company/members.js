const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const router = Router();

const memberStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "..", "..", "..", "..", "static", "images", "members"));
	},
	filename: (req, file, cb) => {
		cb(null, `${lodash.camelCase(req.body.name)}.jpg`);
	},
});

const member = multer({ storage: memberStorage });

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Members ORDER BY ID ASC;", (err, results, fields) => {
		if (err) {
			return res.json({
				error: {
					summary: "An error occurred while retrieving insights",
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

router.post("/create", member.single("photo"), (req, res) => {
	const action = req.body.action;
	if (action === "Create Member") {
		connection.query(
			`INSERT INTO Members (Name, Photo, LinkedIn, Title, Email, Department) VALUES ('${req.body.name}', '/images/members/${req.file.filename}', '${req.body.linkedin}', '${req.body.title}', '${req.body.email}', '${req.body.department}');`,
			(err, results, fields) => {
				if (err) {
					console.error(err);
					res.cookie("adminActionResponse", "Member couldn't be created. Please try again.");
					res.redirect("/admin/dashboard/company");
				} else {
					res.cookie("adminActionResponse", "Member created successfully.");
					res.redirect("/admin/dashboard/company");
				}
			}
		);
	}
});

router.post("/edit", member.single("photo"), (req, res) => {
	const action = req.body.action;
	if (action === "Update Member") {
		const { name, newName, newEmail, newTitle, newLinkedIn } = req.body,
			image = req.file;
		if (!name) {
			res.cookie("adminActionResponse", "Member couldn't be updated");
			res.redirect("/admin/dashboard/company");
		} else if (newName && newEmail && newTitle && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', Title = '${newTitle}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && newTitle && newLinkedIn) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', Title = '${newTitle}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && newTitle && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', Title = '${newTitle}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newTitle && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Title = '${newTitle}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && newTitle) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', Title = '${newTitle}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && newLinkedIn) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newTitle && newLinkedIn) {
			connection.query(`UPDATE Members SET Name = '${newName}', Title = '${newTitle}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newTitle && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Title = '${newTitle}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && newTitle && newLinkedIn) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', Title = '${newTitle}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && newTitle && image) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', Title = '${newTitle}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newTitle && newLinkedIn && image) {
			connection.query(`UPDATE Members SET Title = '${newTitle}', LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newEmail) {
			connection.query(`UPDATE Members SET Name = '${newName}', Email = '${newEmail}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) error = "Member doesn't exist";
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newTitle) {
			connection.query(`UPDATE Members SET Name = '${newName}', Title = '${newTitle}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && newLinkedIn) {
			connection.query(`UPDATE Members SET Name = '${newName}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName && image) {
			connection.query(`UPDATE Members SET Name = '${newName}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && newTitle) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', Title = '${newTitle}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && newLinkedIn) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail && image) {
			connection.query(`UPDATE Members SET Email = '${newEmail}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newTitle && newLinkedIn) {
			connection.query(`UPDATE Members SET Title = '${newTitle}', LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newTitle && image) {
			connection.query(`UPDATE Members SET Title = '${newTitle}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newLinkedIn && image) {
			connection.query(`UPDATE Members SET LinkedIn = '${newLinkedIn}', Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newName) {
			connection.query(`UPDATE Members SET Name = '${newName}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newEmail) {
			connection.query(`UPDATE Members SET Email = '${newEmail}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newTitle) {
			connection.query(`UPDATE Members SET Title = '${newTitle}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (newLinkedIn) {
			connection.query(`UPDATE Members SET LinkedIn = '${newLinkedIn}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		} else if (image) {
			connection.query(`UPDATE Members SET Photo = '/images/members/${image.filename}' WHERE Name = '${name}';`, (err, results, fields) => {
				if (!results.affectedRows) res.cookie("adminActionResponse", "Member doesn't exist");
				else if (err) res.cookie("adminActionResponse", "Member couldn't be updated");
				else res.cookie("adminActionResponse", "Member updated successfully");
				res.redirect("/admin/dashboard/company");
			});
		}
	}
});

router.post("/remove", member.single("photo"), (req, res) => {
	const action = req.body.action;
	if (action === "Remove Member") {
		fs.rmSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "members", `${lodash.camelCase(req.body.name)}.jpg`), { force: true });
		connection.query(`SELECT ID FROM Members WHERE Name = '${req.body.name}';`, (err, results, fields) => {
			if (err || !results[0]) {
				console.error(err);
				res.cookie("adminActionResponse", "Member couldn't be deleted. Please try again.");
				res.redirect("/admin/dashboard/company");
			} else {
				const id = results[0].ID;
				connection.query(`DELETE FROM Members WHERE ID = '${id}';`, (err, results, fields) => {
					if (err) {
						console.error(err);
						res.cookie("adminActionResponse", "Member couldn't be deleted. Please try again.");
						res.redirect("/admin/dashboard/company");
					} else {
						res.cookie("adminActionResponse", "Member deleted successfully.");
						res.redirect("/admin/dashboard/company");
					}
				});
			}
		});
	}
});

module.exports = router;