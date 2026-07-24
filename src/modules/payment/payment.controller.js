const crypto = require('crypto');
const paymentService = require('./payment.service');
const {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../../utils/statuscodes');

async function initiatePayment(req, res) {
  const { meterNumber, amount } = req.body;
  if (!meterNumber || !amount) {
    return res.status(STATUS_BAD_REQUEST).json({
      success:    false,
      statusCode: STATUS_BAD_REQUEST,
      error:      'meterNumber and amount are required',
    });
  }
  try {
    const data = await paymentService.initiatePayment(meterNumber, amount);
    res.json(data);
  } catch (err) {
    console.error('[payment/initiate]', err.message);
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({
      success:    false,
      statusCode: STATUS_INTERNAL_SERVER_ERROR,
      error:      'Could not initiate payment',
    });
  }
}

async function verifyPayment(req, res) {
  const { ref } = req.params;
  try {
    const data = await paymentService.verifyPayment(ref);
    res.json(data);
  } catch (err) {
    console.error('[payment/verify]', err.message);
    res.status(STATUS_BAD_REQUEST).json({ success: false, statusCode: STATUS_BAD_REQUEST, error: err.message });
  }
}

async function webhook(req, res) {
  try {
    const signature = req.headers['x-paystack-signature'];
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest('hex');

    if (!signature || hash !== signature) {
      console.warn('[payment/webhook] Invalid Paystack signature — ignoring');
      return res.status(STATUS_UNAUTHORIZED).json({
        success:    false,
        statusCode: STATUS_UNAUTHORIZED,
        error:      'Invalid webhook signature',
      });
    }

    await paymentService.handleWebhook(req.body);
    res.sendStatus(STATUS_OK);
  } catch (err) {
    console.error('[payment/webhook]', err.message);
    res.sendStatus(STATUS_OK);
  }
}

async function getTransactions(req, res) {
  const { meter } = req.params;
  try {
    const transactions = await paymentService.getRecentTransactions(meter);
    res.json({ meterNumber: meter, transactions });
  } catch (err) {
    console.error('[payment/transactions]', err.message);
    res.status(STATUS_NOT_FOUND).json({ success: false, statusCode: STATUS_NOT_FOUND, error: err.message });
  }
}

module.exports = { initiatePayment, verifyPayment, webhook, getTransactions };