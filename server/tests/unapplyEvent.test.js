const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.unapplyEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'someEventId' },
      userId: 'user123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Events.findOneAndUpdate.mockClear();
    errorLogger.error.mockClear();
  });

  it('should return 404 if event not found', async () => {
    Events.findOneAndUpdate.mockResolvedValue(null);

    await eventsController.unapply(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

});
