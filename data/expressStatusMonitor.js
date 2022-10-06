const expressStatusMonitor = require("express-status-monitor");

const appStatusMonitor = expressStatusMonitor({
	title: "App Status - Admin Dashboard - Visbanking",
	ignoreStartsWith: "/admin",
	path: "/admin/dashboard/system/status"
});

module.exports = appStatusMonitor;