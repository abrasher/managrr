import 'reflect-metadata'

import { EntityManager } from '@mikro-orm/sqlite'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema, ResolverData } from 'type-graphql'
import Container from 'typedi'
import { v4 as uuidv4 } from 'uuid'

import type { IRequest } from '@/backend/typings/express'

import { logger } from './common/logger'
import { storage } from './loaders/asyncStorage'
import { getORM } from './loaders/database'
import { prepareDatabase } from './loaders/database'
import { registerEnums } from './loaders/graphql'
import { Settings } from './modules/system/settings.entity'
import { ContextType } from './types'

dotenv.config()

async function bootstrap() {
  try {
    await prepareDatabase()

    const orm = await getORM()
    const settings = await orm.em.findOneOrFail(Settings, { id: 'main' })

    // Register TypeGraphQL Enums
    registerEnums()

    const schema = await buildSchema({
      resolvers: [__dirname + '/resolvers/*.resolver.ts', __dirname + '*/**/*.resolver.ts'],
      emitSchemaFile: true,
      container: ({ context }: ResolverData<ContextType>) => Container.of(context.requestId),
    })

    const app = express()

    const server = new ApolloServer({
      schema,
      context: async ({ req }: { req: IRequest }) => {
        const em = storage.getStore()!

        const headerToken = req.headers.authorization

        if (!headerToken) return new AuthenticationError('No API Key provided')

        const { apiKey } = await em.findOneOrFail(Settings, { id: 'main' })

        if (apiKey !== headerToken) return new AuthenticationError('Invalid API Key provided')

        const requestId = uuidv4()
        const container = Container.of(requestId)
        const context = {
          requestId,
          container,
          em,
        }
        container.set(EntityManager, orm.em.fork())
        container.set('context', context)
        return context
      },
    })

    app.use(cookieParser())
    app.use(express.json())
    app.use(cors())

    app.use((req, res, next) => {
      storage.run(orm.em.fork(true, true), () => next())
    })

    app.use('/img', express.static('assets'))

    server.applyMiddleware({
      app,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    })

    const port = process.env.PORT ?? settings.port ?? 9989

    app.listen({ port }, () => {
      const url = `http://localhost:${port}${server.graphqlPath}`
      logger.info(`Managrr: Server is listening at ${url}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap().catch((err) => console.error(err))
