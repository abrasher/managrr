import { registerEnumType } from 'type-graphql'

import { LibraryType } from '@/backend/modules/externalAPI/plex'
import { TASK_NAME, TASK_STATUS } from '@/backend/modules/system/system.entity'
import { BlendMode } from '@/backend/modules/system/system.input'

export const registerEnums = (): void => {
  registerEnumType(LibraryType, {
    name: 'LibraryType',
  })

  registerEnumType(TASK_STATUS, {
    name: 'TaskStatus',
  })

  registerEnumType(TASK_NAME, {
    name: 'TaskName',
  })

  registerEnumType(BlendMode, {
    name: 'BlendMode',
  })
}
