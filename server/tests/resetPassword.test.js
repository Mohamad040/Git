const request = require("supertest");
const express = require("express");
const { authController } = require("../controllers/authController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

authController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.post("/api/auth/reset-password", authController.resetPassword);

describe("POST /api/auth/reset-password", () => {
  const validBody = {
    email: "test@example.com",
    otp: "ABC123",
    newPassword: "newSecurePass"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any field is missing", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({
      email: "test@example.com"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

});
