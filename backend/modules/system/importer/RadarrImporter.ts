import { Merge } from 'type-fest'

import { getORM } from '@/backend/loaders/database'

import { LibraryType } from '../../externalAPI/plex'
import { IRadarrMovie, IRadarrMovieFile } from '../../externalAPI/radarr/radarr.interface'
import { RadarrAPI } from '../../externalAPI/radarr/RadarrAPI'
import { RadarrInstance } from '../settings.entity'
import { ImporterAgent, MediaUID, MetadataMap } from './importer.interface'
import { KeyedCollection } from './KeyedCollection'

export type RadarrMovieFileMetadata = Omit<IRadarrMovieFile, 'quality' | 'mediaInfo'> & {
  quality: string
}

export type RadarrMetadata = Merge<
  IRadarrMovie,
  {
    instanceId: string
    movieFile: RadarrMovieFileMetadata
  }
>

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

  private transformResult(movie: IRadarrMovie, instanceId: string): RadarrMetadata {
    return {
      ...movie,
      instanceId,
      movieFile: {
        ...movie.movieFile,
        quality: movie.movieFile.quality.quality.name,
      },
    }
  }

  private async getRadarrMedia(): Promise<RadarrMetadata[]> {
    if (this._radarrMedia) {
      return this._radarrMedia
    }

    const orm = await getORM()
    const em = orm.em.fork()

    const radarrInstances = await em.find(RadarrInstance, {})

    const movies = await Promise.all(
      radarrInstances.flatMap(async ({ url, apiKey, id: instanceId }) => {
        const api = new RadarrAPI(url, apiKey)

        const movies = await api.getMovies()

        return movies.flatMap((movie) => this.transformResult(movie, instanceId))
      })
    )

    return movies.flat()
  }
}
