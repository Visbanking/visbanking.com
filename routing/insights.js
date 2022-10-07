const express = require("express");
const { get } = require("../data/api/APIClient");
const router = express.Router();
const Insight = require("../models/insight.model");

router.get("/", async (req, res) => {
	if (req.query.page) {
		if (req.query.topic) {
			get(`/api/insights?page=${req.query.page}&topic=${req.query.topic}`)
			.then(({ result:insights }) => {
				res.json({
					message: `Insights were retrieved successfully`,
					insights
				});
			})
			.catch(err => {
				res.json({
					message: "An error ocurred while retrieving insights",
					error: err
				});
			});
		} else if (!req.query.topic) {
			get(`/api/insights?page=${req.query.page}`)
			.then(({ result:insights }) => {
				res.json({
					message: `Insights were retrieved successfully`,
					insights
				});
			})
			.catch(err => {
				res.json({
					message: "An error ocurred while retrieving insights",
					error: err
				});
			});}
	} else if (!req.query.page) {
		get("/api/insights")
		.then(({ result:insights }) => {
			res.render("insights", {
				title: "Insights | Visbanking",
				path: "/insights",
				insights,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		})
		.catch(console.error);
	}
});

router.get("/:article_id", (req, res) => {
	get(`/api/insights/insight/${req.params.article_id}`)
	.then(async ({ result:insight }) => {
		Insight.increment("Views", {
			where: {
				ID: req.params.article_id
			}
		});
		const { ID: insightId, Topic: insightTopic } = insight;
		const { result:insights } = await get("/api/insights");
		const newestInsights = insights.sort((a, b) => new Date(b.Date) - new Date(a.Date)).filter(insight => insight.ID!==insightId).slice(0, 3);
		const relatedInsights = insights.sort((a, b) => a.Views - b.Views).filter(insight => (insight.ID!==req.params.article_id && insight.Topic===insightTopic)).slice(0, 3);
		const body = [];
		insight.Body.split("  ").forEach((par) => {
			body.push(par);
		});
		const post = { ...insight, Body: body };
		res.render("insight", {
			title: `${post.Title} | Insights | Visbanking`,
			path: req.originalUrl,
			post,
			newestInsights,
			relatedInsights,
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
		});
	})
	.catch(err => {
		console.log(err);
		res.redirect("/insights");
	});
});

router.get("/insight/:article_id", (req, res) => {
	res.redirect(`/insights/${req.params.article_id}`);
});

module.exports = router;
