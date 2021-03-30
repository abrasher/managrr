import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { User } from '../entities/user.entity'
import { ContextType } from '../types'

@Service()
@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() context: ContextType): Promise<User[]> {
    const user = await context.em.find(User, {})

    return user
  }
}
