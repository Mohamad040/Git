jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: login", () => {
  let mongoServer;
  const testPassword = "validpass123";

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = bcrypt.hashSync(testPassword, 8);

    await User.create({
      name: "Login Test",
      age: 30,
      gender: "Female",
      email: "logintest@example.com",
      password: hashedPassword,
      city: "Jaffa",
      street: "Yefet",
      houseNumber: 10,
      isAdmin: false,
      isWorker: true,
      workType: "Electrician",
      description: "Reliable worker",
      userCalls: [],
      workerCalls: []
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 400 if user email does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "whatever123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user email please enter correct email");
  });

  it("❌ should return 401 if password is incorrect", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "logintest@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid Password!");
    expect(res.body.accessToken).toBeNull();
  });
});
