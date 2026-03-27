require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const waitTimesRoutes = require('./routes/waitTimes');
const mobileUnitsRoutes = require('./routes/mobileUnits');
const routingRoutes = require('./routes/routing');

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header (curl, server-to-server, mobile apps).
      if (!origin) {
        callback(null, true);
        return;
      }

      if (config.isCorsOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'medmap-backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/facilities', facilitiesRoutes);
app.use('/api/v1/wait-times', waitTimesRoutes);
app.use('/api/v1/mobile-units', mobileUnitsRoutes);
app.use('/api/v1/routing', routingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.restPort;
app.listen(PORT, () => {
  console.log(`\n✅ MedMap Backend REST API running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`🏥 API Docs: http://localhost:${PORT}/api/v1`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
