const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();


usersRouter.get("/getAllUsers", usersController.getAllUsers);  
usersRouter.put('/:id/updateUser', usersController.editUserDetails);
usersRouter.delete('/:id/deleteUser', usersController.deleteUser);
usersRouter.put('/:id/updatePassword', usersController.updatePassword);
usersRouter.get('/userStats', usersController.getUserStats);
usersRouter.get('/:id', usersController.getUserDetails);
module.exports = { usersRouter };
