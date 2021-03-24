import { Arg, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { getMovieImporter } from '../tasks/importMovie'

@Service()
@Resolver()
export class TaskResolver {
  @Query((returns) => String)
  importMovies(@Arg('machineIdentifier', (type) => String) machineId: string): string {
    const movieImporter = getMovieImporter()

    if (movieImporter.status === 'running') {
      return 'Movie Importer Already Running'
    }

    void movieImporter.import(machineId)

    return 'Movie Importer Started'
  }

  @Query((returns) => String)
  taskState(): string {
    const movieImporter = getMovieImporter()
    return movieImporter.status
  }
}
