import pool from "../config/db.js";

export async function uploadProfilePicture(userId, filename) {

    const [result] = await pool.query(
        `
        UPDATE users
        SET profile_image = ?
        WHERE id = ?
        `,
        [filename, userId]
    );

    return result.affectedRows;
}

export async function getProfileImage(userId) {

    const [rows] = await pool.query(
        `
        SELECT profile_image
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0] || null;
}