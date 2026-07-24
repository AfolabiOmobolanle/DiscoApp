require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const meterRoutes        = require('./src/modules/meter/meter.routes');
const paymentRoutes      = require('./src/modules/payment/payment.routes');
const notificationRoutes = require('./src/modules/notifications/notifications.routes');
const errorHandler       = require('./src/middleware/errorhandler');

require('./src/jobs/balancePoller'); // starts cron on server boot

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; },
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/meter',         meterRoutes);
app.use('/api/payment',       paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
// Judges / frontend can hit this to confirm server is live
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'WattsUp ⚡' });
});

// ── Dev: manual cron trigger ──────────────────────────────────────────────────
// Hit this during demo to simulate the 2-hour poller firing live
app.post('/dev/trigger-poll', async (req, res) => {
  try {
    await require('./src/jobs/balancePoller').runOnce();
    res.json({ triggered: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Error handler (must be registered last) ───────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`⚡ WattsUp backend running on port ${PORT}`);
});
