const { Router } = require("express");
// const { EmailVerifier } = require("simple-email-verifier");
const client = require("@mailchimp/mailchimp_marketing");
const connection = require("../../data/dbconnection");
const router = Router();
require("dotenv").config();

client.setConfig({
	apiKey: process.env.MAILCHIMP,
	server: "us20",
});

router.get("/", (req, res) => {
	res.redirect(`/landing/newsDigest/${["a", "b"][Math.floor(Math.random() * 2)]}`);
});

router.post("/", (req, res) => {
	const { fname, email } = req.body;
	connection.query(`INSERT INTO NewsDigest (FirstName, LastName, Email, Company) VALUES ('${fname}', '${req.body.lname || ""}', '${email}', '${req.body.company || ""}');`, (err, results, fields) => {
		if (err) return res.redirect(new URL(req.headers.referer).pathname);
		res.redirect("/landing/newsdigest/success");
	});
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success | Visbanking",
		path: req.originalUrl,
	});
});

router.get("/failure", (req, res) => {
	res.render("failure", {
		title: "Failure | Visbanking",
		path: req.originalUrl,
	});
});

router.get("/:test_id", (req, res) => {
	const test_id = req.params.test_id;
	if (["a", "b"].indexOf(test_id) === -1) return res.redirect("/landing/newsdigest/a");
	res.render("landing/newsDigest", {
		title: "Subscribe to our News Digest | Visbanking",
		path: req.originalUrl,
		test_id,
	});
});

module.exports = router;