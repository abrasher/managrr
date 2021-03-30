import { EntityManager } from '@mikro-orm/sqlite'
import { Service } from 'typedi'

import { PlexAccount } from '../entities'
import { PlexDevice, PlexDeviceServer, PlexUser } from '../entities/plexAccount.entity'
import { Settings } from '../entities/settings.entity'
import { cache } from '../lib/cache'
import * as plexApi from '../modules/plexapi'
import { UpdateUserSharingInput } from '../resolvers/types/plexAccount.types'

/**
 * Service to interact with Plex Account API
 */
@Service({ global: true })
export class PlexAccountService {
  constructor(private em: EntityManager) {}

  async getToken(): Promise<string> {
    const settings = await this.em.findOneOrFail(Settings, { id: 'main' })

    if (settings.plexAccountToken === null) {
      throw new Error('Plex Account Token is not defined')
    }
    return settings.plexAccountToken
  }

  async getAccount(): Promise<PlexAccount> {
    const account = await this.getAccountCache()

    const { id, email, username, uuid, users, token } = account

    return {
      id,
      email,
      username,
      uuid,
      token,
      users,
    }
  }

  async updateSharing(data: UpdateUserSharingInput[]): Promise<PlexUser[]> {
    const account = await this.getAccountCache()
    const users = data.map((user) => account.updateUser(user))

    return await Promise.all(users)
  }

  async getDevices(): Promise<PlexDevice[]> {
    const account = await this.getAccountCache()

    return await account.getDevices()
  }

  async getServers(): Promise<PlexDeviceServer[]> {
    const account = await this.getAccountCache()
    const rawServers = await account.getServers()

    const servers = await Promise.all(
      rawServers.map(async (entry) => {
        const libraries = await entry.getLibraries()

        return {
          ...entry,
          libraries,
        }
      })
    )
    return servers
  }

  private async getAccountCache(): Promise<plexApi.PlexAccount> {
    const token = await this.getToken()
    return await cache.get(token, plexApi.PlexAccount.build(token))
  }
}
