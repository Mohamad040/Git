const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();


authRouter.post('/forgetPassword', authController.forgetPassword);
authRouter.post('/resetPassword', authController.resetPassword);
authRouter.post('/login', authController.login);
authRouter.post('/signupcos', authController.signupcos);
authRouter.post('/signupwor', authController.signupwor);
authRouter.post('/getLocationDetails', authController.getLocationDetails);

module.exports = { authRouter };
