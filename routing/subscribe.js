const express = require("express");
const bodyParser = require("body-parser");
const { EmailVerifier } = require("simple-email-verifier");
const client = require("@mailchimp/mailchimp_marketing");
const connection = require("./data/dbconnection");
require("dotenv").config();
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

client.setConfig({
	apiKey: process.env.MAILCHIMP,
	server: 'us20'
});

var error = "";
const verifier = new EmailVerifier(10000);

router.post("/", (req, res) => {
	const fName = req.body.name.split(" ")[0],
	lName = req.body.name.split(" ")[1],
	email = req.body.email;
	verifier.verify(email).then(result => {
		if (result) {
			let new_client = {
				members: [
					{
						email_address: email,
						status: "subscribed",
						merge_fields: {
							FNAME: fName,
							LNAME: lName,
						}
					},
				],
			};
			const run = async () => {
				const response = await client.lists.batchListMembers("1675aa5465", new_client);
				if (response.error_count === 0) {
        			connection.query(`INSERT INTO Mailings (FirstName, LastName, Email) VALUES ( "${fName}", "${lName}", "${email}");`);
					res.redirect("/subscribe/success");
				} else {
					if (response.errors[0].error_code === "ERROR_CONTACT_EXISTS") {
						new_client.update_existing = true;
						run();
					} else {
						console.error(response.errors[0].error);
						res.redirect("/subscribe/failure");
					}
				}
			};
			run();
		} else {
			error = "The email you entered doesn't exist";
			res.redirect("/#newsletter");
		}
	}).catch(() => {
		error = "There was a problem. Please try again.";
		res.redirect("/#newsletter");
	});
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Success - Visbanking",
		path: "/subscribe/success"
	});
});

router.get("/failure", (req, res) => {
	res.render("failure", {
		title: "Failure - Visbanking",
		path: "/subscribe/failure"
	});
});

module.exports = router;
