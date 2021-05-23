// import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
// import { Service } from 'typedi'

// import { Mutation } from '../../frontend/src/graphql/generated-types'
// import { User } from '../entities/user.entity'
// import { ContextType } from '../types'
// import { UserLoginInput } from './types/user.type'

// @Service()
// @Resolver()
// export class UserResolver {
//   @Query(() => [User])
//   async users(@Ctx() context: ContextType): Promise<User[]> {
//     const user = await context.em.find(User, {})

//     return user
//   }
// }
