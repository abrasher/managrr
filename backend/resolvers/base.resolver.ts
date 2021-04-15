import { resolveSelections } from '@jenyus-org/graphql-utils'
import { AnyEntity, NotFoundError, UniqueConstraintViolationException, wrap } from '@mikro-orm/core'
import { EntityClass, EntityName } from '@mikro-orm/core/typings'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
import { logger } from 'lib/logger'
import { camelCase } from 'lodash'
import pluralize from 'pluralize'
import {
  Arg,
  ClassType,
  Ctx,
  Field,
  ID,
  Info,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'

import { ContextType } from '../types'
import { BaseInput } from './types/base.type'

const getName = <T>(entity: EntityName<T>): string => {
  return typeof entity === 'string' ? entity : entity.name.toString()
}

const stripTypename = (fieldArray: string[]): string[] => {
  return fieldArray.filter((field) => field !== '__typename')
}

const getFieldsAndSelections = (name: string, info: GraphQLResolveInfo) => {
  const fields = stripTypename(
    resolveSelections(
      [
        {
          field: name,
          selections: ['*.'],
        },
      ],
      info
    )
  )

  const relations = stripTypename(
    resolveSelections(
      [
        {
          field: name,
          selections: ['**.**'],
        },
      ],
      info
    )
  )

  return { fields, relations }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseResolver = <T extends AnyEntity<T>>(entity: EntityClass<T>) => {
  const entityName = getName(entity)
  const findAllName = pluralize(camelCase(entityName))

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query((returns) => entity, { name: camelCase(entityName) })
    async getOne(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<T | null> {
      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      const foundEntity = await ctx.em.findOne(entity, {}, { populate: relations, fields })

      return foundEntity
    }

    @Query((returns) => [entity], { name: findAllName })
    async getAll(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<T[]> {
      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      const entities = await ctx.em.find(entity, {}, { populate: relations, fields })

      return entities
    }
  }

  return BaseResolver
}

export type MutationPayload<T> = Promise<IPayload<T> | null>

interface IPayload<T> {
  entity: T | null
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseCRUDResolver = <
  T extends AnyEntity<T>,
  A extends Record<string, unknown>,
  U extends BaseInput,
  D extends BaseInput
>(
  entity: ClassType<T>,
  addInput: ClassType<A>,
  updateInput: ClassType<U>,
  removeInput?: ClassType<D>
) => {
  const entityName = getName(entity)
  const addEntityName = `add${entityName}`
  const updateEntityName = `update${entityName}`
  const removeEntityName = `remove${entityName}`
  const upsertEntityName = `upsert${entityName}`

  const baseResolver = createBaseResolver(entity)

  function AddInputType<T extends ClassType>(entity: T) {
    @InputType(`Add${entityName}Input`, { isAbstract: true })
    class AddInput {}

    return AddInput
  }

  function UpdateInputType<T extends ClassType>(entity: T) {
    @InputType(`Update${entityName}Input`, { isAbstract: true })
    class UpdateInput {}

    return UpdateInput
  }

  function RemoveInputType<T extends ClassType>(entity: T) {
    @InputType(`Remove${entityName}Input`, { isAbstract: true })
    class RemoveInput {
      @Field(() => ID)
      id!: string
    }

    return RemoveInput
  }

  function UpsertInputType() {
    @InputType(`Upsert${entityName}Input`, { isAbstract: true })
    class UpsertInput extends addInput {
      @Field(() => ID, { nullable: true })
      id!: string | null
    }

    return UpsertInput
  }

  const AddInput = addInput ?? AddInputType(entity)
  const UpdateInput = updateInput ?? UpdateInputType(entity)
  const RemoveInput = removeInput ?? RemoveInputType(entity)
  const UpsertInput = UpsertInputType()

  @Resolver({ isAbstract: true })
  class BaseCRUDResolver extends baseResolver {
    @Mutation((returns) => entity, { name: addEntityName })
    async add(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => AddInput) input: A
    ): Promise<T> {
      const entityToCreate = ctx.em.create(entity, input)

      try {
        await ctx.em.persistAndFlush(entityToCreate)
      } catch (error) {
        mikroErrorHandler(error)
      }

      return entityToCreate as T
    }
    @Mutation((returns) => entity, { name: upsertEntityName })
    async upsert(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => UpsertInput) input: U
    ) {
      const { id } = fromGlobalId(input.id)
      logger.info(`upsert id: ${id}`)

      const entityToUpdate = await ctx.em.findOne(entity, { id })

      const { id: removedId, ...addData } = input

      if (!entityToUpdate) {
        return this.add(ctx, info, addData as A)
      } else {
        return this.update(ctx, info, input)
      }
    }

    @Mutation((returns) => entity, { name: updateEntityName, nullable: true })
    async update(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => UpdateInput) input: U
    ): Promise<T | null> {
      const { id } = fromGlobalId(input.id)

      try {
        const entityToUpdate = await ctx.em.findOneOrFail(entity, { id })
        wrap(entityToUpdate).assign({ ...input, id })
        await ctx.em.flush()
        return entityToUpdate as T
      } catch (error) {
        mikroErrorHandler(error)
        return null
      }
    }

    @Mutation((returns) => entity, { name: removeEntityName, nullable: true })
    async remove(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => RemoveInput) input: D
    ): Promise<T | null> {
      const { id } = fromGlobalId(input.id)

      const entityToRemove = await ctx.em.findOneOrFail(entity, { id })

      if (entityToRemove) {
        await ctx.em.removeAndFlush(entityToRemove)
        return entityToRemove as T
      }
      return null
    }
  }

  return BaseCRUDResolver
}

const mikroErrorHandler = (error: unknown): never => {
  logger.error(error)
  if (error instanceof UniqueConstraintViolationException) {
    throw new GraphQLError('Database Error: Unique Constraint Violation. View log for details')
  } else if (error instanceof NotFoundError) {
    throw new GraphQLError('Database Error: Entity not found in database')
  } else {
    throw new GraphQLError(error as string)
  }
}
