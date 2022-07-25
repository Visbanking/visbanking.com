const { Router } = require("express");
const router = Router();
const connection = require("../data/dbconnection");
const { toLower } = require("lodash");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);

router.get("/", async (req, res) => {
	if (!req.query.tier) return res.redirect("/pricing");
	const prices = await stripe.prices.list({
		lookup_keys: [toLower(req.query.tier)],
		expand: ["data.product"],
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
	connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
		if (err) {
			console.error(err);
			res.redirect("/error");
		} else {
			const id = results[0].ID;
			connection.query(`UPDATE Users SET Initial_Payment = 'Complete', Tier = '${req.query.tier}' WHERE ID = ${id};`, (err, results, fields) => {
				if (err) {
					console.error(err);
					res.redirect("/error");
				} else {
					res.render("success", {
						title: "Payment Successful | Visbanking",
						path: "/buy/success",
						tier: req.query.tier,
					});
				}
			});
		}
	});
});

router.get("/failure", (req, res) => {
	connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
		if (err) {
			console.error(err);
			res.clearCookie("user");
			res.cookie("DEL_USER", req.cookies.user);
			res.redirect("/error");
		} else if (results.length === 0) {
			res.redirect("/");
		} else {
			connection.query(`UPDATE Users SET Tier = 'Free' WHERE ID = ${results[0].ID};`, (err, results, fields) => {
				if (err) {
					console.error(err);
					res.clearCookie("user");
					res.cookie("DEL_USER", req.cookies.user);
					res.redirect("/error");
				} else {
					res.render("failure", {
						title: "Payment Failed | Visbanking",
						path: "/buy/failure",
						tier: req.query.tier,
					});
				}
			});
		}
	});
});

module.exports = router;
