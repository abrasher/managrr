import {
  Genre,
  Movie,
  PlexMediaEntity,
  PlexSectionEntity,
  PlexSettings,
  RadarrFile,
  RadarrInstance,
  Settings,
} from './entities'
export default {
  entities: [
    Movie,
    PlexMediaEntity,
    PlexSectionEntity,
    PlexSettings,
    RadarrFile,
    RadarrInstance,
    Settings,
    Genre,
  ],
  dbName: 'managrr.db',
  type: 'sqlite' as const,
}
