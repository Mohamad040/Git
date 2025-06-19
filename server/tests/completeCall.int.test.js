// server/tests/completeCall.int.test.js

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

// Mock authJwt middleware to inject userId
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockWorkerId';
  next();
});

app.put('/api/events/:id/complete', authJwt.verifyToken, eventsController.completeCall);

describe('PUT /api/events/:id/complete (completeCall)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if call not found', async () => {
    Events.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/events/fakeid/complete')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Call not found' });
    expect(sendMail).not.toHaveBeenCalled();
  });


});
