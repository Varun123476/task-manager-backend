import { success } from "zod";
import {
    registerUser,
    loginUser,
    refreshUser,
    logoutUser
 } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
export async function register(req, res) {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}

export async function login(req, res) {
    try {
        const { accessToken, refreshToken, user } = await loginUser(req.body);
        
        res.cookie("refreshToken", refreshToken, {
             httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user
            }
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }
}

export const refresh = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    const {
        accessToken,
        refreshToken: newRefreshToken
    } = await refreshUser(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        data: {
            accessToken
        }
    });

});

export const logout = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

});