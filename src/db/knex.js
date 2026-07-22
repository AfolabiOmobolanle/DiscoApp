const knex   = require('knex');
const config = require('../config/db/knexfile');

const env = process.env.NODE_ENV || 'development';

const db = knex(config[env]);

module.exports = db;
