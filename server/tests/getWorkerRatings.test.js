const { getWorkerRatings } = require('../controllers/workRateController'); // <-- adjust path
const WorkRate = require('../models/workRate'); // <-- adjust path

jest.mock('../models/WorkRate');

describe('getWorkerRatings', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { workerId: 'worker123' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('should return ratings for the worker sorted by createdAt desc', async () => {
    const mockRatings = [
      { _id: 2, workerId: 'worker123', createdAt: new Date('2024-05-01') },
      { _id: 1, workerId: 'worker123', createdAt: new Date('2024-04-01') }
    ];
    const sortMock = jest.fn().mockResolvedValue(mockRatings);
    WorkRate.find.mockReturnValue({ sort: sortMock });

    await getWorkerRatings(req, res);

    expect(WorkRate.find).toHaveBeenCalledWith({ workerId: 'worker123' });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith(mockRatings);
  });

});
