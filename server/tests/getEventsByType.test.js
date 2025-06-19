const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.getEventsByType', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { callType: 'Plumbing' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should return 404 if no events are found', async () => {
    Events.find.mockResolvedValue([]);

    await eventsController.getEventsByType(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('No events found for call type: Plumbing');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No calls found for this type' });
  });

});
