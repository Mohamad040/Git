jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: forgetPassword", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    await User.create({
      name: "Forget Me",
      email: "forgot@example.com",
      password: bcrypt.hashSync("secret123", 8),
      age: 28,
      gender: "Male",
      city: "Tel Aviv",
      street: "Rothschild",
      houseNumber: 21,
      workType: "None",
      isWorker: false,
      isAdmin: false,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 400 if email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/forgetPassword")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });

});
