require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'medmap_user',
      password: process.env.DB_PASSWORD || 'medmap_secure_password_123',
      database: process.env.DB_NAME || 'medmap_db',
    },
    pool: { min: 2, max: 10 },
    migrations: { directory: './src/db/migrations', extension: 'js' },
    seeds: { directory: './src/db/seeds', extension: 'js' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 5, max: 20 },
    migrations: { directory: './src/db/migrations', extension: 'js' },
    seeds: { directory: './src/db/seeds', extension: 'js' },
  },
};
