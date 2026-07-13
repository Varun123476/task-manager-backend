import { z } from "zod";

export const createTaskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(100, "Title is too long"),

        description: z
            .string()
            .trim()
            .optional()
    })
});

export const getTasksSchema = z.object({
    query: z.object({

        page: z.coerce.number().min(1).optional(),

        limit: z.coerce.number().min(1).max(100).optional(),

        status: z.enum([
            "pending",
            "completed"
        ]).optional(),

        search: z.string().trim().optional(),

        sort: z.enum([
            "created_at",
            "title",
            "status"
        ]).optional(),

        order: z.enum([
            "asc",
            "desc"
        ]).optional()

    })
});

export const taskIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const updateTaskSchema = z.object({

    params: z.object({
        id: z.coerce.number().int().positive()
    }),

    body: z.object({
        title: z.string().trim().min(1).optional(),

        description: z.string().trim().optional()
    })

});