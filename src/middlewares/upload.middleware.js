import multer from 'multer';
import path from 'path';
import AppError from '../errors/AppError.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});

// Allowed file types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];

// File Filter
const fileFilter = (req, file, cb) => {

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new AppError(
                "Only JPG, JPEG, PNG and WEBP images are allowed",
                400
            ),
            false
        );
    }

    cb(null, true);
};

// Multer Instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

export default upload;