const express = require("express");
const bodyParser = require("body-parser");
const { EmailVerifier } = require("simple-email-verifier");
const nodemailer = require("nodemailer");
const connection = require("../data/dbconnection");
const { readFileSync } = require("fs");
const { join } = require("path");
require("dotenv").config();
const router = express.Router();

let error;
const verifier = new EmailVerifier(10000);

router.get("/", (req, res) => {
	res.render("contact", {
		title: "Contact Us | Visbanking",
		path: "/contact",
		error: error,
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
});

router.post("/", (req, res) => {
	const name = `${req.body.fname} ${req.body.lname}`,
		email = req.body.email,
		message = req.body.message,
		topic = req.body.topic,
		phone = req.body.phone;
	verifier
		.verify(email)
		.then((response) => {
			if (response) {
				connection.query(`INSERT INTO Contacts (Name, Email, Message, Topic, Phone) VALUES ('${name}', '${email}', '${message}', '${topic}', '${phone}');`, (err, results, fields) => {
					if (err && err.code === "ER_DUP_ENTRY") {
						connection.query(`UPDATE Contacts SET Message = '${message}' WHERE Email = '${email}';`, (err, results, fields) => {
							if (err) {
								console.error(err);
								res.redirect("/error");
							} else {
								const transporter = nodemailer.createTransport({
									name: "www.visbanking.com",
									host: "mail.visbanking.com",
									port: 465,
									secure: true,
									auth: {
										user: process.env.NO_REPLY_EMAIL,
										pass: process.env.NO_REPLY_PASS,
									},
								});
								const emailHTML = readFileSync(join(__dirname, "..", "views", "emails", "contactFormSubmission.html"), "utf8")
									.replace("${name}", name)
									.replace("${email}", email)
									.replace("${topic}", topic)
									.replace("${message}", message)
									.replace("${phone}", phone);
								const emailMessage = {
									from: `'Visbanking.com' ${process.env.NO_REPLY_EMAIL}`,
									to: topic === "General" ? "info@visbanking.com" : topic === "Sales" ? "sales@visbanking.com" : topic === "Support" ? "support@visbanking.com" : "",
									subject: "New Contact Submission | Visbanking",
									html: emailHTML,
								};
								transporter.sendMail(emailMessage, (err, info) => {
									if (err) {
										console.error(err);
										res.redirect("/contact/success");
									} else {
										console.log(info);
										res.redirect("/contact/success");
									}
								});
							}
						});
					} else if (err && err.code !== "ER_DUP_ENTRY") {
						console.error(err);
						res.redirect("/error");
					} else {
						res.redirect("/contact/success");
					}
				});
			} else {
				error = `${email} doesn't exist`;
				res.redirect("/contact");
			}
		})
		.catch(() => {
			res.redirect("/contact");
		});
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success | Visbanking",
		path: "/contact/success",
		loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
	});
});

module.exports = router;
