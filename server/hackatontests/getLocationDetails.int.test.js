const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Integration Test: getLocationDetails", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should return location details for valid coordinates", async () => {
    const res = await request(app).post("/api/auth/getLocationDetails").send({
      lat: 31.7683, // Jerusalem approx
      lng: 35.2137,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("city");
    expect(res.body).toHaveProperty("street");
    expect(res.body).toHaveProperty("houseNumber");
  });

});
