const { createConnection } = require("mysql");
require("dotenv").config();

const connection = createConnection({
    host: 'database-visbanking-mysql.cysrondf3cdf.us-east-2.rds.amazonaws.com',
    user: 'webmaster',
    password: process.env.visbankingMySQLDatabaseInstancePasswordForWebmaster,
    database: 'Users'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
});

module.exports = connection;