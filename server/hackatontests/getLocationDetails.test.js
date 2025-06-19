const { authController } = require('../controllers/authController');
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe("Unit Test: getLocationDetails", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  

  it("❌ should return 400 if coordinates are missing", async () => {
    const res = mockRes();
    await authController.getLocationDetails({ body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing coordinates" });
  });

  
});
