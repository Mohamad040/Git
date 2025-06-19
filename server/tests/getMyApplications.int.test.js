// server/tests/getMyApplications.int.test.js

const request = require('supertest');
const express = require('express');

const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const authJwt = require('../middlewares/authJwt');

jest.mock('../models/events');       // mock Events model
jest.mock('../middlewares/authJwt'); // mock auth middleware

const app = express();
app.use(express.json());

// Mock authJwt middleware: sets req.userId and calls next()
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId123';
  next();
});

// Register the route with the mocked middleware & controller
app.get('/api/events/myApplications', authJwt.verifyToken, eventsController.getMyApplications);

describe('GET /api/events/myApplications - getMyApplications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return applications with status "Open" for the user sorted by date descending', async () => {
    const mockApps = [
      { _id: '2', callType: 'Cleaning', status: 'Open', date: new Date('2025-02-02') },
      { _id: '1', callType: 'Painting', status: 'Open', date: new Date('2025-01-01') }
    ];

    // Mock chain: find().sort()
    const sortMock = jest.fn().mockReturnThis();
    Events.find.mockReturnValue({ sort: sortMock });
    sortMock.mockResolvedValue(mockApps);

    const res = await request(app)
      .get('/api/events/myApplications')
      .expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0].callType).toBe('Cleaning');
    expect(res.body[1].callType).toBe('Painting');

    expect(Events.find).toHaveBeenCalledWith({
      applicants: 'mockUserId123',
      status: 'Open'
    });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
  });

});
