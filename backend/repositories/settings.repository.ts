import { PlexSettings, Settings } from '@generated/type-graphql'
import { Service } from 'typedi'

import { PlexServer } from '../plexapi'
import {
  PlexSettingsInput,
  SettingsInput,
} from '../resolvers/types/settings.type'
import { BaseRepository } from './base.repository'

@Service()
export class SettingsRepository extends BaseRepository {
  async findOrMake(): Promise<Settings> {
    const settingsCount = await this.prisma.settings.count({})
    if (settingsCount === 0) {
      await this.prisma.settings.create({
        data: {
          id: 1,
          language: 'english',
          plexAccountToken: '',
          plex: undefined,
        },
      })
    }
    const settings = await this.prisma.settings.findFirst({ where: { id: 1 } })
    if (settings !== null) {
      return settings
    }
    throw new Error('Error: Unable to find settings')
  }

  async updateSettings(input: SettingsInput): Promise<Settings> {
    const { plex, ...data } = input

    const queries: Promise<unknown>[] = []

    if (plex) {
      queries.push(...plex?.map((server) => this.updatePlex(server)))
    }

    await Promise.all(queries)

    return await this.prisma.settings.update({
      where: { id: 1 },
      data,
    })
  }

  async updatePlex({ url, token }: PlexSettingsInput): Promise<PlexSettings> {
    const { machineIdentifier, friendlyName } = await PlexServer.build(
      url,
      token
    )

    const data = {
      url,
      token,
      machineIdentifier,
      friendlyName,
      settingsId: 1,
    }

    return await this.prisma.plexSettings.upsert({
      where: { url },
      create: data,
      update: data,
    })
  }
}
