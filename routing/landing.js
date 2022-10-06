const { Router } = require("express");
// const { EmailVerifier } = require("simple-email-verifier");
const newsDigest = require("./landing/newsDigest");
const academic = require("./landing/academic");
const report = require("./landing/report");
const router = Router();

// const verifier = new EmailVerifier(10000);

router.get("/", (req, res) => {
	res.redirect("/landing/newsDigest");
});

router.use("/newsDigest", newsDigest);

router.use("/academic", academic);

router.use("/report", report);

module.exports = router;
