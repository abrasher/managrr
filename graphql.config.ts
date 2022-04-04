import type { IGraphQLConfig } from 'graphql-config'

const config: IGraphQLConfig = {
  schema: './packages/backend/schema.gql',
  documents: './packages/frontend/src/graphql/**/*.graphql',
}

export default config
