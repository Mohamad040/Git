jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: resetPassword", () => {
  let mongoServer;
  let otp = "ABC123";
  const email = "reset@test.com";

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user with a valid OTP
    await User.create({
      name: "Reset Target",
      email,
      password: bcrypt.hashSync("oldpassword", 8),
      gender: "Female",
      age: 33,
      city: "Eilat",
      street: "Palm St",
      houseNumber: 3,
      workType: "None",
      isAdmin: false,
      isWorker: false,
      resetPasswordToken: otp,
      resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should reset password with valid OTP", async () => {
    const res = await request(app).post("/api/auth/resetPassword").send({
      email,
      otp,
      newPassword: "newsecurepass",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password has been updated");

    const user = await User.findOne({ email });
    const isValid = bcrypt.compareSync("newsecurepass", user.password);
    expect(isValid).toBe(true);
    expect(user.resetPasswordToken).toBeUndefined();
    expect(user.resetPasswordExpires).toBeUndefined();
  });

});
