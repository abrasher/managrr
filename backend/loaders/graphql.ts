import { registerEnumType } from 'type-graphql'

import { Availability } from '@/entities/radarr.type'
import { LibraryType } from '@/modules/plexapi'
import { TASK_NAME, TASK_STATUS } from '@/modules/system/system.entity'
import { BlendMode } from '@/modules/system/system.input'

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
