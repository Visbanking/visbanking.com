const { Router } = require("express");
const lodash = require("lodash");
const { getAllServices, createNewService, updateService, deleteService } = require("../../../../controllers/service.controller");
require("dotenv").config();
const router = Router();

router.get("/", (req, res) => {
	getAllServices()
	.then(results => {
		res.json({
			success: true,
			data: results
		});
	})
	.catch(err => {
		res.json({
			error: {
				summary: "An error ocurred while retrieving services",
				detail: err
			}
		});
	});
});

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Service") {
		const { name, description } = req.body;
		createNewService({
			ID: lodash.kebabCase(name.slice(0, 20)),
			Name: name,
			Description: description
		})
		.then(() => {
			res.cookie("adminActionResponse", "Service created successfully.");
			res.redirect("/admin/dashboard/company");
		})
		.catch(err => {
			console.error(err);
			res.cookie("adminActionResponse", "Service couldn't be created. Please try again.");
			res.redirect("/admin/dashboard/company");
		});
	}
});

router.post("/edit", (req, res) => {
	const action = req.body.action;
	if (action === "Update Service") {
		const { name, newDescription } = req.body;
		updateService(name, {
			Description: newDescription
		})
		.then(() => {
			res.cookie("adminActionResponse", "Service updated successfully.");
			res.redirect("/admin/dashboard/company");
		})
		.catch(err => {
			console.error(err);
			res.cookie("adminActionResponse", "Service couldn't be updated. Please try again.");
			res.redirect("/admin/dashboard/company");
		});
	}
});

router.post("/remove", (req, res) => {
	const action = req.body.action;
	if (action === "Remove Service") {
		const { name } = req.body;
		deleteService(name)
		.then(() => {
			res.cookie("adminActionResponse", "Service deleted successfully.");
			res.redirect("/admin/dashboard/company");
		})
		.catch(err => {
			console.error(err);
			res.cookie("adminActionResponse", "Service couldn't be deleted. Please try again.");
			res.redirect("/admin/dashboard/company");
		});
	}
});

module.exports = router;