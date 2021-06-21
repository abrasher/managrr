import { MikroORM } from '@mikro-orm/core'
import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  EntityManager,
  SqlEntityManager,
} from '@mikro-orm/sqlite'
import axios from 'axios'
import { PlexServer } from 'modules/plexapi'

import { PlexSectionEntity, TASK_NAME } from '@/backend/entities'
import { getOrm } from '@/backend/loaders/database'
import { OMDbApi } from '@/backend/modules/omdbapi/OMDbApi'
import { RadarrAPI } from '@/backend/modules/radarr/RadarrAPI'

import { Movie, RadarrFile } from '../entities/movie.entity'
import { PlexInstance, RadarrInstance } from '../entities/settings.entity'
import { logger } from '../lib/logger'
import { DeepPartial } from '../types'
import { BaseTask } from './BaseTask'

enum TASKSTATUS {
  RUNNING = 'running',
  NOT_STARTED = 'not_started',
  ERROR = 'error',
  FINISHED = 'finished',
}

type PartialMovie = DeepPartial<Movie>
type PartialRadarr = DeepPartial<RadarrFile>

class MovieImporterTask extends BaseTask {
  em!: EntityManager

  constructor() {
    super(TASK_NAME.importer)
  }

  private async getEM() {
    if (this.em) {
      return this.em
    }
    const orm = await getOrm()

    return orm.em.fork()
  }

  async run() {
    const em = await this.getEM()

    
    const radarrInstances = await em.find(RadarrInstance, {})

    
    const radarrServers = []

    

    
  }

  async importServer(machineIdentifier: string): Promise<void> {
    const em = await this.getEM()

    const omdbApi = new OMDbApi('1b1c73a0')

    logger.info(`Managrr: Starting Movie Importer at ${new Date().toISOString()}`)

    try {
      const serverInstance = await this.em.findOneOrFail(PlexInstance, {
        machineIdentifier,
      })

      const radarrInstances = await this.em.find(RadarrInstance, {})

      logger.debug(`Fetching Radarr Data`)
      const radarrMap = await this.mapRadarr(radarrInstances)

      const plex = await PlexServer.build(serverInstance.url, serverInstance.token)

      const plexLibrary = await plex.getLibrary()

      logger.debug(`Fetching Plex Media Data`)
      const movieSections = plexLibrary.sections.filter((section) => section.type === 'movie')

      const movieMap = new Map<number, PartialMovie>()

      for (const section of movieSections) {
        logger.debug(`Importing Plex Section ${section.title}`)
        let sectionEntity = await this.em.findOne(PlexSectionEntity, { uuid: section.uuid })

        if (!sectionEntity) {
          sectionEntity = this.em.create(PlexSectionEntity, { ...section, server: serverInstance })
        }

        for (const movie of section.media) {
          logger.debug(`${movie.title}: Importing...`)

          logger.debug(`${movie.title}: Fetching ids from Plex`)
          const ids = await movie.getIds()

          if (ids.tmdbId) {
            const movieVal = movieMap.get(ids.tmdbId)
            const radarrFiles = radarrMap.get(ids.tmdbId)

            const { title, studio, contentRating, year, duration, ratingKey, thumb, rating } = movie

            logger.debug(`${title}: Fetching OMDb Info`)
            const omdbData = ids.imdbId
              ? await omdbApi.findByIMDbId(ids.imdbId)
              : await omdbApi.search(title, year, 'movie')

            const movieData = {
              title,
              studio,
              contentRating,
              year,
              duration,
              rating,
              rottenTomatoesRating: omdbData?.Ratings.rottenTomatoes,
              imdbRating: omdbData?.Ratings.imdb,
              metacriticRating: omdbData?.Ratings.metacritic,
              thumb: `${serverInstance.url}${thumb}?X-Plex-Token=${serverInstance.token}`,
              tmdbId: ids.tmdbId,
              plexMedia: mergeArray(
                [
                  {
                    ratingKey,
                    section: sectionEntity,
                  },
                ],
                movieVal?.plexMedia
              ),
              ...(radarrFiles ? { radarrs: radarrFiles } : {}),
            }

            movieMap.set(ids.tmdbId, movieData as DeepPartial<Movie>)
          }
        }
      }

      // iterate over movies and either update or add each movie
      for (const movie of movieMap.values()) {
        const foundMovie = await this.em.findOne(
          Movie,
          { tmdbId: movie.tmdbId },
          { populate: true }
        )

        if (!foundMovie) {
          console.log('Creating')
          const newMovie = this.em.create(Movie, movie)
          this.em.persist(newMovie)
        } else {
          console.log('Assigning')
          foundMovie.assign(movie)
        }
      }
      await this.em.flush()
      this.em.clear()

      logger.info(`Managrr: Movie Importer Completed at ${new Date().toLocaleDateString()}`)
      this.status = TASKSTATUS.FINISHED
    } catch (err) {
      this.status = TASKSTATUS.ERROR
      logger.error(err)
    }
  }

  private async mapRadarr(instances: Array<RadarrInstance>) {
    const mediaMap = new Map<number, Partial<PartialRadarr>[]>()
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
            instance: {
              id: instance.id,
            },
            radarrId: movie.id,
            monitored: movie.monitored,
            hasFile: movie.hasFile,
            tmdbId: Number(movie.tmdbId),
            imdbId: movie.imdbId,
            qualityProfileId: movie.qualityProfileId,
          },
        ])
      })
    }
    return mediaMap
  }
}

const ImportTask = new MovieImporterTask()

// Merge an array with an unknown object
const mergeArray = <T>(src: T[], toAdd: unknown): T[] => {
  if (Array.isArray(toAdd)) {
    return [...src, ...toAdd] as T[]
  }
  return src
}

interface RadarrData {
  imdbId: string
  tmdbId: number
  id: number
  monitored: boolean
  hasFile: boolean
  qualityProfileId: number
}
