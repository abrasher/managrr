import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import { Service } from 'typedi'

import { Movie } from '../entities/movie.entity'
import { BaseRepository } from './base.repository'

@Service()
export class MovieRepository extends BaseRepository {
  async getAll(info: GraphQLResolveInfo): Promise<Movie[]> {
    const select = new PrismaSelect(info)
    const fieldMap = info.fieldNodes
  }
}
