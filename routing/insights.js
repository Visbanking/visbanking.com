const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("insights", {
        title: "Insights - Visbanking",
        path: req.path
    });
});

router.get("/:article_id", (req, res, next) => {
    console.log(req.params);
    next();
    // Query the database for an article with id = article_id
    // If query return an object, render a template passing the object to show the article
    // If query doesn't return an object, set status code as 404 and redirect
});

module.exports = router;