import {
  Genre,
  Movie,
  PlexInstance,
  PlexMediaEntity,
  PlexSectionEntity,
  RadarrFile,
  RadarrInstance,
  Settings,
} from './entities'
export default {
  entities: [Movie, PlexMediaEntity, PlexSectionEntity, PlexInstance, RadarrFile, RadarrInstance, Settings, Genre],
  dbName: 'managrr.db',
  type: 'sqlite' as const,
}
