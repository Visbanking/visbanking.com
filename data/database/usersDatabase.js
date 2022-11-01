const { Sequelize } = require("sequelize");
const errorLogger = require("../log/error.log");
const infoLogger = require("../log/info.log");
require("dotenv").config();

const connection = new Sequelize({
	dialect: "mysql",
	host: process.env.DB_HOST,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: 3306,
	logging: process.env.NODE_ENV === "production" ? false : message => {
		if (message instanceof Error) errorLogger.error(message);
		else infoLogger.info(message);
	}
});

(async () => {
	await connection.authenticate();
	infoLogger.info("Database Connection Successful");
})();

module.exports = connection;