const db = require('../../db/knex');

const SUPPORTED_DISCOS = ['IKEDC', 'EKEDC'];
const METER_NUMBER_LENGTH = 11;

async function validateMeter(meterNumber, disco) {
  const query = db('meters').where({ meter_number: meterNumber });
  if (disco) query.andWhere({ disco });

  const meter = await query.first();

  if (!meter) {
    throw new Error(disco ? `Meter not found under ${disco}` : 'Meter not found');
  }

  return {
    disco:        meter.disco,
    customerName: meter.customer_name,
    address:      meter.address,
    status:       'active',
  };
}
 
async function getMeterDashboard(meterNumber) {
  const meter = await db('meters').where({ meter_number: meterNumber }).first();

  if (!meter) throw new Error('Meter not found');

  const stats = await db('transactions')
    .where({ meter_number: meterNumber, status: 'success' })
    .sum({ totalAmountSpent: 'amount' })
    .count({ totalTokensIssued: 'id' })
    .first();

  return {
    meterNumber:       meter.meter_number,
    customerName:      meter.customer_name,
    address:           meter.address,
    balance:           meter.last_balance,
    readingUnits:      meter.last_balance,
    totalAmountSpent:  Number(stats.totalAmountSpent) || 0,
    totalTokensIssued: Number(stats.totalTokensIssued) || 0,
    lastUpdated:       meter.updated_at,
  };
}

module.exports = { validateMeter, getMeterDashboard, SUPPORTED_DISCOS, METER_NUMBER_LENGTH };
 

