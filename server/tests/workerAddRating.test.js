const { addRating } = require('../controllers/workRateController');
const WorkRate = require('../models/workRate');
const Events = require('../models/events');
const mongoose = require('mongoose');

jest.mock('../models/WorkRate');
jest.mock('../models/Events');

describe('addRating (minimal working test)', () => {
  it('returns 400 if workerId is missing', async () => {
    // Arrange
    const req = {
      body: {
        rate: 5 // no workerId!
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await addRating(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('workerId and rate are required') })
    );
  });
});
