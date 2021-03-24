import { resolveSelections } from '@jenyus-org/graphql-utils'
import { AnyEntity, wrap } from '@mikro-orm/core'
import { EntityClass, EntityName } from '@mikro-orm/core/typings'
import { GraphQLResolveInfo } from 'graphql'
import { camelCase } from 'lodash'
import pluralize from 'pluralize'
import { Arg, ClassType, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql'

import { ContextType } from '../types'

const getName = <T>(entity: EntityName<T>): string => {
  return typeof entity === 'string' ? entity : entity.name.toString()
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseResolver = <T extends AnyEntity<T>>(entity: EntityClass<T>) => {
  const entityName = getName(entity)
  const findAllName = pluralize(camelCase(entityName))

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query((returns) => [entity], { name: findAllName })
    async getAll(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<T[]> {
      const fields = resolveSelections(
        [
          {
            field: findAllName,
            selections: ['*.'],
          },
        ],
        info
      )

      const relations = resolveSelections(
        [
          {
            field: findAllName,
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseCRUDResolver = <T extends AnyEntity<T>, A, U, D>(
  entity: EntityClass<T>,
  addInput: ClassType<A>,
  updateInput: ClassType<U>,
  removeInput: ClassType<D>
) => {
  const entityName = getName(entity)
  const addEntityName = `add${entityName}`
  const updateEntityName = `update${entityName}`
  const removeEntityName = `remove${entityName}`

  const baseResolver = createBaseResolver(entity)

  @Resolver({ isAbstract: true })
  abstract class BaseCRUDResolver extends baseResolver {
    @Mutation((returns) => entity, { name: addEntityName })
    async add(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('data', (type) => addInput) input: A
    ): Promise<T> {
      const entityToCreate = ctx.em.create(entity, input)

      await ctx.em.persistAndFlush(entityToCreate)

      return entityToCreate
    }
    @Mutation((returns) => entity, { name: updateEntityName })
    async update(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('data', (type) => updateInput) input: U
    ): Promise<T | null> {
      const entityMetadata = ctx.em.getMetadata().get<U>(entityName)
      const primaryKey = entityMetadata.primaryKeys[0]

      const entityToUpdate = await ctx.em.findOne(entity, { [primaryKey]: input[primaryKey] })

      if (entityToUpdate) {
        wrap(entityToUpdate).assign(input)
        await ctx.em.flush()
        return entityToUpdate
      }
      return null
    }

    @Mutation((returns) => entity, { name: removeEntityName })
    async remove(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('data', (type) => removeInput) input: D
    ): Promise<T | null> {
      const entityToRemove = await ctx.em.findOne(entity, input)

      if (entityToRemove) {
        await ctx.em.removeAndFlush(entityToRemove)
        return entityToRemove
      }
      return null
    }
  }

  return BaseCRUDResolver
}
