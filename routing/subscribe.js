const express = require("express");
const bodyParser = require("body-parser");
const { EmailVerifier } = require("simple-email-verifier");
const client = require("@mailchimp/mailchimp_marketing");
const phoneVerify = require("google-libphonenumber");
const phoneUtil = phoneVerify.PhoneNumberUtil.getInstance();
const PNF = phoneVerify.PhoneNumberFormat;
const { customList } = require("country-codes-list");
const connection = require("./data/dbconnection");
require("dotenv").config();
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

client.setConfig({
	apiKey: process.env.MAILCHIMP,
	server: 'us5'
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
				const response = await client.lists.batchListMembers("71c3a51cce", new_client);
				if (response.error_count === 0) {
        			connection.query(`INSERT INTO Mailings (Address1, Address2, City, State, Country, Phone, Role, FirstName, LastName, Company, Email) VALUES ("${address1?address1:"NULL"}", "${address2?address2:"NULL"}", "${city?city:"NULL"}", "${state?state:"NULL"}", "${country?country:"NULL"}", "${phone?phoneUtil.format(phone, PNF.INTERNATIONAL):"NULL"}", "${role?role:"NULL"}", "${fName}", "${lName}", "${company?company:"NULL"}", "${email}");`);
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
