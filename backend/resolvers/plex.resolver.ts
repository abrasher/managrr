import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { PlexInstance } from '../entities/settings.entity'
import { PlexServer } from '../modules/plexapi'
import { ContextType } from '../types'
import { createBaseCRUDResolver } from './base.resolver'
import { AddPlexInstanceInput, UpdatePlexInstanceInput } from './types/settings.type'

const PlexBaseCRUDResolver = createBaseCRUDResolver(PlexInstance, AddPlexInstanceInput, UpdatePlexInstanceInput)

@Service()
@Resolver((of) => PlexInstance)
export class PlexInstanceResolver extends PlexBaseCRUDResolver {
  @Mutation((returns) => PlexInstance)
  async addPlexInstance(
    @Ctx() ctx: ContextType,
    @Arg('input') { url, token }: AddPlexInstanceInput
  ): Promise<PlexInstance> {
    const { friendlyName, machineIdentifier } = await PlexServer.build(url, token)

    const newInstance = ctx.em.create(PlexInstance, {
      url,
      token,
      machineIdentifier,
      friendlyName,
    })

    await ctx.em.persistAndFlush(newInstance)

    return newInstance
  }

  @Mutation((returns) => PlexInstance)
  async updatePlexServer(
    @Ctx() ctx: ContextType,
    @Arg('input') { id, url, token }: UpdatePlexInstanceInput
  ): Promise<PlexInstance | null> {
    const plexServer = await ctx.em.findOne(PlexInstance, {
      id,
    })

    if (plexServer) {
      const { friendlyName, machineIdentifier } = await PlexServer.build(url, token)

      plexServer.assign({
        id,
        url,
        token,
        friendlyName,
        machineIdentifier,
      })

      await ctx.em.flush()
      return plexServer
    }
    return null
  }
}
