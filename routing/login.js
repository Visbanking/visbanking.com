const express = require("express");
const bodyParser = require("body-parser");
const { check } = require("email-existence");
const hash = require("hash.js");
const { createConnection } = require("mysql");
const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));

const connection = createConnection({
    host: 'database-visbanking-mysql.cysrondf3cdf.us-east-2.rds.amazonaws.com',
    user: 'webmaster',
    password: 'fRcrTbL*F%9m!h',
    database: 'Users'
});

connection.on("error", (err) => {
    console.log(err.code);
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
});

var logInError, usernameAfterRedirect, signUpError, emailError, usernameError;

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Log In - Visbanking",
        path: "/login",
        action: "Log In",
        incorrectPassword: logInError,
        usernameAfterRedirect,
        usernameError
    });
});

router.post("/login", (req, res, next) => {
    const username = req.body.username, pass = hash.sha512().update(req.body.pass).digest("hex");
    connection.query(`SELECT Password FROM Users WHERE Username='${username}';`, (err, results, fields) => {
        if (err || results.length < 1) {
            usernameError = true;
            return res.redirect("/login");
        };
        if (pass === results[0].Password) {
            res.redirect(`/users/${username}`);
        } else {
            logInError = true;
            res.redirect("/login");
        }
    });
});

router.get("/signup", (req, res) => {
    res.render("login", {
        title: "Sign Up - Visbanking",
        path: "/signup",
        action: "Sign Up",
        signUpError: signUpError,
        emailError : emailError
    });
});

router.post("/signup", (req, res) => {
    const fname = req.body.fname, lname = req.body.lname, email = req.body.email, username = req.body.username, pass = hash.sha512().update(req.body.pass).digest("hex");
    check(email, (err, response) => {
        if (err || !response) {
            emailError = true;
            res.redirect("/signup");
        }
        else {
            connection.query(`INSERT INTO Users (FirstName, LastName, Email, Username, Password) VALUES ('${fname}','${lname}','${email}','${username}','${pass}');`, (err, results, fields) => {
                if (err && err.code==='ER_DUP_ENTRY') {
                    usernameAfterRedirect = username;
                    if (err.sqlMessage.includes("Email")) {
                        res.redirect("/login");
                    } else if (err.sqlMessage.includes("Username")) {
                        signUpError = true;
                        res.redirect("/signup");
                    }
                } else {
                    connection.query(`SELECT ID FROM Users WHERE Username='${username}';`, (err, results, fields) => {
                        if (err) throw err;
                        const date = new Date();
                        connection.query(`INSERT INTO Subscriptions (UserID, StartDate, EndDate) VALUES (${results[0].ID}, '${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}', '${date.getFullYear()+1}-${date.getMonth()+1}-${date.getDate()}');`, (err, results, fields) => {
                            if (err) {
                                res.status(500).render("error", {
                                    title: "Server Error",
                                    code: 500,
                                    message: "We've had a problem communicating with the database"
                                });
                            } else {
                                res.redirect(`/users/${username}`);
                            }
                        });
                    });
                }
            });
        }
    });
    // Redirect user to personal profile
});

module.exports = router;