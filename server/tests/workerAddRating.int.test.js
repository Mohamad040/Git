jest.setTimeout(60000);

jest.mock('../middlewares/authJwt', () => ({
  verifyToken: (req, res, next) => {
    // Use require INSIDE the mock factory!
    req.userId = require('mongoose').Types.ObjectId().toString();
    next();
  }
}));

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require("../server");
const WorkRate = require('../models/workRate');
const Events = require('../models/events');

let mongoServer;

describe('POST /api/workRates', () => {
  let workerId, eventId;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    workerId = new mongoose.Types.ObjectId().toString();
    // Create an event for rating
    const event = await Events.create({
      callType: 'Test',
      city: 'City',
      street: 'Street',
      status: 'Open',
      createdBy: new mongoose.Types.ObjectId().toString()
    });
    eventId = event._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop(); // <--- NEW: shut down the in-memory DB
  });

  afterEach(async () => {
    await WorkRate.deleteMany();
    await Events.updateMany({}, { $set: { rated: false } });
  });

  it('should add a rating and mark event as rated', async () => {
    const res = await request(app)
      .post('/api/workRates')
      .send({
        workerId,
        callId: eventId,
        rate: 5,
        feedback: 'Excellent',
        customerName: 'Sajed'
      })
      .expect(201);

    expect(res.body).toHaveProperty('message', 'Saved');
    expect(res.body.rating).toHaveProperty('workerId', workerId);
    expect(res.body.rating).toHaveProperty('rate', 5);
    expect(res.body.rating).toHaveProperty('feedback', 'Excellent');
    expect(res.body.rating).toHaveProperty('customerName', 'Sajed');

    // Check DB: rating was saved
    const rating = await WorkRate.findOne({ workerId });
    expect(rating).toBeTruthy();

    // Check event: should be marked as rated
    const updatedEvent = await Events.findById(eventId);
    expect(updatedEvent.rated).toBe(true);
  });
  
});
