const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");

jest.mock("../models/users");

usersController.infoLogger = { info: jest.fn() };
usersController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.get("/api/users/:id", usersController.getUserDetails);

describe("GET /api/users/:id", () => {
  const validUserId = "1234567890abcdef12345678";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/api/users/${validUserId}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user id please enter correct id");
  });

});
