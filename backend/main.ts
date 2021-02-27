import "reflect-metadata"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { SettingsResolver } from "./resolvers"
import { ContextType } from "./types"
import { PrismaClient } from "@prisma/client"
import { prisma } from "./prisma"
import { Container } from "typedi"

async function bootstrap() {
  try {
    Container.set(PrismaClient, prisma)

    const schema = await buildSchema({
      resolvers: [SettingsResolver],
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

    server.applyMiddleware({ app })

    app.listen({ port: 4000 }, () => {
      console.log(`Server is listening at ${server.graphqlPath}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap().catch((err) => console.error(err))
