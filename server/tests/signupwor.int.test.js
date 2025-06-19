jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: signupwor", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 400 for missing parameters", async () => {
    const res = await request(app).post("/api/auth/signupwor").send({
      email: "missing@example.com",
      password: "abc123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing Parameters Please send all Parameters");
  });

});
