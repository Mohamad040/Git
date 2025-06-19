const { Router } = require('express');
const { ratingsController } = require('../controllers/ratingsController');
const ratingsRouter = new Router();


ratingsRouter.post('/addRating', ratingsController.addRating);
ratingsRouter.get('/getAllRatings', ratingsController.getAllRatings);
ratingsRouter.get('/getAverageRating', ratingsController.getAverageRating);
ratingsRouter.delete('/deleteRating/:id', ratingsController.deleteRating);

module.exports = { ratingsRouter };