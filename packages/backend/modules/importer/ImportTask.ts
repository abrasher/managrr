import { Settings, TASK_NAME } from '@/backend/entities'
import { getOrm } from '@/backend/loaders/database'
import { BaseTask } from '@/backend/tasks/BaseTask'

import { Media } from '../media/media.entity'
import { BaseMetadata, ImporterAgent, MediaUID } from './importer.interface'
import { OMDbMetadataAgent } from './OMDbMetadata'
import { PlexImporter } from './PlexImporter'
import { RadarrImporter } from './RadarrImporter'
import { TMDbMetadataAgent } from './TMDbMetadata'

class ImportTaskClass extends BaseTask {
  constructor() {
    super(TASK_NAME.importer)
  }

  async run() {
    const orm = await getOrm()
    const em = orm.em.fork()

    const settings = await orm.em.findOneOrFail(Settings, { id: 'main' })
    const plexImporter = new PlexImporter()
    const radarrImporter = new RadarrImporter()

    const tmdbMetadata = new TMDbMetadataAgent(settings.tmdbKey)
    const omdbMetadata = new OMDbMetadataAgent(settings.omdbKey)

    const importers: ImporterAgent[] = [plexImporter, radarrImporter]

    this.logger.debug('Importing Media')
    const mediaMaps = await Promise.all(importers.map((i) => i.getMedia()))

    const media = new Map<MediaUID, BaseMetadata>()

    mediaMaps.forEach((map) =>
      map.forEach((value, key) => {
        media.set(key, value)
      })
    )

    const mediaArray = [...media]

    const mediaData = await Promise.all(
      mediaArray.slice(0, 2).flatMap(async ([imdbId, { title, year, type }]) => {
        const metadata = {
          plexMetadata: await plexImporter.getMetadata(imdbId),
          radarrMetadata: await radarrImporter.getMetadata(imdbId),
          omdbMetadata: await omdbMetadata.getMetadata(imdbId),
          tmdbMetadata: await tmdbMetadata.getMetadata(imdbId),
        }

        return {
          title,
          year,
          type,
          imdbId,
          metadata,
        }
      })
    )

    await Promise.all(
      mediaData.map(async ({ imdbId, title, type, year, metadata }) => {
        const entity = await em.findOne(Media, { imdbId })
        const { radarrMetadata, plexMetadata, tmdbMetadata, omdbMetadata } = metadata

        if (entity) {
          entity.assign({
            radarrMetadata,
            plexMetadata,
            tmdbMetadata,
            omdbMetadata,
          })
        } else {
          em.persist(
            em.create(Media, {
              imdbId,
              title,
              type,
              year,
              radarrMetadata,
              plexMetadata,
              tmdbMetadata,
              omdbMetadata,
            })
          )
        }
      })
    )

    await em.flush()

    this.logger.debug(await em.find(Media, {}))
  }
}

export const ImportTask = new ImportTaskClass()
