import { TASK_NAME } from '@/entities'
import { ImportTask } from '@/modules/importer/ImportTask'
import { registerTask } from '@/tasks/BaseTask'
import { ThumbnailTask } from '@/tasks/GeneratePosterTask'
import { RestorePosterTask } from '@/tasks/RestorePosterTask'

export const loadTasks = (): void => {
  registerTask(TASK_NAME.thumbnail_generate, ThumbnailTask)
  registerTask(TASK_NAME.restore_poster, new RestorePosterTask())
  registerTask(TASK_NAME.importer, ImportTask)
}
