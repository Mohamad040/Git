const { ratingsController } = require('../controllers/ratingsController');
const Rating = require('../models/ratings');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/ratings');       // Mock Rating model
jest.mock('../logs/logs');             // Mock logger

describe('ratingsController.getAllRatings', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Rating.find.mockClear();
    errorLogger.error.mockClear();
  });

  it('should return all ratings sorted by date desc', async () => {
    const fakeRatings = [
      { username: 'user1', rating: 5, date: new Date('2024-06-02') },
      { username: 'user2', rating: 3, date: new Date('2024-06-01') }
    ];

    // Mock find() to return an object with sort method, that returns fakeRatings
    Rating.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeRatings)
    });

    await ratingsController.getAllRatings(req, res);

    expect(Rating.find).toHaveBeenCalled();
    expect(Rating.find().sort).toHaveBeenCalledWith({ date: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeRatings);
  });

});
