import { FieldSelections, resolveSelections } from '@jenyus-org/graphql-utils'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, Info, Int, Mutation, Query, Resolver } from 'type-graphql'

import { PlexSettings, Settings } from '../entities'
import { PlexServer } from '../plexapi'
import { ContextType } from '../types'
import { PlexSettingsInput, SettingsInput } from './types/settings.type'

@Resolver((of) => Settings)
export class SettingsResolver {
  @Query((returns) => Settings)
  async settings(
    @Ctx() ctx: ContextType,
    @Info() info: GraphQLResolveInfo
  ): Promise<Settings> {
    const fieldSelections: FieldSelections[] = [
      { field: 'settings', selections: ['*.'] },
    ]
    const relationSelections: FieldSelections[] = [
      {
        field: 'settings',
        selections: ['**.**'],
      },
    ]

    const fields = resolveSelections(fieldSelections, info)
    const populate = resolveSelections(relationSelections, info)

    const res = await ctx.em.findOneOrFail(
      Settings,
      { id: 1 },
      { populate, fields }
    )
    return res
  }

  @Mutation((returns) => Settings)
  async updateSettings(@Arg('data') input: SettingsInput): Promise<Settings> {
    return await this.settingsRepo.updateSettings(input)
  }

  @Mutation((returns) => PlexSettings)
  async updatePlex(
    @Arg('data') input: PlexSettingsInput
  ): Promise<PlexSettings> {
    return await this.settingsRepo.updatePlex(input)
  }

  @Mutation((returns) => PlexSettings)
  async deletePlex(
    @Ctx() context: ContextType,
    @Arg('id', (type) => Int) id: number
  ): Promise<PlexSettings> {
    return await context.prisma.plexSettings.delete({ where: { id } })
  }

  @Query((returns) => Boolean)
  testPlex(@Arg('data') { url, token }: PlexSettingsInput): Promise<boolean> {
    // try {
    //   await PlexServer.build(url, token)
    //   return true
    // } catch (err) {
    //   //throw new Error('custom error')
    //   return false
    // }
    return PlexServer.testConnection(url, token)
  }
}
