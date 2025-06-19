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
jest.mock('../logs/logs');

describe('eventsController.approveWorker', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'eventId123',
        workerId: 'workerId123'
      }
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

  it('should skip sending mail if worker email missing', async () => {
    const fakeEvent = {
      _id: 'eventId123',
      callType: 'Plumbing',
      callID: 'call123',
      createdBy: 'customerId123',
      assignedWorker: 'workerId123',
      status: 'in progress',
      rated: false,
      applicants: []
    };
    Events.findByIdAndUpdate.mockResolvedValue(fakeEvent);

    const fakeWorker = { name: 'WorkerName' }; // no email
    const fakeCustomer = { name: 'CustomerName', email: 'customer@example.com' };
    User.findById
      .mockResolvedValueOnce(fakeWorker)
      .mockResolvedValueOnce(fakeCustomer);

    await eventsController.approveWorker(req, res);

    expect(sendMail).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: 'Worker approved & event set to "in progress"',
      event: fakeEvent
    });
  });
});
