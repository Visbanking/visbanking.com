const { Router } = require("express");
const connection = require("./dbconnection");
const hash = require("hash.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

let error;

router.all("/", (req, res) => {
    res.redirect("/admin/login");
});

router.get("/login", (req, res) => {
    res.render("admin", {
        title: "Admin Login - Visbanking",
        error: error
    });
    error = "";
});

router.post("/login", (req, res) => {
    const username = req.body.username, pass = hash.sha512().update(req.body.pass).digest("hex");
    connection.query(`SELECT * FROM Admins WHERE Username = '${username}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            res.redirect("/");
        } else if (results[0].Password !== pass) {
            error = "The email or password entered were invalid";
            res.redirect("/admin/login");
        } else {
            res.cookie('admin', username, {
                httpOnly: true,
                expires: new Date(Date.now() + 8_640_000)
            });
            res.redirect("/admin/dashboard");
        }
    });
});

router.get("/dashboard", (req, res) => {
    if (!req.cookies.admin) {
        res.redirect("/");
    } else {
        connection.query(`SELECT * FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else if (results.length === 0) {
                res.redirect("/admin/login");
            } else {
                res.render("dashboard", {
                    title: "Admin Dashboard - Visbanking",
                    admin: results[0]
                });
            }
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie('admin');
    res.redirect("/");
});

module.exports = router;