const request = require("supertest");
const express = require("express");
const { authController } = require("../controllers/authController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

// Mock dependencies
jest.mock("../models/users");
jest.mock("bcryptjs");

// Optional: Hide winston console output during test
jest.spyOn(console, 'log').mockImplementation(() => {});

// Optional: You can use this if your controller uses external loggers
authController.infoLogger = { info: jest.fn() };
authController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.post("/api/auth/signup", authController.signupcos);

describe("POST /api/auth/signup", () => {
  const validBody = {
    name: "Sahed",
    email: "sajed@test.com",
    age: 25,
    gender: "male",
    password: "123456",
    city: "Haifa",
    street: "Main St",
    houseNumber: 10,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 if user is created successfully", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hashSync.mockReturnValue("hashed123");
    User.prototype.save = jest.fn().mockResolvedValue({ _id: "1", ...validBody });

    const res = await request(app).post("/api/auth/signup").send(validBody);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(validBody.email);
  });

  it("should return 400 if parameters are missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "test@test.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing Parameters Please send all Parameters");
  });
  
});
