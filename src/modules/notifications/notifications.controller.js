const notificationsService = require('./notifications.service');

async function setThreshold(req, res) {
  const { meterNumber, threshold, fcmToken, autoRecharge, autoAmount } = req.body;

  if (!meterNumber || threshold === undefined || !fcmToken) {
    return res.status(400).json({ error: 'meterNumber, threshold and fcmToken are required' });
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
    res.status(500).json({ error: err.message });
  }
}

module.exports = { setThreshold };