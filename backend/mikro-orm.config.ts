import { EntityManager } from '@mikro-orm/core'
import { storage } from 'loaders/asyncStorage'

import {
  Genre,
  Movie,
  Node,
  PlexInstance,
  PlexMediaEntity,
  PlexSectionEntity,
  RadarrFile,
  RadarrInstance,
  Settings,
  User,
} from './entities'
export default {
  entities: [
    Node,
    Movie,
    PlexMediaEntity,
    PlexSectionEntity,
    PlexInstance,
    RadarrFile,
    RadarrInstance,
    Settings,
    Genre,
    User,
  ],
  dbName: 'managrr.db',
  type: 'sqlite' as const,
  context: (): EntityManager | undefined => storage.getStore(),
}
