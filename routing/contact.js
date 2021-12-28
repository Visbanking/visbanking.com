const express = require("express");
const bodyParser = require("body-parser");
const existence = require("email-existence");
const connection = require("./data/dbconnection");
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
    const name = `${req.body.fname} ${req.body.lname}`, email = req.body.email, subject = req.body.subject, message = req.body.message;
    existence.check(email, (err, response) => {
        if (err) {
            console.error(err);
            error = 'There was a problem. Please try again.';
        } else if (!response) {
            error = `${email} doesn't exist`;
        } else {
            connection.query(`INSERT INTO Contacts (Name, Email, Subject, Message) VALUES ('${name}', '${email}', '${subject}', '${message}');`, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    res.redirect("/error");
                } else {
                    res.redirect("/contact/success");
                }
            });
        }
    });
});

router.get("/success", (req, res) => {
    res.render("success", {
        title: "Success - Visbanking",
        path: "/contact/success"
    });
});

module.exports = router;