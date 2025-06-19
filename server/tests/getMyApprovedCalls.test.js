const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.getMyApprovedCalls', () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: 'userId123'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.find.mockClear();
    errorLogger.error.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should return approved calls sorted by date descending', async () => {
    const mockCalls = [
      { _id: 'call1', date: new Date('2024-06-02') },
      { _id: 'call2', date: new Date('2024-06-01') }
    ];

    const leanMock = jest.fn().mockResolvedValue(mockCalls);
    const sortMock = jest.fn().mockReturnValue({ lean: leanMock });
    Events.find.mockReturnValue({ sort: sortMock });

    await eventsController.getMyApprovedCalls(req, res);

    expect(Events.find).toHaveBeenCalledWith({ approvedWorkers: 'userId123' });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(leanMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockCalls);
  });

});
