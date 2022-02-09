import type { TypedDocumentNode } from '@apollo/client'
import type { VariablesOf } from '@graphql-typed-document-node/core'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'

import { client } from '~/graphql/client'
import type { RecursiveRemove } from '~/lib/helpers'
import { displayErrors, pickProperties, stripProperty } from '~/lib/helpers'
import type { UnionToTuple } from '~/typings/common'

interface NestedNode {
  [p: string]: Node | null
}

interface Node {
  __typename: string
  id: string
  [k: string]: unknown
}

export const useQuery = <D, V>(
  document: TypedDocumentNode<D, V>
): { data: Ref<RecursiveRemove<D, '__typename'> | undefined>; loading: Ref<boolean> } => {
  const loading = ref(true)
  const data = ref<RecursiveRemove<D, '__typename'>>()

  void client
    .query({ query: document, returnPartialData: false })
    .then((result) => {
      data.value = stripProperty(result.data, '__typename')

      loading.value = false
    })
    .catch((error) => console.error(error))

  return {
    loading,
    data,
  }
}

export const useMutation = <T, V>(
  document: TypedDocumentNode<T, { input: V }>
): { fetching: Ref<boolean>; execute: (variables: V) => Promise<T> } => {
  const fetching = ref(false)

  return {
    fetching,
    execute: (mutationVariables: V) => {
      fetching.value = true
      return client
        .mutate({
          mutation: document,
          variables: {
            input: mutationVariables,
          },
        })
        .then((res) => {
          fetching.value = false
          if (!res.data) {
            console.error(res)
            throw new Error('No Data Returned')
          }
          return res.data
        })
    },
  }
}

export const useUpsertMutation = <D extends NestedNode, V extends Record<string, unknown>>(
  document: TypedDocumentNode<D, { input: V }>,
  variables: UnionToTuple<keyof V & string>
) => {
  return async (ref: V): Promise<void> => {
    // @ts-expect-error typescript poops itself here from UnionToTuple
    const input = pickProperties(ref, variables)

    const data = await mutate(document, input)

    if (!data) return

    Object.assign(ref, data)
  }
}

export const useRemoveMutation = <D extends NestedNode, V extends { id: string | null }>(
  document: TypedDocumentNode<D, { input: V }>,
  arrayRef: Ref<V[]>
) => {
  return async (ref: V): Promise<void> => {
    const { id } = ref

    if (id) {
      const data = await mutate(document, { id })
      if (!data) return
    }

    // Remove the value from the array
    arrayRef.value = arrayRef.value.filter((entry) => entry !== ref)
  }
}

const mutate = async <D extends NestedNode>(
  document: TypedDocumentNode<D>,
  vars: VariablesOf<typeof document>
) => {
  try {
    const result = await client.mutate({
      mutation: document,
      variables: { input: vars },
    })

    if (result.errors) displayErrors(result.errors)
    if (!result.data) return

    const queryName = Object.keys(result.data)[0]
    const data = result.data[queryName]

    ElMessage.success('Saved Successfully')

    return data
  } catch (error) {
    // Figure out how errors are handled by apollo
    console.error(error)
    throw new Error(error)
  }
}
