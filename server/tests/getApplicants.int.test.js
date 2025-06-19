// server/tests/getApplicants.int.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const authJwt = require('../middlewares/authJwt');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../middlewares/authJwt');

const app = express();
app.use(express.json());

// Mock auth middleware to simulate authenticated user
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

app.get('/api/events/:id/applicants', authJwt.verifyToken, eventsController.getApplicants);

describe('GET /api/events/:id/applicants (getApplicants)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return applicants and approved workers', async () => {
    const mockApplicants = [
      { _id: 'a1', name: 'Applicant One', email: 'a1@example.com', phone: '111', workType: 'Plumber' },
      { _id: 'a2', name: 'Applicant Two', email: 'a2@example.com', phone: '222', workType: 'Electrician' },
    ];
    const mockApprovedWorkers = [
      { _id: 'w1', name: 'Worker One', email: 'w1@example.com', phone: '333', workType: 'Carpenter' }
    ];

    // Mock Events.findById().populate()
    const populateMock = jest.fn().mockReturnValue({
      applicants: mockApplicants,
      approvedWorkers: ['w1'],
    });
    Events.findById.mockReturnValue({
      populate: populateMock,
    });

    User.find.mockResolvedValue(mockApprovedWorkers);

    const res = await request(app)
      .get('/api/events/someEventId/applicants')
      .send();

    expect(Events.findById).toHaveBeenCalledWith('someEventId');
    expect(populateMock).toHaveBeenCalledWith('applicants', 'name email phone workType');
    expect(User.find).toHaveBeenCalledWith(
      { _id: { $in: ['w1'] } },
      'name email phone workType'
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      applicants: mockApplicants,
      approvedWorkers: mockApprovedWorkers
    });
  });

});
