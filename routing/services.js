const { Router } = require("express");
const { checkCache, setCache } = require("./../data/caching");
const { renderFile } = require("pug");
const path = require("path");
const router = Router();

router.get("/", checkCache, (req, res) => {
	res.render("services", {
		title: "Credit Quality Trends in Banking | US Bank Market Share | Visbanking",
		path: "/services",
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services.pug"), {
			title: "Credit Quality Trends in Banking | US Bank Market Share | Visbanking",
			path: "/services",
		})
	);
});

router.get("/analysis", checkCache, (req, res) => {
	res.render("services/service", {
		title: "Competitive Analysis | Services | Visbanking",
		path: req.originalUrl,
		service: "analysis"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "Competitive Analysis | Services | Visbanking",
			path: req.originalUrl,
			service: "analysis"
		})
	);
});

router.get("/market", checkCache, (req, res) => {
	res.render("services/service", {
		title: "Market Share | Services | Visbanking",
		path: req.originalUrl,
		service: "market"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "Market Share | Services | Visbanking",
			path: req.originalUrl,
			service: "market"
		})
	);
});

router.get("/m&a", checkCache, (req, res) => {
	res.render("services/service", {
		title: "M&A Due Dilligence | Services | Visbanking",
		path: req.originalUrl,
		service: "m&a"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "M&A Due Dilligence | Services | Visbanking",
			path: req.originalUrl,
			service: "m&a"
		})
	);
});

router.get("/credit", checkCache, (req, res) => {
	res.render("services/service", {
		title: "Credit Quality | Services | Visbanking",
		path: req.originalUrl,
		service: "credit"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "Credit Quality | Services | Visbanking",
			path: req.originalUrl,
			service: "credit"
		})
	);
});

router.get("/geographic", checkCache, (req, res) => {
	res.render("services/service", {
		title: "Geographic Coverage | Services | Visbanking",
		path: req.originalUrl,
		service: "geographic"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "Geographic Coverage | Services | Visbanking",
			path: req.originalUrl,
			service: "geographic"
		})
	);
});

router.get("/insight", checkCache, (req, res) => {
	res.render("services/service", {
		title: "Insight into Deposit and Loan Growth or Decline | Services | Visbanking",
		path: req.originalUrl,
		service: "insight"
	});	
	setCache(
		`visbanking.com${req.originalUrl}`,
		renderFile(path.join(__dirname, "..", "views", "services", "/service.pug"), {
			title: "Insight into Deposit and Loan Growth or Decline | Services | Visbanking",
			path: req.originalUrl,
			service: "insight"
		})
	);
});

module.exports = router;