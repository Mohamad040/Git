jest.setTimeout(60000); 
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: getEvents", () => {
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
      name: "Test User",
      age: 25,
      gender: "Female",
      email: "get@example.com",
      password: "123456",
      city: "Haifa",
      street: "Carmel",
      houseNumber: 7,
      workType: "Cleaner",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    // Add some events, now with createdBy
    await Events.insertMany([
      {
        callType: "Electric",
        city: "Haifa",
        street: "Herzl",
        houseNumber: 5,
        description: "Fix light",
        costumerdetails: [`Name: ${user.name}`, `Age: ${user.age}`, `Gender: ${user.gender}`],
        status: "Open",
        createdBy: user._id, 
      },
      {
        callType: "Plumbing",
        city: "Haifa",
        street: "Ben Gurion",
        houseNumber: 11,
        description: "Leaking pipe",
        costumerdetails: [`Name: ${user.name}`, `Age: ${user.age}`, `Gender: ${user.gender}`],
        status: "Open",
        createdBy: user._id, 
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should return all events successfully", async () => {
    const res = await request(app)
      .get("/api/events/getEvents")
      .set("x-access-token", token); 

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("callType");
    expect(res.body[0]).toHaveProperty("city");
  });
});
