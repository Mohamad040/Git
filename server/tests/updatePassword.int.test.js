jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: updatePassword", () => {
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

    const hashedPassword = bcrypt.hashSync("oldpass123", 8);

    user = new User({
      name: "Password Tester",
      age: 28,
      gender: "Female",
      email: "password@test.com",
      password: hashedPassword,
      city: "Akko",
      street: "Old City",
      houseNumber: 4,
      workType: "Cook",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should fail with 400 if current password is incorrect", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}/updatePassword`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "wrongpass",
        newPassword: "anotherpass123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Current password is incorrect");
  });

});
