const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

usersController.infoLogger = { info: jest.fn() };
usersController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.put("/api/users/:id", usersController.editUserDetails);

describe("PUT /api/users/:id", () => {
  const userId = "1234567890abcdef12345678";
  const mockUser = {
    _id: userId,
    name: "Mofed",
    email: "mofed@test.com",
    password: "hashedOldPassword"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "Any"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should hash new password if old password is correct", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hashSync.mockReturnValue("hashedNewPassword");
    User.updateOne.mockResolvedValue({ matchedCount: 1 });

    const res = await request(app).put(`/api/users/${userId}`).send({
      oldPassword: "correctOldPassword",
      password: "newPassword"
    });

    expect(res.statusCode).toBe(200);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("newPassword", 8);
    expect(res.body.message).toContain("successfully");
  });

});
