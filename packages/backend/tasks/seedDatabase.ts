import { EntityManager } from '@mikro-orm/core'
import bcrypt from 'bcrypt'

import { BlendMode } from '@/backend/modules/system/system.input'

import { PlexInstance, Settings } from '../entities'
import { RadarrInstance } from '../entities/settings.entity'
import { User } from '../entities/user.entity'

export const seedDatabase = async (em: EntityManager): Promise<void> => {
  const settings = await em.findOne(Settings, { id: 'main' })
  const plexInstances = await em.find(PlexInstance, {})
  const radarrInstances = await em.find(RadarrInstance, {})
  const userCount = await em.count(User)

  const defaultPlex = {
    url: process.env.PLEXURL,
    token: process.env.PLEXTOKEN,
  }

  const defaultRadarr = {
    url: process.env.RADARRURL,
    apiKey: process.env.RADARRKEY,
    instanceName: 'radarr1080',
  }

  const defaultSettings: Partial<Settings> = {
    language: 'eng',
    plexAccountToken: process.env.PLEXTOKEN,
    posterSettings: {
      BLEND_MODE: BlendMode.BLEND_SCREEN,
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

  if (userCount === 0) {
    const defaultUser = em.create(User, {
      username: 'admin',
      password: bcrypt.hashSync('admin', 10),
    })

    em.persist(defaultUser)
  }

  if (plexInstances.length === 0) {
    const defaultPlexInstance = em.create(PlexInstance, defaultPlex)

    em.persist(defaultPlexInstance)
  }

  if (radarrInstances.length === 0) {
    const defaultRadarrInstance = em.create(RadarrInstance, defaultRadarr)

    em.persist(defaultRadarrInstance)
  }

  if (!settings) {
    const settings = em.create(Settings, defaultSettings)

    em.persist(settings)
  }

  await em.flush()
}
