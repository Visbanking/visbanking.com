const { Router } = require("express");
const { getAllNewsDigestSubscribers } = require("../../../../controllers/newsDigestSubscriber.controller");
const router = Router();

router.get("/", (req, res) => {
	getAllNewsDigestSubscribers()
	.then(results => {
		res.json({
			success: true,
			data: results
		});
	})
	.catch(err => {
		res.json({
			error: {
				summary: "AN error ocurred while retrieving news digest subscribers",
				detail: err
			}
		});
	});
});

module.exports = router;