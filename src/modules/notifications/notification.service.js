const db = require('../../db/knex');

// ── Save threshold + auto-recharge settings to DB ─────────────────────────────
async function saveNotificationSettings(meterNumber, { threshold, fcmToken, autoRecharge, autoAmount }) {
  const meter = await db('meters').where({ meter_number: meterNumber }).first();
  if (!meter) throw new Error('Meter not found');

  await db('meters')
    .where({ meter_number: meterNumber })
    .update({
      threshold,
      fcm_token:     fcmToken,
      auto_recharge: autoRecharge,
      auto_amount:   autoAmount,
      updated_at:    db.fn.now(),
    });

  return { success: true };
}

// ── Check which meters are below threshold (uses seeded data) ─────────────────
async function getLowBalanceMeters() {
  const meters = await db('meters')
    .whereRaw('last_balance <= threshold')
    .select('*');

  return meters;
}

// ── Placeholder — Firebase FCM will go here later ─────────────────────────────
async function sendLowUnitsAlert(fcmToken, meterNumber, balance) {
  console.log(`[Notifications] Low units alert — Meter ${meterNumber}: ${balance} units (FCM pending)`);
}

async function sendRechargeSuccess(fcmToken, token, units) {
  console.log(`[Notifications] Recharge success — Token: ${token}, Units: ${units} (FCM pending)`);
}

module.exports = {
  saveNotificationSettings,
  getLowBalanceMeters,
  sendLowUnitsAlert,
  sendRechargeSuccess,
};