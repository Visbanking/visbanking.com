const express = require("express");
const bodyParser = require("body-parser");
const existence = require("email-existence");
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

let error;

router.get("/", (req, res) => {
    res.render("contact", {
        title: "Contact Us - Visbanking",
        path: "/contact", 
        error: error
    });
});

router.post("/", (req, res) => {
    const name = req.body.name, email = req.body.email, subject = req.body.subject, message = req.body.message;
    existence.check(email, (err, response) => {
        if (err || !response) {
            console.error(err);
            error = `${email} doesn't exist`;
        }
    })
})

module.exports = router;