import argon2 from "argon2";
import {
  findUserByEmail,
  createUser,
  saveRefreshToken,
  getRefreshTokenByUserId,
  removeRefreshToken,
} from "../repositories/auth.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import AppError from "../errors/AppError.js";
import logger from "../config/logger.js";

export async function registerUser(userData) {
  const { username, email, password } = userData;

  if (!username || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    logger.warn(
      { email },
      "Registration failed: email already exists"
    );

    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await argon2.hash(password);

  const userId = await createUser({
    username,
    email,
    password: hashedPassword,
  });

  logger.info(
    {
      userId,
      email,
    },
    "User registered successfully"
  );

  return {
    id: userId,
    username,
    email,
  };
}

export async function loginUser(userData) {
  const { email, password } = userData;

  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    logger.warn(
      { email },
      "Login failed: user not found"
    );

    // Don't reveal whether the email exists
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await argon2.verify(
    user.password,
    password
  );

  if (!isValid) {
    logger.warn(
      {
        userId: user.id,
      },
      "Login failed: invalid password"
    );

    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  const hashedRefreshToken = await argon2.hash(refreshToken);

  await saveRefreshToken(
    user.id,
    hashedRefreshToken
  );

  logger.info(
    {
      userId: user.id,
    },
    "User logged in"
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

export async function refreshUser(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh Token is required", 401);
  }

  const payload = verifyRefreshToken(refreshToken);

  const storedRefreshToken =
    await getRefreshTokenByUserId(payload.id);

  if (!storedRefreshToken) {
    logger.warn(
      {
        userId: payload.id,
      },
      "Refresh failed: token not found"
    );

    throw new AppError("Invalid refresh token", 401);
  }

  const isValid = await argon2.verify(
    storedRefreshToken,
    refreshToken
  );

  if (!isValid) {
    logger.warn(
      {
        userId: payload.id,
      },
      "Refresh failed: invalid refresh token"
    );

    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken({
    id: payload.id,
  });

  const newRefreshToken = generateRefreshToken({
    id: payload.id,
  });

  const hashedRefreshToken =
    await argon2.hash(newRefreshToken);

  await saveRefreshToken(
    payload.id,
    hashedRefreshToken
  );

  logger.info(
    {
      userId: payload.id,
    },
    "Access token refreshed"
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh Token is required", 401);
  }

  const payload = verifyRefreshToken(refreshToken);

  await removeRefreshToken(payload.id);

  logger.info(
    {
      userId: payload.id,
    },
    "User logged out"
  );
}