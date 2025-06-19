const { ratingsController } = require("../controllers/ratingsController");
const Rating = require("../models/ratings");
const { infoLogger, errorLogger } = require("../logs/logs");

jest.mock("../models/ratings");
jest.mock("../logs/logs");

describe("Unit Test: deleteRating", () => {
  const req = { params: { id: "123abc" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("❌ should return 404 if rating not found", async () => {
    Rating.findById.mockResolvedValue(null);

    await ratingsController.deleteRating(req, res);

    expect(Rating.findById).toHaveBeenCalledWith("123abc");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Rating not found" });
  });

});
