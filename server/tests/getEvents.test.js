const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { infoLogger, errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.getEvents', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 500 if fetching events fails', async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error('DB error'));
    Events.find.mockReturnValue({ sort: sortMock });

    await eventsController.getEvents(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching Calls:')
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching Calls',
      error: expect.anything() // Allow both Error object or .message
    });
  });
});
