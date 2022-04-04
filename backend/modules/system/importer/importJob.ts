import { getORM } from '@/loaders/database'

import { Media } from '../../library/media.entity'
import { Settings } from '../settings.entity'
import { BaseMetadata, ImporterAgent, MediaUID } from './importer.interface'
import { OMDbMetadataAgent } from './OMDbMetadata'
import { PlexImporter } from './PlexImporter'
import { RadarrImporter } from './RadarrImporter'
import { TMDbMetadataAgent } from './TMDbMetadata'

class ImportTaskClass {
  async run(recentlyAdded = false) {
    const orm = await getORM()
    const em = orm.em.fork()

    const settings = await orm.em.findOneOrFail(Settings, { id: 'main' })
    const plexImporter = new PlexImporter(recentlyAdded)
    const radarrImporter = new RadarrImporter()

    const tmdbMetadata = new TMDbMetadataAgent(settings.tmdbKey)
    const omdbMetadata = new OMDbMetadataAgent(settings.omdbKey)

    const importers: ImporterAgent[] = [plexImporter, radarrImporter]

    const plexMedia = await plexImporter.getMedia()
    const radarrMedia = await radarrImporter.getMedia()

    const media = new Map<MediaUID, BaseMetadata>()

    const mediaArray = [...media]

    const mediaData = await Promise.all(
      mediaArray.slice(0, 2).flatMap(async ([imdbId, { title, year, type }]) => {
        const metadata = {
          plexMetadata: await plexImporter.getMetadata(imdbId),
          radarrMetadata: await radarrImporter.getMetadata(imdbId),
          omdbMetadata: await omdbMetadata.getMetadata(imdbId),j
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
            plexMetadata: plexMetadata,
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
              plexMetadata: plexMetadata,
              tmdbMetadata,
              omdbMetadata,
            })
          )
        }
      })
    )

    await em.flush()
  }
}

export const ImportTask = new ImportTaskClass()
