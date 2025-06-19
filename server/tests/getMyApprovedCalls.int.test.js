// server/tests/getMyApprovedCalls.int.test.js

const request = require('supertest');
const express = require('express');

const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const authJwt = require('../middlewares/authJwt');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events'); // mock Events model
jest.mock('../middlewares/authJwt'); // mock auth middleware
jest.mock('../logs/logs'); // mock logger

const app = express();
app.use(express.json());

// Mock authJwt middleware: sets req.userId and calls next()
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId123';
  next();
});

// Route under test with auth middleware and controller
app.get('/api/events/myApprovedCalls', authJwt.verifyToken, eventsController.getMyApprovedCalls);

describe('GET /api/events/myApprovedCalls - getMyApprovedCalls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return only approved calls for the user sorted by date descending', async () => {
    // Mock data to return from Events.find().sort().lean()
    const mockCalls = [
      { _id: '2', callType: 'Electric', date: new Date('2025-01-02') },
      { _id: '1', callType: 'Plumbing', date: new Date('2025-01-01') }
    ];

    // Chain mocks for find().sort().lean()
    const sortMock = jest.fn().mockReturnThis();
    const leanMock = jest.fn().mockResolvedValue(mockCalls);

    Events.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ lean: leanMock });

    const res = await request(app)
      .get('/api/events/myApprovedCalls')
      .expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0].callType).toBe('Electric');
    expect(res.body[1].callType).toBe('Plumbing');

    expect(Events.find).toHaveBeenCalledWith({ approvedWorkers: 'mockUserId123' });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(leanMock).toHaveBeenCalled();
  });

});
