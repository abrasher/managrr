import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { PlexInstance, RadarrInstance, Settings } from '@/modules/system/settings.entity'

import { Context } from '../../types'
import { createBaseCRUDResolver } from '../graphql/base.resolver'
import {
  AddPlexInstanceInput,
  AddRadarrInstanceInput,
  UpdatePlexInstanceInput,
  UpdateRadarrInstanceInput,
  UpdateSettingsInput,
} from './settings.type'

@Service()
@Resolver((of) => Settings)
export class SettingsResolver {
  @Query((returns) => Settings)
  async settings(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo): Promise<Settings> {
    return await ctx.em.findOneOrFail(Settings, { id: 'main' }, { populate: true })
  }

  @Mutation((returns) => Settings)
  async updateSettings(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdateSettingsInput
  ): Promise<Settings> {
    const { port, language, plexAccountToken, posterSettings } = input
    const settings = await ctx.em.findOneOrFail(Settings, { id: 'main' })

    settings.assign({
      language,
      plexAccountToken,
      port,
      posterSettings,
    })

    await ctx.em.flush()

    return settings
  }
}

const PlexBaseCRUDResolver = createBaseCRUDResolver(
  PlexInstance,
  AddPlexInstanceInput,
  UpdatePlexInstanceInput
)
@Service()
@Resolver((of) => PlexInstance)
export class PlexInstanceResolver extends PlexBaseCRUDResolver {}

const RadarrBaseCRUDResolver = createBaseCRUDResolver(
  RadarrInstance,
  AddRadarrInstanceInput,
  UpdateRadarrInstanceInput
)

@Service()
@Resolver((of) => RadarrInstance)
export class RadarrResolver extends RadarrBaseCRUDResolver {}
