const { Router } = require("express");
const connection = require("../data/dbconnection");
const { capitalize, toLower, toUpper } = require("lodash");
const banks = require("./reports/banks");
const macro = require("./reports/macro");
const performance = require("./reports/performance");
const { getCache, setCache } = require("./../data/caching");
const { readFile, getPDFUrl } = require("../data/s3Client");
const { JSDOM } = require("jsdom");
const router = Router();

router.get("/", (req, res) => {
	getCache("Visbanking Reports Types")
		.then(data => {
			connection.query("SELECT DISTINCT(Type) FROM Visbanking.AllReports;", (err, results, fields) => {
				if (results.length) setCache("Visbanking Reports Types", results.map(reportType => reportType.Type));
			});
			res.render("reports", {
				title: "US Banking Industry Report & Outlook | Visbanking",
				path: req.originalUrl,
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
				reportTypes: data.split(",").map(reportType => { return { Type:reportType }; })
			});
		});
});

router.get("/:report_type", (req, res) => {
	const { report_type: type } = req.params;
	if (type !== toLower(type)) return res.redirect(`/reports/${toLower(type)}`);
	connection.query(`SELECT * FROM Visbanking.AllReports WHERE Type = '${capitalize(type)}' GROUP BY State, City, IDRSSD ORDER BY SectionName;`, async (err, results, fields) => {
		if (err) {
			res.redirect("/reports");
		} else {
			const reportTypes = await getCache("Visbanking Reports Types");
			res.render("reports", {
				reports: results,
				title: `${capitalize(type)} Reports in USA | Visbanking`,
				path: req.originalUrl,
				reportsType: type,
				reportTypes: reportTypes.split(","),
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.get("/:report_type/:state_or_section", (req, res) => {
	const { report_type: type, state_or_section: stateOrSection } = req.params;
	if (type !== toLower(type)) return res.redirect(`/reports/${toLower(type)}/${stateOrSection}`);
	else if (stateOrSection.length === 2 && (stateOrSection !== toUpper(stateOrSection))) return res.redirect(`/reports/${type}/${toUpper(stateOrSection)}`);
	else if (stateOrSection.length > 2 && (stateOrSection !== toLower(stateOrSection))) return res.redirect(`/reports/${type}/${toLower(stateOrSection)}`);
	connection.query(`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND (State = '${stateOrSection}' OR SectionName = '${capitalize(stateOrSection)}') GROUP BY State, City, IDRSSD;`, async (err, results, fields) => {
		if (err) {
			res.redirect(`/reports/${type}`);
		} else {
			if (!results.length) {
				res.redirect(`/reports/${type}`);
			} else if (!results[0].City) {
				res.render("reports/bank", {
					reports: results,
					title: `${capitalize(type)} Reports for ${stateOrSection}, US | Visbanking`,
					path: req.originalUrl,
					reportsType: type,
					reportTypes: [ ... new Set(results.map(report => report.Subtype)) ],
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
				});
			} else {
				const reportTypes = await getCache("Visbanking Reports Types");
				return res.render("reports", {
					reports: results,
					title: `${capitalize(type)} Reports for ${stateOrSection}, US | Visbanking`,
					path: req.originalUrl,
					state: stateOrSection,
					reportsType: type,
					reportTypes: reportTypes.split(","),
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
				});
			}
		}
	});
});

router.get("/:report_type/:state_or_section/:city_or_subtype", (req, res) => {
	const { report_type: type, state_or_section: stateOrSection, city_or_subtype: cityOrSubtype } = req.params;
	if (type !== toLower(type)) return res.redirect(`/reports/${toLower(type)}/${stateOrSection}/${cityOrSubtype}${req.query.type ? `?type=${req.query.type}` : ""}`);
	else if (stateOrSection.length === 2 && (stateOrSection !== toUpper(stateOrSection))) return res.redirect(`/reports/${type}/${toUpper(stateOrSection)}/${cityOrSubtype}${req.query.type ? `?type=${req.query.type}` : ""}`);
	else if (stateOrSection.length > 2 && (stateOrSection !== toLower(stateOrSection))) return res.redirect(`/reports/${type}/${toLower(stateOrSection)}/${cityOrSubtype}${req.query.type ? `?type=${req.query.type}` : ""}`);
	connection.query(`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND (State = '${stateOrSection}' OR SectionName = '${stateOrSection}') AND (City = '${cityOrSubtype}' OR Subtype = '${cityOrSubtype}') GROUP BY State, City, IDRSSD ORDER BY SectionName;`, async (err, results, fields) => {
		if (err || !results.length) {
			res.redirect(`/reports/${type}/${stateOrSection}`);
		} else if (!results[0].IDRSSD) {
			if (cityOrSubtype !== toLower(cityOrSubtype)) return res.redirect(`/reports/${type}/${stateOrSection}/${toLower(cityOrSubtype)}?type=${req.query.type}`);
			else if (!req.query.type) return res.redirect(`/reports/${type}/${stateOrSection}`);
			else if ((req.query.type==="html") && !req.query.page) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}?type=html&page=index`);
			const reports = results.filter(report => report.FileExtension===req.query.type);
			reports.forEach(report => report.URL=new URL(report.URL));
			if (req.cookies.user && req.cookies.tier && req.cookies.session_id) {
				connection.query(`SELECT Email, Tier, Session_ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
					if (err || req.cookies.session_id !== results[0].Session_ID || req.cookies.tier !== results[0].Tier) {
						res.clearCookie("user");
						res.clearCookie("tier");
						res.clearCookie("session_id");
						res.redirect("/login");
					} else if (!results[0]) {
						res.clearCookie("user");
						res.clearCookie("tier");
						res.clearCookie("session_id");
						res.redirect("/signup");
					} else {
						if (!reports.length) return res.redirect(`/reports/${type}/${stateOrSection}`);
						const tiers = ["Free", "Professional", "Academic", "Premium", "Enterprise"];
						const bestReportOptions = new Map();
						reports.forEach(report => {
							bestReportOptions.set(report, tiers.indexOf(req.cookies.tier)-tiers.indexOf(report.Tier));
						});
						const bestReportOptionsSorted = [...bestReportOptions.entries()].sort((a, b) => a[1] | b[1]);
						const suitableReports = bestReportOptionsSorted.filter(report => report[1] >= 0);
						if (!suitableReports.length) {
							return res.render("reports/upgrade", {
								path: req.originalUrl,
								access: false,
								userTier: req.cookies.tier,
								tier: {
									...require("../data/.pricingTiers.json")[toLower(bestReportOptionsSorted[0][0].Tier)],
									tier: bestReportOptionsSorted[0][0].Tier,
								},
								title: `${bestReportOptionsSorted[0][0].Type} ${bestReportOptionsSorted[0][0].Subtype} for ${bestReportOptionsSorted[0][0].BankName} | Visbanking`,
								loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
							});
						}
						const reportToRender = suitableReports[0][0];
						if (req.query.type === "html") {
							const renderHTMLReport = () => {
								readFile(reportToRender.URL.hostname.split(".")[0], `${reportToRender.URL.pathname.split("/").slice(1, -1).join("/")}/${req.query.page}.html`)
									.then((report) => {
										const reportHTML = new JSDOM(report);
										const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
										res.render("reports/htmlReport", {
											path: req.originalUrl,
											title: `${reportToRender.Type} ${reportToRender.Subtype} for ${reportToRender.BankName} | Visbanking`,
											reportBody,
											loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
										});
									})
									.catch((err) => {
										if (err.name === "NoSuchKey") return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
										connection.query(
											`SELECT * FROM Visbanking.AllReports WHERE FileExtension = '${reportToRender.FileExtension}' AND Tier = '${reportToRender.Tier}' AND State = '${reportToRender.State}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`,
											(err, results, fields) => {
												res.render("reports/error", {
													path: req.originalUrl,
													access: true,
													title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
													error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
													alternativeReports: results,
													loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
												});
											}
										);
									});
							};
							renderHTMLReport();
						} else if (req.query.type === "pdf") {
							getPDFUrl(reportToRender.URL.hostname.split(".")[0], reportToRender.URL.pathname.slice(1))
								.then(pdfSource => {
									res.render("reports/pdfReport", {
										path: req.originalUrl,
										access: true,
										title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
										pdfSource,
										loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
									});
								})
								.catch(err => {
									if (err.name === "NoSuchKey") return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
									connection.query(
										`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND Tier <> 'Free' AND State = '${stateOrSection}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`,
										(err, results, fields) => {
											res.render("reports/error", {
												path: req.originalUrl,
												access: true,
												title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
												error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
												alternativeReports: results,
												loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
											});
										}
									);
								});
						}
					}
				});
			} else res.redirect("/login");
		} else {
			if (cityOrSubtype !== capitalize(cityOrSubtype)) return res.redirect(`/reports/${type}/${stateOrSection}/${capitalize(cityOrSubtype)}`);
			const reportTypes = await getCache("Visbanking Reports Types");
			return res.render("reports", {
				reports: results,
				title: `${capitalize(type)} Reports for ${stateOrSection}, US | Visbanking`,
				path: req.originalUrl,
				state: stateOrSection,
				city: cityOrSubtype,
				reportsType: type,
				reportTypes: reportTypes.split(","),
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.get("/:report_type/:state_or_section/:city_or_subtype/:bank_id", (req, res) => {
	const { report_type: type, state_or_section: stateOrSection, city_or_subtype: cityOrSubtype, bank_id: bank } = req.params;
	if (type !== toLower(type)) return res.redirect(`/reports/${toLower(type)}/${stateOrSection}/${cityOrSubtype}/${bank}`);
	else if (stateOrSection.length === 2 && (stateOrSection !== toUpper(stateOrSection))) return res.redirect(`/reports/${type}/${toUpper(stateOrSection)}/${cityOrSubtype}/${bank}`);
	else if (stateOrSection.length > 2 && (stateOrSection !== toLower(stateOrSection))) return res.redirect(`/reports/${type}/${toLower(stateOrSection)}/${cityOrSubtype}/${bank}`);
	else if (cityOrSubtype !== cityOrSubtype.split(" ").map(word => capitalize(word)).join(" ")) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype.split(" ").map(word => capitalize(word)).join(" ")}/${bank}`);
	connection.query(`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND (State = '${stateOrSection}' OR SectionName = '${stateOrSection}') AND (City = '${cityOrSubtype}' OR Subtype = '${cityOrSubtype}') AND IDRSSD = ${bank} AND Subtype <> 'SDI';`, (err, results, fields) => {
		if (err || !results.length) {
			res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}`);
		} else {
			res.render("reports/bank", {
				reports: results,
				title: `${results[0].BankName} | Visbanking`,
				path: req.originalUrl,
				reportsType: type,
				reportTypes: [ ... new Set(results.map(report => report.Subtype)) ],
				loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
			});
		}
	});
});

router.get("/:report_type/:state_or_section/:city_or_subtype/:bank_id/:subtype", (req, res) => {
	const { report_type: type, state_or_section: stateOrSection, city_or_subtype: cityOrSubtype, bank_id: bank, subtype } = req.params;
	if (!req.query.type) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
	else if (type !== toLower(type)) return res.redirect(`/reports/${toLower(type)}/${stateOrSection}/${cityOrSubtype}/${bank}/${subtype}?type=${req.query.type}${req.query.page ? `&page=${req.query.page}` : ""}`);
	else if (stateOrSection.length === 2 && (stateOrSection !== toUpper(stateOrSection))) return res.redirect(`/reports/${type}/${toUpper(stateOrSection)}/${cityOrSubtype}/${bank}/${subtype}?type=${req.query.type}${req.query.page ? `&page=${req.query.page}` : ""}`);
	else if (stateOrSection.length > 2 && (stateOrSection !== toLower(stateOrSection))) return res.redirect(`/reports/${type}/${toLower(stateOrSection)}/${cityOrSubtype}/${bank}/${subtype}?type=${req.query.type}${req.query.page ? `&page=${req.query.page}` : ""}`);
	else if (cityOrSubtype !== cityOrSubtype.split(" ").map(word => capitalize(word)).join(" ")) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype.split(" ").map(word => capitalize(word)).join(" ")}/${bank}/${subtype}?type=${req.query.type}${req.query.page ? `&page=${req.query.page}` : ""}`);
	else if (subtype !== toLower(subtype)) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}/${toLower(subtype)}?type=${req.query.type}${req.query.page ? `&page=${req.query.page}` : ""}`);
	else if ((req.query.type==="html") && !req.query.page) return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}/${subtype}?type=html&page=index`);
	connection.query(`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND (State = '${stateOrSection}' OR SectionName = '${stateOrSection}') AND (City = '${cityOrSubtype}' OR Subtype = '${cityOrSubtype}') AND IDRSSD = ${bank} AND Subtype = '${subtype}' AND FileExtension = '${req.query.type}';`, (err, results, fields) => {
		if (err || !results.length) {
			res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
		} else if (req.cookies.user && req.cookies.tier && req.cookies.session_id) {
			results.forEach(report => report.URL=new URL(report.URL));
			const reports = results;
			connection.query(`SELECT Email, Tier, Session_ID FROM Users WHERE Email = '${req.cookies.user}';`, (err, results, fields) => {
				if (err || req.cookies.session_id !== results[0].Session_ID || req.cookies.tier !== results[0].Tier) {
					res.clearCookie("user");
					res.clearCookie("tier");
					res.clearCookie("session_id");
					res.redirect("/login");
				} else if (!results[0]) {
					res.clearCookie("user");
					res.clearCookie("tier");
					res.clearCookie("session_id");
					res.redirect("/signup");
				} else {
					const tiers = ["Free", "Professional", "Academic", "Premium", "Enterprise"];
					const bestReportOptions = new Map();
					reports.forEach(report => {
						bestReportOptions.set(report, tiers.indexOf(req.cookies.tier)-tiers.indexOf(report.Tier));
					});
					const bestReportOptionsSorted = [...bestReportOptions.entries()].sort((a, b) => a[1] | b[1]);
					const suitableReports = bestReportOptionsSorted.filter(report => report[1] >= 0);
					if (!suitableReports.length) {
						return res.render("reports/upgrade", {
							path: req.originalUrl,
							access: false,
							userTier: req.cookies.tier,
							tier: {
								...require("../data/.pricingTiers.json")[toLower(bestReportOptionsSorted[0][0].Tier)],
								tier: bestReportOptionsSorted[0][0].Tier,
							},
							title: `${bestReportOptionsSorted[0][0].Type} ${bestReportOptionsSorted[0][0].Subtype} for ${bestReportOptionsSorted[0][0].BankName} | Visbanking`,
							loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
						});
					}
					const reportToRender = suitableReports[0][0];
					if (req.query.type === "html") {
						const renderHTMLReport = () => {
							readFile(reportToRender.URL.hostname.split(".")[0], `${reportToRender.URL.pathname.split("/").slice(1, -1).join("/")}/${req.query.page}.html`)
								.then((report) => {
									const reportHTML = new JSDOM(report);
									const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
									res.render("reports/htmlReport", {
										path: req.originalUrl,
										title: `${reportToRender.Type} ${reportToRender.Subtype} for ${reportToRender.BankName} | Visbanking`,
										reportBody,
										loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
									});
								})
								.catch((err) => {
									if (err.name === "NoSuchKey") return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
									connection.query(
										`SELECT * FROM Visbanking.AllReports WHERE FileExtension = '${reportToRender.FileExtension}' AND Tier = '${reportToRender.Tier}' AND State = '${reportToRender.State}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`,
										(err, results, fields) => {
											res.render("reports/error", {
												path: req.originalUrl,
												access: true,
												title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
												error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
												alternativeReports: results,
												loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
											});
										}
									);
								});
						};
						renderHTMLReport();
					} else if (req.query.type === "pdf") {
						getPDFUrl(reportToRender.URL.hostname.split(".")[0], reportToRender.URL.pathname.slice(1))
							.then(pdfSource => {
								res.render("reports/pdfReport", {
									path: req.originalUrl,
									access: true,
									title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
									pdfSource,
									loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
								});
							})
							.catch(err => {
								if (err.name === "NoSuchKey") return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
								connection.query(
									`SELECT * FROM Visbanking.AllReports WHERE Type = '${type}' AND Tier <> 'Free' AND State = '${stateOrSection}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`,
									(err, results, fields) => {
										res.render("reports/error", {
											path: req.originalUrl,
											access: true,
											title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
											error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
											alternativeReports: results,
											loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
										});
									}
								);
							});
					}
				}
			});
		} else {
			const reportToRender = results.filter(report => report.Tier==="Free")[0];
			if (!reportToRender){
				return res.render("reports/upgrade", {
					path: req.originalUrl,
					access: false,
					userTier: req.cookies.tier,
					tier: {
						...require("../data/.pricingTiers.json")[toLower(results[0].Tier)],
						tier: results[0].Tier,
					},
					title: `${results[0].Type} ${results[0].Subtype} for ${results[0].BankName} | Visbanking`,
					loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
				});
			}
			const renderHTMLReport = () => {
				readFile("ds-allreports-free", `${reportToRender.URL.split("/").slice(3).join("/")}`)
					.then((report) => {
						const reportHTML = new JSDOM(report);
						const reportBody = reportHTML.window.document.querySelector("body").innerHTML;
						res.render("reports/htmlReport", {
							path: req.originalUrl,
							title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
							reportBody,
							loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
						});
					})
					.catch(() => {
						if (err.name === "NoSuchKey") return res.redirect(`/reports/${type}/${stateOrSection}/${cityOrSubtype}/${bank}`);
						connection.query(
							`SELECT * FROM Visbanking.AllReports WHERE FileExtension = '${reportToRender.FileExtension}' AND Tier = '${reportToRender.Tier}' AND State = '${reportToRender.State}' AND Status = 'Active' ORDER BY RAND() LIMIT 0, 3;`,
							(err, results, fields) => {
								res.render("reports/error", {
									path: req.originalUrl,
									access: true,
									title: `${reportToRender.Type} ${reportToRender.Subtype} Report for ${reportToRender.BankName} | Visbanking`,
									error: "We are in the midst of updating the reports with the latest information. The selected bank is not yet available. Check back soon to review the latest bank reports.",
									alternativeReports: results,
									loggedIn: new Boolean(req.cookies.user && req.cookies.tier && req.cookies.session_id).valueOf(),
								});
							}
						);
					});
			};
			renderHTMLReport();
		}
	});
});

// router.use("/bank", banks);

// router.use("/macro", macro);

// router.use("/performance", performance);

module.exports = router;
