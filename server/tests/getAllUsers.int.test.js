jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: getAllUsers", () => {
  let mongoServer;
  let token;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    user = new User({
      name: "User One",
      age: 30,
      gender: "Male",
      email: "user1@test.com",
      password: "123456",
      city: "Jerusalem",
      street: "Main",
      houseNumber: 1,
      workType: "Technician",
    });

    await user.save();

    await User.create({
      name: "User Two",
      age: 22,
      gender: "Female",
      email: "user2@test.com",
      password: "abcdef",
      city: "Tel Aviv",
      street: "Dizengoff",
      houseNumber: 10,
      workType: "Cleaner",
    });

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should return all users without passwords", async () => {
    const res = await request(app)
      .get("/api/users/getAllUsers")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    res.body.forEach((user) => {
      expect(user).not.toHaveProperty("password");
      expect(user).toHaveProperty("email");
    });
  });
});
