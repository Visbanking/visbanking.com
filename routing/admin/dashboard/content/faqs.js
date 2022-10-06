const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	connection.query("SELECT * FROM Questions ORDER BY ID ASC;", (err, results, fields) => {
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

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create FAQ") {
		connection.query(`INSERT INTO Questions (Question, Answer, Category) VALUES ('${req.body.question}', '${req.body.answer}', '${req.body.category}');`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.cookie("adminActionResponse", "FAQ couldn't be created. Please try again.");
				res.redirect("/admin/dashboard/content");
			} else {
				res.cookie("adminActionResponse", "FAQ created successfully");
				res.redirect("/admin/dashboard/content");
			}
		});
	}
});

router.post("/edit", (req, res) => {
	const action = req.body.action;
	if (action === "Update FAQ") {
		connection.query(`UPDATE Questions SET Answer = '${req.body.newAnswer}' WHERE Question = '${req.body.question}';`, (err, results, fields) => {
			if (!results.affectedRows) res.cookie("adminActionResponse", "FAQ doesn't exist");
			else if (err) res.cookie("adminActionResponse", "FAQ couldn't be updated");
			else res.cookie("adminActionResponse", "FAQ updated successfully");
			res.redirect("/admin/dashboard/content");
		});
	}
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove FAQ") {
		connection.query(`SELECT ID FROM Questions WHERE Question = '${req.body.question}';`, (err, results, fields) => {
			if (err || !results[0]) {
				console.error(err);
				res.cookie("adminActionResponse", "FAQ couldn't be deleted. Please try again.");
				res.redirect("/admin/dashboard/content");
			} else {
				const id = results[0].ID;
				connection.query(`DELETE FROM Questions WHERE ID = ${id};`, (err, results, fields) => {
					if (err) {
						console.error(err);
						res.cookie("adminActionResponse", "FAQ couldn't be deleted. Please try again.");
						res.redirect("/admin/dashboard/content");
					} else {
						res.cookie("adminActionResponse", "FAQ deleted successfully");
						res.redirect("/admin/dashboard/content");
					}
				});
			}
		});
	}
});

module.exports = router;