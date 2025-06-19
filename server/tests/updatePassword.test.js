const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

const app = express();
app.use(express.json());

// Middleware to simulate authentication (req.userId)
app.use((req, res, next) => {
  req.userId = "1234567890abcdef12345678";
  next();
});

app.put("/api/users/update-password", usersController.updatePassword);

describe("PUT /api/users/update-password", () => {
  const userId = "1234567890abcdef12345678";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).put("/api/users/update-password").send({
      currentPassword: "oldPass",
      newPassword: "newPass"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

});
