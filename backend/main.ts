import 'reflect-metadata'

import { MikroORM } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/sqlite'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema, registerEnumType, ResolverData } from 'type-graphql'
import Container from 'typedi'

import { CollectionMode, CollectionOrder } from './entities/movie.entity'
import { Availablity } from './entities/radarr.entity'
import config from './mikro-orm.config'
import { LibraryType } from './modules/plexapi'
import { initImporter } from './tasks/MovieImporter'
import { seedDatabase } from './tasks/seedDatabase'
import { ContextType } from './types'

dotenv.config()

async function bootstrap() {
  try {
    const orm = await MikroORM.init(config)

    initImporter(orm.em.fork() as EntityManager)

    await seedDatabase(orm.em)

    registerEnumType(LibraryType, {
      name: 'PlexLibraryType',
    })

    registerEnumType(CollectionMode, {
      name: 'PlexCollectionMode',
    })

    registerEnumType(CollectionOrder, {
      name: 'PlexCollectionOrder',
    })

    registerEnumType(Availablity, {
      name: 'RadarrAvailablity',
    })

    const schema = await buildSchema({
      resolvers: [__dirname + '/resolvers/*.resolver.ts'],
      emitSchemaFile: true,
      container: ({ context }: ResolverData<ContextType>) => Container.of(context.requestId),
    })

    const app = express()

    const server = new ApolloServer({
      schema,
      context: () => {
        const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
        const container = Container.of(requestId)
        const context = {
          requestId,
          container,
          em: orm.em.fork(),
        }
        container.set(EntityManager, orm.em.fork())
        container.set('context', context)
        return context
      },
    })

    server.applyMiddleware({
      app,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    })

    const port = process.env.PORT ?? 4000

    app.listen({ port }, () => {
      const url = `http://localhost:${port}${server.graphqlPath}`
      console.log(`Server is listening at ${url}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap().catch((err) => console.error(err))
