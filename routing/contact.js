const express = require("express");
const { EmailVerifier } = require("simple-email-verifier");
const nodemailer = require("nodemailer");
const connection = require("../data/dbconnection");
const path = require("path");
const { renderFile } = require("pug");
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
								const userEmailHTML = renderFile(path.join(__dirname, "..", "views", "emails", "contactFormSubmissionConfirmation.pug"), {
									fName: req.body.fname,
									lName: req.body.lname,
									email, message, topic, phone
								});
								const notificationEmailHTML = renderFile(path.join(__dirname, "..", "views", "emails", "contactFormSubmissionNotification.pug"), {
									name, email, message, topic, phone
								});
								const userEmailMessage = {
									from: `Visbanking.com ${process.env.NO_REPLY_EMAIL}`,
									to: email,
									subject: "Thanks for your interest | Visbanking",
									html: userEmailHTML,
								};
								const notificationEmailMessage = {
									from: `Visbanking.com ${process.env.NO_REPLY_EMAIL}`,
									to: topic === "General" ? "info@visbanking.com" : topic === "Sales" ? "sales@visbanking.com" : topic === "Support" ? "support@visbanking.com" : "",
									subject: "New Contact Submission | Visbanking",
									html: notificationEmailHTML,
								};
								try {
									transporter.sendMail(userEmailMessage);
									transporter.sendMail(notificationEmailMessage);
									res.redirect("/contact/success");
								} catch (err) {
									console.error(err);
									res.redirect("/contact");
								};
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
