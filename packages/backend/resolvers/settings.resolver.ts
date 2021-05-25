import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, FieldResolver, Info, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { PosterGenerationSettings } from '@/backend/entities/settings.entity'
import { PosterGenerationInput } from '@/backend/modules/system/system.input'

import { Settings } from '../entities'
import { getSystemSettings } from '../lib/systemSettings'
import { ContextType } from '../types'
import { UpdateSettingsInput } from './types/settings.type'

@Service()
@Resolver((of) => Settings)
export class SettingsResolver {
  @Query((returns) => Settings)
  async settings(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<Settings> {
    return await ctx.em.findOneOrFail(Settings, { id: 'main' }, { populate: true })
  }

  @Mutation((returns) => Settings)
  async updateSettings(
    @Ctx() ctx: ContextType,
    @Arg('input') input: UpdateSettingsInput
  ): Promise<Settings> {
    const { port, language, plexAccountToken } = input
    const settings = await ctx.em.findOneOrFail(Settings, { id: 'main' })

    settings.assign({
      language,
      plexAccountToken,
    })

    if (port) {
      getSystemSettings().setSetting('port', port)
    }

    await ctx.em.flush()

    return settings
  }

  @Mutation((returns) => PosterGenerationSettings)
  async updatePosterSettings(
    @Ctx() ctx: ContextType,
    @Arg('input') input: PosterGenerationInput
  ): Promise<PosterGenerationSettings> {
    const settings = await ctx.em.findOneOrFail(Settings, { id: 'main' }, { populate: true })

    console.log(input)

    settings.posterSettings.assign(input)

    await ctx.em.flush()

    return settings.posterSettings
  }

  @FieldResolver(() => Number)
  port(): number {
    return getSystemSettings().port
  }
}
