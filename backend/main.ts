import 'reflect-metadata'

import { EntityManager, MikroORM } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema, registerEnumType } from 'type-graphql'

import {
  CollectionMode,
  CollectionOrder,
  LibraryType,
} from './entities/movie.entity'
import config from './mikro-orm.config'
import { PlexAccountResolver, SettingsResolver } from './resolvers'
import { MovieResolver } from './resolvers/movie.resolver'

async function bootstrap() {
  try {
    const orm = await MikroORM.init(config)

    registerEnumType(LibraryType, {
      name: 'PlexLibraryType',
    })

    registerEnumType(CollectionMode, {
      name: 'PlexCollectionMode',
    })

    registerEnumType(CollectionOrder, {
      name: 'PlexCollectionOrder',
    })

    const schema = await buildSchema({
      resolvers: [SettingsResolver, PlexAccountResolver, MovieResolver],
      emitSchemaFile: true,
    })

    const app = express()

    const server = new ApolloServer({
      schema,
      context: () => ({
        em: orm.em.fork(),
      }),
    })

    server.applyMiddleware({
      app,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    })

    app.listen({ port: 4000 }, () => {
      console.log(`Server is listening at ${server.graphqlPath}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap().catch((err) => console.error(err))
