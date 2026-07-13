import {
    createTask as createTaskRepository,
    getTasksByUserId,
    getTaskByTaskId,
    updateTaskByTaskId,
    deleteTaskByTaskId
} from '../repositories/task.repository.js'
import AppError from '../errors/AppError.js';
import { countTasksByUserId } from '../repositories/task.repository.js';
 

export async function createTask(userId,taskData) {
    const title = taskData.title?.trim();
    const description = taskData.description?.trim();
    
    if (!title) {
        throw new AppError("Title is required",400)
    }
    return await createTaskRepository(userId, {
        title,
        description
    });
}


export async function getTasks(userId,page,limit,status,search,order,sort) {

    const offset = (page - 1) * limit;

    const tasks = await getTasksByUserId(userId, limit, offset,status,search,order,sort);
    

    const totalItems = await countTasksByUserId(userId,status,search);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        tasks,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages
        }
    }

}


export async function getTask(taskId, userId) {

    const task = await getTaskByTaskId(taskId, userId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return task;
}

export async function updateTask(taskId,userId,taskData) {

    const result = await updateTaskByTaskId(taskId,userId,taskData);

if (result.affectedRows === 0) {
    throw new AppError("Task not found",404);
    }
    
    return result;
}

export async function deleteTask(taskId,userId) {

    const result = await deleteTaskByTaskId(taskId,userId);

if (result.affectedRows === 0) {
    throw new AppError("Task not found",404);
    }
    
    return result;
}
