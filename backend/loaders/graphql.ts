import { registerEnumType } from 'type-graphql'

import { LibraryType } from '../modules/externalAPI/plex'
import { TASK_NAME, TASK_STATUS } from '../modules/system/system.entity'
import { BlendMode } from '../modules/system/system.input'

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
