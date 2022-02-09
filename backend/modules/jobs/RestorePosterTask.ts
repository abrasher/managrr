import fs from 'fs'
import path from 'path'

import { getORM } from '@/backend/loaders/database'
import { PlexServer } from '@/backend/modules/externalAPI/plex'

import { Media } from '../library/media.entity'
import { PlexInstance } from '../system/settings.entity'
import { TASK_NAME } from '../system/system.entity'
import { BaseTask } from './BaseTask'
import { BACKUP_DIR } from './GeneratePosterTask'

export class RestorePosterTask extends BaseTask {
  constructor() {
    super(TASK_NAME.restore_poster)
  }

  async run(): Promise<void> {
    const em = (await getORM()).em.fork()

    const plexApiMap = new Map<string, PlexServer>()
    const plexInstances = await em.find(PlexInstance, {})

    for (const { id, url, token } of plexInstances) {
      plexApiMap.set(id, new PlexServer(url, token))
    }

    const movies = await em.find(Media, {}, { populate: true })

    for (const movie of movies) {
      this.logger.debug(`Restoring Plex Posters for ${movie.title}`)
      const imagePath = path.join(BACKUP_DIR, `${movie.id}-backup.jpg`)
      fs.promises
        .stat(imagePath)
        .then(() => {
          for (const plexMetadataItem of movie.plexMetadata) {
            fs.promises
              .readFile(imagePath)
              .then((data) => {
                this.logger.silly(`Uploading Plex Posters for ${plexMetadataItem.ratingKey}`)
                plexApiMap
                  .get(plexMetadataItem.serverMachineIdentifier)
                  ?.uploadPoster(plexMetadataItem.ratingKey, data)
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
