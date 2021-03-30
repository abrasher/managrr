import { resolveSelections } from '@jenyus-org/graphql-utils'
import { AnyEntity, wrap } from '@mikro-orm/core'
import { EntityClass, EntityName } from '@mikro-orm/core/typings'
import { GraphQLResolveInfo } from 'graphql'
import { camelCase } from 'lodash'
import pluralize from 'pluralize'
import { Arg, ClassType, Ctx, Field, ID, Info, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { ContextType } from '../types'
import { BaseInput } from './types/base.type'

const getName = <T>(entity: EntityName<T>): string => {
  return typeof entity === 'string' ? entity : entity.name.toString()
}

const getFieldsAndSelections = (name: string, info: GraphQLResolveInfo) => {
  const fields = resolveSelections(
    [
      {
        field: name,
        selections: ['*.'],
      },
    ],
    info
  )

  const relations = resolveSelections(
    [
      {
        field: name,
        selections: ['**.**'],
      },
    ],
    info
  )

  return { fields, relations }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseResolver = <T extends AnyEntity<T>>(entity: EntityClass<T>) => {
  const entityName = getName(entity)
  const findAllName = pluralize(camelCase(entityName))

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query((returns) => entity)
    async getOne(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<T | null> {
      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      const foundEntity = await ctx.em.findOne(entity, {}, { populate: relations, fields })

      return foundEntity
    }

    @Query((returns) => [entity], { name: findAllName })
    async getAll(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<T[]> {
      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      return await ctx.em.find(entity, {}, { populate: relations, fields })
    }
  }

  return BaseResolver
}

type MutationPayload<T> = Promise<IPayload<T> | null>

interface IPayload<T> {
  entity: T | null
  errors?: Error[]
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseCRUDResolver = <T extends AnyEntity<T>, A, U extends BaseInput, D>(
  entity: ClassType<T>,
  addInput: ClassType<A>,
  updateInput: ClassType<U>,
  removeInput?: ClassType<D>
) => {
  const entityName = getName(entity)
  const addEntityName = `add${entityName}`
  const updateEntityName = `update${entityName}`
  const removeEntityName = `remove${entityName}`

  const baseResolver = createBaseResolver(entity)

  function Payload<T>(operation: 'Add' | 'Update' | 'Remove') {
    @ObjectType(`Create${entityName}Payload`)
    class ResponsePayload {
      @Field(() => entity, { name: camelCase(entityName) })
      entity!: T

      @Field(() => [Error])
      errors?: Error[]
    }

    return ResponsePayload
  }

  function RemoveInputType<T extends ClassType>(entity: T) {
    @InputType(`Remove${entityName}Input`)
    class RemoveInput {
      @Field(() => ID)
      id!: string
    }

    return RemoveInput
  }

  const RemoveInput = removeInput ?? RemoveInputType(entity)

  @Resolver({ isAbstract: true })
  abstract class BaseCRUDResolver extends baseResolver {
    @Mutation((returns) => Payload('Add'), { name: addEntityName })
    async add(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => addInput) input: A
    ): MutationPayload<T> {
      const entityToCreate = ctx.em.create(entity, input)

      await ctx.em.persistAndFlush(entityToCreate)

      return {
        entity: entityToCreate,
      }
    }
    @Mutation((returns) => Payload('Update'), { name: updateEntityName })
    async update(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => updateInput) input: U
    ): MutationPayload<T> {
      const entityToUpdate = await ctx.em.findOne(entity, { id: input.id })

      if (entityToUpdate) {
        wrap(entityToUpdate).assign(input)
        await ctx.em.flush()
        return {
          entity: entityToUpdate,
        }
      }
      return {
        entity: null,
      }
    }

    @Mutation((returns) => Payload('Remove'), { name: removeEntityName })
    async remove(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => RemoveInput) input: D
    ): MutationPayload<T> {
      const entityToRemove = await ctx.em.findOne(entity, input)

      if (entityToRemove) {
        await ctx.em.removeAndFlush(entityToRemove)
        return {
          entity: entityToRemove,
        }
      }
      return {
        entity: null,
      }
    }
  }

  return BaseCRUDResolver
}

@ObjectType()
class Error {
  @Field()
  code!: string

  @Field()
  message!: string
}
