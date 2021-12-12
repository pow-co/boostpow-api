require('dotenv').config()

import knex from 'knex'

const pg = knex({
  client: 'pg',
  connection: getConnectionUrl()
});

export default pg

function getConnectionUrl() {

  switch(process.env.NODE_ENV) {
    case 'development':
      return process.env.DEV_DATABASE_URL
    case 'test':
      return process.env.TEST_DATABASE_URL
    case 'production':
      return process.env.DATABASE_URL
    default:
      return process.env.DATABASE_URL
  }

}

