import { EntityManager } from '@mikro-orm/core'

import { PlexInstance, Settings } from '../entities'
import { RadarrInstance } from '../entities/settings.entity'
import { User } from '../entities/user.entity'

export const seedDatabase = async (em: EntityManager): Promise<void> => {
  const settings = await em.findOne(Settings, { id: 1 })
  const plexInstances = await em.find(PlexInstance, {})
  const radarrInstances = await em.find(RadarrInstance, {})

  const userRepo = em.getRepository(User)

  const newUser = userRepo.create({
    name: Math.random(),
  })

  em.persist(newUser)

  const defaultPlex = {
    url: process.env.PLEXURL,
    token: process.env.PLEXTOKEN,
    machineIdentifier: 'plex2',
    friendlyName: 'Friendly',
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
