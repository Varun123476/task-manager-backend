import dotenv from "dotenv";
import app from "./app.js";
import logger from "./src/config/logger.js";
import redis from "./src/config/redis.js";

import pool from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

 // Check MySQL
try {
    await pool.query("SELECT 1");
    logger.info("Connected to MySQL");
} catch (error) {
    logger.fatal(error, "Failed to connect to MySQL");
    process.exit(1);
}


app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});