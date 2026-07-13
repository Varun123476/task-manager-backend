import argon2 from "argon2";
import {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    getRefreshTokenByUserId,
    removeRefreshToken
} from "../repositories/auth.repository.js";
import { generateAccessToken, generateRefreshToken,  verifyRefreshToken } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

export async function registerUser(userData) {

    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error("All fields are required");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const userId = await createUser({
        username,
        email,
        password: hashedPassword
    });

    return {
        id: userId,
        username,
        email
    };
}

export async function loginUser(userData) {
    const { email, password } = userData;

    if (!email || !password) {
        throw new AppError("All fields are required",401);
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password",401);
    }

    const isValid = await argon2.verify(
        user.password,
        password
    );

    if (!isValid) {
        throw new AppError("Invalid email or password",401);
    }

    const accessToken = generateAccessToken({
        id: user.id
    });

    const refreshToken = generateRefreshToken({
        id: user.id
    });

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await saveRefreshToken(
        user.id,
        hashedRefreshToken
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}

export async function refreshUser(refreshToken) {
    if (!refreshToken) {
        throw new AppError("Refresh Token is required", 401);
    }
    const payload = verifyRefreshToken(refreshToken);
    const storedRefreshToken = await getRefreshTokenByUserId(payload.id);

    if (!storedRefreshToken) {
        throw new AppError("Invalid refresh token", 401);
    }
   const isValid = await argon2.verify(
    storedRefreshToken,
    refreshToken
);

if (!isValid) {
    throw new AppError("Invalid refresh token", 401);
}

const accessToken = generateAccessToken({
    id: payload.id
});

const newRefreshToken = generateRefreshToken({
    id: payload.id
});

const hashedRefreshToken = await argon2.hash(newRefreshToken);

await saveRefreshToken(
    payload.id,
    hashedRefreshToken
);

return {
    accessToken,
    refreshToken: newRefreshToken
};

}

export async function logoutUser(refreshToken) {
    if (!refreshToken) {
        throw new AppError("Refresh Token is required", 401);
    }
    const payload = verifyRefreshToken(refreshToken);

     await removeRefreshToken(payload.id);

}