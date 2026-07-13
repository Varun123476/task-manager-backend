import AppError from "../errors/AppError.js";
import {
  uploadProfilePicture as updateProfileImage,
  getProfileImage,
} from "../repositories/user.repository.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export async function uploadProfilePicture(userId, file) {
  if (!file) {
    throw new AppError("Please upload an image", 400);
  }
  const profileImage = await getProfileImage(userId);

  if (profileImage) {
    const imageUrl = profileImage.profile_image;

const afterUpload = imageUrl.split("/upload/")[1];

const path = afterUpload
    .split("/")
    .slice(1)
    .join("/");


const publicId = path.substring(
    0,
    path.lastIndexOf(".")
    );
  await cloudinary.uploader.destroy(publicId);

  }

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    folder: "task-manager/profile-pictures",
  });

  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.error("Failed to delete temporary file:", error);
  }
  const affectedRows = await updateProfileImage(
    userId,
    uploadResult.secure_url,
  );

  if (affectedRows === 0) {
    throw new AppError("User not found", 404);
  }

  return {
    imageUrl: uploadResult.secure_url,
  };
}
