import { Service } from 'typedi'
import { BaseRepository } from './base.repository'
import * as plexApi from '../plexapi'
import { UpdateUserSharingInput } from '../resolvers/types/plexAccount.types'
import { cache } from '../lib/cache'
import {
  PlexAccount,
  PlexUser,
  PlexDevice,
  PlexDeviceServer,
} from '../entities/plexAccount.entity'
import { SettingsRepository } from './settings.repository'

@Service()
export class PlexAccountRepository extends BaseRepository {
  async getToken(): Promise<string> {
    const settingsRepo = new SettingsRepository(this.prisma)

    const account = await settingsRepo.findOrMake()
    return account.plexAccountToken
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

  async inviteUsers(data: UpdateUserSharingInput[]): Promise<PlexUser[]> {
    const account = await this.getAccountCache()

    const users = data.map((user) => account.inviteUser(user))

    return await Promise.all(users)
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
