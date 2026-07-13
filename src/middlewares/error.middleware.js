import AppError from "../errors/AppError.js";
import logger from "../config/logger.js";

export default function errorHandler(
    err,
    req,
    res,
    next
) {
    if (err instanceof AppError) {
        logger.warn(
            {
                statusCode: err.statusCode,
                method: req.method,
                path: req.originalUrl,
            },
            err.message
        );

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    logger.error(
        {
            err,
            method: req.method,
            path: req.originalUrl,
        },
        "Unhandled application error"
    );

    return res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,
    });
}