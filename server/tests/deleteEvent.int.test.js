// server/tests/deleteEvent.int.test.js

jest.setTimeout(20000);
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: deleteEvent", () => {
  let mongoServer;
  let token;
  let user;
  let event;

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
      gender: "Male",
      email: "delete@example.com",
      password: "123456",
      city: "Tel Aviv",
      street: "Main Street",
      houseNumber: 10,
      workType: "Technician",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    event = new Events({
      callType: "Repair",
      city: "Tel Aviv",
      street: "Main Street",
      houseNumber: 10,
      description: "Test event",
      status: "Open",
      createdBy: user._id
    });

    await event.save();

    // Add the callID to user's userCalls array
    user.userCalls = [event.callID];
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("❌ should return 404 if event not found", async () => {
    // Use a random valid ObjectId to guarantee "not found"
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/events/deleteEvent/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Event not found");
  });

});
