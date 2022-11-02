const { Router } = require("express");
const connection = require("../../../../data/dbconnection");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const { marked } = require("marked");
const { get, del, post } = require("../../../../data/api/APIClient");
const fs = require("fs");
const { URLSearchParams } = require("url");
const { capitalize, kebabCase } = require("lodash");
const PressReleaseController = require("../../../../controllers/pressRelease.controller");
require("dotenv").config();
const router = Router();

const pressReleaseStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title)))) 
			fs.mkdirSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title)));
		cb(null, path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title)));
	},
	filename: (req, file, cb) => {
		if (file.fieldname === "headerImage") {
			if (fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`)))
				fs.rmSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`), { force: true });
			cb(null, `${lodash.camelCase(file.fieldname)}.jpg`);
		}
		if (file.fieldname === "bodyImages") {
			if (fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`)))
				fs.rmSync(path.join(__dirname, "..", "..", "..", "..", "static", "images", "pressReleases", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`), { force: true });
			cb(null, `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`);
		}
	},
});

const pressRelease = multer({ storage: pressReleaseStorage });

router.get("/", (req, res) => {
	PressReleaseController.getAllPressReleases()
	.then(pressReleases => {
		return res.json({
			success: true,
			data: pressReleases.sort((a, b) => new Date(b.Date) - new Date(a.Date))
		});
	})
	.catch(err => {
		return res.json({
			error: {
				summary: "An error ocurred while retrieving Press Releases",
				detail: err
			}
		});
	});
	// get("/api/pressReleases")
	// .then(({ result:pressReleases }) => {
	// 	return res.json({
	// 		success: true,
	// 		data: pressReleases.sort((a, b) => new Date(b.Date) - new Date(a.Date))
	// 	});
	// })
	// .catch(err => {
	// 	return res.json({
	// 		error: {
	// 			summary: "An error ocurred while retrieving Press Releases",
	// 			detail: err
	// 		}
	// 	});
	// });
});

router.get("/create", (req, res) => {
	if (req.cookies.admin) {
		connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
			if (err) {
				console.error(err);
				res.redirect("/error");
			} else if (results[0]["COUNT(*)"] !== 0) {
				res.render("admin/dashboard/company/pressReleases/create");
			}
		});
	} else {
		res.redirect("/admin");
	}
});

router.post("/create", pressRelease.fields([{ name: "headerImage" }, { name: "bodyImages" }]), (req, res) => {
	const action = req.body.action;
	if (action === "Create Press Release") {
		const postData = {
			ID: kebabCase(req.body.title),
			Image: `/images/pressReleases/${lodash.kebabCase(req.body.title)}/headerImage.jpg`
		};
		for (const key in req.body) postData[capitalize(key)] = req.body[key];
		postData.Body = marked(postData.Body);
		PressReleaseController.createNewPressRelease(postData)
		.then(() => {
			res.cookie("adminActionResponse", "Press Release created successfully.");
		})
		.catch(err => {
			res.cookie("adminActionResponse", "Press Release couldn't be created. Please try again.");
			console.log(err.toJSON());
		})
		.finally(() => {
			res.redirect("/admin/dashboard/company");
		});
		// post("/api/pressReleases/pressRelease", new URLSearchParams(postData).toString())
		// .then(() => {
		// 	res.cookie("adminActionResponse", "Press Release created successfully.");
		// })
		// .catch(err => {
		// 	res.cookie("adminActionResponse", "Press Release couldn't be created. Please try again.");
		// 	console.log(err.toJSON());
		// })
		// .finally(() => {
		// 	res.redirect("/admin/dashboard/company");
		// });
	}
});

router.get("/edit", (req, res) => {
	PressReleaseController.getAllPressReleases()
	.then(pressReleases => {
		if (!pressReleases[0]) throw new Error();
		const pressReleasesTitles = pressReleases.map(pressRelease => pressRelease.Title);
		res.render("admin/dashboard/company/pressReleases/edit", {
			pressReleasesTitles,
		});
	})
	.catch(err => {
		console.log(err)
		// error = "There was a problem accessing the database";
		res.redirect("/admin/dashboard");
	});
	// get("/api/pressReleases?fields=Title")
	// .then(({ result:pressReleases }) => {
	// 	if (!pressReleases[0]) throw new Error();
	// 	const pressReleasesTitles = pressReleases.map((pressReleaseTitle) => pressReleaseTitle.Title);
	// 	res.render("admin/dashboard/company/pressReleases/edit", {
	// 		pressReleasesTitles,
	// 	});
	// })
	// .catch(err => {
	// 	console.log(err)
	// 	// error = "There was a problem accessing the database";
	// 	res.redirect("/admin/dashboard");
	// });
});

router.post("/edit", pressRelease.fields([{ name: "headerImage" }, { name: "bodyImages" }]), (req, res) => {
	const action = req.body.action;
	if (action === "Edit Press Release") {
		connection.query(`UPDATE PressReleases SET Image = '/images/pressReleases/${lodash.kebabCase(req.body.title)}/${req.files["headerImage"][0].filename}' WHERE Title = '${req.body.title}';`, (err, results, fields) => {
			if (!results.affectedRows) res.cookie("adminActionResponse", "Press Release doesn't exist");
			else if (err) res.cookie("adminActionResponse", "Press Release couldn't be updated");
			else res.cookie("adminActionResponse", "Press Release updated successfully");
			res.redirect("/admin/dashboard/company");
		});
	}
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove Press Release") {
		PressReleaseController.deletePressReleaseById(lodash.kebabCase(req.body.title))
		.then(() => {
			res.cookie("adminActionResponse", "Press Release deleted successfully");
		})
		.catch(() => {
			res.cookie("adminActionResponse", "Press Release couldn't be deleted. Please try again");
		})
		.finally(() => {
			res.redirect("/admin/dashboard/company");
		});
		// del(`/api/pressReleases/pressRelease/${lodash.kebabCase(req.body.title)}`)
		// .then(() => {
		// 	res.cookie("adminActionResponse", "Press Release deleted successfully");
		// })
		// .catch(() => {
		// 	res.cookie("adminActionResponse", "Press Release couldn't be deleted. Please try again");
		// })
		// .finally(() => {
		// 	res.redirect("/admin/dashboard/company");
		// });
	}
});

module.exports = router;