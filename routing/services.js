const { Router } = require("express");
const { checkCache, setCache } = require("./../data/caching");
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

router.get("/analysis", (req, res) => {
	res.render("services/service", {
		title: "Competitive Analysis | Services | Visbanking",
		path: req.originalUrl,
		service: "analysis"
	});	
});

router.get("/market", (req, res) => {
	res.render("services/service", {
		title: "Market Share | Services | Visbanking",
		path: req.originalUrl,
		service: "market"
	});	
});

router.get("/m&a", (req, res) => {
	res.render("services/service", {
		title: "M&A Due Dilligence | Services | Visbanking",
		path: req.originalUrl,
		service: "m&a"
	});	
});

router.get("/credit", (req, res) => {
	res.render("services/service", {
		title: "Credit Quality | Services | Visbanking",
		path: req.originalUrl,
		service: "credit"
	});	
});

router.get("/geographic", (req, res) => {
	res.render("services/service", {
		title: "Geographic Coverage | Services | Visbanking",
		path: req.originalUrl,
		service: "geographic"
	});	
});

router.get("/insight", (req, res) => {
	res.render("services/service", {
		title: "Insight into Deposit and Loan Growth or Decline | Services | Visbanking",
		path: req.originalUrl,
		service: "insight"
	});	
});

module.exports = router;