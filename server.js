import dotenv from "dotenv";
import app from "./app.js";

import pool from "./src/config/db.js";
import redis from "./src/config/redis.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

 // Check MySQL
    await pool.query("SELECT 1");
    console.log("✅ MySQL Connected");


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});