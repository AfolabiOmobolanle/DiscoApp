const express    = require('express');
const router     = express.Router();
const controller = require('./meter.controller');
 
router.post('/validate', controller.validateMeter);
 
router.get('/balance/:meter', controller.getMeterBalance);
 
module.exports = router;
 