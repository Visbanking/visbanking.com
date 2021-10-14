const express = require("express");
const router = express.Router();
const { urlencoded } = require("body-parser"); 
const cookieParser = require("cookie-parser");
const connection = require("./dbconnection");

router.use(urlencoded({extended: true}));
router.use(cookieParser());

router.get("/", (req, res) => {
    res.render("users", {
        title: "Users - Visbanking",
        path: "/users"
    });
});

router.get("/:email", (req, res, next) => {
    connection.query(`SELECT * FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else {
            res.render("user", {
                title: `${results[0].FirstName} ${results[0].LastName} | Users - Visbanking`,
                userInfo: results[0],
                user: req.cookies.username||""
            });
        }
    });
});

router.post("/:email", (req, res) => {
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
});

// router.get("/:email/update", (req, res) => {
//     if (req.cookies.username === req.params.email) {
//         res.render("")
//     }
// });

router.get("/:email/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/");
});

module.exports = router;