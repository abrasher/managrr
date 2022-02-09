import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const typePolicies = {
  PlexSharedServer: {
    fields: {
      libraries: {
        merge: (existing: [], incoming: []) => {
          return incoming
        },
      },
    },
  },
}

const client = new ApolloClient({
  uri: '/graphql',
  credentials: 'same-origin',
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
  cache: new InMemoryCache({
    typePolicies,
  }),
})

export interface Balls {
  size: number
}

export { client }
