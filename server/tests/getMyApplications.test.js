const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');

jest.mock('../models/events');

describe('eventsController.getMyApplications', () => {
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
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should return applications filtered by userId and status, sorted by date desc', async () => {
    const mockApps = [
      { _id: 'app1', date: new Date('2024-06-02') },
      { _id: 'app2', date: new Date('2024-06-01') }
    ];

    const sortMock = jest.fn().mockResolvedValue(mockApps);
    Events.find.mockReturnValue({ sort: sortMock });

    await eventsController.getMyApplications(req, res);

    expect(Events.find).toHaveBeenCalledWith({
      applicants: 'userId123',
      status: 'Open'
    });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(res.json).toHaveBeenCalledWith(mockApps);
  });

});
