const { createLogger, format, transports } = require("winston");
const path = require("path");

const errorLogger = createLogger({
	level: "error",
	transports: [
		new transports.File({
			format: format.combine(
				format.timestamp(),
				format.label({
					label: "visbanking.com"
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[${timestamp} - ${message} - ${label}]`;
				})
			),
			filename: path.join(__dirname, "..", "..", "logs", "error.log"),
			level: "error"
		})
	]
});

if (process.env.NODE_ENV !== "production") errorLogger.add(new transports.Console({
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.label({
			label: "visbanking.com"
		}),
		format.printf(({ message, label, timestamp }) => {
			return `[${timestamp} - ${message} - ${label}]`;
		})
	),
	level: "error"
}));

module.exports = errorLogger;