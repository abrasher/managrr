import { RadarrInstance } from '@/backend/entities'
import { getOrm } from '@/backend/loaders/database'

import { LibraryType } from '../plexapi'
import { RadarrMovie } from '../radarr/radarr.interface'
import { RadarrAPI } from '../radarr/RadarrAPI'
import { ImporterAgent, MediaUID, MetadataMap } from './importer.interface'
import { KeyedCollection } from './KeyedCollection'

export type RadarrMetadata = RadarrMovie & {
  instance: {
    id: string
  }
}

export class RadarrImporter implements ImporterAgent {
  readonly agentName = 'radarr'

  _radarrMedia: RadarrMetadata[] | null
  _metadataMap?: KeyedCollection<MediaUID, RadarrMetadata>

  constructor() {
    this._radarrMedia = null
  }

  async getMedia(): Promise<MetadataMap> {
    const media = await this.getRadarrMedia()

    const mediaMap: MetadataMap = new Map()

    media.forEach(({ imdbId, title, year }) =>
      mediaMap.set(imdbId, {
        title,
        year,
        imdbId,
        type: LibraryType.MOVIE,
      })
    )

    return mediaMap
  }

  private async getMetadataMap(): Promise<KeyedCollection<MediaUID, RadarrMetadata>> {
    if (this._metadataMap) {
      return this._metadataMap
    }

    const media = await this.getRadarrMedia()
    const metadata = new KeyedCollection<MediaUID, RadarrMetadata>()

    media.forEach((movie) => metadata.add(movie.imdbId, movie))

    this._metadataMap = metadata
    return metadata
  }

  async getMetadata(imdbId: string): Promise<RadarrMetadata[]> {
    const metadataMap = await this.getMetadataMap()

    return metadataMap.get(imdbId)
  }

  private async getRadarrMedia(): Promise<RadarrMetadata[]> {
    if (this._radarrMedia) {
      return this._radarrMedia
    }

    const orm = await getOrm()
    const em = orm.em.fork()

    const radarrInstances = await em.find(RadarrInstance, {})

    const movies = await Promise.all(
      radarrInstances.flatMap(async ({ url, apiKey, id }) => {
        const api = new RadarrAPI(url, apiKey)

        const movies = await api.getMovies()

        return movies.flatMap((movie) => ({ ...movie, instance: { id } }))
      })
    )

    return movies.flat()
  }
}
