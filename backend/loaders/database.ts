import { EntityManager, MikroORM } from '@mikro-orm/core'
import { existsSync, rmSync } from 'fs'

import mikroOrmConfig from '@/backend/mikro-orm.config'

import { logger } from '../common/logger'
import { PlexInstance, RadarrInstance, Settings } from '../modules/system/settings.entity'
import { BlendMode } from '../modules/system/system.input'

let orm: Promise<MikroORM> | undefined

export const getORM = (): Promise<MikroORM> => {
  if (orm) {
    return orm
  }

  orm = MikroORM.init(mikroOrmConfig)

  return orm
}

export const prepareDatabase = async () => {
  try {
    const dbExists = existsSync('./config/managrr.db')

    const orm = await getORM()
    const migrator = orm.getMigrator()

    if (!dbExists) {
      await orm.getSchemaGenerator().createSchema()
      await seedDatabase(orm.em.fork())
      await migrator.createInitialMigration()
    } else {
      await migrator.createMigration()
      await migrator.up()
    }
  } catch (err) {
    logger.fatal(err)
    rmSync('./config/managrr.db')
  }
}

const seedDatabase = async (em: EntityManager): Promise<void> => {
  const settings = await em.findOne(Settings, { id: 'main' })
  const plexInstances = await em.find(PlexInstance, {})
  const radarrInstances = await em.find(RadarrInstance, {})

  const defaultPlex = {
    url: process.env.PLEX_URL,
    token: process.env.PLEX_TOKEN,
  }

  const defaultRadarr = {
    url: process.env.RADARR_URL,
    apiKey: process.env.RADARR_KEY,
    instanceName: 'radarr',
  }

  if (process.env.NODE_DEV) {
    if (plexInstances.length === 0) {
      const defaultPlexInstance = em.create(PlexInstance, defaultPlex)

      em.persist(defaultPlexInstance)
    }

    if (radarrInstances.length === 0) {
      const defaultRadarrInstance = em.create(RadarrInstance, defaultRadarr)

      em.persist(defaultRadarrInstance)
    }
  }

  const defaultSettings = {
    language: 'eng',
    port: 9989,
    plexAccountToken: process.env.PLEX_TOKEN || '',
    posterSettings: {
      BOX_COLOUR: '#211E1E',
      BLEND_MODE: BlendMode.SCREEN,
      DESTINATION_OPACITY: 0.1,
      SOURCE_OPACITY: 1,
      SPACING: 25,
      GLOBAL_ICON_SCALE: 0.85,
      RATING_SCALE: 0.85,
      FONT_COLOUR: 'white',
      JPEG_QUALITY: 80,
      IMAGE_HEIGHT: 2100,
      IMAGE_WIDTH: 1400,
    },
  }

  if (!settings) {
    const settings = em.create(Settings, defaultSettings)

    em.persist(settings)
  }

  await em.flush()
}
