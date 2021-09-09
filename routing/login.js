const express = require("express");
const bodyParser = require("body-parser");
const existence = require("email-existence");
const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Log In - Visbanking",
        path: "/login",
        action: "Log In"
    });
});

router.post("/login", (req, res) => {
    res.send(req.body);
    // Query database for email
    // If query returns an object, compare hashed password from object and hashed password from req.body
        // If password hashes coincide, log user in and redirect to personal profile
        // If passowrd hashed are different, redirect user back to login and display error message
    // If query doesn't return object, redirect user to signup
});

router.get("/signup", (req, res) => {
    res.render("login", {
        title: "Sign Up - Visbanking",
        path: "/signup",
        action: "Sign Up"
    });
});

router.post("/signup", (req, res) => {
    res.send(req.body);
    // Add JSON object to database (users collection)
    // Redirect user to personal profile
});

module.exports = router;