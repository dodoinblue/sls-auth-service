'use strict';
const path = require('path'); // eslint-disable-line
const { knexSnakeCaseMappers } = require('objection'); // eslint-disable-line


const MIGRATION_DIR = path.resolve('migrations');
const SEED_DIR = path.resolve('seeds');

const MIGRATION_TABLE_NAME = 'migrations';

const dbConfig = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
  },
  useNullAsDefault: true,
  pool: {
    min: 1,
    max: 10
  },
  migrations: {
    directory: MIGRATION_DIR,
    tableName: MIGRATION_TABLE_NAME
  },
  acquireConnectionTimeout: 10 * 1000,
  debug: true,
  ...knexSnakeCaseMappers()
};

module.exports = dbConfig;
