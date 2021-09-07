const express = require("express");
const bodyParser = require("body-parser");
const existence = require("email-existence");
const router = express.Router();

router.get("/subscribe", (req, res) => {
    res.render("subscribe", {
        title: "Subscribe to our Newsletter - Visbanking",
        path: "/subscribe"
    });
});

module.exports = router;