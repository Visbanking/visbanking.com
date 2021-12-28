const { createConnection } = require("mysql");
require("dotenv").config();

const connection = createConnection({
    host: process.env.DB_HOST,
    user: 'webmaster',
    password: process.env.DB_PASS,
    database: 'Users'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
});

module.exports = connection;