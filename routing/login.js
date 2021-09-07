const express = require("express");
const bodyParser = require("body-parser");
const existence = require("email-existence");
const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Log In - Visbanking",
        path: req.path,
        action: "Log In"
    });
});

router.post("/login", (req, res) => {
    res.send(req.body);
    const email = req.body.email;
    existence.check(email, (err, response) => {
        if (err || !response) console.log("Email doesn't exist");
        else console.log("Email is valid");
    });
});

router.get("/signup", (req, res) => {
    res.render("login", {
        title: "Sign Up - Visbanking",
        path: req.path,
        action: "Sign Up"
    });
});

router.post("/signup", (req, res) => {
    const email = req.body.email, password = req.body.password;
})

module.exports = router;