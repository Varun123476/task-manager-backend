import pool from "../config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    try {
        // Find the migrations folder
        const migrationsPath = path.join(__dirname, "../migrations");

        // Read all migration files
        const files = await fs.readdir(migrationsPath);
        files.sort();

        // Create the migrations table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Read all executed migrations
        const [rows] = await pool.query(
            "SELECT filename FROM migrations"
        );

        // Store executed filenames in a Set
        const executed = new Set(
            rows.map(row => row.filename)
        );

        // Process every migration file
        for (const file of files) {

            // Skip if already executed
            if (executed.has(file)) {
                console.log(`⏭️ Skipping ${file}`);
                continue;
            }

            console.log(`🚀 Running ${file}`);

            // Read SQL from file
            const sql = await fs.readFile(
                path.join(migrationsPath, file),
                "utf8"
            );

            // Get one connection for the transaction
            const connection = await pool.getConnection();

            try {

                // Start transaction
                await connection.beginTransaction();

                // Execute migration SQL
                await connection.query(sql);

                // Record migration
                await connection.query(
                    "INSERT INTO migrations(filename) VALUES(?)",
                    [file]
                );

                // Save everything
                await connection.commit();

                console.log(`✅ Completed ${file}`);

            } catch (error) {

                // Undo everything
                await connection.rollback();

                throw error;

            } finally {

                // Return connection to pool
                connection.release();
            }
        }

        console.log("🎉 All migrations completed.");

    } catch (error) {

        console.error("❌ Migration failed");
        console.error(error);

    } finally {

        await pool.end();
    }
}

migrate();