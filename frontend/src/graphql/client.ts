import { ApolloClient, InMemoryCache } from '@apollo/client/core'

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
    addTypename: false,
  }),
})

export { client }
