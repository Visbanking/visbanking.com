const { Router } = require("express");
const { createTransport } = require("nodemailer");
const { readFileSync } = require("fs");
const path = require("path");
const router = Router();
require("dotenv").config();

router.get("/", (req, res) => {
	res.render("landing/academic", {
		title: "Visbanking Academic - Visbanking",
		path: req.originalUrl,
		tier: require("./../../data/.pricingTiers.json").professional
	});
});

router.post("/", (req, res) => {
	const { firstName: fName, lastName: lName, email } = req.body;
	const transporter = createTransport({
		name: "www.visbanking.com",
		host: "mail.visbanking.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.NO_REPLY_EMAIL,
			pass: process.env.NO_REPLY_PASS,
		},
	});
	const emailHTML = readFileSync(path.join(__dirname, "..", "..", "views", "emails", "academicRequest.html")).replaceAll("${name}", `${fName} ${lName}`).replaceAll("${email}", email);
	const message = {
		from: "Visbanking.com",
		to: ["info@visbanking.com", "brian@visbanking.com"],
		subject: "New Academics Account Request",
		html: emailHTML
	};
	transporter.sendMail(message, (err, info) => {
		if (err) res.redirect("/landing/academic");
		else res.redirect("/landing/academic/success");
	});
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success - Visbanking",
		path: req.originalUrl
	});
});

router.get("/failure", (req, res) => {
	res.render("failure", {
		title: "Failure - Visbanking",
		path: req.originalUrl
	});
});

module.exports = router;