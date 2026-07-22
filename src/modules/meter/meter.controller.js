const meterService = require('./meter.service');
 
async function validateMeter(req, res) {
  const { meterNumber } = req.body;
 
  if (!meterNumber) {
    return res.status(400).json({ error: 'meterNumber is required' });
  }
 
  try {
    const data = await meterService.validateMeter(meterNumber);
    res.json(data);
  } catch (err) {
    console.error('[meter/validate]', err.message);
    res.status(404).json({ error: 'Meter not found' });
  }
}
 
async function getMeterBalance(req, res) {
  const { meter } = req.params;
 
  try {
    const data = await meterService.getMeterBalance(meter);
    res.json(data);
  } catch (err) {
    console.error('[meter/balance]', err.message);
    res.status(404).json({ error: 'Meter not found' });
  }
}
 
module.exports = { validateMeter, getMeterBalance };
 

