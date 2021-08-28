
const winston = require('winston');

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'proofofwork' },
  transports: [
    new winston.transports.Console(),
  ],
});

export { log }
