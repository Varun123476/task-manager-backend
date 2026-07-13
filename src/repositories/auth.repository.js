import pool from "../config/db.js";

export async function findUserByEmail(email) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0] || null;
}

export async function createUser(userData) {
    const { username, email, password } = userData;

    const [result] = await pool.query(
        `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
        `,
        [username, email, password]
    );

    return result.insertId;
}

export async function saveRefreshToken(userId, refreshToken) {
    const [result] = await pool.query(
        `
        UPDATE users
        SET refresh_token = ?
        WHERE id = ?
        `,
        [refreshToken, userId]
    );

    return result;
}

export async function removeRefreshToken(userId) {
    const [result] = await pool.query(
        `
        UPDATE users
        SET refresh_token = NULL
        WHERE id = ?
        `,
        [userId]
    );

    return result;
}

export async function getRefreshTokenByUserId(userId) {
    const [rows] = await pool.query(
        `
        SELECT refresh_token
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0]?.refresh_token || null;
}