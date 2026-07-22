const cron = require('node-cron');
const db   = require('../db/knex');

// Runs every 2 hours
cron.schedule('*/5 * * * *', async () => {
      console.log('[Poller] Running balance check...');

  try {
    const meters = await db('meters').select('*');

    for (const meter of meters) {
      // Using seeded last_balance from DB
      if (meter.last_balance <= meter.threshold && meter.fcm_token) {
        console.log(`[Poller] Low balance alert — Meter ${meter.meter_number}: ${meter.last_balance} units`);
        // Firebase FCM call will go here later
      }
    }

    console.log(`[Poller] Checked ${meters.length} meters.`);
  } catch (err) {
    console.error('[Poller] Error:', err.message);
  }
});

// Manual trigger for demo/testing — hit POST /dev/trigger-poll
async function runOnce() {
  const meters = await db('meters').select('*');

  let alertCount = 0;
  for (const meter of meters) {
    if (meter.last_balance <= meter.threshold) {
      alertCount++;
      console.log(`[Poller] ⚠️  Low balance — Meter ${meter.meter_number} (${meter.disco}): ${meter.last_balance} units`);
    }
  }

  console.log(`[Poller] Done — ${meters.length} meters checked, ${alertCount} low balance alerts.`);
}

module.exports = { runOnce };