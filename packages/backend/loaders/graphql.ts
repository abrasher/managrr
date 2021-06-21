import { registerEnumType } from 'type-graphql'

import { Availability } from '@/backend/entities/radarr.type'
import { LibraryType } from '@/backend/modules/plexapi'
import { TASK_NAME, TASK_STATUS } from '@/backend/modules/system/system.entity'
import { BlendMode } from '@/backend/modules/system/system.input'

export const registerEnums = (): void => {
  registerEnumType(LibraryType, {
    name: 'LibraryType',
  })

  registerEnumType(Availability, {
    name: 'RadarrAvailability',
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
