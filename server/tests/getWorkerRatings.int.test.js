const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const WorkRate = require('../models/workRate');

jest.mock('../middlewares/authJwt', () => ({
  verifyToken: (req, res, next) => {
    req.userId = '507f191e810c19729de860ea'; // fixed user id for tests
    next();
  }
}));

jest.setTimeout(60000);

describe('GET /api/workRates/:workerId', () => {
  let mongoServer;
  let workerId, customerId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    workerId = new mongoose.Types.ObjectId();
    customerId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await WorkRate.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should return empty array if no ratings for the worker', async () => {
    const otherWorkerId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/workRates/${otherWorkerId.toString()}`)
      .expect(200);

    expect(res.body).toEqual([]);
  });
});
