import { UserInputError } from 'apollo-server-errors'
import { GraphQLResolveInfo } from 'graphql'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
import { Arg, Ctx, FieldResolver, ID, Info, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'

import { ContextType } from '../../types'
import { Node } from './node.entity'

type INode = Node<unknown>

@Service()
@Resolver(() => Node)
export class NodeResolver {
  @FieldResolver(() => String)
  globalId(@Root() root: { id: string }, @Info() info: GraphQLResolveInfo): string {
    return toGlobalId(info.parentType.name, root.id)
  }

  private async fetcher(globalId: string, context: ContextType) {
    const { type, id } = fromGlobalId(globalId)

    console.log(type)

    if (type === '') {
      throw new UserInputError('Unable to Parse Id')
    }

    const repository = context.em.getRepository<INode>(type)

    return await repository.findOne({ id })
  }

  @Query(() => Node, { nullable: true })
  node(@Arg('id', () => ID) id: string, @Ctx() context: ContextType): Promise<INode | null> {
    return this.fetcher(id, context)
  }

  @Query(() => [Node], { nullable: true })
  nodes(
    @Arg('ids', () => [ID]) ids: string[],
    @Ctx() context: ContextType
  ): Promise<INode | null>[] {
    return ids.map((id) => this.fetcher(id, context))
  }
}
