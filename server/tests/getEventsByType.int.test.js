jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: getEventsByType", () => {
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
      age: 30,
      gender: "Female",
      email: "type@test.com",
      password: "123456",
      city: "Jaffa",
      street: "Yefet",
      houseNumber: 9,
      workType: "Cleaner",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    // Insert some events
    await Events.insertMany([
      {
        callType: "Electric",
        city: "Jaffa",
        street: "Allenby",
        houseNumber: 15,
        description: "Fix wires",
        costumerdetails: [`Name: ${user.name}`, `Age: ${user.age}`, `Gender: ${user.gender}`],
        status: "Open",
        createdBy: user._id
      },
      {
        callType: "Plumbing",
        city: "Jaffa",
        street: "Yefet",
        houseNumber: 8,
        description: "Sink issue",
        costumerdetails: [`Name: ${user.name}`, `Age: ${user.age}`, `Gender: ${user.gender}`],
        status: "Open",
        createdBy: user._id
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 404 if no events found for given type", async () => {
    const res = await request(app)
      .get("/api/events/getEventsByType/NonExistingType")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No calls found for this type");
  });
});
