const express    = require('express');
const router     = express.Router();
const controller = require('./meter.controller');
 
router.post('/validate', controller.validateMeter);
 
router.get('/dashboard/:meter', controller.getMeterDashboard);
 
module.exports = router;
 