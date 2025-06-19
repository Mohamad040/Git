jest.setTimeout(20000);

// ✅ Set SECRET to match what your app uses
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: addEvent", () => {
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testUser = new User({
      name: "Test User",
      age: 28,
      gender: "Male",
      email: "test@example.com",
      password: "12345678",
      city: "Jerusalem",
      street: "Ben Yehuda",
      houseNumber: 15,
      workType: "Electrician",
    });

    await testUser.save();
    userId = testUser._id;

    token = jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // ✅ TEST 2: Missing fields
  it("❌ should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/events/addEvent")
      .set("Authorization", `Bearer ${token}`)
      .send({
        callType: "Electric",
        city: "Haifa",
        street: "Hertzel",
        // Missing: description, status
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });
});
