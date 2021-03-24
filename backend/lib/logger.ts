import 'winston-daily-rotate-file'

import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'managrr.%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '7d',
      dirname: 'logs',
      level: 'info',
    }),
  ],
})

export { logger }
