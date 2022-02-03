const express = require("express");
const bodyParser = require("body-parser");
const { EmailVerifier } = require("simple-email-verifier");
const connection = require("./data/dbconnection");
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

let error;
const verifier = new EmailVerifier(10000);

router.get("/", (req, res) => {
    res.render("contact", {
        title: "Contact Us - Visbanking",
        path: "/contact", 
        error: error
    });
});

router.post("/", (req, res) => {
    const name = `${req.body.fname} ${req.body.lname}`, email = req.body.email, message = req.body.message, topic = req.body.topic, phone = req.body.phone;
    verifier.verify(email).then(result => {
        if (result) {
            connection.query(`INSERT INTO Contacts (Name, Email, Message, Topic, Phone) VALUES ('${name}', '${email}', '${message}', '${topic}', '${phone}');`, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    res.redirect("/error");
                } else {
                    res.redirect("/contact/success");
                }
            });
        } else {
            error = `${email} doesn't exist`;
            res.redirect("/contact");
        }
    }).catch(() => {
        error = 'There was a problem. Please try again.';
        res.redirect("/contact");
    });
});

router.get("/success", (req, res) => {
    res.render("success", {
        title: "Success - Visbanking",
        path: "/contact/success"
    });
});

module.exports = router;