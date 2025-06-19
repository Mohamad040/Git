

const { authController } = require("../controllers/authController"); // adjust path as needed

/**
 * Helper → Express-like `res` object with chainable status() and json().
 */
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

/**
 * Helper → fake Fetch Response whose json() resolves to the supplied payload.
 */
const fakeFetchResponse = (payload) => ({
  ok: true,
  json: async () => payload,
});

beforeEach(() => {
  jest.clearAllMocks();
  // Replace the *global* fetch with a fresh mock for every test
  global.fetch = jest.fn();
});

describe("getLocationDetails", () => {

  it("returns 400 when coordinates are missing", async () => {
    const req = { body: {} }; // no lat/lng
    const res = buildRes();

    await authController.getLocationDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing coordinates" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

});
