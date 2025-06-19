const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const { infoLogger, errorLogger } = require('../logs/logs');
const mongoose = require('mongoose');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../logs/logs');

describe('eventsController.deleteEvent', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: 'CALL123' },
      userId: 'USER001'
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should delete event by ObjectId and return success message', async () => {
    // Simulate valid ObjectId, so _id branch
    const objectId = new mongoose.Types.ObjectId().toString();
    req.params.id = objectId;
    Events.findByIdAndDelete.mockResolvedValue({
      callID: 'ABC123',
      _id: objectId
    });
    User.updateOne.mockResolvedValue({});

    await eventsController.deleteEvent(req, res);

    expect(Events.findByIdAndDelete).toHaveBeenCalledWith(objectId);
    expect(infoLogger.info).toHaveBeenCalledWith(`Event deleted successfully: ${objectId}`);
    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: req.userId },
      { $pull: { userCalls: 'ABC123' } }
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully" });
  });

});