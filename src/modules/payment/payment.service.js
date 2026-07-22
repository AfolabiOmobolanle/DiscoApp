const axios = require('axios');
const db    = require('../../db/knex');
 
const PS = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});
 
const BP = axios.create({
  baseURL: process.env.BUYPOWER_API_URL,
  headers: { Authorization: `Bearer ${process.env.BUYPOWER_API_TOKEN}` },
});
 
// ── Initiate Paystack payment + save pending transaction ──────────────────────
async function initiatePayment(meterNumber, amount) {
  const reference = `WU_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
 
  const res = await PS.post('/transaction/initialize', {
    email:    `${meterNumber}@wattsup.ng`,
    amount:   amount * 100,               // kobo
    reference,
    currency: 'NGN',
    metadata: { meterNumber },
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
    authorizationUrl: res.data.data.authorization_url,
    amount,
  };
}
 
async function verifyPayment(reference) {
  const res    = await PS.get(`/transaction/verify/${reference}`);
  const { status, metadata, amount } = res.data.data;
 
  if (status !== 'success') {
    await db('transactions').where({ reference }).update({ status: 'failed' });
    throw new Error('Payment not successful');
  }
 
  const bp = await BP.post('/prepaid/vend', {
    meter:    metadata.meterNumber,
    amount:   amount,                     // already in kobo from Paystack
    vendType: 'PREPAID',
    reference,
  });
 
  // Update transaction to success with token
  await db('transactions')
    .where({ reference })
    .update({ status: 'success', token: bp.data.token });
 
  return {
    status: 'success',
    token:   bp.data.token,
    message: bp.data.message,
  };
}
 
// ── Handle Paystack webhook ───────────────────────────────────────────────────
async function handleWebhook(event) {
  if (event.event !== 'charge.success') return;
 
  const { reference } = event.data;
 
  const transaction = await db('transactions').where({ reference }).first();
  if (!transaction || transaction.status === 'success') return;
 
  await db('transactions').where({ reference }).update({ status: 'success' });
}
 
module.exports = { initiatePayment, verifyPayment, handleWebhook };
 

