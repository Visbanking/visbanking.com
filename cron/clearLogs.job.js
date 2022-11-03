const fs = require("fs/promises");
const cron = require("node-cron");
const path = require("path");

module.exports = cron.schedule("0 10 * * 1", async () => {
	await fs.writeFile(path.join(__dirname, "..", "logs", "info.log"), "");
	await fs.writeFile(path.join(__dirname, "..", "logs", "error.log"), "");
});