const { Sequelize } = require("sequelize");
require("dotenv").config();

const connection = new Sequelize('Visbanking', process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

(async () => {
	await connection.authenticate();
})();

module.exports = connection;