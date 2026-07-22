const express    = require('express');
const router     = express.Router();
const controller = require('./notifications.controller');

router.post('/threshold', controller.setThreshold);

module.exports = router;