const { Router }          = require('express');
const { eventsController } = require('../controllers/eventsController');
const { verifyToken }      = require('../middlewares/authJwt');

const eventsRouter = new Router();

eventsRouter.get('/getEvents',                    verifyToken, eventsController.getEvents);
eventsRouter.get('/getEventsByType/:callType',    verifyToken, eventsController.getEventsByType);
eventsRouter.post('/addEvent',                    verifyToken, eventsController.addEvent);
eventsRouter.delete('/deleteEvent/:id',           verifyToken, eventsController.deleteEvent);
eventsRouter.delete('/applicants/:id',  verifyToken,  eventsController.unapply);
eventsRouter.put('/updateEvent/:callID',          verifyToken, eventsController.updateEvent);
eventsRouter.post('/getLocationDetails',          verifyToken, eventsController.getLocationDetails);
eventsRouter.get('/myCalls', verifyToken, eventsController.getMyEvents);
eventsRouter.get('/applicants/:id', verifyToken, eventsController.getApplicants);
eventsRouter.post('/approve/:id/:workerId',       verifyToken, eventsController.approveWorker);
eventsRouter.post('/applicants/:id',              verifyToken, eventsController.applyToCall);
eventsRouter.get('/myApplications',               verifyToken,eventsController.getMyApplications);
eventsRouter.get('/getApprovedCalls',  verifyToken, eventsController.getMyApprovedCalls);
eventsRouter.put('/update/:id',          verifyToken, eventsController.cusupdateEvent);
eventsRouter.post('/completeCall/:id', verifyToken, eventsController.completeCall);
eventsRouter.put('/rated/:id', verifyToken, eventsController.markRated);
module.exports = { eventsRouter };
