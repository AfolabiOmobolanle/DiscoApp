const axios = require('axios');
const db    = require('../../db/knex');
const { sendRechargeSuccess } = require('../notifications/notification.service');

const PS = axios.create({
  baseURL: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
  headers: {
    Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// ── Initiate payment + save pending transaction ───────────────────────────────
async function initiatePayment(meterNumber, amount) {
  const reference = `WU_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const res = await PS.post('/transaction/initialize', {
    email:        `${meterNumber}@wattsup.ng`,
    amount:       amount * 100, // Paystack expects kobo
    reference,
    currency:     'NGN',
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
    metadata:     { meterNumber },
  });

  if (!res.data?.status) {
    throw new Error(res.data?.message || 'Failed to initialize payment');
  }

  // Save pending transaction to DB
  await db('transactions').insert({
    meter_number: meterNumber,
    amount,
    reference,
    status: 'pending',
  });

  return {
    reference,
    authorizationUrl: res.data.data?.authorization_url,
    amount,
  };
}

// ── Verify payment ─────────────────────────────────────────────────────────────
async function verifyPayment(reference) {
  const res = await PS.get(`/transaction/verify/${reference}`);
  const { status, data, message } = res.data;

  if (!status || data?.status !== 'success') {
    await db('transactions').where({ reference }).update({ status: 'failed' });
    throw new Error(message || 'Payment not successful');
  }

  // Generate a mock token since BuyPower is not integrated yet
  const token = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

  await db('transactions')
    .where({ reference })
    .update({ status: 'success', token });

  const transaction = await db('transactions').where({ reference }).first();
  const meter = await db('meters').where({ meter_number: transaction.meter_number }).first();
  if (meter?.fcm_token) {
    await sendRechargeSuccess(meter.fcm_token, token, transaction.amount).catch((err) => {
      console.error('[Payment] FCM send failed:', err.message);
    });
  }

  return {
    status:  'success',
    token,
    message: 'Recharge successful',
  };
}

// ── Handle Paystack webhook (signature verified in controller) ────────────────
async function handleWebhook(event) {
  if (!event || event.event !== 'charge.success') return;

  const reference = event.data?.reference;
  if (!reference) return;

  const transaction = await db('transactions').where({ reference }).first();
  if (!transaction || transaction.status === 'success') return;

  await verifyPayment(reference).catch((err) => {
    console.error('[Payment] webhook verify failed:', err.message);
  });
}

// ── Recent transactions for a meter ───────────────────────────────────────────
async function getRecentTransactions(meterNumber, limit = 20) {
  const meter = await db('meters').where({ meter_number: meterNumber }).first();
  if (!meter) throw new Error('Meter not found');

  return db('transactions')
    .where({ meter_number: meterNumber })
    .orderBy('created_at', 'desc')
    .limit(limit);
}

module.exports = { initiatePayment, verifyPayment, handleWebhook, getRecentTransactions };
