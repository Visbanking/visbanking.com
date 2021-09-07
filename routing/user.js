const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("users", {
        title: "Users - Visbanking"
    });
});

router.get("/:user_id", (req, res) => {
    res.send(req.params);
    // Query the database for user with id = user_id
    // If query returns an object, render template user.pug
    // If query doesn't return an object, user does not exist -> 404 error
});

router.get("/:user_id/articles", (req, res) => {
    res.send(req.params);
    // Query the database for articles under user with id = user_id
    // Render templates user_articles.pug
});

router.get("/:user_id/banks", (req, res) => {
    res.send(req.params);
    // Query the database for banks being watched by user with id = user_id
    // Render template user_banks.pug
});

module.exports = router;