const express = require("express");
const { createTransport } = require("nodemailer");
const hash = require("hash.js");
const { v4: uuidv4 } = require("uuid");
const { toLower } = require("lodash");
const connection = require("../data/dbconnection");
const { get, post } = require("axios");
const { readFileSync } = require("fs");
const { join } = require("path");
const router = express.Router();
require("dotenv").config();

let logInError, emailAfterRedirect, emailError;

router.get("/", (req, res) => {
	if (req.cookies.session_id && req.cookies.user) {
		res.redirect("/me");
	} else {
		res.render("login", {
			title: "Log In | Visbanking",
			path: "/login",
			action: "Log In",
			logInError,
			emailAfterRedirect,
		});
	}
	logInError = false;
	emailAfterRedirect = "";
});

router.post("/", (req, res) => {
	const email = req.body.email,
		pass = hash.sha512().update(req.body.pass).digest("hex");
	connection.query(`SELECT Password FROM Users WHERE Email='${email}';`, (err, results, fields) => {
		if (err) {
			logInError = "Please try again";
			res.redirect("/login");
		} else if (results.length < 1) {
			res.redirect("/signup");
		} else if (pass === results[0].Password) {
			const session_id = hash.sha512().update(uuidv4()).digest("hex");
			connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Email = '${email}';`, (err, results, fields) => {
				if (err) {
					logInError = "Please try again";
					res.redirect("/login");
				} else {
					res.cookie("user", email, {
						httpOnly: true,
						secure: true,
						expires: new Date(Date.now() + 241920000),
					});
					res.cookie("session_id", session_id, {
						httpOnly: true,
						secure: true,
						expires: new Date(Date.now() + 241920000),
					});
					res.redirect("/me");
				}
			});
		} else {
			logInError = "Incorrect password";
			res.redirect("/login");
		}
	});
});

router.get("/google", (req, res) => {
	if (req.query.iss.includes("accounts.google.com") && req.query.aud === process.env.GOOGLE_SIGN_IN_CLIENT_ID) {
		connection.query(`SELECT * FROM Users WHERE Google = '${req.query.email}';`, (err, results, fields) => {
			if (err) {
				emailError = "There was an error. Please try again.";
				console.error(err);
				res.redirect("/login");
			} else if (results.length < 1) {
				logInError = "Invalid credentials";
				res.redirect("/login");
			} else {
				const session_id = hash.sha512().update(uuidv4()).digest("hex"),
					user = results[0].Email;
				connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Google = '${req.query.email}';`, (err, results, fields) => {
					if (err) {
						console.error(err);
						res.redirect("/login");
					} else {
						res.cookie("user", user, {
							httpOnly: true,
							secure: true,
							expires: new Date(Date.now() + 241920000),
						});
						res.cookie("session_id", session_id, {
							httpOnly: true,
							secure: true,
							expires: new Date(Date.now() + 241920000),
						});
						res.redirect("/me");
					}
				});
			}
		});
	} else res.redirect("/login");
});

router.get("/linkedin", (req, res) => {
	if (!req.query.state)
		res.redirect(
			`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=https://visbanking.com/login/linkedin&state=${process.env.LINKEDIN_STATE_STRING}&scope=r_liteprofile%20r_emailaddress`
		);
	else if (req.query.state !== process.env.LINKEDIN_STATE_STRING) res.redirect("/login");
	else if (req.query.state === process.env.LINKEDIN_STATE_STRING) {
		if (req.query.error) res.redirect("/login");
		else {
			post(
				`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.query.code}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}&redirect_uri=https://visbanking.com/login/linkedin`,
				{},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			)
				.then((accessData) => {
					get("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
						headers: {
							Authorization: `Bearer ${accessData.data.access_token}`,
						},
					})
						.then((emailData) => {
							const email = emailData.data.elements[0]["handle~"].emailAddress;
							connection.query(`SELECT * FROM Users WHERE LinkedIn = '${email}';`, (err, results, fields) => {
								if (err) {
									emailError = "There was an error. Please try again.";
									console.error(err);
									res.redirect("/login");
								} else if (results.length < 1) {
									logInError = "Invalid credentials";
									res.redirect("/login");
								} else {
									const session_id = hash.sha512().update(uuidv4()).digest("hex"),
										user = results[0].Email;
									connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE LinkedIn = '${email}';`, (err, results, fields) => {
										if (err) {
											console.error(err);
											res.redirect("/login");
										} else {
											res.cookie("user", user, {
												httpOnly: true,
												secure: true,
												expires: new Date(Date.now() + 241920000),
											});
											res.cookie("session_id", session_id, {
												httpOnly: true,
												secure: true,
												expires: new Date(Date.now() + 241920000),
											});
											res.redirect("/me");
										}
									});
								}
							});
						})
						.catch((err) => res.redirect("/login/linkedin"));
				})
				.catch((err) => res.redirect("/login/linkedin"));
		}
	}
});

module.exports = router;
