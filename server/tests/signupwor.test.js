const request = require("supertest");
const express = require("express");
const { authController } = require("../controllers/authController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

// Mocks
jest.mock("../models/users");
jest.mock("bcryptjs");
jest.spyOn(console, 'log').mockImplementation(() => {}); // optional to silence logs

authController.infoLogger = { info: jest.fn() };
authController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.post("/api/auth/signup-worker", authController.signupwor);

describe("POST /api/auth/signup-worker", () => {
  const validWorker = {
    name: "WorkerName",
    email: "worker@test.com",
    age: 30,
    gender: "male",
    password: "strongpass",
    workType: "Electrician",
    city: "Jerusalem",
    street: "Work St",
    houseNumber: 11,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 if worker is created successfully", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hashSync.mockReturnValue("hashedpass123");
    User.prototype.save = jest.fn().mockResolvedValue({ _id: "2", ...validWorker });

    const res = await request(app).post("/api/auth/signup-worker").send(validWorker);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(validWorker.email);
  });

  it("should return 400 if parameters are missing", async () => {
    const res = await request(app).post("/api/auth/signup-worker").send({ email: "test@worker.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing Parameters Please send all Parameters");
  });

});
