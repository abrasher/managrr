import { EntityManager } from '@mikro-orm/sqlite'
import axios from 'axios'

import { Movie, RadarrFile } from '../entities/movie.entity'
import { PlexInstance, RadarrInstance } from '../entities/settings.entity'
import { log } from '../lib/logger'
import { PlexServer } from '../plexapi/PlexServer'
import { EntityData } from '../types'

enum TASKSTATUS {
  RUNNING = 'running',
  NOT_STARTED = 'not_started',
  ERROR = 'error',
  FINISHED = 'finished',
}

export const initImporter = (em: EntityManager): MovieImporter => {
  return new MovieImporter(em)
}

export const getMovieImporter = (): MovieImporter => {
  return MovieImporter.getInstance()
}

class MovieImporter {
  static _instance: MovieImporter

  status: TASKSTATUS

  constructor(private em: EntityManager) {
    this.status = TASKSTATUS.NOT_STARTED
    MovieImporter._instance = this
  }

  static getInstance(): MovieImporter {
    return this._instance
  }

  async import(plexMachineId: string): Promise<void> {
    this.status = TASKSTATUS.RUNNING

    try {
      const { url, token } = await this.em.findOneOrFail(PlexInstance, {
        machineIdentifier: plexMachineId,
      })

      const radarrInstances = await this.em.find(RadarrInstance, {})
      const radarrMap = await this.mapRadarr(radarrInstances)

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

            const { title, studio, contentRating, year, duration, ratingKey, ids } = movie

            movieMap.set(movie.ids.tmdbId, {
              title,
              studio,
              contentRating,
              year,
              duration,
              tmdbId: ids.tmdbId,
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
              radarrs: [...(radarrFiles ?? [])],
            })
          }
        }
      }

      for (const movie of movieMap.values()) {
        const foundMovie = await this.em.findOne(Movie, { tmdbId: movie.tmdbId })

        if (!foundMovie) {
          const newMovie = this.em.create(Movie, movie)
          this.em.persist(newMovie)
        } else {
          foundMovie.assign(movie, { merge: true })
        }
      }
      await this.em.flush()
      this.em.clear()
      this.status = TASKSTATUS.FINISHED
    } catch (err) {
      this.status = TASKSTATUS.ERROR
      log.error(err)
    }
  }

  private async mapRadarr(instances: Array<RadarrInstance>) {
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
}

interface RadarrData {
  imdbId: string
  tmdbId: number
  id: number
  monitored: boolean
  hasFile: boolean
}
