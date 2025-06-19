jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: getUserDetails", () => {
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
      name: "Detail User",
      age: 40,
      gender: "Male",
      email: "detail@test.com",
      password: "123456",
      city: "Netanya",
      street: "Kikar Haatzmaut",
      houseNumber: 3,
      workType: "Electrician",
    });

    await user.save();
    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 400 if user is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user id please enter correct id");
  });
});
