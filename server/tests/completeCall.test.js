const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const { sendMail } = require('../utils/mailer');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn()
}));
jest.mock('../logs/logs', () => ({
  errorLogger: { error: jest.fn() }
}));

describe('eventsController.completeCall', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'callId123' },
      userId: 'workerId123'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.findByIdAndUpdate.mockClear();
    User.findById.mockClear();
    sendMail.mockClear();
    errorLogger.error.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should handle missing call with 404', async () => {
    Events.findByIdAndUpdate.mockResolvedValue(null);

    await eventsController.completeCall(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

});
