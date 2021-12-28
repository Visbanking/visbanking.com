const { Router } = require("express");
const router = Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TEST);

router.get("/", async (req, res) => {
    if (!req.query.tier) return res.redirect("/pricing");
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
		success_url: `${req.protocol}://${req.hostname}/buy/success?tier=${req.query.tier}&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${req.protocol}://${req.hostname}/buy/failure?tier=${req.query.tier}`,
	});
	res.redirect(303, session.url);
});

router.get("/success", (req, res) => {
	res.render("success", {
		title: "Payment Successful - Visbanking",
		path: "/buy/success",
		tier: req.query.tier
	});
});

router.get("/failure", (req, res) => {
	res.render("failure", {
		title: "Payment Failed - Visbanking",
		path: "/buy/failure",
		tier: req.query.tier
	});
});

module.exports = router;
