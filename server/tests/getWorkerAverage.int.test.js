// server/tests/getWorkerAverage.int.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { Types } = mongoose;
const { MongoMemoryServer } = require('mongodb-memory-server');

const WorkRate = require('../models/workRate'); // Adjust path if needed
const { getWorkerAverage } = require('../controllers/workRateController');

const app = express();
app.use(express.json());

// Setup route for testing
app.get('/api/workers/:workerId/average', getWorkerAverage);

describe('GET /api/workers/:workerId/average - getWorkerAverage', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean work rates collection after each test
    await WorkRate.deleteMany({});
  });

  it('should return average 0 and count 0 if no rates found', async () => {
    const workerId = new Types.ObjectId();

    const res = await request(app).get(`/api/workers/${workerId.toString()}/average`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 0, count: 0 });
  });

});
