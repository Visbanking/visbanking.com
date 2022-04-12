const { Router } = require("express");
const bodyParser = require("body-parser");
const { check } = require("email-existence");
const client = require("@mailchimp/mailchimp_marketing");
const router = Router();
require("dotenv").config();

router.use(bodyParser.urlencoded({extended: true}));

client.setConfig({
	apiKey: process.env.MAILCHIMP,
	server: 'us20'
});

router.get("/newsdigest", (req, res) => {
    res.render("funnel/newsDigest", {
        title: 'Subscribe to our News Digest - Visbanking',
        path: req.originalUrl
    });
});

router.post("/newsdigest", (req, res) => {
    const { fname, lname, email, company } = req.body;
    check(email, (err, response) => {
        if (response) {
			let new_client = {
				members: [
					{
						email_address: email,
						status: "subscribed",
						merge_fields: {
							FNAME: fname,
							LNAME: lname,
							COMPANY: company
						}
					},
				],
			};
			const run = async () => {
				const response = await client.lists.batchListMembers("6a0268299e", new_client);
				if (response.error_count === 0) {
					res.redirect("/funnel/newsdigest/success");
				} else {
					if (response.errors[0].error_code === "ERROR_CONTACT_EXISTS") {
						new_client.update_existing = true;
						run();
					} else {
						console.error(response.errors[0].error);
						res.redirect("/funnel/newsdigest/failure");
					}
				}
			};
			run();
        } else {
            res.redirect("/funnel/newsdigest");
        }
    });
});

router.get("/newsdigest/success", (req, res) => {
    res.render("success", {
        title: "Success - Visbanking",
        path: req.originalUrl
    });
});

router.get("/newsdigest/failure", (req, res) => {
    res.render("failure", {
        title: "Failure - Visbanking",
        path: req.originalUrl
    });
});

module.exports = router;