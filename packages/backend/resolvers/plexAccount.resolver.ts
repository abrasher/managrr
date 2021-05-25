import { Arg, FieldResolver, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { PlexAccountService } from '@/backend/services/plexaccount.service'

import { PlexAccount, PlexDevice, PlexDeviceServer, PlexUser } from '../entities/plexAccount.entity'
import { UpdateUserSharingInput } from './types/plexAccount.types'

@Service()
@Resolver((of) => PlexAccount)
export class PlexAccountResolver {
  constructor(private accountService: PlexAccountService) {}

  @Query(() => PlexAccount)
  async account(): Promise<PlexAccount> {
    return await this.accountService.getAccount()
  }

  @FieldResolver()
  async devices(): Promise<PlexDevice[]> {
    return await this.accountService.getDevices()
  }

  @FieldResolver()
  async servers(): Promise<PlexDeviceServer[]> {
    return await this.accountService.getServers()
  }

  @Mutation(() => [PlexUser])
  async updateUsers(
    @Arg('input', () => [UpdateUserSharingInput]) data: UpdateUserSharingInput[]
  ): Promise<PlexUser[]> {
    return await this.accountService.updateSharing(data)
  }
}
