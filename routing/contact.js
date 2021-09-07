const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("contact", {
        title: "Contact Us - Visbanking",
        path: req.url
    });
});

module.exports = router;