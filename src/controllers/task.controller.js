import {
    createTask,
    getTasks as getAllTasks,
    getTask, 
    updateTask,
    deleteTask
} from "../services/task.service.js";
 import asyncHandler from "../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    
    const userId = req.user.id;
    const task = await createTask(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        task
    })
})


export const getTasks = asyncHandler(async (req, res) => {
      
    const {page = 1,limit = 10,status,sort,search,order } = req.validated.query;

    const result = await getAllTasks(req.user.id, page, limit, status, search);

    return res.status(200).json({
        success: true,
        ...result
    });
});


export const getSingleTask = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await getTask(taskId, userId);

    return res.status(200).json({
        success: true,
        task
    });

});

export const updateSingleTask = asyncHandler(async (req, res) => {

    await updateTask(
        req.params.id,
        req.user.id,
        req.body
    );

    return res.status(200).json({
        success: true,
        message: "Task updated successfully"
    });
})

export const deleteSingleTask = asyncHandler(async (req, res) => {

    await deleteTask(
        req.params.id,
        req.user.id,
    );

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });

}); 