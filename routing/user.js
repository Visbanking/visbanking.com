const express = require("express");
const router = express.Router();
const { urlencoded } = require("body-parser"); 
const cookieParser = require("cookie-parser");
const hash = require("hash.js");
const multer = require("multer");
const path = require("path");
const lodash = require("lodash");
const { get, post } = require("axios");
const connection = require("./data/dbconnection");
const tiers = require("./data/.pricingTiers.json");
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

router.all("/*", (req, res, next) => {
    if (!req.cookies.session_id || !req.cookies.user) {
        res.clearCookie('session_id');
        res.clearCookie('user');
        return res.redirect("/login");
    }
    connection.query(`SELECT Session_ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        if (!results[0]) {
            res.clearCookie("user");
            res.clearCookie("session_id"); 
            res.redirect("/signup");
        }
        else if (req.cookies.session_id === results[0].Session_ID) next();
        else {
            res.clearCookie('session_id');
            res.redirect("/login");
        }
    });
});

router.get("/", (req, res, next) => {
    connection.query(`SELECT * FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (results.length === 0) {
            next();
        } else {
            res.cookie('tier', results[0].Tier, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 241920000)
            });
            res.render("user", {
                title: `${results[0].FirstName} ${results[0].LastName} - Visbanking`,
                userInfo: results[0],
                tier: results[0].Tier,
                tiers,
                user: req.cookies.user||"",
                message,
                error: error||''
            });
            error = message = '';
        }
    });
});

router.post("/", user.single('image'), (req, res) => {
    if (req.body.name.split(" ").length > 1 && req.file) {
        const fname = req.body.name.split(" ")[0], lname = req.body.name.split(" ")[1];
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) {
                error = 'Name and/or profile picture couldn\'t be updated';
                res.redirect(`/me`);
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET FirstName = '${fname}', LastName = '${lname}', Image = '/images/users/${req.file.filename}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        error = 'Name and/or profile picture couldn\'t be updated';
                    } else {
                        message = 'Name and profile picture updated successfully';
                    }
                    res.redirect(`/me`);
                });
            }
        });
    } else if (!req.file) {
        const fname = req.body.name.split(" ")[0], lname = req.body.name.split(" ")[1];
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) {
                error = 'Name couldn\'t be updated'
                res.redirect(`/me`);
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET FirstName = '${fname}', LastName = '${lname}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        error = 'Name couldn\'t be updated'
                    } else {
                        message = 'Name updated successfully';
                    }
                    res.redirect(`/me`);
                });
            }
        });
    } else if (!(req.body.name.split(" ").length > 1)) {
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) {
                error = 'Profile picture couldn\'t be updated';
                res.redirect(`/me`);
            } else {
                const id = results[0].ID;
                connection.query(`UPDATE Users SET Image = '/images/users/${req.file.filename}' WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        error = 'Profile picture couldn\'t be updated';
                    } else {
                        message = 'Profile picture updated successfully';
                    }
                    res.redirect(`/me`);
                });
            }
        });
    }
});

router.get("/password", (req, res) => {
    res.render("update", {
        title: "Update Password", 
        error: error || ''
    });
    error = '';
});

router.post("/password", (req, res) => {
    const old = hash.sha512().update(req.body.old).digest("hex");
    connection.query(`SELECT Password FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.redirect("/error");
        } else if (old !== results[0].Password) {
            error = 'Old password is incorrect';
            res.redirect(`/me/password`);
        } else {
            if (old === hash.sha512().update(req.body.pass).digest("hex")) {
                error = 'New password can\'t be the same as old password';
                res.redirect(`/me/password`);
            } else if (old === results[0].Password) {
                const pass = hash.sha512().update(req.body.pass).digest("hex");
                connection.query(`UPDATE Users SET Password = '${pass}' WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
                    if (err) {
                        error = `Password couldn\'t be updated`;
                        res.redirect(`/me`);
                    } else {
                        message = 'Password updated successfully';
                        res.clearCookie('user');
                        res.redirect("/login");
                    }
                });
            }
        }
    });
});

