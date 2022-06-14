const connection = require("./dbconnection");
const { writeFile } = require("fs");
const path = require("path");

module.exports = () => new Promise((resolve, reject) => {
	let sitemap = '<?xml version="1.1" encoding="UTF-8"?>\n';
	sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
	const paths = ["/", "/about", "/about/team", "/services", "/insights", "/contact", "/buy", "/pricing", "/login", "/signup", "/me", "/reports", "/reports/bank", "/reports/macro", "/reports/macro/deposits", "/reports/performance", "/terms", "/privacy", "/cookies", "/disclaimer"];
	for (let path of paths) sitemap += `\t<url><loc>https://visbanking.com${path}</loc></url>\n`;
	connection.query("SELECT ID FROM Insights LIMIT 0, 500;", (err, insights, fields) => {
		if (err) reject(err);
		for (let insight of insights) sitemap += `\t<url><loc>https://visbanking.com/insights/insight/${insight.ID}</loc></url>\n`;
		connection.query("SELECT * FROM Visbanking.AllReports ORDER BY RAND();", (err, reports, fields) => {
			if (err) reject(err);
			const singleBankReports = reports.filter(bank => bank.Type==="Bank").slice(0, 500),
				macroReports = reports.filter(bank => bank.Type==="Macro").slice(0, 500),
				performanceReports = reports.filter(bank => bank.Type==="Performance").slice(0, 500);
			singleBankReports.forEach(report => sitemap += `\t<url><loc>https://visbanking.com/reports/bank/${report.State}/${report.City}/${report.IDRSSD}</loc></url>\n`);
			macroReports.forEach(report => sitemap += `\t<url><loc>https://visbanking.com/reports/macro/deposits/${report.State ? report.State : report.SectionName.toLowerCase()}</loc></url>\n`);
			performanceReports.forEach(report => sitemap += `\t<url><loc>https://visbanking.com/reports/performance/${report.State ? report.State : report.SectionName.toLowerCase()}</loc></url>\n`);
			sitemap += '</urlset>';
			writeFile(path.join(__dirname, "..", "sitemap.xml"), sitemap, (err) => {
				if (err) reject(err);
				resolve("Done");
			});
		});
	});
});