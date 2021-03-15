import { Arg, FieldResolver, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import {
  PlexAccount,
  PlexDevice,
  PlexDeviceServer,
  PlexUser,
} from '../entities/plexAccount.entity'
import { PlexAccountRepository } from '../repositories/plexAccount.repository'
import { UpdateUserSharingInput } from './types/plexAccount.types'

@Service()
@Resolver((of) => PlexAccount)
export class PlexAccountResolver {
  constructor(private repository: PlexAccountRepository) {}

  @Query(() => PlexAccount)
  async account(): Promise<PlexAccount> {
    return await this.repository.getAccount()
  }

  @FieldResolver()
  async devices(): Promise<PlexDevice[]> {
    return await this.repository.getDevices()
  }

  @FieldResolver()
  async servers(): Promise<PlexDeviceServer[]> {
    return await this.repository.getServers()
  }

  @Mutation(() => [PlexUser])
  async updateUsers(
    @Arg('data', () => [UpdateUserSharingInput]) data: UpdateUserSharingInput[]
  ): Promise<PlexUser[]> {
    return await this.repository.updateSharing(data)
  }

  @Mutation(() => [PlexUser])
  async inviteUsers(
    @Arg('data', () => [UpdateUserSharingInput]) data: UpdateUserSharingInput[]
  ): Promise<PlexUser[]> {
    return await this.repository.inviteUsers(data)
  }
}
