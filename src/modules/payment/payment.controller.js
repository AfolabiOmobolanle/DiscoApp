const paymentService = require('./payment.service');

async function initiatePayment(req, res) {
  const { meterNumber, amount } = req.body;
  if (!meterNumber || !amount) {
    return res.status(400).json({ error: 'meterNumber and amount are required' });
  }
  try {
    const data = await paymentService.initiatePayment(meterNumber, amount);
    res.json(data);
  } catch (err) {
    console.error('[payment/initiate]', err.message);
    res.status(500).json({ error: 'Could not initiate payment' });
  }
}

async function verifyPayment(req, res) {
  const { ref } = req.params;
  try {
    const data = await paymentService.verifyPayment(ref);
    res.json(data);
  } catch (err) {
    console.error('[payment/verify]', err.message);
    res.status(400).json({ error: err.message });
  }
}

async function webhook(req, res) {
  try {
    await paymentService.handleWebhook(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('[payment/webhook]', err.message);
    res.sendStatus(200);
  }
}

module.exports = { initiatePayment, verifyPayment, webhook };