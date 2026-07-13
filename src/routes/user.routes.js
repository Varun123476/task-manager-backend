import upload from '../middlewares/upload.middleware.js';
import { uploadProfileImage } from '../controllers/user.controllers.js';
import {authenticate} from '../middlewares/auth.middleware.js'
import { Router } from 'express';

const router = Router();

router.post('/profile-picture',
    authenticate,
    upload.single('image'),
    uploadProfileImage
)

export  default router;