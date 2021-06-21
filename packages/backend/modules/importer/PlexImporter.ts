import pLimit from 'p-limit'

import { PlexInstance } from '@/backend/entities'
import { getOrm } from '@/backend/loaders/database'

import { PlexServer } from '../plexapi'
import { IPlexMediaMetadata } from '../plexapi/PlexMedia'
import { ImporterAgent, MediaUID, MetadataMap } from './importer.interface'
import { KeyedCollection } from './KeyedCollection'

export type PlexMetadata = IPlexMediaMetadata & IMediaIds

type IMediaIds = {
  imdbId?: string
  tmdbId?: number
  tvdbId?: string
}

export class PlexImporter implements ImporterAgent {
  readonly agentName = 'plex'

  _plexMedia: PlexMetadata[] | null
  _metadata?: KeyedCollection<MediaUID, PlexMetadata>

  constructor() {
    this._plexMedia = null
  }

  async getMedia(): Promise<MetadataMap> {
    const media = await this.getPlexMedia()

    const mediaMap: MetadataMap = new Map()

    media.forEach(({ imdbId, title, year, type }) => {
      imdbId && mediaMap.set(imdbId, { title, year, type, imdbId })
    })

    return mediaMap
  }

  private async getMap(): Promise<KeyedCollection<MediaUID, PlexMetadata>> {
    if (this._metadata) {
      return this._metadata
    }

    const media = await this.getPlexMedia()
    const metadata = new KeyedCollection<MediaUID, PlexMetadata>()

    media.forEach((item) => item.imdbId && metadata.add(item.imdbId, item))

    this._metadata = metadata
    return metadata
  }

  async getMetadata(imdbId: string): Promise<PlexMetadata[]> {
    const metadata = await this.getMap()
    return metadata.get(imdbId)
  }

  private async getPlexMedia(): Promise<PlexMetadata[]> {
    if (this._plexMedia) {
      return this._plexMedia
    }

    const orm = await getOrm()
    const em = orm.em.fork()

    const limit = pLimit(50)

    const plexInstances = await em.find(PlexInstance, {})

    const mediaNested = await Promise.all(
      plexInstances.flatMap(async ({ url, token }) => {
        const server = new PlexServer(url, token)

        const sections = await server.library.getSections()

        return await Promise.all(
          sections.flatMap(async (section) => {
            const items = await section.getAllMedia()
            // this awful line returns all the details of the media limited to 50 requests at a time
            return await Promise.all(
              items.flat().flatMap((i) =>
                limit(async () => {
                  const details = await i.getDetails()
                  return {
                    ...details,
                    ...this.parseIds(details),
                  }
                })
              )
            )
          })
        )
      })
    )

    const mediaFlat = mediaNested.flat(2)

    this._plexMedia = mediaFlat

    return mediaFlat
  }

  private parseIds({ guid, Guid }: IPlexMediaMetadata): IMediaIds {
    // If library if from old scanner or TMDB
    // TODO Adapt this to include other library scanners
    if (!Guid) {
      const regMatch = /com\.plexapp\.agents\.(\w*):\/\/([\w\d]*)/

      const match = regMatch.exec(guid)
      if (match) {
        const [_, agent, id] = match
        if (agent === 'imdb') {
          return {
            imdbId: id,
          }
        }
        if (agent === 'themoviedb') {
          return {
            tmdbId: Number(id),
          }
        }
      }
      return {}
    }

    const ids = Guid.map((item) => item.id)

    const getId = (source: string) => {
      const result = ids?.find((id) => id.includes(source))

      return result?.split('://')[1]
    }

    return {
      imdbId: getId('imdb'),
      tmdbId: Number(getId('tmdb')),
      tvdbId: getId('tvdb'),
    }
  }
}
