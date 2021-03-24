import { FieldSelections, resolveSelections } from '@jenyus-org/graphql-utils'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { Settings } from '../entities'
import { ContextType, ExpandRecursively } from '../types'
import { createBaseResolver } from './base.resolver'
import { UpdateSettingsInput } from './types/settings.type'

const SettingsBaseResolver = createBaseResolver(Settings)

type t = ExpandRecursively<typeof SettingsBaseResolver>

@Service()
@Resolver((of) => Settings)
export class SettingsResolver {
  @Query((returns) => Settings)
  async settings(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<Settings> {
    const fieldSelections: FieldSelections[] = [{ field: 'settings', selections: ['*.'] }]
    const relationSelections: FieldSelections[] = [
      {
        field: 'settings',
        selections: ['**.**'],
      },
    ]

    const fields = resolveSelections(fieldSelections, info)
    const populate = resolveSelections(relationSelections, info)

    return await ctx.em.findOneOrFail(Settings, { id: 1 }, { populate, fields })
  }

  @Mutation((returns) => Settings)
  async updateSettings(@Ctx() ctx: ContextType, @Arg('data') input: UpdateSettingsInput): Promise<Settings> {
    const settings = await ctx.em.findOneOrFail(Settings, { id: 1 })

    settings.assign(input)

    await ctx.em.flush()

    return settings
  }
}
