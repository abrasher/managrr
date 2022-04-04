import axios from 'axios'
import fs from 'fs'
import path from 'path'

import { logger } from '@/common/logger'
import { getORM } from '@/loaders/database'
import { PlexServer } from '@/modules/externalAPI/plex'
import { PosterGenerator } from '@/modules/library/PosterGenerator'

import { Media } from '../library/media.entity'
import { PlexInstance } from '../system/settings.entity'

export const BACKUP_DIR = path.join(process.cwd(), 'backup', 'posters')

export const generatePosterJob = async () => {
  const posterGen = new PosterGenerator()

  const orm = await getORM()

  const em = orm.em.fork()

  const movies = await em.find(Media, {}, { populate: true })
  const plexInstances = await em.find(PlexInstance, {})

  const plexAPIMap = new Map<string, PlexServer>()

  for (const { url, token } of plexInstances) {
    const plexAPI = new PlexServer(url, token)

    const sections = await plexAPI.library.getSections()

    sections.forEach((section) => plexAPIMap.set(section.uuid, plexAPI))
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })

  await Promise.all(
    movies.map(async ({ id, title, omdbMetadata, plexMetadata: plexMetadata }) => {
      logger.debug(`Generating Poster for ${title}`)

      const backupPath = path.join(BACKUP_DIR, `${id}-backup.jpg`)

      const { data } = await axios.get<Buffer>(omdbMetadata.poster, {
        responseType: 'arraybuffer',
      })

      if (fs.existsSync(backupPath)) {
        fs.promises.writeFile(backupPath, data).catch((err) => {
          logger.error(`Error Backing up Poster for ${title}`, err)
        })
      }

      const posterBuffer = await posterGen.generate({
        posterImage: data,
        imdbRating: omdbMetadata.imdbRating,
        metacriticRating: omdbMetadata.metascore,
        rottenTomatoesRating: omdbMetadata.rottenTomatoesRating,
      })

      if (!posterBuffer) return

      for (const file of plexMetadata) {
        logger.debug(`Uploading Poster for ${title} in section ${file.librarySectionTitle}`)
        const plexApi = plexAPIMap.get(file.serverMachineIdentifier)
        if (!plexApi) {
          throw new Error(`Plex Api is undefined for ${file.serverMachineIdentifier}`)
        }

        plexApi.uploadPoster(file.ratingKey, posterBuffer)
      }

      logger.debug(`Generated Poster for ${title}`)
    })
  )
}
