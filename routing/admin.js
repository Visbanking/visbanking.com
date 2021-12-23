const { Router } = require("express");
const connection = require("./dbconnection");
const hash = require("hash.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const marked = require("marked");
const fs = require("fs");
require("dotenv").config();
const router = Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

let error, message;
const insightStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "static", "images", "insights"));
    }, 
    filename: (req, file, cb) => {
        cb(null, `${lodash.camelCase(req.body.title)}.jpg`);
    }
});
const memberStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "static", "images", "members"));
    },
    filename: (req, file, cb) => {
        cb(null, `${lodash.camelCase(req.body.name)}.jpg`);
    }
});

const insight = multer({ storage:insightStorage });
const member = multer({ storage:memberStorage });

router.use((req, res, next) => {
    const userAgent = req.headers["user-agent"];
    if (userAgent.includes("Android") || userAgent.includes("iPhone") || userAgent.includes("iPad"))
    {
        return res.render("redirect", {
            title: 'Page Unavailable'
        });
    }
    next();
});

router.all("/", (req, res) => {
    res.redirect("/admin/login");
});

router.post("/dashboard/*", (req, res, next) => {
    if (req.cookies.admin) {
        connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else if (results[0]['COUNT(*)'] === 0) {
                res.redirect("/");
            } else {
                next();
            }
        });
    } else res.redirect("/admin");
});

router.get("/login", (req, res) => {
    if (req.cookies.admin) {
        connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else if (results[0]["COUNT(*)"] !== 0) {
                res.redirect("/admin/dashboard");
            }
        });
    } else {
        res.render("admin", {
            title: "Admin Login - Visbanking",
            error: error
        });
        error = "";
    }
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
            error = "The username or password entered were invalid";
            res.redirect("/admin/login");
        } else {
            res.cookie('admin', username, {
                httpOnly: true,
                expires: new Date(Date.now() + 8640000)
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
                    admin: results[0],
                    message: message
                });
                message = "";
            }
        });
    }
});

router.post("/dashboard/profile", (req, res) => {
    if (req.body.username.trim() !== '' && req.body.pass.trim() !== '') {
        const username = req.body.username.trim(), pass = hash.sha512().update(req.body.pass.trim()).digest("hex");
        connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Profile information couldn't be updated. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Admins SET Username = '${username}', Password = '${pass}' WHERE ID = '${id}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = "Profile information couldn't be updated. Please try again.";
                        res.redirect("/admin/dashboard");
                    } else {
                        res.clearCookie("admin");
                        res.redirect("/admin");
                    }
                });
            }
        });
    } else if (req.body.pass.trim() !== '') {
        const pass = hash.sha512().update(req.body.pass.trim()).digest("hex");
        connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Profile information couldn't be updated. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Admins SET Password = '${pass}' WHERE ID = '${id}';`, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    message = "Profile information couldn't be updated. Please try again.";
                    res.redirect("/admin/dashboard");
                } else {
                    res.clearCookie("admin");
                    res.redirect("/admin");
                }
            });
            }
        });
    } else if (req.body.username.trim() !== '') {
        const username = req.body.username.trim();
        connection.query(`SELECT ID FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Profile information couldn't be updated. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Admins SET Username = '${username}' WHERE ID = '${id}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = "Profile information couldn't be updated. Please try again.";
                        res.redirect("/admin/dashboard");
                    } else {
                        res.clearCookie("admin");
                        res.redirect("/admin");
                    }
                });
            }
        });
    }
});

router.post("/dashboard/admins", (req, res) => {
    const action = req.body.action;
    if (action === "Add admin") {
        const username = req.body.username.trim(), pass = hash.sha512().update(req.body.pass.trim()).digest("hex");
        connection.query(`INSERT INTO Admins (Username, Password) VALUES ('${username}', '${pass}');`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "New admin couldn't be created. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                message = "New admin created successfully.";
                res.redirect("/admin/dashboard");
            }
        });
    } else if (action === "Delete admin") {
        connection.query(`SELECT ID FROM Admins WHERE Username = '${req.body.username}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Admin couldn't be deleted. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`DELETE FROM Admins WHERE ID = '${id}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = "Admin couldn't be deleted. Please try again.";
                        res.redirect("/admin/dashboard");
                    } else {
                        message = "Admin deleted successfully.";
                        res.redirect("/admin/dashboard");
                    }
                });
            }
        });
    }
});

router.get("/dashboard/insights", (req, res) => {
    if (req.cookies.admin) {
        connection.query(`SELECT COUNT(*) FROM Admins WHERE Username = '${req.cookies.admin}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.redirect("/error");
            } else if (results[0]["COUNT(*)"] !== 0) {
                res.render("create");
            }
        });
    } else {
        res.redirect("/admin");
    }
});

router.post("/dashboard/insights", insight.single('image'), (req, res) => {
    const action = req.body.action;
    if (action === "Add insight") {
        connection.query(`INSERT INTO Insights VALUES ('${uuidv4()}', '${req.body.title}', '${marked(req.body.body)}', '/images/insights/${req.file.filename}', '${req.body.topics}', '${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}', 0);`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Insight couldn't be created. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                message = "Insight created successfully.";
                res.redirect("/admin/dashboard");
            }
        });
    } else if (action === "Delete insight") {
        connection.query(`SELECT ID FROM Insights WHERE Title = '${req.body.title}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Insight couldn't be deleted. Please try again";
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`DELETE FROM Insights WHERE ID = '${id}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = "Insight couldn't be deleted. Please try again";
                        res.redirect("/admin/dashboard");
                    } else {
                        message = "Insight deleted successfully.";
                        res.redirect("/admin/dashboard");
                    }
                });
            }
        });
    }
});

router.post("/dashboard/members", member.single('photo'), (req, res) => {
    const action = req.body.action;
    if (action === "Add member") {
        connection.query(`INSERT INTO Members (Name, Photo, LinkedIn, Title, Email, Department) VALUES ('${req.body.name}', '/images/members/${req.file.filename}', '${req.body.linkedin}', '${req.body.title}', '${req.body.email}', '${req.body.department}');`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = "Member couldn't be created. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                message = "Member created successfully.";
                res.redirect("/admin/dashboard");
            }
        });
    } else if (action === "Delete member") {
        fs.rm(path.join(__dirname, "..", "static", "images", "members", `${lodash.camelCase(req.body.name)}.jpg`), (err) => {
            if (err.code !== 'ENOENT') {
                console.error(err);
                message = "Member couldn't be deleted. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
                connection.query(`SELECT ID FROM Members WHERE Name = '${req.body.name}';`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = "Member couldn't be deleted. Please try again.";
                        res.redirect("/admin/dashboard");
                    } else {
                        const id = results[0].ID;
                        connection.query(`DELETE FROM Members WHERE ID = '${id}';`, (err, results, fields) => {
                            if (err) {
                                console.error(err);
                                message = "Member couldn't be deleted. Please try again.";
                                res.redirect("/admin/dashboard");
                            } else {
                                message = "Member deleted successfully.";
                                res.redirect("/admin/dashboard");
                            }
                        });
                    }
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