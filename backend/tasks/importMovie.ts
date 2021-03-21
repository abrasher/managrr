import { MikroORM } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/sqlite'
import axios from 'axios'

import { Movie, RadarrFile } from '../entities/movie.entity'
import { PlexSettings, RadarrInstance } from '../entities/settings.entity'
import { log } from '../lib/logger'
import mikroOrmConfig from '../mikro-orm.config'
import { PlexServer } from '../plexapi/PlexServer'
import { EntityData } from '../types'

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)

  const importer = new MovieImporter(orm.em as EntityManager)

  await orm.em.persistAndFlush([
    orm.em.create(PlexSettings, {
      url: 'https://plex.brasher.ca',
      token: 'K13usJEFYXCB4oVtrXL-',
      machineIdentifier: 'plex2',
      friendlyName: 'Friendly',
    }),
    orm.em.create(RadarrInstance, {
      url: 'https://radarr.brasher.ca',
      apiKey: '91ce1fb5aebf49459838770d20f17151',
      instanceName: 'radarr1080',
    }),
  ])

  await importer.import('plex2')
}

main()
  .catch((err) => console.error(err))
  .finally(() => {
    process.exit()
  })

class MovieImporter {
  constructor(private em: EntityManager) {}

  async import(plexMachineId: string) {
    const { url, token } = await this.em.findOneOrFail(PlexSettings, {
      machineIdentifier: plexMachineId,
    })

    const radarrInstances = await this.em.find(RadarrInstance, {})
    const radarrMap = await mapRadarr(radarrInstances)

    const plex = await PlexServer.build(url, token)
    const plexLibrary = await plex.getLibrary()

    const movieSections = await Promise.all(
      plexLibrary.sections
        .filter((section) => section.type === 'movie')
        .map(async (section) => ({
          ...section,
          media: await Promise.all(
            section.media.slice(0, 50).map(async (item) => ({
              ...item,
              ids: await item.getIds(),
            }))
          ),
        }))
    )

    const movieMap = new Map<number, EntityData<Movie>>()

    for (const section of movieSections) {
      for (const movie of section.media) {
        if (movie.ids.tmdbId) {
          const movieVal = movieMap.get(movie.ids.tmdbId)
          const plexMedia = movieVal?.plexMedia ?? []
          const radarrFiles = radarrMap.get(movie.ids.tmdbId)

          const {
            title,
            studio,
            contentRating,
            year,
            duration,
            ratingKey,
          } = movie

          movieMap.set(movie.ids.tmdbId, {
            title,
            studio,
            contentRating,
            year,
            duration,
            plexMedia: [
              ...plexMedia,
              {
                ratingKey,
                section: {
                  key: section.key,
                  title: section.title,
                  type: section.type,
                  uuid: section.uuid,
                },
              },
            ],
            radarrs: radarrFiles,
          })
        }
      }
    }
    for (const movie of movieMap.values()) {
      const newMovie = this.em.create(Movie, movie)
      this.em.persist(newMovie)
    }
    await this.em.flush()
  }
}

const mapRadarr = async (instances: Array<RadarrInstance>) => {
  const mediaMap = new Map<number, Array<EntityData<RadarrFile>>>()
  for (const instance of instances) {
    const { url, apiKey } = instance
    const res = await axios.get<RadarrData[]>(`${url}/api/v3/movie`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    })

    res.data.forEach((movie) => {
      const mapValue = mediaMap.get(movie.tmdbId) ?? []

      mediaMap.set(movie.tmdbId, [
        ...mapValue,
        {
          id: movie.id,
          monitored: movie.monitored,
          hasFile: movie.hasFile,
          tmdbId: Number(movie.tmdbId),
          imdbId: movie.imdbId,
        },
      ])
    })
  }
  return mediaMap
}

interface RadarrData {
  imdbId: string
  tmdbId: number
  id: number
  monitored: boolean
  hasFile: boolean
}
