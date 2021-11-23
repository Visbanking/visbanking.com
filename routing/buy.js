const { Router } = require("express");
const router = Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);

router.get("/", async (req, res) => {
    console.log(req.url);
	const prices = await stripe.prices.list({
		lookup_keys: [req.query.tier],
		expand: ["data.product"]
	});
	const session = await stripe.checkout.sessions.create({
		billing_address_collection: "auto",
		line_items: [
			{
				price: prices.data[0].id,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${req.protocol}://${req.hostname}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${req.protocol}://${req.hostname}/buy/failure`,
	});
	res.redirect(303, session.url);
});

router.get("/success", (req, res) => {
    res.send("Success");
});

router.get("/failure", (req, res) => {
    res.send("Failure");
});

module.exports = router;
