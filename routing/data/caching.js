const redis = require("redis");
require("dotenv").config();

const client = redis.createClient(process.env.REDIS_PORT);

client.connect()
.catch(console.error);

const checkCache = async (req, res, next) => {
    if (client.isOpen) {
        const data = await client.get(`visbanking.com${req.originalUrl}`);
        if (data !== null) res.send(data);
        else next();
    } else next();
};

const setCache = (key, value) => {
    client.isOpen ? client.set(key, value) : null;
}

module.exports = {
    checkCache,
    setCache
};