const { eventsController } = require('../controllers/eventsController');
const User = require('../models/users');
const Events = require('../models/events');

jest.mock('../models/users');
jest.mock('../models/events');

describe('eventsController.addEvent', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      userId: 'user123',
      body: {
        callType: 'Electricity',
        city: 'Haifa',
        street: 'Main St',
        houseNumber: 10,
        description: 'Power outage',
        status: 'open'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should create an event and update user calls', async () => {
    const mockUser = {
      name: 'Fadi',
      age: 28,
      gender: 'male',
      userCalls: [],
      save: jest.fn()
    };

    const mockSavedEvent = {
      callID: 'CALL123',
      save: jest.fn().mockResolvedValue({ callID: 'CALL123' })
    };

    User.findById.mockResolvedValue(mockUser);
    Events.mockImplementation(() => mockSavedEvent);

    await eventsController.addEvent(req, res);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(mockSavedEvent.save).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Event created successfully",
      event: { callID: 'CALL123' }
    });
  });

  it('should return 403 if user is not found', async () => {
    User.findById.mockResolvedValue(null);

    await eventsController.addEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

});
