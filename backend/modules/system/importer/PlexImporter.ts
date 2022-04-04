import pLimit from 'p-limit'

import { getORM } from '@/loaders/database'

import { PlexServer } from '../../externalAPI/plex'
import { IPlexMediaMetadata } from '../../externalAPI/plex/PlexMedia'
import { PlexInstance } from '../settings.entity'
import { ImporterAgent, MediaUID, MetadataMap } from './importer.interface'
import { KeyedCollection } from './KeyedCollection'

export type PlexMetadata = IPlexMediaMetadata & IMediaIds & { serverMachineIdentifier: string }

type IMediaIds = {
  imdbId?: string
  tmdbId?: number
  tvdbId?: string
}

export class PlexImporter implements ImporterAgent {
  readonly agentName = 'plex'

  _plexMedia: PlexMetadata[] | null
  _metadata?: KeyedCollection<MediaUID, PlexMetadata>

  constructor(private recentlyAdded = false) {
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

    const orm = await getORM()
    const em = orm.em.fork()

    const limit = pLimit(50)

    const plexInstances = await em.find(PlexInstance, {
      machineIdentifier: {
        $not: undefined,
      },
    })

    const mediaNested = await Promise.all(
      plexInstances.flatMap(async ({ url, token, machineIdentifier }) => {
        const server = new PlexServer(url, token)

        const items = this.recentlyAdded
          ? await server.library.getRecentlyAdded()
          : await Promise.all(
              (
                await server.library.getSections()
              ).flatMap(async (section) => await section.getAllMedia())
            )

        return await Promise.all(
          // this awful line returns all the details of the media limited to 50 requests at a time

          items.flat().flatMap((i) =>
            limit(async () => {
              const details = await i.getDetails()
              console.log(JSON.stringify(details))
              return {
                ...details,
                ...this.parseIds(details),
                serverMachineIdentifier: machineIdentifier as string,
              }
            })
          )
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
