import 'reflect-metadata'

import { RequestContext } from '@mikro-orm/core'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema, ResolverData } from 'type-graphql'
import Container from 'typedi'
import { v4 as uuidv4 } from 'uuid'

import { logger } from './common/logger'
import { getORM } from './loaders/database'
import { prepareDatabase } from './loaders/database'
import { registerEnums } from './loaders/graphql'
import { Settings } from './modules/system/settings.entity'
import { Context } from './types'
import type { IExpressContext } from './typings/express'

dotenv.config()

async function bootstrap() {
  try {
    await prepareDatabase()

    const orm = await getORM()
    const settings = await orm.em.fork().findOneOrFail(Settings, { id: 'main' })

    // Register TypeGraphQL Enums
    registerEnums()

    const schema = await buildSchema({
      resolvers: [__dirname + '/resolvers/*.resolver.ts', __dirname + '*/**/*.resolver.ts'],
      emitSchemaFile: true,
      container: ({ context }: ResolverData<Context>) => context.container,
    })

    const app = express()

    const server = new ApolloServer<IExpressContext>({
      schema,
      context: async ({ req }) => {
        const em = RequestContext.getEntityManager()!

        console.log(req.body)

        const headerToken = req.headers.authorization

        if (!headerToken) throw new AuthenticationError('No API Key provided')

        const { apiKey } = await em.findOneOrFail(Settings, { id: 'main' })

        if (apiKey !== headerToken) throw new AuthenticationError('Invalid API Key provided')

        const requestId = uuidv4()
        const container = Container.of(requestId)
        const context = {
          requestId,
          container,
          em,
        }

        container.set('context', context)
        return context
      },
      plugins: <ApolloServerPlugin<Context>[]>[
        {
          requestDidStart: async (req) => ({
            willSendResponse: async (req) => {
              Container.reset(req.context.requestId)
            },
          }),
        },
      ],
    })

    app.use(cookieParser())
    app.use(express.json())

    app.use('/img', express.static('assets'))
    app.use((req, res, next) => {
      RequestContext.create(orm.em, next)
    })

    await server.start()

    server.applyMiddleware({
      app,
      // cors: {
      //   origin: 'http://localhost:3000',
      //   credentials: true,
      // },
      cors: true,
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
