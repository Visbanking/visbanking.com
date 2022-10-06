const { Router } = require("express");
const { createTransport } = require("nodemailer");
const { renderFile } = require("pug");
const { createNewLead } = require("../../controllers/conversionLead.controller");
const { getInsightsByPage } = require("../../controllers/insight.controller");
const path = require("path");
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
	.then(() => {
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
		const emailHTML = renderFile(path.join(__dirname, "..", "..", "views", "emails", "conversionLeadSubmission.pug"), {
			name: `${fName} ${lName}`
		});
		const message = {
			from: "Visbanking Report no-reply@visbanking.com",
			to: email,
			subject: "Download the Bank Ranking Report here",
			html: emailHTML
		};
		transporter.sendMail(message, (err, info) => {
			console.log(info);
			if (err) res.redirect("/landing/report");
			else res.redirect("/landing/report/success");
		});
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