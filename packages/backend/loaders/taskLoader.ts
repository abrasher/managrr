import { TASK_NAME } from '@/backend/entities'
import { ImportTask } from '@/backend/modules/importer/ImportTask'
import { registerTask } from '@/backend/tasks/BaseTask'
import { ThumbnailTask } from '@/backend/tasks/GeneratePosterTask'
import { RestorePosterTask } from '@/backend/tasks/RestorePosterTask'

export const loadTasks = (): void => {
  registerTask(TASK_NAME.thumbnail_generate, ThumbnailTask)
  registerTask(TASK_NAME.restore_poster, new RestorePosterTask())
  registerTask(TASK_NAME.importer, ImportTask)
}
