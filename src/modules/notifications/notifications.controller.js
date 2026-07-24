const notificationsService = require('./notification.service');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../../utils/statuscodes');

async function setThreshold(req, res) {
  const { meterNumber, threshold, fcmToken, autoRecharge, autoAmount } = req.body;

  if (!meterNumber || threshold === undefined || !fcmToken) {
    return res.status(STATUS_BAD_REQUEST).json({
      success:    false,
      statusCode: STATUS_BAD_REQUEST,
      error:      'meterNumber, threshold and fcmToken are required',
    });
  }

  try {
    const data = await notificationsService.saveNotificationSettings(meterNumber, {
      threshold,
      fcmToken,
      autoRecharge,
      autoAmount,
    });
    res.json(data);
  } catch (err) {
    console.error('[notifications/threshold]', err.message);
    const status = err.message === 'Meter not found' ? STATUS_NOT_FOUND : STATUS_INTERNAL_SERVER_ERROR;
    res.status(status).json({ success: false, statusCode: status, error: err.message });
  }
}

module.exports = { setThreshold };