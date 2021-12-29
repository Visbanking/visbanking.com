const express = require("express");
const bodyParser = require("body-parser");
const { check } = require("email-existence");
const hash = require("hash.js");
const cookieParser = require("cookie-parser");
const connection = require("./data/dbconnection");
require("dotenv").config();
const router = express.Router();
router.use(bodyParser.urlencoded({extended:true}));
router.use(cookieParser());

var logInError, emailAfterRedirect, signUpError, emailError;

router.get("/login", (req, res) => {
    if (req.cookies.user) {
        res.redirect(`/users/${req.cookies.user}`);
    } else {
        res.render("login", {
            title: "Log In - Visbanking",
            path: "/login",
            action: "Log In",
            incorrectPassword: logInError,
            emailAfterRedirect
        });
    }
});

router.post("/login", (req, res) => {
    const email = req.body.email, pass = hash.sha512().update(req.body.pass).digest("hex");
    connection.query(`SELECT Password FROM Users WHERE Email='${email}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length < 1) {
            res.redirect("/signup");
        } else if (pass === results[0].Password) {
            res.cookie("user", email, {
                httpOnly: true,
                expires: new Date(Date.now() + 241920000),
            });
            res.redirect(`/users/${email}`);
        } else {
            logInError = true;
            res.redirect("/login");
        }
    });
});

router.get("/signup", (req, res) => {
    if (req.cookies.user) {
        res.redirect(`/users/${req.cookies.user}`);
    } else if (!req.query.tier) {
        res.redirect("/buy?tier=free");
    } else {
        res.render("login", {
            title: "Sign Up - Visbanking",
            path: "/signup",
            action: "Sign Up",
            tier: req.query.tier,
            signUpError: signUpError,
        });
    }
});

router.post("/signup", (req, res) => {
    const fname = req.body.fname, lname = req.body.lname, email = req.body.email, pass = hash.sha512().update(req.body.pass).digest("hex"), tier = req.body.tier;
    check(email, (err, response) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (!response) {
            emailError = true;
            res.redirect("/signup");
        }
        else {
            connection.query(`INSERT INTO Users (FirstName, LastName, Email, Password, Tier) VALUES ('${fname}','${lname}','${email}','${pass}', '${tier[0].toUpperCase()+tier.slice(1)}');`, (err, results, fields) => {
                if (err && err.code==='ER_DUP_ENTRY') {
                    emailAfterRedirect = email;
                    if (err.sqlMessage.includes("Email")) {
                        res.redirect("/login");
                    } else if (err.sqlMessage.includes("Username")) {
                        signUpError = true;
                        res.redirect("/signup");
                    }
                } else {
                    connection.query(`SELECT ID FROM Users WHERE Email='${email}';`, (err, results, fields) => {
                        if (err) {
                            console.error(err);
                            res.redirect("/error");
                        } else {
                            res.cookie("user", email, {
                                httpOnly: true,
                                expires: new Date(Date.now() + 241920000)
                            });
                            res.redirect(`/users/${email}`);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;