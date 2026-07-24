const express    = require('express');
const router     = express.Router();
const controller = require('./payment.controller');

router.post('/initiate', controller.initiatePayment);
router.get('/verify/:ref', controller.verifyPayment);
router.post('/webhook', controller.webhook);
router.get('/transactions/:meter', controller.getTransactions);

module.exports = router;