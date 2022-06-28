const { Router } = require("express");
const router = Router();

router.use("/", (req, res) => {
	res.redirect(req.originalUrl.replace("funnel", "landing"));
});

module.exports = router;