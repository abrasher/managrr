import { EntityManager } from '@mikro-orm/core'
import bcrypt from 'bcrypt'

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

  const defaultProperties = {
    language: 'eng',
    plexAccountToken: process.env.PLEXTOKEN,
    plex: [defaultPlex],
    radarrInstances: [defaultRadarr],
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
    const defaultSettings = em.create(Settings, defaultProperties)

    em.persist(defaultSettings)
  }

  await em.flush()
}
