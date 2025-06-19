// server/tests/applyToCall.int.test.js

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

// Mock authentication middleware to set req.userId
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockWorkerId';
  next();
});

// Route to test
app.put('/api/events/:id/apply', authJwt.verifyToken, eventsController.applyToCall);

describe('PUT /api/events/:id/apply (applyToCall)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond 404 if event not found', async () => {
    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    const res = await request(app)
      .put('/api/events/fakeEvent/apply')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Call not found' });

    expect(sendMail).not.toHaveBeenCalled();
  });

});
