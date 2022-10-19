const { Router } = require("express");
const { createTransport } = require("nodemailer");
const { renderFile } = require("pug");
const { createNewLead } = require("../../controllers/conversionLead.controller");
const { getInsightsByPage } = require("../../controllers/insight.controller");
const path = require("path");
const errorLogger = require("../../data/log/error.log");
const router = Router();

router.get("/", async (req, res) => {
	res.render("landing/report", {
		title: "Get A Free Report | Visbanking",
		path: req.originalUrl,
		insights: await getInsightsByPage()
	});
});

router.post("/", (req, res) => {
	const { fName, lName, email } = req.body;
	if (!fName || !lName || !email) return res.redirect("/landing/report");
	createNewLead({
		FirstName: fName,
		LastName: lName,
		Email: email,
		Phone: req.body.phone || null
	})
	.then(async () => {
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
		const userEmailHTML = renderFile(path.join(__dirname, "..", "..", "views", "emails", "conversionLeadSubmission.pug"), {
			name: `${fName} ${lName}`
		});
		const notificationEmailHTML = renderFile(path.join(__dirname, "..", "..", "views", "emails", "conversionLeadNotification.pug"), {
			name: `${fName} ${lName}`,
			email,
			phone: req.body.phone
		});
		const userMessage = {
			from: "Visbanking Report no-reply@visbanking.com",
			to: email,
			subject: "Download the Bank Ranking Report here",
			html: userEmailHTML
		};
		const notificatinMessage = {
			from: "Visbanking.com no-reply@visbanking.com",
			to: "info@visbanking.com",
			subject: "New Lead Generated",
			html: notificationEmailHTML
		};
		try {
			await transporter.sendMail(userMessage);
			await transporter.sendMail(notificatinMessage);
			res.redirect("/landing/report/success");
		} catch (err) {
			errorLogger.error(err);
			res.redirect("/landing/report");
		}
	})
	.catch(() => {
		res.redirect("/landing/report");
	});
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success | Visbanking",
		path: req.originalUrl
	});
});

module.exports = router;