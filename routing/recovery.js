const { Router } = require("express");
const connection = require("./data/dbconnection");
const hash = require("hash.js");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { readFileSync } = require("fs");
const { join } = require("path");
const router = Router();
require("dotenv").config();

router.get("/", (req,res) => {
    res.redirect("/recovery/recover");
});

router.get("/recover", (req, res) => {
    res.render("recover", {
        title: 'Password Recovery - Visbanking'
    });
});

router.post("/recover", (req, res) => {
    const email = req.body.email, recovery_id = uuidv4();
    connection.query(`UPDATE Users SET Recovery = '${recovery_id}' WHERE Email = '${email}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else {
            if (results.affectedRows === 0) {
                res.redirect("/recovery/recover/failure");
            } else {
                const transporter = nodemailer.createTransport({
                    name: 'www.visbanking.com',
                    host: 'mail.visbanking.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.NO_REPLY_EMAIL,
                        pass: process.env.NO_REPLY_PASS
                    }
                });
                const emailHTML = readFileSync(join(__dirname, "..", "views", "emails", "passwordRecovery.html"), "utf8").replace("${user}", email).replace("${recovery_id}", recovery_id);
                emailHTML.replace("${user}", email).replace("${recovery_id}", recovery_id);
                const message = {
                    from: `'Visbanking.com' ${process.env.NO_REPLY_EMAIL}`,
                    to: email,
                    subject: 'Password Recovery - Visbanking',
                    html: emailHTML
                }
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        res.redirect("/recovery/recover/failure");
                    } else {
                        res.redirect("/recovery/recover/success");
                    }
                });
            }
        }
    });
});

router.get("/recover/failure", (req, res) => {
    res.render("failure", {
        title: 'Failure - Visbanking',
        path: '/recovery/recover/failure'
    });
});

router.get("/recover/success", (req, res) => {
    res.clearCookie('user');
    res.clearCookie('tier');
    res.render("success", {
        title: 'Success - Visbanking',
        path: '/recovery/recover/success'
    });
});

router.get("/reset", (req, res) => {
    if (!req.query.user || !req.query.recovery_id) {
        res.render("reset", {
            title: 'Password Reset - Visbanking',
            access: false,
            user: req.query.user
        });
    } else {
        connection.query(`SELECT Recovery FROM Users WHERE Email = '${req.query.user}';`, (err, results, fields) => {
            console.log(results);
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else if (results.length === 0 || results[0].Recovery === 'No' || results[0].Recovery !== req.query.recovery_id) {
                res.render("reset", {
                    title: 'Password Reset - Visbanking',
                    access: false,
                    user: req.query.user
                });
            } else if (results[0].Recovery === req.query.recovery_id) {
                res.render("reset", {
                    title: 'Password Reset - Visbanking',
                    access: true
                });
            }
        });
    }
});

router.post("/reset", (req, res) => {
    const pass = hash.sha512().update(req.body.pass).digest("hex");
    connection.query(`UPDATE Users SET Password = '${pass}' WHERE Email = '${req.query.user}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/recovery/reset/failure");
        } else if (results.affectedRows === 0) {
            res.redirect("/recovery/reset/failure");
        } else {
            connection.query(`UPDATE Users SET Recovery = 'No' WHERE Email = '${req.query.user}';`);
            res.redirect("/recovery/reset/success");
        }
    });
});

router.get("/reset/failure", (req, res) => {
    res.render("failure", {
        title: 'Failure - Visbanking',
        path: '/recovery/recover/failure'
    });
});

router.get("/reset/success", (req, res) => {
    res.render("success", {
        title: 'Success - Visbanking',
        path: '/recovery/reset/success'
    });
});

module.exports = router;