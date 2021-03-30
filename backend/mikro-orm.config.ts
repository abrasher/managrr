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
    Movie,
    PlexMediaEntity,
    PlexSectionEntity,
    PlexInstance,
    RadarrFile,
    RadarrInstance,
    Settings,
    Genre,
    User,
    Node,
  ],
  dbName: 'managrr.db',
  type: 'sqlite' as const,
}
