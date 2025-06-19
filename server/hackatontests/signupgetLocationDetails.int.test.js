// signupgetLocationDetails.int.test.js
// Integration tests for getLocationDetails *without* boot-strapping the full app.
// We create a lightweight Express instance that exposes only the route we want to test.
// This avoids DB connections (mongoose) and avoids the need for the main server port.

const express = require("express");
const request = require("supertest");

// Path may vary – adjust so it points to your controller file.
const { authController } = require("../controllers/authController");

/**
 * Build a tiny Express app just for the test.
 */
const buildTestApp = () => {
  const app = express();
  app.use(express.json());
  app.post("/api/auth/getLocationDetails", authController.getLocationDetails);
  return app;
};

// Shared fake Nominatim payload
const fakeAddressPayload = {
  address: {
    city: "Tel Aviv",
    country: "Israel",
    road: "Rothschild",
    house_number: "12",
  },
};

let app; // will hold our Express app per test suite

beforeEach(() => {
  jest.clearAllMocks();
  // Stub global.fetch for all tests
  global.fetch = jest.fn();
  // Create fresh app each test file (no need each test)
  app = buildTestApp();
});

describe("POST /api/auth/getLocationDetails (integration)", () => {
  const route = "/api/auth/getLocationDetails";

  it("returns 200 + formatted details when coordinates are valid", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => fakeAddressPayload });

    const res = await request(app)
      .post(route)
      .send({ lat: 32.0853, lng: 34.7818 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: "Tel Aviv, Israel | Tel Aviv, Israel",
      street: "Rothschild",
      houseNumber: "12",
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
