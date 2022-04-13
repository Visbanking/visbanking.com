const { Router } = require("express");
const connection = require("./data/dbconnection");
const hash = require("hash.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const marked = require("marked");
const fs = require("fs");
const { result } = require("lodash");
require("dotenv").config();
const router = Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

let error, message;
const insightStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    	if (!fs.existsSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title)))) fs.mkdirSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title)));
            cb(null, path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title)));
    }, 
    filename: (req, file, cb) => {
    	if (file.fieldname === "headerImage") {
            if (fs.existsSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`)))
                fs.rmSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.fieldname)}.jpg`), { force:true });
	        cb(null, `${lodash.camelCase(file.fieldname)}.jpg`);
        } if (file.fieldname === "bodyImages") {
            if (fs.existsSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`)))
                fs.rmSync(path.join(__dirname, "..", "static", "images", "insights", lodash.kebabCase(req.body.title), `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`), { force:true });
	        cb(null, `${lodash.camelCase(file.originalname.split(".")[0])}.jpg`);
        }
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
        const username = req.body.username.trim(), pass = hash.sha512().update(process.env.DEFAULT_ADMIN_PASS).digest("hex");
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

router.post("/dashboard/insights", insight.fields([{ name:'headerImage' }, { name:'bodyImages'}]), (req, res) => {
    const action = req.body.action;
    if (action === "Add insight") {
        connection.query(`INSERT INTO Insights VALUES ('${lodash.kebabCase(req.body.title)}', '${req.body.title}', '${marked.marked(req.body.body.trim()).trim()}', '/images/insights/${lodash.kebabCase(req.body.title)}/${req.files["headerImage"][0].filename}', '${req.body.topic}', '${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}', 0, '${req.body.tags}', '${req.body.author}', '${req.body.description}', '${req.body.keywords}');`, (err, results, fields) => {
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
        fs.rm(path.join(__dirname, "..", "static", "images", "insights", `${lodash.kebabCase(req.body.title)}`), { recursive:true }, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error(err);
                message = "Insight couldn't be deleted. Please try again.";
                res.redirect("/admin/dashboard");
            } else {
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
    }
});

router.get("/dashboard/insights/edit", (req, res) => {
    connection.query("SELECT Title FROM Insights ORDER BY Date DESC;", (err, results, fields) => {
        if (err || !results.length) {
            error = 'There was a problem accessing the database';
            res.redirect("/admin/dashboard");
        } else {
            const insightsTitles = results.map(insightTitle => insightTitle.Title);
            res.render("edit", {
                insightsTitles
            });
        }
    });
});

router.post("/dashboard/insights/edit", insight.fields([{ name:'headerImage' }, { name:'bodyImages'}]), (req, res) => {
    connection.query(`UPDATE Insights SET Image = '/images/insights/${lodash.kebabCase(req.body.title)}/${req.files["headerImage"][0].filename}' WHERE Title = '${req.body.title}';`, (err, results, fields) => {
        if (!results.affectedRows) error = 'Insight doesn\'t exist';
        else if (err) error = 'Insight couldn\'t be updated';
        else message = 'Insight updated successfully';
        res.redirect("/admin/dashboard");
    });
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
    } else if (action === "Edit member") {
        connection.query(`UPDATE Members SET Photo = '/images/members/${req.file.filename}' WHERE Name = '${req.body.name}';`, (err, results, fields) => {
            if (!results.affectedRows) error = 'Member doesn\'t exist';
            else if (err) error = 'Member couldn\'t be updated';
            else message = 'Member updated successfully';
            res.redirect("/admin/dashboard");
        });
    } else if (action === "Delete member") {
        fs.rm(path.join(__dirname, "..", "static", "images", "members", `${lodash.camelCase(req.body.name)}.jpg`), (err) => {
            if (err && err.code !== 'ENOENT') {
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

router.post("/dashboard/questions", (req, res) => {
    const action = req.body.action;
    if (action === "Add FAQ") {
        connection.query(`INSERT INTO Questions (Question, Answer, Category) VALUES ('${req.body.question}', '${req.body.answer}', '${req.body.category}');`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = 'FAQ couldn\'t be created. Please try again.';
                res.redirect("/admin/dashboard");
            } else {
                message = 'FAQ created successfully';
                res.redirect("/admin/dashboard");
            }
        });
    } else if (action === "Delete FAQ") {
        connection.query(`SELECT ID FROM Questions WHERE Question = '${req.body.question}';`, (err, results, fields) => {
            if (err) {
                console.error(err);
                message = 'FAQ couldn\'t be deleted. Please try again.';
                res.redirect("/admin/dashboard");
            } else {
                const id = results[0].ID;
                connection.query(`DELETE FROM Questions WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        message = 'FAQ couldn\'t be deleted. Please try again.';
                        res.redirect("/admin/dashboard");
                    } else {
                        message = 'FAQ deleted successfully';
                        res.redirect("/admin/dashboard");
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
