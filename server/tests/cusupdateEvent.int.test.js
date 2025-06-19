// server/tests/cusupdateEvent.int.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const authJwt = require('../middlewares/authJwt');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../middlewares/authJwt');
jest.mock('../logs/logs');

const app = express();
app.use(express.json());

// Mock auth middleware to simulate logged-in user
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

app.put('/api/events/:id/cusupdate', authJwt.verifyToken, eventsController.cusupdateEvent);

describe('PUT /api/events/:id/cusupdate (cusupdateEvent)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if event not found', async () => {
    Events.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/events/unknownEvent/cusupdate')
      .send({ callType: 'Plumbing' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Call not found' });
  });

});
