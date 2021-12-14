const express = require("express");
const router = express.Router();
const { urlencoded } = require("body-parser"); 
const cookieParser = require("cookie-parser");
const hash = require("hash.js");
const multer = require("multer");
const path = require("path");
const lodash = require("lodash");
const connection = require("./dbconnection");

router.use(urlencoded({extended: true}));
router.use(cookieParser());

let error;
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "static", "images", "users"));
    },
    filename: (req, file, cb) => {
        cb(null, `${lodash.camelCase(req.cookies.user.split("@")[0])}.jpg`);
    }
});
const user = multer({ storage:userStorage });

router.get("/", (req, res) => {
    res.render("users", {
        title: "Users - Visbanking",
        path: "/users"
    });
});

router.get("/:email", (req, res) => {
    connection.query(`SELECT * FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            res.redirect("/");
        } else {
            res.render("user", {
                title: `${results[0].FirstName} ${results[0].LastName} | Users - Visbanking`,
                userInfo: results[0],
                user: req.cookies.user||"",
                access: req.cookies.user===results[0].Email
            });
        }
    });
});

router.post("/:email", user.single('image'), (req, res) => {
    if (req.body.name.split(" ").length > 1 && req.file) {
        const fname = req.body.name.split(" ")[0], lname = req.body.name.split(" ")[1];
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET FirstName = '${fname}', LastName = '${lname}', Image = '/images/users/${req.file.filename}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/error");
                    } else {
                        res.redirect(`/users/${req.params.email}`);
                    }
                });
            }
        });
    } else if (!req.file) {
        const fname = req.body.name.split(" ")[0], lname = req.body.name.split(" ")[1];
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET FirstName = '${fname}', LastName = '${lname}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/error");
                    } else {
                        res.redirect(`/users/${req.params.email}`);
                    }
                });
            }
        });
    } else if (!(req.body.name.split(" ").length > 1)) {
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET Image = '/images/users/${req.file.filename}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/error");
                    } else {
                        res.redirect(`/users/${req.params.email}`);
                    }
                });
            }
        });
    }
});

router.get("/:email/update", (req, res) => {
    if (req.cookies.user === req.params.email) {
        res.render("update", {
            title: "Update Password", 
            error: error || ''
        });
        error = '';
    } else {
        res.redirect(`/users/${req.params.email}`);
    }
});

router.post("/:email/update", (req, res) => {
    const old = hash.sha512().update(req.body.old).digest("hex");
    connection.query(`SELECT Password FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (old !== results[0].Password) {
            error = 'Old password is incorrect';
            res.redirect(`/users/${req.params.email}/update`);
        } else {
            if (old === hash.sha512().update(req.body.pass).digest("hex")) {
                error = 'New password can\'t be the same as old password';
                res.redirect(`/users/${req.params.email}/update`);
            } else if (old === results[0].Password) {
                const pass = hash.sha512().update(req.body.pass).digest("hex");
                connection.query(`UPDATE Users SET Password = '${pass}' WHERE Email = '${req.params.email}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/error");
                    }
                    else {
                        res.redirect(`/users/${req.params.email}`);
                    }
                });
            }
        }
    });
});

router.get("/:email/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/");
});

module.exports = router;