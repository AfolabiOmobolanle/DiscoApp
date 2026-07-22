const db = require('../../db/knex');
 
async function validateMeter(meterNumber) {
  const meter = await db('meters').where({ meter_number: meterNumber }).first();
 
  if (!meter) throw new Error('Meter not found');
 
  return {
    disco:        meter.disco,
    customerName: meter.customer_name,
    address:      meter.address,
    status:       'active',
  };
}
 
async function getMeterBalance(meterNumber) {
  const meter = await db('meters').where({ meter_number: meterNumber }).first();
 
  if (!meter) throw new Error('Meter not found');
 
  return {
    meterNumber: meter.meter_number,
    balance:     meter.last_balance,
    lastUpdated: meter.updated_at,
  };
}
 
module.exports = { validateMeter, getMeterBalance };
 

