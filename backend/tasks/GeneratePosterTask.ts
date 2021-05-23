import axios from 'axios'
import fs from 'fs'
import path from 'path'

import { Movie, PlexInstance, TASK_NAME, TASK_STATUS } from '@/entities'
import { PosterGenerator } from '@/lib/PosterGenerator'
import { getOrm } from '@/loaders/database'
import { PlexServer } from '@/modules/plexapi'

import { BaseTask } from './BaseTask'

export const BACKUP_DIR = path.join(process.cwd(), 'backup', 'posters')

class ThumbnailTaskClass extends BaseTask {
  status: TASK_STATUS = TASK_STATUS.not_started

  constructor() {
    super(TASK_NAME.thumbnail_generate)
  }

  async run(): Promise<void> {
    // Grab All Movies with their metadata (thumb, ratings)
    // Download all metadata into a folder
    // Generate all thumbnails
    // Apply thumbnails to plex
    const posterGen = new PosterGenerator()

    const orm = await getOrm()

    const em = orm.em.fork()

    const movies = await em.find(Movie, {}, { populate: true })
    const plexInstances = await em.find(PlexInstance, {})

    const plexApiMap = new Map<string, PlexServer>()

    for (const { id, url, token } of plexInstances) {
      plexApiMap.set(id, await PlexServer.build(url, token))
    }

    fs.mkdirSync(BACKUP_DIR, { recursive: true })

    await Promise.all(
      movies.map(
        async ({
          imdbRating,
          metacriticRating,
          rottenTomatoesRating,
          plexMedia,
          title,
          id,
          thumb,
        }) => {
          this.logger.debug(`Generating Poster for ${title}`)

          const backupPath = path.join(BACKUP_DIR, `${id}-backup.jpg`)

          const { data } = await axios.get<Buffer>(thumb, { responseType: 'arraybuffer' })

          if (fs.existsSync(backupPath)) {
            fs.promises.writeFile(backupPath, data).catch((err) => {
              this.logger.error(`Error Backing up Poster for ${title}`, err)
            })
          }

          const posterBuffer = await posterGen.generate({
            posterImage: data,
            imdbRating,
            metacriticRating,
            rottenTomatoesRating,
          })

          if (!posterBuffer) return

          for (const file of plexMedia) {
            this.logger.debug(`Uploading Poster for ${title} in section ${file.section.title}`)
            const plexApi = plexApiMap.get(file.section.server.id)
            if (!plexApi) {
              throw new Error(`Plex Api is undefined for ${file.section.server.id}`)
            }

            plexApi.uploadPoster(file.ratingKey, posterBuffer)
          }

          this.logger.debug(`Generated Poster for ${title}`)
        }
      )
    )
  }
}

export const ThumbnailTask = new ThumbnailTaskClass()
