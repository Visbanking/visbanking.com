const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
	res.clearCookie("admin");
	res.redirect("/admin");
});

module.exports = router;