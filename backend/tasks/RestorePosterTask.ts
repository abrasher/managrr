import fs from 'fs'
import path from 'path'

import { Movie, PlexInstance, TASK_NAME } from '@/entities'
import { getOrm } from '@/loaders/database'
import { PlexServer } from '@/modules/plexapi'

import { BaseTask } from './BaseTask'
import { BACKUP_DIR } from './GeneratePosterTask'

export class RestorePosterTask extends BaseTask {
  constructor() {
    super(TASK_NAME.restore_poster)
  }

  async run(): Promise<void> {
    const em = (await getOrm()).em.fork()

    const plexApiMap = new Map<string, PlexServer>()
    const plexInstances = await em.find(PlexInstance, {})

    for (const { id, url, token } of plexInstances) {
      plexApiMap.set(id, await PlexServer.build(url, token))
    }

    const movies = await em.find(Movie, {}, { populate: true })

    for (const movie of movies) {
      this.logger.debug(`Restoring Plex Posters for ${movie.title}`)
      const imagePath = path.join(BACKUP_DIR, `${movie.id}-backup.jpg`)
      fs.promises
        .stat(imagePath)
        .then(() => {
          for (const mediaItem of movie.plexMedia) {
            const plexApi = plexApiMap.get(mediaItem.section.server.id) as PlexServer

            fs.promises
              .readFile(imagePath)
              .then((data) => {
                this.logger.silly(`Uploading Plex Posters for ${mediaItem.ratingKey}`)
                plexApi.uploadPoster(mediaItem.ratingKey, data)
              })
              .catch((err) => this.logger.error(`Error Reading Backup Poster`, err))
          }
        })
        .catch(() => {
          this.logger.silly(`No backup found for ${movie.title}, skipping`)
        })
    }
  }
}
