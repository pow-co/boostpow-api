
const winston = require('winston');

import config from './config'

const transports = [
  new winston.transports.Console({
    level: 'info'
  }),
]

if (config.get('loki_host')) {

  const LokiTransport = require("winston-loki");

  const lokiConfig = {
    format: winston.format.json(),
    host: config.get('loki_host'),
    json: true,
    batching: false,
    labels: { app: config.get('loki_label_app') }
  }

  if (config.get('loki_basic_auth')) {

    lokiConfig['basicAuth'] = config.get('loki_basic_auth')
  }

  transports.push(
    new LokiTransport(lokiConfig)
  )

}

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'boostpow' },
  transports
});

export { log }
