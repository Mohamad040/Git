const { ratingsController } = require('../controllers/ratingsController');
const Rating = require('../models/ratings');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/ratings');
jest.mock('../logs/logs');

describe('ratingsController.getAverageRating', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Rating.aggregate.mockClear();
    errorLogger.error.mockClear();
  });

  it('should return 0 if no ratings found', async () => {
    Rating.aggregate.mockResolvedValue([]);

    await ratingsController.getAverageRating(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ average: '0.0' });
  });

});
