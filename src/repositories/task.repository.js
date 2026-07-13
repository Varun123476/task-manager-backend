import pool from '../config/db.js';

export async function createTask(userId, taskData) {
    const { title,description} = taskData;
    const [result] = await pool.query(
        `
        INSERT INTO tasks (user_id, title, description)
        VALUES (?, ?, ?)
        `,
        [userId, title, description]
    );

    return {
        id: result.insertId,
        user_id: userId,
        title,
        description,
        status: "pending"
    };
}

export async function getTasksByUserId(userId, limit, offset, status, search,order,sort) {

    let query = `
    SELECT *
    FROM tasks
    WHERE user_id = ?
    `;

    const values = [userId];

    if (status) {
        query += `
        AND status = ?
        `;

        values.push(status);
    }
    if (search) {
        query += `
        AND(
        title LIKE ?
        OR description LIKE ?
    )
        `
        values.push(`%${search}%`)
        values.push(`%${search}%`)
    }
     const allowedSortFields = [
        "created_at",
        "title",
        "status"
    ];

    if (!allowedSortFields.includes(sort)) {
        sort = "created_at";
    }

    
    order = order?.toUpperCase();
    if (order !== "ASC" && order !== "DESC") {
        order = "DESC";
    }   
    
    query += `
    ORDER BY ${sort} ${order}
    LIMIT ?
    OFFSET ?
    `;

    values.push(limit);
    values.push(offset);

    const [rows] = await pool.query(query, values);

    return rows;
}

export async function getTaskByTaskId(taskId, userId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM tasks
        WHERE id = ?
        AND user_id = ?
        `,
        [taskId, userId]
    );

    return rows[0];
}

export async function updateTaskByTaskId(taskId, userId, taskData) {

    const { title, description } = taskData;

    const [result] = await pool.query(
        `
        UPDATE tasks
        SET title = ?, description = ?
        WHERE id = ? AND user_id = ?
        `,
        [title, description, taskId, userId]
    );

    return result;
}

export async function deleteTaskByTaskId(taskId, userId) {

    const [result] = await pool.query(
        `
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
        `,
        [ taskId, userId]
    );

    return result;
}

export async function countTasksByUserId(userId,status,search) {

    let query = 
        `SELECT COUNT(*) AS total
         FROM tasks
         WHERE user_id = ?
        `;  

    const values = [userId];

     if (status) {
    query += `
    AND status = ?
    `;
    values.push(status);
    }

     if (search) {
       query += `
      AND (
        title LIKE ?
        OR description LIKE ?
    )
    `;

    values.push(`%${search}%`);
    values.push(`%${search}%`);
    }
    


const [rows] = await pool.query(query, values);

    return rows[0].total;
}