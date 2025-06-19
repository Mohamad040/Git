const { getWorkerAverage } = require('../controllers/workRateController');
const WorkRate = require('../models/workRate');
const mongoose = require('mongoose');

jest.mock('../models/workRate');

describe('getWorkerAverage', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { workerId: new mongoose.Types.ObjectId().toString() } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return average and count if found', async () => {
    WorkRate.aggregate.mockResolvedValue([{ avg: 4.5, count: 10 }]);

    await getWorkerAverage(req, res);

    expect(WorkRate.aggregate).toHaveBeenCalledWith([
      { $match: { workerId: expect.any(mongoose.Types.ObjectId) } },
      { $group: { _id: null, avg: { $avg: '$rate' }, count: { $sum: 1 } } }
    ]);
    expect(res.json).toHaveBeenCalledWith({ average: 4.5, count: 10 });
  });

});
