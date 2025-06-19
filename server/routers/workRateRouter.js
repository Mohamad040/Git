const { Router } = require('express');
const { verifyToken } = require('../middlewares/authJwt');
const wr = require('../controllers/workRateController');

const workRateRouter = new Router();

/* anyone logged-in can rate & read */
workRateRouter.post('/',                verifyToken, wr.addRating);
workRateRouter.get('/:workerId',        verifyToken, wr.getWorkerRatings);
workRateRouter.get('/avg/:workerId',    verifyToken, wr.getWorkerAverage);

module.exports = { workRateRouter };