router.get("/connect/google", (req, res) => {
    if (req.query.iss.includes("accounts.google.com") && req.query.aud === process.env.GOOGLE_SIGN_IN_CLIENT_ID) {
        connection.query(`UPDATE Users SET Google = '${req.query.email}' WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) error = 'Google account couldn\'t be associated';
            else message = 'Google account associated successfully';
            res.redirect("/me");
        });
    }
});

router.get("/connect/linkedin", (req, res) => {
    if (!req.query.state) res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=http://visbanking.com/me/connect/linkedin&state=${process.env.LINKEDIN_STATE_STRING}&scope=r_liteprofile%20r_emailaddress`);
    else if (req.query.state !== process.env.LINKEDIN_STATE_STRING) res.redirect("/me");
    else if (req.query.state === process.env.LINKEDIN_STATE_STRING) {
        if (req.query.error) {
            error = 'LinkedIn account couldn\'t be associated';
            res.redirect("/me");
        } else {
            post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.query.code}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}&redirect_uri=http://visbanking.com/me/connect/linkedin`, {}, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(accessData => {
                get("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
                    headers: {
                        'Authorization': `Bearer ${accessData.data.access_token}`
                    }
                })
                .then(emailData => {
                    const email = emailData.data.elements[0]["handle~"].emailAddress;
                    connection.query(`UPDATE Users SET LinkedIn = '${email}' WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
                        if (err) error = 'LinkedIn account couldn\'t be associated';
                        else message = 'LinkedIn account associated successfully';
                        res.redirect("/me");
                    });
                })
                .catch(err => {
                    error = 'LinkedIn account couldn\'t be associated'
                    res.redirect("/me")
                });
            })
            .catch(err => {
                error = 'LinkedIn account couldn\'t be associated'
                res.redirect("/me")
            });
        }
    }
});

router.get("/logout", (req, res) => {
    connection.query(`UPDATE Users SET Session_ID = '' WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        res.clearCookie("user");
        res.clearCookie('tier');
        res.clearCookie('session_id');
        res.redirect("/");
    });
});

router.get("/subscription", (req, res) => {
    connection.query(`SELECT ID, Tier FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        if (err) {
            error = 'Your subscription couldn\'t be updated';
            res.redirect(`/me`);
        } else {
            const id = results[0].ID;
            const tier = results[0].Tier;
            connection.query(`UPDATE Users SET Tier = '${lodash.capitalize(req.query.tier)}' WHERE ID = ${id};`, async (err, results, fields) => {
                if (err) {
                    error = 'Your subscription couldn\'t be updated';
                    res.redirect(`/me`);
                } else {
                    if (tier === 'Free') {
                        return res.redirect("/buy?tier=free");
                    }
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
                    res.redirect(`/me`);
                }
            });
        }
    });
});

router.get("/cancel", (req, res) => {
    connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
        if (err) {
            error = 'Your subscription coudln\'t be canceled';
            res.redirect(`/me`);
        } else {
            const id = results[0].ID;
            connection.query(`UPDATE Users SET Tier = 'Free' WHERE ID = ${id};`, async (err, results, fields) => {
                if (err) {
                    error = 'Your subscription coudln\'t be canceled';
                    res.redirect(`/me`);
                } else {
                    const customer = await stripe.customers.list({
                        email: req.cookies.user
                    });
                    const subscription = await stripe.subscriptions.list({
                        customer: customer.data[0].id
                    });
                    const prices = await stripe.prices.list({
                        lookup_keys: ['free']
                    });
                    await stripe.subscriptions.update(subscription.data[0].id, {
                        cancel_at_period_end: false,
                        proration_behavior: 'always_invoice',
                        items: [{
                            id: subscription.data[0].items.data[0].id,
                            price: prices.data[0].id
                        }]
                    });
                    message = 'Your subscription has been cancelled';
                    res.redirect(`/me`);
                }
            });
        }
    });
});

router.get("/delete", async (req, res) => {
    if (req.cookies.tier === 'Free') {
        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
            if (err) {
                error = 'Your account couldn\'t be deleted';
                res.redirect(`/me`);
            } else {
                const id = results[0].ID;
                connection.query(`DELETE FROM Users WHERE ID = ${id};`, (err, results, fields) => {
                    if (err) {
                        error = 'Your account couldn\'t be deleted';
                        res.redirect(`/me`);
                    } else {
                        fs.rm(path.join(__dirname, "..", "static", "images", "users", `${lodash.camelCase(req.cookies.user).split('@')[0]}.jpg`), { force:true }, (err) => {
                            res.clearCookie('user');
                            res.clearCookie('tier');
                            res.clearCookie('session_id');
                            res.render("deleted");
                        });
                    }
                });
            }
        });
    } else {
        const customer = await stripe.customers.list({
            email: req.cookies.user
        });
        const subscription = await stripe.subscriptions.list({
            customer: customer.data[0].id
        });
        stripe.subscriptions.del(subscription.data[0].id, { invoice_now: false }, (err, result) => {
            if (err) {
                error = 'Your account couldn\'t be deleted';
                res.redirect(`/me`);
            } else {
                stripe.customers.del(customer.data[0].id, (err, result) => {
                    if (err) {
                        error = 'Your account couldn\'t be deleted';
                        res.redirect(`/me`);
                    } else {
                        connection.query(`SELECT ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
                            if (err) {
                                error = 'Your account couldn\'t be deleted';
                                res.redirect(`/me`);
                            } else {
                                connection.query(`DELETE FROM Users WHERE ID = ${results[0].ID};`, (err, results, fields) => {
                                    if (err) {
                                        error = 'Your account couldn\'t be deleted';
                                        return res.redirect(`/me`);
                                    }
                                    fs.rm(path.join(__dirname, "..", "static", "images", "users", `${lodash.camelCase(req.cookies.user).split('@')[0]}.jpg`), { force:true }, (err) => {
                                        res.clearCookie('user');
                                        res.clearCookie('tier');
                                        res.clearCookie('session_id');
                                        res.render("deleted");
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;