require('dotenv').config();

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
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
};
