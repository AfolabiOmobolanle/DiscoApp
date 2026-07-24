const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging }        = require('firebase-admin/messaging');
const db                      = require('../../db/knex');

const isPlaceholder = (value) => !value || value.startsWith('your_');

const hasFirebaseConfig = !isPlaceholder(process.env.FIREBASE_PROJECT_ID)
  && !isPlaceholder(process.env.FIREBASE_CLIENT_EMAIL)
  && !isPlaceholder(process.env.FIREBASE_PRIVATE_KEY);

let messaging = null;

if (hasFirebaseConfig) {
  const app = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  messaging = getMessaging(app);
} else {
  console.warn('[Firebase] Credentials not set — push notifications are disabled.');
}

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

// ── Firebase Cloud Messaging ──────────────────────────────────────────────────
async function sendLowUnitsAlert(fcmToken, meterNumber, balance) {
  if (!messaging || !fcmToken) return;

  await messaging.send({
    token: fcmToken,
    notification: {
      title: '⚡ Low Units Alert',
      body:  `Meter ${meterNumber} has ${balance} units remaining. Recharge now!`,
    },
    data: { meterNumber, balance: String(balance), type: 'LOW_UNITS' },
  });
}

async function sendRechargeSuccess(fcmToken, token, amount) {
  if (!messaging || !fcmToken) return;

  await messaging.send({
    token: fcmToken,
    notification: {
      title: '✅ Recharge Successful',
      body:  `Token: ${token} — ₦${amount} recharge complete.`,
    },
    data: { token, amount: String(amount), type: 'RECHARGE_SUCCESS' },
  });
}

module.exports = {
  saveNotificationSettings,
  getLowBalanceMeters,
  sendLowUnitsAlert,
  sendRechargeSuccess,
};
