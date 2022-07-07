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

let logInError, emailAfterRedirect, signUpError, emailError, signUpVerificationMessage;

router.get("/login", (req, res) => {
	if (req.cookies.session_id && req.cookies.user) {
		res.redirect("/me");
	} else {
		res.render("login", {
			title: "Log In - Visbanking",
			path: "/login",
			action: "Log In",
			logInError,
			emailAfterRedirect,
		});
	}
	logInError = false;
	emailAfterRedirect = "";
});

router.post("/login", (req, res) => {
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

router.get("/login/google", (req, res) => {
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

router.get("/login/linkedin", (req, res) => {
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

router.get("/signup", (req, res) => {
	if (req.query.tier !== toLower(req.query.tier)) res.redirect(`/signup?tier=${toLower(req.query.tier)}`);
	else if (req.cookies.session_id && req.cookies.user) res.redirect("/me");
	else if (!req.query.tier || !["free", "professional", "premium", "enterprise", "academic"].includes(req.query.tier) || (req.query.tier === "academic" && !req.query.email)) res.redirect("/signup?tier=free");
	else if (req.query.tier === "academic" && req.query.email) {
		connection.query(`SELECT Email, FirstName, LastName FROM Academics WHERE Email = '${req.query.email}';`, (err, results, fields) => {
			if (results[0]) {
				res.render("login", {
					title: "Sign Up | Academic - Visbanking",
					path: "/signup",
					action: "Sign Up",
					tier: "academic",
					autocompleteData: results[0]
				});
			} else res.redirect("/signup");
		});
	} else {
		res.render("login", {
			title: "Sign Up - Visbanking",
			path: "/signup",
			action: "Sign Up",
			tier: req.query.tier,
			signUpError: signUpError,
			emailError,
		});
		emailError = signUpError = "";
	}
});

router.post("/signup", (req, res) => {
	const fname = req.body.fname,
		lname = req.body.lname,
		email = req.body.email,
		pass = hash.sha512().update(req.body.pass).digest("hex"),
		tier = req.body.tier;
	const sql = req.body.tier==="academic" ? `INSERT INTO Users (FirstName, LastName, Email, Password, Tier) VALUES ('${fname}','${lname}','${email}','${pass}', '${req.query.tier}');` : `INSERT INTO Users (FirstName, LastName, Email, Password) VALUES ('${fname}','${lname}','${email}','${pass}');`
	connection.query(sql, (err, results, fields) => {
			if (err && err.code === "ER_DUP_ENTRY") {
				emailAfterRedirect = email;
				res.redirect("/login");
			} else {
				connection.query(`SELECT ID FROM Users WHERE Email='${email}';`, (err, results, fields) => {
					if (err) {
						signUpError = "Please try again";
						res.redirect("/signup");
					} else {
						const signup_code = hash.sha512().update(uuidv4()).digest("hex");
						connection.query(`UPDATE Users SET Signup_Code = '${signup_code}' WHERE Email = '${email}';`, (err, results, fields) => {
							if (err) {
								console.error(err);
								res.redirect(`/signup?tier=${tier}}`);
							} else {
								const transporter = createTransport({
									name: "www.visbanking.com",
									host: "mail.visbanking.com",
									port: 465,
									secure: true,
									auth: {
										user: process.env.NO_REPLY_EMAIL,
										pass: process.env.NO_REPLY_PASS,
									},
								});
								const userEmailHTML = readFileSync(join(__dirname, "..", "views", "emails", "emailVerification.html"), "utf8").replaceAll("${name}", `${fname} ${lname}`).replaceAll("${email}", email).replaceAll("${code}", signup_code).replaceAll("${tier}", tier);
								const userMessage = {
									from: "Visbanking.com",
									to: email,
									subject: "Verify your Visbanking account",
									html: userEmailHTML,
								};
								transporter.sendMail(userMessage, (err, info) => {
									if (err) {
										console.error(err);
										res.redirect(`/signup?tier=${tier}`);
									} else {
										res.cookie("user", email, {
											httpOnly: true,
											secure: true,
											expires: new Date(Date.now() + 241920000),
										});
										res.redirect("/signup/success");
									}
								});
								const infoEmailHTML = readFileSync(join(__dirname, "..", "views", "emails", "userConfirmation.html"), "utf8").replaceAll("${signupMethod}", "EMAIL AND PASSWORD").replaceAll("${name}", `${fname} ${lname}`).replaceAll("${email}", email).replaceAll("${tier}", tier);
								const infoMessage = {
									from: "Visbanking.com",
									to: "info@visbanking.com",
									subject: "New User Confirmation",
									html: infoEmailHTML
								};
								transporter.sendMail(infoMessage)
							}
						});
					}
				});
			}
		}
	);
	// verifier.verify(email)
	// .then(response => {
	//     if (response) {
	//         connection.query(`INSERT INTO Users (FirstName, LastName, Email, Password, Tier) VALUES ('${fname}','${lname}','${email}','${pass}', '${tier[0].toUpperCase()+tier.slice(1)}');`, (err, results, fields) => {
	//             if (err && err.code==='ER_DUP_ENTRY') {
	//                 emailAfterRedirect = email;
	//                 res.redirect("/login");
	//             } else {
	//                 connection.query(`SELECT ID FROM Users WHERE Email='${email}';`, (err, results, fields) => {
	//                     if (err) {
	//                         signUpError = 'Please try again';
	//                         res.redirect("/signup");
	//                     } else {
	//                         const session_id = hash.sha512().update(uuidv4()).digest("hex");
	//                         connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Email = '${email}';`, (err, results, fields) => {
	//                             if (err) {
	//                                 console.error(err);
	//                                 res.redirect("/signup");
	//                             } else {
	//                                 res.cookie('user', email, {
	//                                     httpOnly: true,
	//                                     secure: true,
	//                                     expires: new Date(Date.now() + 241920000),
	//                                 });
	//                                 res.cookie("session_id", session_id, {
	//                                     httpOnly: true,
	//                                     secure: true,
	//                                     expires: new Date(Date.now() + 241920000)
	//                                 });
	//                                 if (tier === 'free') {
	//                                     return res.redirect(`/signup/success`);
	//                                 }
	//                                 res.redirect(`/buy?tier=${req.body.tier}`);
	//                             }
	//                         });
	//                     }
	//                 });
	//             }
	//         });
	//     } else {
	//         emailError = 'Entered email doesn\'t exist';
	//         res.redirect("/signup");
	//     }
	// })
	// .catch(() => {
	//     signUpError = 'Please try again';
	//     res.redirect("/signup");
	// });
});

router.get("/signup/google", (req, res) => {
	if (req.query.iss.includes("accounts.google.com") && req.query.aud === process.env.GOOGLE_SIGN_IN_CLIENT_ID) {
		connection.query(
			`INSERT INTO Users (FirstName, LastName, Email, Password, Tier, Image, Google, Signup_Code, Initial_Payment) VALUES ('${req.query.fname}', '${req.query.lname}', '${req.query.email}', '${hash
				.sha512()
				.update(req.query.p)
				.digest("hex")}', '${req.query.tier[0].toUpperCase() + req.query.tier.slice(1)}', '${req.query.photo}', '${req.query.email}', '0'${req.query.tier !== "free" ? ", 'None'" : ", 'Complete'"});`,
			(err, results, fields) => {
				if (err) {
					if (err.code === "ER_DUP_ENTRY") {
						return res.redirect(`/login/google?iss=${req.query.iss}&aud=${req.query.aud}&fname=${req.query.given_name}&lname=${req.query.family_name}&email=${req.query.email}&photo=${req.query.picture}&p=${req.query.sub}`);
					}
					emailError = "Please try again";
					res.redirect("/signup");
				} else {
					const session_id = hash.sha512().update(uuidv4()).digest("hex");
					connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE Google = '${req.query.email}';`, (err, results, fields) => {
						if (err) {
							console.error(err);
							res.redirect("/signup");
						} else {
							res.cookie("user", req.query.email, {
								httpOnly: true,
								secure: true,
								expires: new Date(Date.now() + 241920000),
							});
							res.cookie("session_id", session_id, {
								httpOnly: true,
								secure: true,
								expires: new Date(Date.now() + 241920000),
							});
							const transporter = createTransport({
								name: "www.visbanking.com",
								host: "mail.visbanking.com",
								port: 465,
								secure: true,
								auth: {
									user: process.env.NO_REPLY_EMAIL,
									pass: process.env.NO_REPLY_PASS,
								},
							});
							const infoEmailHTML = readFileSync(join(__dirname, "..", "views", "emails", "userConfirmation.html"), "utf8").replaceAll("${signupMethod}", "SOCIAL LOGIN (GOOGLE)").replaceAll("${name}", `${req.query.fname} ${req.query.lname}`).replaceAll("${email}", req.query.email).replaceAll("${tier}", req.query.tier);
							const infoMessage = {
								from: "Visbanking.com",
								to: "info@visbanking.com",
								subject: "New User Confirmation",
								html: infoEmailHTML
							};
							console.log(infoEmailHTML);
							transporter.sendMail(infoMessage);
							if (req.query.tier === "free") {
								return res.redirect("/signup/success");
							}
							res.redirect(`/buy?tier=${req.query.tier}`);
						}
					});
				}
			}
		);
	} else res.redirect("/signup");
});

router.get("/signup/linkedin", async (req, res) => {
	if (!req.query.state)
		res.redirect(
			`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=https://visbanking.com/signup/linkedin&state=${
				process.env.LINKEDIN_STATE_STRING + "_" + req.query.tier
			}&scope=r_liteprofile%20r_emailaddress`
		);
	else if (req.query.state.split("_")[0] !== process.env.LINKEDIN_STATE_STRING) res.redirect("/signup");
	else if (req.query.state.split("_")[0] === process.env.LINKEDIN_STATE_STRING) {
		if (req.query.error) res.redirect("/signup");
		else {
			const tier = req.query.state.split("_")[1];
			post(
				`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.query.code}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}&redirect_uri=https://visbanking.com/signup/linkedin`,
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
							get("https://api.linkedin.com/v2/me", {
								headers: {
									Authorization: `Bearer ${accessData.data.access_token}`,
								},
							})
								.then((profileData) => {
									const profile = { ...profileData.data, email: emailData.data.elements[0]["handle~"].emailAddress };
									connection.query(
										`INSERT INTO Users (FirstName, LastName, Email, Password, Tier, LinkedIn, Signup_Code, Initial_Payment) VALUES ('${profile.localizedFirstName}', '${profile.localizedLastName}', '${profile.email}', '${hash
											.sha512()
											.update(profile.id)
											.digest("hex")}', '${tier}', '${profile.email}', '0'${tier !== "free" ? ", 'None'" : ", 'Complete'"})`,
										(err, results, fields) => {
											if (err) {
												if (err.code === "ER_DUP_ENTRY") return res.redirect("/login/linkedin");
												res.redirect("/signup");
											} else {
												const session_id = hash.sha512().update(uuidv4()).digest("hex");
												connection.query(`UPDATE Users SET Session_ID = '${session_id}' WHERE LinkedIn = '${profile.email}';`, (err, results, fields) => {
													if (err) {
														console.error(err);
														res.redirect("/signup");
													} else {
														res.cookie("user", profile.email, {
															httpOnly: true,
															secure: true,
															expires: new Date(Date.now() + 241920000),
														});
														res.cookie("session_id", session_id, {
															httpOnly: true,
															secure: true,
															expires: new Date(Date.now() + 241920000),
														});
														const transporter = createTransport({
															name: "www.visbanking.com",
															host: "mail.visbanking.com",
															port: 465,
															secure: true,
															auth: {
																user: process.env.NO_REPLY_EMAIL,
																pass: process.env.NO_REPLY_PASS,
															},
														});
														const infoEmailHTML = readFileSync(join(__dirname, "..", "views", "emails", "userConfirmation.html"), "utf8").replaceAll("${signupMethod}", "SOCIAL LOGIN (LINKEDIN)").replaceAll("${name}", `${profile.localizedFirstName} ${profile.localizedLastName}`).replaceAll("${email}", profile.email).replaceAll("${tier}", tier);
														const infoMessage = {
															from: "Visbanking.com",
															to: "info@visbanking.com",
															subject: "New User Confirmation",
															html: infoEmailHTML
														};
														transporter.sendMail(infoMessage)
														if (tier === "free") {
															return res.redirect("/signup/success");
														}
														res.redirect(`/buy?tier=${tier}`);
													}
												});
											}
										}
									);
								})
								.catch((err) => res.redirect("/signup/linkedin"));
						})
						.catch((err) => res.redirect("/signup/linkedin"));
				})
				.catch((err) => res.redirect("/signup/linkedin"));
		}
	}
});

router.get("/signup/success", (req, res) => {
	res.render("success", {
		title: "Success - Visbanking",
		path: "/signup/success",
	});
});

router.get("/signup/verify", (req, res) => {
	if (!req.query.e || !req.query.c) return res.redirect("/signup");
	const { e: email, c: code, t: tier } = req.query;
	connection.query(`UPDATE Users SET Signup_Code = '0' WHERE Email = '${email}';`, (err, results, fields) => {
		if (err) {
			res.redirect("/signup/verify/failure");
		} else if (!results.affectedRows) {
			try {
				connection.query(`DELETE FROM Users WHERE Email = '${email}';`);
			} catch (e) {
				console.error(e);
			}
			res.redirect("/signup");
		} else if (!results.changedRows) {
			res.redirect("/login");
		} else {
			if (!["free", "academic"].includes(tier)) res.redirect(`/buy?tier=${tier}`);
			else res.redirect("/signup/verify/success");
		}
	});
});

router.get("/signup/verify/success", (req, res) => {
	res.render("success", {
		title: "Success - Visbanking",
		path: req.originalUrl,
	});
});

router.get("/signup/verify/failure", (req, res) => {
	res.render("failure", {
		title: "Failure - Visbanking",
		path: req.originalUrl,
	});
});

module.exports = router;
