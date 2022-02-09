import { EntityManager, Options } from '@mikro-orm/core'

import { storage } from '@/backend/loaders/asyncStorage'

const defineConfig = (config: Options) => config

// import {
//   Genre,
//   Movie,
//   Node,
//   PlexInstance,
//   PlexMediaEntity,
//   PlexSectionEntity,
//   RadarrFile,
//   RadarrInstance,
//   // Rating,
//   Settings,
//   User,
// } from './entities'
export default defineConfig({
  // entities: [
  //   Node,
  //   Movie,
  //   PlexMediaEntity,
  //   PlexSectionEntity,
  //   PlexInstance,
  //   RadarrFile,
  //   // Rating,
  //   RadarrInstance,
  //   Settings,
  //   Genre,
  //   User,
  // ],
  entities: ['./**/*.entity.ts'],
  entitiesTs: ['./**/*.entity.ts'],
  dbName: 'config/managrr.db',
  type: 'sqlite' as const,
  context: (): EntityManager | undefined => storage.getStore(),
})
