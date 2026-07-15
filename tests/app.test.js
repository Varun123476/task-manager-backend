import request from "supertest";
import app from "../app.js";

describe("App", () => {

    it("should return API running message", async () => {

        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.text).toBe("Task Manager API is Running 🚀");

    });

});