import { resolveSelections } from '@jenyus-org/graphql-utils'
import { AnyEntity } from '@mikro-orm/core'
import { EntityName } from '@mikro-orm/core/typings'
import { GraphQLResolveInfo } from 'graphql'
import { camelCase } from 'lodash'
import pluralize from 'pluralize'
import { Ctx, Info, Query, Resolver } from 'type-graphql'

import { ContextType } from '../types'

const getName = <T>(entity: EntityName<T>): string => {
  if (typeof entity === 'string') {
    return entity
  }
  return entity.name as string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseResolver = <T extends AnyEntity<T>>(
  entity: EntityName<T>
) => {
  const entityName = getName(entity)

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query((type) => [entity], { name: camelCase(pluralize(entityName)) })
    async getAll(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo
    ): Promise<T[]> {
      const fields = resolveSelections(
        [
          {
            field: entityName,
            selections: ['*.*'],
          },
        ],
        info
      )

      const relations = resolveSelections(
        [
          {
            field: entityName,
            selections: ['**.**'],
          },
        ],
        info
      )

      return await ctx.em.find(entity, {}, { populate: relations, fields })
    }
  }

  return BaseResolver
}
