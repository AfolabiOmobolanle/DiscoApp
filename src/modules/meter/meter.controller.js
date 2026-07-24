const meterService = require('./meter.service');
const { SUPPORTED_DISCOS, METER_NUMBER_LENGTH } = meterService;
const { STATUS_BAD_REQUEST, STATUS_NOT_FOUND } = require('../../utils/statuscodes');

async function validateMeter(req, res) {
  const { meterNumber } = req.body;
  let { disco } = req.body;

  if (!meterNumber) {
    return res.status(STATUS_BAD_REQUEST).json({ success: false, statusCode: STATUS_BAD_REQUEST, error: 'meterNumber is required' });
  }

  if (String(meterNumber).length < METER_NUMBER_LENGTH) {
    return res.status(STATUS_BAD_REQUEST).json({ success: false, statusCode: STATUS_BAD_REQUEST, error: 'Meter number incomplete' });
  }

  if (disco) {
    disco = String(disco).toUpperCase();
    if (!SUPPORTED_DISCOS.includes(disco)) {
      return res.status(STATUS_BAD_REQUEST).json({
        success:    false,
        statusCode: STATUS_BAD_REQUEST,
        error:      `disco must be one of: ${SUPPORTED_DISCOS.join(', ')}`,
      });
    }
  } else {
    disco = undefined;
  }

  try {
    const data = await meterService.validateMeter(meterNumber, disco);
    res.json(data);
  } catch (err) {
    console.error('[meter/validate]', err.message);
    res.status(STATUS_NOT_FOUND).json({ success: false, statusCode: STATUS_NOT_FOUND, error: err.message });
  }
}

async function getMeterDashboard(req, res) {
  const { meter } = req.params;

  if (String(meter).length < METER_NUMBER_LENGTH) {
    return res.status(STATUS_BAD_REQUEST).json({ success: false, statusCode: STATUS_BAD_REQUEST, error: 'Meter number incomplete' });
  }

  try {
    const data = await meterService.getMeterDashboard(meter);
    res.json(data);
  } catch (err) {
    console.error('[meter/dashboard]', err.message);
    res.status(STATUS_NOT_FOUND).json({ success: false, statusCode: STATUS_NOT_FOUND, error: 'Meter not found' });
  }
}

module.exports = { validateMeter, getMeterDashboard };
 

