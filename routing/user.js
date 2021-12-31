const express = require("express");
const router = express.Router();
const { urlencoded } = require("body-parser"); 
const cookieParser = require("cookie-parser");
const hash = require("hash.js");
const multer = require("multer");
const path = require("path");
const lodash = require("lodash");
const connection = require("./data/dbconnection");
const tiers = require("./data/pricingTiers.json");
const fs = require("fs");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);

router.use(urlencoded({extended: true}));
router.use(cookieParser());

let error, message;

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

router.get("/:email", (req, res, next) => {
    connection.query(`SELECT * FROM Users WHERE Email = '${req.params.email}';`, async (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            next();
        } else {
            const customer = await stripe.customers.list({
                email: req.cookies.user
            });
            const subscription = await stripe.subscriptions.list({
                customer: customer.data[0].id
            });
            const plan = await stripe.prices.list({
                product: subscription.data[0].plan.product
            });
            const tier = lodash.capitalize(plan.data[0].lookup_key);
            res.cookie('tier', tier, {
                httpOnly: true,
                expires: new Date(Date.now() + 241920000)
            });
            res.render("user", {
                title: `${results[0].FirstName} ${results[0].LastName} | Users - Visbanking`,
                userInfo: results[0],
                tier,
                tiers,
                user: req.cookies.user||"",
                access: req.cookies.user===results[0].Email,
                message,
                error: error||''
            });
            error = message = '';
        }
    });
});

router.post("/:email", user.single('image'), (req, res) => {
    if (req.cookies.user === req.params.email) {
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
                            error = 'Name and/or profile picture couldn\'t be updated';
                        } else {
                            message = 'Name and profile picture updated successfully';
                        }
                        res.redirect(`/users/${req.params.email}`);
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
                            error = 'Name couldn\'t be updated'
                        } else {
                            message = 'Name updated successfully';
                        }
                        res.redirect(`/users/${req.params.email}`);
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
                            error = 'Profile picture couldn\'t be updated';
                        } else {
                            message = 'Profile picture updated successfully';
                        }
                        res.redirect(`/users/${req.params.email}`);
                    });
                }
            });
        }
    } else res.redirect(`/users/${req.cookies.user}`);
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
    if (req.cookies.user === req.params.email) {
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
                            error = `Password couldn\'t be updated`;
                        } else {
                            message = 'Password updated successfully';
                        }
                        res.clearCookie('user');
                        res.redirect("/login");
                    });
                }
            }
        });
    } else {
        res.redirect(`/users/${req.cookies.user}`);
    }
});

router.get("/:email/logout", (req, res) => {
    res.clearCookie("user");
    res.redirect("/");
});

router.get("/:email/subscription", (req, res) => {
    if (req.cookies.user === req.params.email) {
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) {
                error = 'Your subscription couldn\'t be updated';
                res.redirect(`/users/${req.cookies.email}`);
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET Tier = '${lodash.capitalize(req.query.tier)}' WHERE ID = ${id};`, async (err, results, fields) => {
                    if (err) {
                        error = 'Your subscription couldn\'t be updated';
                        res.redirect(`/users/${req.cookies.user}`);
                    } else {
                        const customer = await stripe.customers.list({
                            email: req.cookies.user
                        });
                        const subscription = await stripe.subscriptions.list({
                            customer: customer.data[0].id
                        });
                        const endTier = req.query.tier;
                        const prices = await stripe.prices.list({
                            lookup_keys: [endTier]
                        });
                        await stripe.subscriptions.update(subscription.data[0].id, {
                            cancel_at_period_end: false,
                            proration_behavior: 'always_invoice',
                            items: [{
                                id: subscription.data[0].items.data[0].id,
                                price: prices.data[0].id
                            }]
                        });
                        if (req.cookies.tier === 'Free') message = 'Your plan has been upgraded';
                        else message = `Your plan has been updated to ${lodash.capitalize(endTier)}`;
                        res.redirect(`/users/${req.cookies.user}`);
                    }
                });
            }
        });
    } else res.redirect(`/users/${req.cookies.user}`)
});

router.get("/:email/delete", async (req, res) => {
    if (req.cookies.user === req.params.email) {
        const customer = await stripe.customers.list({
            email: req.cookies.user
        });
        const subscription = await stripe.subscriptions.list({
            customer: customer.data[0].id
        });
        stripe.subscriptions.del(subscription.data[0].id, { invoice_now: false }, (err, result) => {
            if (err) {
                error = 'Your account couldn\'t be deleted';
                res.redirect(`/users/${req.cookies.user}`);
            } else {
                stripe.customers.del(customer.data[0].id, (err, result) => {
                    if (err) {
                        error = 'Your account couldn\'t be deleted';
                        res.redirect(`/users/${req.cookies.user}`);
                    } else {
                        connection.query(`SELECT ID FROM Users WHERE Email = '${req.params.email}';`, (err, results, fields) => {
                            if (err) {
                                error = 'Your account couldn\'t be deleted';
                                res.redirect(`/users/${req.cookies.user}`);
                            } else {
                                connection.query(`DELETE FROM Users WHERE ID = ${results[0].ID};`, (err, results, fields) => {
                                    if (err) {
                                        error = 'Your account couldn\'t be deleted';
                                        return res.redirect(`/users/${req.cookies.user}`);
                                    }
                                    fs.rm(path.join(__dirname, "..", "static", "images", "users", `${lodash.camelCase(req.cookies.user).split('@')[0]}.jpg`), (err) => {
                                        if (err.code !== 'ENOENT') {
                                            error = 'Your account couldn\'t be deleted';
                                            res.redirect(`/users/${req.cookies.email}`)
                                        } else {
                                            res.cookie('user', 'deleted');
                                            res.redirect("/users/deleted");
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    } else res.redirect(`/users/${req.cookies.user}`);
});

router.get("/deleted", (req, res) => {
    if (req.cookies.user === 'deleted') {
        res.clearCookie('user');
        res.clearCookie('tier');
        res.render("deleted");
    } else {
        res.redirect(`/users/${req.cookies.user}`);
    }
});

module.exports = router;