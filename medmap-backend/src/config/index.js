require('dotenv').config();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createOriginPattern(origin) {
  if (!origin.includes('*')) {
    return null;
  }

  const pattern = '^' + origin.split('*').map(escapeRegex).join('.*') + '$';
  return new RegExp(pattern);
}

const defaultCorsOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
];

const devForwardedCorsOrigins = [
  'https://*.app.github.dev',
  'https://*.github.dev',
];

const configuredCorsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = Array.from(
  new Set([
    ...defaultCorsOrigins,
    ...(process.env.NODE_ENV === 'production' ? [] : devForwardedCorsOrigins),
    ...configuredCorsOrigins,
  ])
);

const corsOriginPatterns = corsOrigins
  .map((origin) => createOriginPattern(origin))
  .filter(Boolean);

function isCorsOriginAllowed(origin) {
  return (
    corsOrigins.includes(origin) ||
    corsOriginPatterns.some((pattern) => pattern.test(origin))
  );
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Server
  restPort: parseInt(process.env.REST_PORT || '3000', 10),
  wsPort: parseInt(process.env.WS_PORT || '3002', 10),
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'medmap_db',
    user: process.env.DB_USER || 'medmap_user',
    password: process.env.DB_PASSWORD || 'medmap_secure_password_123',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key',
    expiresIn: process.env.JWT_EXPIRY || '24h',
  },
  
  // OpenRouteService
  ors: {
    apiKey: process.env.ORS_API_KEY || '',
    baseUrl: process.env.ORS_BASE_URL || 'https://api.openrouteservice.org',
  },
  
  // IPFS (Infura)
  ipfs: {
    projectId: process.env.IPFS_PROJECT_ID || '',
    projectSecret: process.env.IPFS_PROJECT_SECRET || '',
    gateway: process.env.IPFS_GATEWAY || 'https://gateway.ipfs.io',
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // CORS
  corsOrigin: corsOrigins,
  isCorsOriginAllowed,
};
