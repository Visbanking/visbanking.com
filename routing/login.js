const express = require("express");
const bodyParser = require("body-parser");
const { EmailVerifier } = require("simple-email-verifier");
const hash = require("hash.js");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const connection = require("./data/dbconnection");
const router = express.Router();
require("dotenv").config();

router.use(bodyParser.urlencoded({extended:true}));
router.use(cookieParser());

var logInError, emailAfterRedirect, signUpError, emailError;
const verifier = new EmailVerifier(10000);

router.get("/login", (req, res) => {
    if (req.cookies.session_id && req.cookies.user) {
        res.redirect(`/me`);
    } else {
        res.render("login", {
            title: "Log In - Visbanking",
            path: "/login",
            action: "Log In",
            incorrectPassword: logInError,
            emailAfterRedirect
        });
    }
    logInError = false;
    emailAfterRedirect = '';
});

router.post("/login", (req, res) => {
    const email = req.body.email, pass = hash.sha512().update(req.body.pass).digest("hex");
    connection.query(`SELECT Password FROM Users WHERE Email='${email}';`, (err, results, fields) => {
        if (err) {
            logInError = true;
            res.redirect("/login");
        } else if (results.length < 1) {
            res.redirect("/signup");
        } else if (pass === results[0].Password) {
            const session_id = hash.sha512().update(uuidv4()).digest("hex");
            connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Email = '${email}';`, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    res.redirect("/login");
                } else {
                    res.cookie('user', email, {
                        httpOnly: true,
                        secure: true,
                        expires: new Date(Date.now() + 241920000),
                    });
                    res.cookie("session_id", session_id, {
                        httpOnly: true,
                        secure: true,
                        expires: new Date(Date.now() + 241920000),
                    });
                    res.redirect(`/me`);
                }
            });
        } else {
            logInError = true;
            res.redirect("/login");
        }
    });
});

router.get("/login/google", (req, res) => {
    if (req.query.iss.includes("accounts.google.com") && req.query.aud === process.env.GOOGLE_SIGN_IN_CLIENT_ID) {
        connection.query(`SELECT * FROM Users WHERE Google = '${req.query.email}';`, (err, results, fields) => {
            if (err) {
                emailError = true;
                console.error(err);
                res.redirect("/login");
            } else if (results.length < 1) {
                res.redirect(`/signup/google?iss=${req.query.iss}&aud=${req.query.aud}&fname=${req.query.fname}&lname=${req.query.lname}&email=${req.query.email}&photo=${req.query.photo}&p=${req.query.p}&tier=free`);
            } else {
                const session_id = hash.sha512().update(uuidv4()).digest("hex");
                connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Google = '${req.query.email}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/login");
                    } else {
                        res.cookie('user', req.query.email, {
                            httpOnly: true,
                            secure: true,
                            expires: new Date(Date.now() + 241920000),
                        });
                        res.cookie("session_id", session_id, {
                            httpOnly: true,
                            secure: true,
                            expires: new Date(Date.now() + 241920000),
                        });
                        res.redirect(`/me`);
                    }
                });
            }
        });
    } else res.redirect("/login");
});

router.get("/signup", (req, res) => {
    if (req.cookies.session_id && req.cookies.user) {
        res.redirect(`/me`);
    } else if (!req.query.tier) {
        res.redirect("/signup?tier=free");
    } else {
        res.render("login", {
            title: "Sign Up - Visbanking",
            path: "/signup",
            action: "Sign Up",
            tier: req.query.tier,
            signUpError: signUpError,
            emailError
        });
    }
    emailError = signUpError = false;
});

router.post("/signup", (req, res) => {
    const fname = req.body.fname, lname = req.body.lname, email = req.body.email, pass = hash.sha512().update(req.body.pass).digest("hex"), tier = req.body.tier;
    verifier.verify(email).then(result => {
        if (result) {
            connection.query(`INSERT INTO Users (FirstName, LastName, Email, Password, Tier) VALUES ('${fname}','${lname}','${email}','${pass}', '${tier[0].toUpperCase()+tier.slice(1)}');`, (err, results, fields) => {
                if (err && err.code==='ER_DUP_ENTRY') {
                    emailAfterRedirect = email;
                    if (err.sqlMessage.includes("Email")) {
                        res.redirect("/login");
                    }
                } else {
                    connection.query(`SELECT ID FROM Users WHERE Email='${email}';`, (err, results, fields) => {
                        if (err) {
                            console.error(err);
                            res.redirect("/error");
                        } else {
                            const session_id = hash.sha512().update(uuidv4()).digest("hex");
                            connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Email = '${email}';`, (err, results, fields) => {
                                if (err) {
                                    console.error(err);
                                    res.redirect("/signup");
                                } else {
                                    res.cookie('user', email, {
                                        httpOnly: true,
                                        secure: true,
                                        expires: new Date(Date.now() + 241920000),
                                    });
                                    res.cookie("session_id", session_id, {
                                        httpOnly: true,
                                        secure: true,
                                        expires: new Date(Date.now() + 241920000)
                                    });
                                    if (tier === 'free') {
                                        return res.redirect(`/me`);
                                    }
                                    res.redirect(`/buy?tier=${req.body.tier}`);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            emailError = true;
            res.redirect("/signup");
        }
    }).catch(() => {
        console.error;
        res.redirect("/signup");
    });
});

router.get("/signup/google", (req, res) => {
    if (req.query.iss.includes("accounts.google.com") && req.query.aud === process.env.GOOGLE_SIGN_IN_CLIENT_ID) {
        connection.query(`INSERT INTO Users (FirstName, LastName, Email, Password, Tier, Image, Google) VALUES ('${req.query.fname}', '${req.query.lname}', '${req.query.email}', '${hash.sha512().update(req.query.p).digest("hex")}', '${req.query.tier[0].toUpperCase()+req.query.tier.slice(1)}', '${req.query.photo}', '${req.query.email}');`, (err, results, fields) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.redirect(`/login/google?email=${req.query.email}`);
                }
                emailError = true;
                res.redirect("/signup");
            } else {
                const session_id = hash.sha512().update(uuidv4()).digest("hex");
                connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Google = '${req.query.email}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/signup");
                    } else {
                        res.cookie('user', req.query.email, {
                            httpOnly: true,
                            secure: true,
                            expires: new Date(Date.now() + 241920000),
                        });
                        res.cookie("session_id", session_id, {
                            httpOnly: true,
                            secure: true,
                            expires: new Date(Date.now() + 241920000)
                        });
                        if (req.query.tier === 'free') {
                            return res.redirect(`/me`);
                        }
                        res.redirect(`/buy?tier=${req.query.tier}`);
                    }
                });
            }
        });
    } else res.redirect("/signup");
});

module.exports = router;