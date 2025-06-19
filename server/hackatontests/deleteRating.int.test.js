// server/hackatontests/deleteRating.int.test.js
const express              = require('express');
const request              = require('supertest');
const mongoose             = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Rating               = require('../models/ratings');
const { ratingsController } = require('../controllers/ratingsController');
const deleteRating = ratingsController.deleteRating;
/* Mock auth middleware */
jest.mock('../middlewares/authJwt', () => ({
  verifyToken: jest.fn((req, _res, next) => {
    req.userId = '507f1f77bcf86cd799439011';
    next();
  }),
}));

/* Mock logger */
jest.mock('../logs/logs', () => ({
  infoLogger : { info  : jest.fn() },
  errorLogger: { error : jest.fn() },
}), { virtual: true });

jest.mock('../utils/logger', () => ({
  infoLogger : { info  : jest.fn() },
  errorLogger: { error : jest.fn() },
}), { virtual: true });

/* In-memory Mongo setup */
let mongo;
let app;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // ⚠️ Build fresh app with DELETE route
  app = express();
  app.use(express.json());

  const { verifyToken } = require('../middlewares/authJwt');

  app.delete('/api/ratings/:id', verifyToken, deleteRating);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await Rating.deleteMany();
  jest.clearAllMocks();
});

describe('DELETE /api/ratings/:id', () => {
  it('✅ 200 – deletes existing rating', async () => {
    const rating = await Rating.create({
      rating   : 4,
      usertype : 'customer',
      username : 'testuser',
      comment  : 'test',
      user     : new mongoose.Types.ObjectId(),
      movie    : new mongoose.Types.ObjectId(),
    });

    await request(app)
      .delete(`/api/ratings/${rating._id}`)
      .expect(200, { message: 'Rating deleted successfully' });

    expect(await Rating.findById(rating._id)).toBeNull();
  });
});
