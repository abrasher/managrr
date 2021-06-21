import { resolveSelections } from '@jenyus-org/graphql-utils'
import { NotFoundError, UniqueConstraintViolationException, wrap } from '@mikro-orm/core'
import { EntityClass, EntityName } from '@mikro-orm/core/typings'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
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
  Query,
  Resolver,
} from 'type-graphql'

import { logger } from '@/backend/lib/logger'
import { INode } from '@/backend/typings/interfaces'

import { ContextType } from '../types'

const getName = <T>(entity: EntityName<T>): string => {
  return typeof entity === 'string' ? entity : entity.name.toString()
}

const stripTypename = (fieldArray: string[]): string[] => {
  return fieldArray.filter((field) => field !== '__typename')
}

export const getFieldsAndSelections = (
  name: string,
  info: GraphQLResolveInfo
): { fields: string[]; relations: string[] } => {
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

@InputType()
class WhereInput {
  @Field()
  id!: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseResolver = (entity: EntityClass<INode>) => {
  const entityName = getName(entity)
  const findAllName = pluralize(camelCase(entityName))

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query((returns) => entity, { name: camelCase(entityName) })
    async getOne(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input') input: WhereInput
    ): Promise<INode | null> {
      const { id } = fromGlobalId(input.id)

      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      return await ctx.em.findOne(entity, { id }, { populate: relations, fields })
    }

    @Query((returns) => [entity], { name: findAllName })
    async getAll(@Ctx() ctx: ContextType, @Info() info: GraphQLResolveInfo): Promise<INode[]> {
      const { relations, fields } = getFieldsAndSelections(findAllName, info)

      return ctx.em.find(entity, {}, { populate: relations, fields })
    }
  }

  return BaseResolver
}

export type MutationPayload<T> = Promise<IPayload<T> | null>

interface IPayload<T> {
  entity: T | null
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createBaseCRUDResolver = <T extends INode>(
  entity: EntityClass<T>,
  addInput: ClassType,
  updateInput: ClassType,
  removeInput?: ClassType
) => {
  const entityName = getName(entity)
  const addEntityName = `add${entityName}`
  const updateEntityName = `update${entityName}`
  const removeEntityName = `remove${entityName}`
  const upsertEntityName = `upsert${entityName}`

  const baseResolver = createBaseResolver(entity)

  function RemoveInputType() {
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

  const AddInput = addInput
  const UpdateInput = updateInput
  const RemoveInput = removeInput ?? RemoveInputType()
  const UpsertInput = UpsertInputType()

  @Resolver({ isAbstract: true })
  class BaseCRUDResolver extends baseResolver {
    @Mutation((returns) => entity, { name: addEntityName })
    async add(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => AddInput) input: T
    ): Promise<T> {
      const entityToCreate = ctx.em.create(entity, input)

      try {
        await ctx.em.persistAndFlush(entityToCreate)
      } catch (error) {
        mikroErrorHandler(error)
      }

      return entityToCreate
    }
    @Mutation((returns) => entity, { name: upsertEntityName })
    async upsert(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => UpsertInput) input: T
    ) {
      if (!input.id) {
        const { id, ...data } = input
        return this.add(ctx, info, data as T)
      }

      const { id } = fromGlobalId(input.id)
      logger.info(`upsert id: ${id}`)

      const entityToUpdate = await ctx.em.findOne(entity, { id })

      if (entityToUpdate) {
        return this.update(ctx, info, input)
      }
    }

    @Mutation((returns) => entity, { name: updateEntityName, nullable: true })
    async update(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => UpdateInput) input: T
    ): Promise<T | null> {
      const { id } = fromGlobalId(input.id)

      try {
        const entityToUpdate = await ctx.em.findOneOrFail(entity, { id })
        wrap(entityToUpdate).assign({ ...input, id })
        await ctx.em.flush()
        return entityToUpdate 
      } catch (error) {
        mikroErrorHandler(error)
        return null
      }
    }

    @Mutation((returns) => entity, { name: removeEntityName, nullable: true })
    async remove(
      @Ctx() ctx: ContextType,
      @Info() info: GraphQLResolveInfo,
      @Arg('input', (type) => RemoveInput) input: T
    ): Promise<T | null> {
      const { id } = fromGlobalId(input.id)

      const entityToRemove = await ctx.em.findOneOrFail(entity, { id })

      if (entityToRemove) {
        await ctx.em.removeAndFlush(entityToRemove)
        return entityToRemove 
      }
      return null
    }
  }

  return BaseCRUDResolver
}

const mikroErrorHandler = (error: unknown): never => {
  logger.error(error)
  if (error instanceof UniqueConstraintViolationException) {
    throw new GraphQLError('Database Error: Unique Constraint Violation. View Log for Details')
  } else if (error instanceof NotFoundError) {
    throw new GraphQLError('Database Error: Entity not found in database')
  } else {
    throw new GraphQLError(error as string)
  }
}
