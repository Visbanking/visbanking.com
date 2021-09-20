const express = require("express");
const router = express.Router();
const { createConnection } = require("mysql");

const connection = createConnection({
    host: 'database-visbanking-mysql.cysrondf3cdf.us-east-2.rds.amazonaws.com',
    user: 'webmaster',
    password: 'fRcrTbL*F%9m!h',
    database: 'Users'
    // insecureAuth: true
});

router.get("/", (req, res) => {
    res.render("users", {
        title: "Users - Visbanking",
        path: "/users"
    });
});

router.get("/:username", (req, res, next) => {
    connection.query(`SELECT * FROM Users WHERE Username='${req.params.username}';`, (err, results, fields) => {
        if (err) throw err;
        else {
            res.render("user", {
                title: `${results[0].FirstName} ${results[0].LastName} | Users - Visbanking`,
                userInfo: results[0]
            });
        }
    });
});

router.get("/:username/articles", (req, res) => {
    res.send(req.params);
    // Query the database for articles under user with username = username
    // Render templates user_articles.pug
});

router.get("/:username/banks", (req, res) => {
    res.send(req.params);
    // Query the database for banks being watched by user with username = username
    // Render template user_banks.pug
});

module.exports = router;