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
	const data = { FNAME: fname };
	if (req.body.lname) data.LNAME = req.body.lname;
	if (req.body.company) data.COMPANY = req.body.company;
	let new_client = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: data,
			},
		],
	};
	const run = async () => {
		const response = await client.lists.batchListMembers("6a0268299e", new_client);
		if (response.error_count === 0) {
			connection.query(`INSERT INTO NewsDigest (FirstName, LastName, Email, Company) VALUES ('${fname}', '${req.body.lname || ""}', '${email}', '${req.body.company || ""}');`, (err, results, fields) => {
				res.redirect("/landing/newsdigest/success");
			});
		} else {
			if (response.errors[0].error_code === "ERROR_CONTACT_EXISTS") {
				new_client.update_existing = true;
				run();
			} else {
				console.error(response.errors[0].error);
				res.redirect("/landing/newsdigest/failure");
			}
		}
	};
	run();
	// verifier.verify(email)
	// .then(response => {
	//     if (response) {
	// 		const data = { FNAME: fname };
	// 		if (req.body.lname) data.LNAME = req.body.lname;
	// 		if (req.body.company) data.COMPANY = req.body.company;
	// 		let new_client = {
	// 			members: [
	// 				{
	// 					email_address: email,
	// 					status: "subscribed",
	// 					merge_fields: data
	// 				},
	// 			],
	// 		};
	// 		const run = async () => {
	// 			const response = await client.lists.batchListMembers("6a0268299e", new_client);
	// 			if (response.error_count === 0) {
	// 				connection.query(`INSERT INTO NewsDigest (FirstName, LastName, Email, Company) VALUES ('${fname}', '${req.body.lname || ''}', '${email}', '${req.body.company || ''}');`, (err, results, fields) => {
	// 					res.redirect("/funnel/newsdigest/success");
	// 				});
	// 			} else {
	// 				if (response.errors[0].error_code === "ERROR_CONTACT_EXISTS") {
	// 					new_client.update_existing = true;
	// 					run();
	// 				} else {
	// 					console.error(response.errors[0].error);
	// 					res.redirect("/funnel/newsdigest/failure");
	// 				}
	// 			}
	// 		};
	// 		run();
	//     } else {
	//         res.redirect("/funnel/newsdigest");
	//     }
	// })
	// .catch(() => {
	// 	res.redirect("/funnel/newsdigest");
	// });
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success - Visbanking",
		path: req.originalUrl,
	});
});

router.get("/failure", (req, res) => {
	res.render("failure", {
		title: "Failure - Visbanking",
		path: req.originalUrl,
	});
});

router.get("/:test_id", (req, res) => {
	const test_id = req.params.test_id;
	if (["a", "b"].indexOf(test_id) === -1) return res.redirect("/landing/newsdigest/a");
	res.render("landing/newsDigest", {
		title: "Subscribe to our News Digest - Visbanking",
		path: req.originalUrl,
		test_id,
	});
});

module.exports = router;