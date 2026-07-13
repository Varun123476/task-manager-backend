import { Router } from "express";
import { authenticate } from '../middlewares/auth.middleware.js'
import {
    create,
    deleteSingleTask,
    getSingleTask,
    getTasks,
    updateSingleTask
} from "../controllers/task.controller.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createTaskSchema,
    getTasksSchema,
    taskIdSchema,
    updateTaskSchema
} from '../validators/task.validator.js';

const router = Router();

router.post('/', authenticate, validate(createTaskSchema),create);
router.get('/', authenticate,  validate(getTasksSchema),getTasks);
router.get('/:id', authenticate, validate(taskIdSchema), getSingleTask);
router.patch('/:id', authenticate, validate(updateTaskSchema),updateSingleTask);
router.delete('/:id',authenticate,validate(taskIdSchema),deleteSingleTask)

export default router;