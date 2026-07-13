import Redis from "ioredis";
import logger from "./logger.js";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redis.on("ready", () => {
    logger.info("✅ Redis Connected");
});

redis.on("error", (err) => {
    logger.error(err, "Redis connection failed");
});

export default redis;