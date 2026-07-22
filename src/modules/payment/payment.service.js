const axios = require('axios');
const db    = require('../../db/knex');

const SP = axios.create({
  baseURL: process.env.SECUREPAY_BASE_URL || 'https://securepay-staging-api.getsecurepay.ai',
  headers: {
    'X-Api-Key':    process.env.SECUREPAY_API_KEY,
    'Content-Type': 'application/json',
  },
});

// ── Initiate payment + save pending transaction ───────────────────────────────
async function initiatePayment(meterNumber, amount) {
  const reference = `WU_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const res = await SP.post('/api/Transfer/initiate/v2', {
    amount,
    currency:  'NGN',
    reference,
    narration: `WattsUp meter recharge — ${meterNumber}`,
    metadata:  { meterNumber },
  });

  // Save pending transaction to DB
  await db('transactions').insert({
    meter_number: meterNumber,
    amount,
    reference,
    status: 'pending',
  });

  return {
    reference,
    paymentLink: res.data.data?.paymentLink || res.data.data?.authorization_url,
    amount,
  };
}

// ── Verify payment via requery ────────────────────────────────────────────────
async function verifyPayment(reference) {
  const res          = await SP.get(`/api/Transfer/requery/${reference}`);
  const { success, data } = res.data;

  if (!success || data?.status !== 'success') {
    await db('transactions').where({ reference }).update({ status: 'failed' });
    throw new Error('Payment not successful');
  }

  // Generate a mock token since BuyPower is not integrated yet
  const token = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

  await db('transactions')
    .where({ reference })
    .update({ status: 'success', token });

  return {
    status:  'success',
    token,
    message: 'Recharge successful',
  };
}

// ── Handle SecurePay webhook ──────────────────────────────────────────────────
async function handleWebhook(event) {
  if (!event || event.success !== true) return;

  const reference = event.data?.reference;
  if (!reference) return;

  const transaction = await db('transactions').where({ reference }).first();
  if (!transaction || transaction.status === 'success') return;

  await db('transactions').where({ reference }).update({ status: 'success' });
}

module.exports = { initiatePayment, verifyPayment, handleWebhook };