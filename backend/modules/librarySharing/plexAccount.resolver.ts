import { SqlEntityManager, SqliteDriver } from '@mikro-orm/sqlite'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, FieldResolver, Info, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { Context } from '../../types'
import { PlexAccount } from '../externalAPI/plex'
import { Settings } from '../system/settings.entity'
import { PlexAccountObject, PlexDevice, PlexDeviceServer, PlexUserObject } from './plexAccount.def'
import { UpdateUserSharingInput } from './plexAccount.types'

@Service()
@Resolver((of) => PlexAccountObject)
export class PlexAccountResolver {
  constructor(private em: SqlEntityManager<SqliteDriver>) {}

  @Query(() => PlexAccountObject)
  async account(
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<PlexAccountObject> {
    const account = await this.getAccount()

    return await account.getAccountDetails()
  }

  @FieldResolver()
  async devices(): Promise<PlexDevice[]> {
    const account = await this.getAccount()

    return await account.getDevices()
  }

  @FieldResolver()
  async users(): Promise<PlexUserObject[]> {
    const account = await this.getAccount()

    const users = await account.getUsers()

    return await Promise.all(
      users.map(async (user) => {
        const sharedServers = await user.getSharedServers()

        return {
          ...user,
          sharedServers,
        }
      })
    )
  }

  @FieldResolver()
  async servers(): Promise<PlexDeviceServer[]> {
    const account = await this.getAccount()

    const servers = await account.getServers()

    return await Promise.all(
      servers.map(async (server) => {
        const libraries = await server.getLibraries()

        return {
          ...server,
          libraries,
        }
      })
    )
  }

  @Mutation(() => [PlexUserObject])
  async updateUsers(
    @Arg('input', () => [UpdateUserSharingInput]) input: UpdateUserSharingInput[]
  ): Promise<PlexUserObject[]> {
    const account = await this.getAccount()

    return await Promise.all(
      input.map(async ({ id, servers }) => {
        const userAccount = await account.getUserById(id)

        await userAccount.updateSharing(servers)

        const userUpdated = await account.getUserById(id)

        return {
          ...userUpdated,
          sharedServers: await userUpdated.getSharedServers(),
        }
      })
    )
  }

  private async getAccount(): Promise<PlexAccount> {
    const { plexAccountToken } = await this.em.findOneOrFail(Settings, { id: 'main' })

    if (plexAccountToken) {
      return new PlexAccount(plexAccountToken)
    } else {
      throw Error('Plex Account Token not defined')
    }
  }
}
