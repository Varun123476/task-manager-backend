import {
    describe,
    test,
    expect,
    vi,
    beforeEach
} from "vitest";

import { loginUser } from '../src/services/auth.service'
import { AppError } from '../src/errors/AppError.js'
import { findUserByEmail, saveRefreshToken } from "../src/repositories/auth.repository";

vi.mock("../src/repositories/auth.repository.js", () => ({
    findUserByEmail: vi.fn(),
    saveRefreshToken: vi.fn(),
}));


describe("loginUser()", () => {

    beforeEach(() => {
    vi.clearAllMocks();
    })
    
    test("throws AppError when user is not found", async () => {

    findUserByEmail.mockResolvedValue(null);

    await expect(
        loginUser({
            email: "varun@test.com",
            password: "password123",
        })
     ).rejects.toThrow("Invalid email or password");

    });

    test("throws AppError when no refresh token is generated")
})