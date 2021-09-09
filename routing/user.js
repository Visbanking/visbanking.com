const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("users", {
        title: "Users - Visbanking",
        path: "/users"
    });
});

router.get("/:username", (req, res) => {
    res.send(req.params);
    // Query the database for user with username = username
    // If query returns an object, render template user.pug
    // If query doesn't return an object, user does not exist -> 404 error
});

router.get("/:username/articles", (req, res) => {
    res.send(req.params);
    // Query the database for articles under user with username = username
    // Render templates user_articles.pug
});

router.get("/:username/banks", (req, res) => {
    res.send(req.params);
    // Query the database for banks being watched by user with username = username
    // Render template user_banks.pug
});

module.exports = router;