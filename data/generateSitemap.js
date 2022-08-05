const connection = require("./dbconnection");
const { writeFile } = require("fs");
const path = require("path");

module.exports = () => new Promise((resolve, reject) => {
	let sitemap = "<?xml version=\"1.1\" encoding=\"UTF-8\"?>\n";
	sitemap += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
	const paths = ["/", "/about", "/about/team", "/services", "/insights", "/contact", "/buy", "/pricing", "/login", "/signup", "/me", "/reports", "/reports/bank", "/reports/macro", "/reports/macro/deposits", "/reports/performance", "/terms", "/privacy", "/cookies", "/disclaimer"];
	for (let path of paths) sitemap += `\t<url><loc>https://visbanking.com${path}</loc></url>\n`;
	connection.query("SELECT ID FROM Insights LIMIT 0, 500;", (err, insights, fields) => {
		if (err) reject(err);
		for (let insight of insights) sitemap += `\t<url><loc>https://visbanking.com/insights/insight/${insight.ID}</loc></url>\n`;
		connection.query("SELECT * FROM Visbanking.AllReports WHERE Tier = 'Free';", (err, reports, fields) => {
			if (err) reject(err);
			reports.forEach(report => sitemap += `\t<url><loc>https://visbanking.com/reports/${report.Type.toLowerCase()}/${report.State.toLowerCase() || report.SectionName.toLowerCase()}/${report.City.toLowerCase() || report.Subtype.toLowerCase()}/${report.IDRSSD || report}</loc></url>\n`);
			sitemap += "</urlset>";
			writeFile(path.join(__dirname, "..", "sitemap.xml"), sitemap, (err) => {
				if (err) reject(err);
				resolve("Done");
			});
		});
	});
});