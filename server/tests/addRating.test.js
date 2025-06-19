const { ratingsController } = require('../controllers/ratingsController');
const Rating = require('../models/ratings');
const { infoLogger, errorLogger } = require('../logs/logs');

jest.mock('../models/ratings');      // Mock מודל Rating
jest.mock('../logs/logs');          // Mock הלוגים

describe('ratingsController.addRating', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        usertype: 'customer',
        rating: 5
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Rating.mockClear();
    infoLogger.info.mockClear();
    errorLogger.error.mockClear();
  });

  it('should return 500 and log error on failure', async () => {
    const error = new Error('Failed to save');
    Rating.prototype.save = jest.fn().mockRejectedValue(error);

    await ratingsController.addRating(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('Failed to submit rating:', error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
