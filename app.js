import express from "express";
import authRoutes from './src/routes/auth.routes.js'
import taskRoutes from './src/routes/task.routes.js'
import userRoutes from './src/routes/user.routes.js'
import errorHandler from "./src/middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";



const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

app.use("/uploads", express.static("uploads")); 

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/users", userRoutes)
app.use(errorHandler);

// Temporary Route
app.get("/", (req, res) => {
    res.send("Task Manager API is Running 🚀");
});

export default app;