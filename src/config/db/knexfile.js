require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
module.exports = {
   development: {
    client: 'postgresql',
    connection: {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: '../../../migrations',
      tableName:  'knex_migrations',
    },
    seeds: {
      directory: '../../../seeds',
    },
    pool: { min: 2, max: 10 },
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: '../../../migrations',
      tableName:  'knex_migrations',
    },
    seeds: {
      directory: '../../../seeds',
    },
    pool: { min: 2, max: 10 },
  },
};