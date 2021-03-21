import { EntityManager } from '@mikro-orm/core'
import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import { Service } from 'typedi'

import { Movie } from '../entities/movie.entity'

@Service()
export class MovieRepository {
  constructor(private em: EntityManager) {}
  async getAll(info: GraphQLResolveInfo): Promise<Movie[]> {
    const select = new PrismaSelect(info)
    const fieldMap = info.fieldNodes
  }
}
