const redis = require("redis");
const errorLogger = require("./log/error.log");
const infoLogger = require("./log/info.log");
require("dotenv").config();

const client = redis.createClient(process.env.REDIS_PORT);

client.connect()
.then(infoLogger.info("Redis connection successful"))
.catch(err => errorLogger.error(`${err.message}`));

// Middleware implementation
const checkCache = async (req, res, next) => {
	if (client.isOpen) {
		const data = await client.get(`visbanking.com${req.originalUrl}`);
		if (data !== null) res.send(data);
		else next();
	} else next();
};

// Direct redis client implementation
const getCache = async (key) => {
	return await client.get(key);
};

const setCache = (key, value) => {
	client.isOpen ? client.set(key, value) : null;
};

module.exports = {
	checkCache,
	getCache,
	setCache
};