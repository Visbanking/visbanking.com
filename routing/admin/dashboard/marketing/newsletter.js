const { Router } = require("express");
const { getAllNewsletterSubscribers } = require("../../../../controllers/newsletterSubscriber.controller");
const router = Router();

router.get("/", (req, res) => {
	getAllNewsletterSubscribers()
	.then(results => {
		res.json({
			success: true,
			data: results
		});
	})
	.catch(err => {
		res.json({
			error: {
				summary: "An error ocurred while retrieving newsletter subscribers",
				detail: err
			}
		});
	});
});

module.exports = router;