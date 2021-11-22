import axios from 'axios'
import { writeFileSync } from 'fs'
import { GraphQLError } from 'graphql'
import { join } from 'path'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { cache } from '@/backend/common/cache'
import { getTasks, startTask } from '@/backend/modules/jobs/BaseTask'
import { PosterGenerator } from '@/backend/modules/library/PosterGenerator'
import { System, Task } from '@/backend/modules/system/system.entity'
import { version } from '@/backend/package.json'
import { ContextType } from '@/backend/types'

import { PosterGenerationInput, RunTaskInput } from './system.input'

@Service()
@Resolver((returns) => System)
export class SystemResolver {
  @Query(() => System)
  system(@Ctx() context: ContextType): System {
    const tasksMap = getTasks()

    const tasks: Task[] = []
    tasksMap.forEach((data, name) =>
      tasks.push({
        name,
        status: data.status,
        completed: data.completed,
        started: data.started,
      })
    )

    return {
      version,
      tasks,
    }
  }

  @Mutation((returns) => String)
  async previewPoster(
    @Ctx() context: ContextType,
    @Arg('input') input: PosterGenerationInput
  ): Promise<string> {
    const randomId = Math.random().toString(36).substring(7)
    const posterGen = new PosterGenerator(input)

    const res = await cache.get(
      'test-poster',
      axios.get<Buffer>('https://www.themoviedb.org/t/p/w1280/pgqgaUx1cJb5oZQQ5v0tNARCeBp.jpg', {
        responseType: 'arraybuffer',
      })
    )

    const poster = await posterGen.generate({
      posterImage: res.data,
      imdbRating: 6.4,
      metacriticRating: 59,
      rottenTomatoesRating: 75,
    })

    if (!poster) throw new GraphQLError('Unknown Error While Generating Preview')

    writeFileSync(join(process.cwd(), 'assets', `preview.jpeg`), poster)

    return join('/img', `preview.jpeg?t=${randomId}`)
  }
}
