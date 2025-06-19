// server/tests/approveWorker.int.test.js

const request = require('supertest');
const express = require('express');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const sendMail = require('../utils/mailer');
const { errorLogger } = require('../logs/logs');
const authJwt = require('../middlewares/authJwt');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer');
jest.mock('../logs/logs');
jest.mock('../middlewares/authJwt');

const app = express();
app.use(express.json());

// Mock authJwt to set req.userId (if needed for your route)
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

app.put('/api/events/:id/approve/:workerId', authJwt.verifyToken, eventsController.approveWorker);

describe('PUT /api/events/:id/approve/:workerId (approveWorker)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log error and return 500 on unexpected errors', async () => {
    const error = new Error('DB error');
    Events.findByIdAndUpdate.mockRejectedValue(error);

    const res = await request(app)
      .put('/api/events/event123/approve/worker123')
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Server error',
      error: error.message
    });
    expect(errorLogger.error).toHaveBeenCalledWith(`Error approving worker: ${error}`);
  });

});
