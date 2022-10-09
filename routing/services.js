const { Router } = require("express");
const path = require("path");
const { getAllServices } = require("../controllers/service.controller");
const router = Router();

router.get("/", (req, res) => {
	getAllServices()
	.then(services => {
		res.render("services", {
			title: "Credit Quality Trends in Banking | US Bank Market Share | Visbanking",
			path: req.originalUrl,
			services,
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
		});
	})
	.catch(() => {
		res.redirect("/services");
	});
});

router.get("/:service_id", (req, res) => {
	getAllServices()
	.then(services => {
		const service = services.find(service => service.ID===req.params.service_id);
		res.render("services/service", {
			title: `${service.Name} | Services | Visbanking`,
			path: req.originalUrl,
			service,
			services: services.filter(service => service.ID!==req.params.service_id),
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
		});
	})
	.catch(() => {
		res.redirect("/services");
	});
});

module.exports = router;