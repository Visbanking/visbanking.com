const { createConnection } = require("mysql");

const connection = createConnection({
    host: 'database-visbanking-mysql.cysrondf3cdf.us-east-2.rds.amazonaws.com',
    user: 'webmaster',
    password: 'fRcrTbL*F%9m!h',
    database: 'Users'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
});

module.exports = connection;