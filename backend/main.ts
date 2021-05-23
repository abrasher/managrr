import 'reflect-metadata'

import { EntityManager } from '@mikro-orm/sqlite'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { buildSchema, ResolverData } from 'type-graphql'
import Container from 'typedi'
import type { IRequest } from '@/typings/express'
import { v4 as uuidv4 } from 'uuid'

import { getUser, login, logout, refresh } from '@/lib/auth'

import { User } from './entities/user.entity'
import { logger } from './lib/logger'
import { getSystemSettings } from './lib/systemSettings'
import { storage } from './loaders/asyncStorage'
import { getOrm } from './loaders/database'
import { registerEnums } from './loaders/graphql'
import { loadTasks } from './loaders/taskLoader'
import { seedDatabase } from './tasks/seedDatabase'
import { ContextType } from './types'

dotenv.config()
const DEVELOPMENT = true

async function bootstrap() {
  try {
    const orm = await getOrm()
    const systemSettings = getSystemSettings()

    await seedDatabase(orm.em)

    // Register TypeGraphQL Enums
    registerEnums()
    loadTasks()

    const schema = await buildSchema({
      resolvers: [__dirname + '/resolvers/*.resolver.ts', __dirname + '*/**/*.resolver.ts'],
      emitSchemaFile: true,
      container: ({ context }: ResolverData<ContextType>) => Container.of(context.requestId),
    })

    const app = express()

    const server = new ApolloServer({
      schema,
      context: async ({ req }: { req: IRequest }) => {
        const em = storage.getStore()

        if (!em) return new Error('AsyncLocalStorage is not defined')

        const { accessToken, refreshToken } = req.cookies

        let user: User | null

        if (!DEVELOPMENT) {
          if (!accessToken || !refreshToken) throw new AuthenticationError('Invalid Token Supplied')
          user = await getUser(accessToken, em)
        } else {
          user = await em.findOne(User, { username: 'admin' })
        }

        if (!user) throw new AuthenticationError('Not Logged In')

        const requestId = uuidv4()
        const container = Container.of(requestId)
        const context = {
          user,
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

    app.use('/login', login)
    app.use('/logout', logout)
    app.use('/refresh', refresh)

    app.use('/img', express.static('assets'))

    server.applyMiddleware({
      app,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    })

    const port = process.env.PORT ?? systemSettings.port ?? 4000

    app.listen({ port }, () => {
      const url = `http://localhost:${port}${server.graphqlPath}`
      logger.info(`Managrr: Server is listening at ${url}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap().catch((err) => console.error(err))
