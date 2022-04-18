const redis = require("redis");
require("dotenv").config();

const client = redis.createClient(process.env.REDIS_PORT);

client.connect()
.catch(console.error);

const checkCache = async (req, res, next) => {
    const data = await client.get(`visbanking.com${req.originalUrl}`);
    if (data !== null) {
        console.log("Rendering from cache");
        res.send(data);
    } else {
        next();
    }
};

const setCache = (key, value) => {
    console.log("Setting cache")
    client.set(key, value);
}

module.exports = {
    checkCache,
    setCache
};