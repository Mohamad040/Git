// getUserStats.test.js
// Jest unit tests for usersController.getUserStats

// ----- Mock the User mongoose model -----
jest.mock("../models/users", () => ({
  find: jest.fn(),
}));
const User = require("../models/users");

// Import controller after mocks so it picks up the stub
const { usersController } = require("../controllers/usersController");

/**
 * Helper: Express-like res with chainable status() and json().
 */
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getUserStats", () => {
  it("returns aggregated counts for each role", async () => {
    // Arrange – mock DB result
    const fakeUsers = [
      { _id: 1, isAdmin: true, isWorker: false },
      { _id: 2, isAdmin: false, isWorker: true },
      { _id: 3, isAdmin: false, isWorker: false },
      { _id: 4, isAdmin: false, isWorker: true },
    ];
    User.find.mockResolvedValue(fakeUsers);

    const req = {};
    const res = buildRes();

    await usersController.getUserStats(req, res);

    expect(User.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      total: 4,
      admins: 1,
      workers: 2,
      customers: 1,
    });
  });
});
