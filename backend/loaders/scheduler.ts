import { scheduleJob } from 'node-schedule'

import { generatePosterJob } from '../modules/jobs/GeneratePosterTask'

scheduleJob('generate posters', '0 0 0/3 1/1 * ? *', () => generatePosterJob())
