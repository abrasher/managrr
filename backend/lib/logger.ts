import { appendFileSync } from 'fs'
import { ILogObject, Logger } from 'tslog'

const logToFile = (logObject: ILogObject) => {
  appendFileSync('log.txt', JSON.stringify(logObject) + '\n')
}

const logger = new Logger({ type: 'pretty' })

logger.attachTransport(
  {
    debug: logToFile,
    error: logToFile,
    fatal: logToFile,
    info: logToFile,
    silly: logToFile,
    trace: logToFile,
    warn: logToFile,
  },
  'warn'
)

export { logger }
