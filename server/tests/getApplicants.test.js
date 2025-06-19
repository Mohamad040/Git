const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');

jest.mock('../models/events');
jest.mock('../models/users');

describe('eventsController.getApplicants', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'eventId123' }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.findById.mockClear();
    User.find.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should return applicants and approved workers', async () => {
    const mockPopulate = jest.fn().mockResolvedValue({
      applicants: [{ name: 'applicant1' }],
      approvedWorkers: ['worker1', 'worker2']
    });
    Events.findById.mockReturnValue({ populate: mockPopulate });
    User.find.mockResolvedValue([{ name: 'worker1' }, { name: 'worker2' }]);

    await eventsController.getApplicants(req, res);

    expect(Events.findById).toHaveBeenCalledWith('eventId123');
    expect(mockPopulate).toHaveBeenCalledWith('applicants', 'name email phone workType');
    expect(User.find).toHaveBeenCalledWith(
      { _id: { $in: ['worker1', 'worker2'] } },
      'name email phone workType'
    );
    expect(res.json).toHaveBeenCalledWith({
      applicants: [{ name: 'applicant1' }],
      approvedWorkers: [{ name: 'worker1' }, { name: 'worker2' }]
    });
  });

});
