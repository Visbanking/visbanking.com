const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
	res.render("landing/academic", {
		title: "Visbanking Academic - Visbanking",
		path: req.originalUrl
	});
});

module.exports = router;