import { Logger } from 'tslog'

import { logger } from '@/lib/logger'
import { TASK_NAME, TASK_STATUS } from '@/modules/system/system.entity'

export abstract class BaseTask {
  constructor(private taskName: TASK_NAME) {
    this.logger = logger.getChildLogger({
      name: taskName,
    })
  }

  async startTask(): Promise<void> {
    if (this.status === TASK_STATUS.running) {
      // TODO notify task already running
    }

    this.status = TASK_STATUS.running
    this.logger.info(`Starting ${this.taskName}`)
    try {
      await this.run()

      this.status = TASK_STATUS.finished

      this.logger.info(`Completed ${this.taskName}`)
    } catch (error) {
      this.status = TASK_STATUS.errored
      this.logger.error(`Error Occurred during ${this.taskName}`, error)
    }
  }

  logger: Logger

  protected abstract run(): Promise<void> | void

  status: TASK_STATUS = TASK_STATUS.not_started
  completed!: number
  started!: number
  errors: Error[] | null = null
}

const TASK_MAP = new Map<TASK_NAME, BaseTask>()

export const registerTask = (name: TASK_NAME, task: BaseTask): void => void TASK_MAP.set(name, task)

export const startTask = (name: TASK_NAME): void => {
  const task = TASK_MAP.get(name)

  if (!task) {
    logger.error(`Managrr: No Such Task ${name}`)
    return
  }

  void task.startTask()
}

export const getTask = (name: TASK_NAME): BaseTask => TASK_MAP.get(name) as BaseTask
export const getTasks = (): typeof TASK_MAP => TASK_MAP
