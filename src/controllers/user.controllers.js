import { success } from "zod";
import { uploadProfilePicture } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadProfileImage = asyncHandler(async (req, res) => {
    const result = await uploadProfilePicture(
        req.user.id,
        req.file
    )
    
    res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: result
    });
});