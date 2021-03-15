import 'reflect-metadata'

import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema, registerEnumType } from 'type-graphql'
import { Container } from 'typedi'

import {
  CollectionMode,
  CollectionOrder,
  LibraryType,
} from './entities/movie.entity'
import { prisma } from './prisma'
import { PlexAccountResolver, SettingsResolver } from './resolvers'
import { MovieResolver } from './resolvers/movie.resolver'
import { ContextType } from './types'

async function bootstrap() {
  try {
    Container.set(PrismaClient, prisma)

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
      container: Container,
      emitSchemaFile: true,
    })

    const app = express()

    const server = new ApolloServer({
      schema,

      context: (): ContextType => ({
        prisma,
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
