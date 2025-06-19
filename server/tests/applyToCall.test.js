const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const { sendMail } = require('../utils/mailer');  // adjust path to your email utility
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn()     // Mock sendMail as jest.fn()
}));
jest.mock('../logs/logs');

describe('eventsController.applyToCall', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'eventId123' },
      userId: 'workerId123'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.findByIdAndUpdate.mockClear();
    User.findById.mockClear();
    sendMail.mockClear();             // Now this is safe to call because sendMail is jest.fn()
    errorLogger.error.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });
  
  it('should return 404 if event not found', async () => {
    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      })
    });

    await eventsController.applyToCall(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });
});
