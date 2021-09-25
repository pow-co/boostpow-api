require('dotenv').config()

import knex from 'knex'

const pg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

export default pg

