const { createLogger, format, transports } = require("winston");
const path = require("path");

const infoLogger = createLogger({
	level: "info",
	transports: [
		new transports.File({
			format: format.combine(
				format.timestamp(),
				format.label({
					label: "visbanking.com"
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[Info: ${message} - ${timestamp} - ${label}]`;
				})
			),
			filename: path.join(__dirname, "..", "..", "logs", "info.log"),
			level: "info"
		})
	]
});

if (process.env.NODE_ENV !== "production") infoLogger.add(new transports.Console({
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.label({
			label: "visbanking.com"
		}),
		format.printf(({ message, label, timestamp }) => {
			return `[Info: ${message} - ${timestamp} - ${label}]`;
		})
	),
	level: "info"
}));

module.exports = infoLogger;