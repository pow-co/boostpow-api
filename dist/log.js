"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const winston = require('winston');
const log = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'proofofwork' },
    transports: [
        new winston.transports.Console(),
    ],
});
exports.log = log;
//# sourceMappingURL=log.js.map