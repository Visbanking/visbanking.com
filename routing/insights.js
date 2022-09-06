const express = require("express");
const { get } = require("../data/api/APIClient");
const router = express.Router();
const connection = require("../data/dbconnection");

router.get("/", async (req, res) => {
	get("/api/insights")
	.then(({ result:insights }) => {
		const newestInsights = insights.sort((a, b) => new Date(b.Date) - new Date(a.Date));
		const topInsights = insights.sort((a, b) => a.Views - b.Views);
		res.render("insights", {
			title: "Insights | Visbanking",
			path: "/insights",
			topInsights,
			newestInsights,
			loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
		});
	})
	.catch(console.error);
});

router.get("/:article_id", (req, res) => {
	get(`/api/insights/insight/${req.params.article_id}`)
	.then(async ({ result:insight }) => {
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
	.catch(() => {
		res.redirect("/insights");
	});
});

module.exports = router;
