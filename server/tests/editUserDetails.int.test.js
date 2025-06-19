jest.setTimeout(20000);
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: editUserDetails", () => {
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

    const hashedPassword = await bcrypt.hash("123456", 8);

    user = new User({
      name: "Edit Me",
      age: 29,
      gender: "Female",
      email: "edit@test.com",
      password: hashedPassword,
      city: "Ashdod",
      street: "Sea Road",
      houseNumber: 5,
      workType: "Technician",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should fail if old password is incorrect", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}/updateUser`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "wrong-password",
        name: "Should Not Update"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Old password is incorrect");
  });

  it("❌ should return 404 if user not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/users/${fakeId}/updateUser`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "123456",
        name: "Nonexistent"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});
