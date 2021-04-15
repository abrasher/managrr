import type { TypedDocumentNode } from '@apollo/client'
import type { VariablesOf } from '@graphql-typed-document-node/core'
import { ElMessage } from 'element-plus'
import { displayErrors, pickProperties } from 'src/lib/helpers'
import type { Ref } from 'vue'

import { client } from '@/graphql/client'
import type { UnionToTuple } from '@/typings/common'

interface NestedNode {
  [p: string]: Node | null
}

interface Node {
  id: string
  [k: string]: unknown
}

type Primitive = string | number | boolean

export const useUpsertMutation = <D extends NestedNode, V extends Record<string, Primitive>>(
  document: TypedDocumentNode<D, { input: V }>,
  variables: UnionToTuple<keyof V & string>
) => {
  return async (ref: V): Promise<void> => {
    // @ts-expect-error typescript poops itself here from UnionToTuple
    const input = pickProperties(ref, variables)

    try {
      const result = await client.mutate({
        mutation: document,
        variables: { input },
        errorPolicy: 'all',
      })
      if (result.errors) displayErrors(result.errors)
      if (!result.data) return

      const data = Object.values(result.data)[0]

      Object.assign(ref, data)

      ElMessage.success('Saved Successfully ')
    } catch (error) {
      ElMessage.error(`GraphQL Error: ${error.message}`)
    }
  }
}

export const useRemoveMutation = <D extends NestedNode, V extends { id: string | null }>(
  document: TypedDocumentNode<D, { input: V }>,
  arrayRef: Ref<V[]>
) => {
  return async (ref: V): Promise<void> => {
    const { id } = ref

    if (!id) {
      const data = await mutate(document, { id })
      if (!data) return
    }

    arrayRef.value = arrayRef.value.filter((entry) => entry !== ref)
  }
}

const mutate = async <D extends NestedNode>(
  document: TypedDocumentNode<D>,
  input: VariablesOf<typeof document>
) => {
  try {
    const result = await client.mutate({
      mutation: document,
      variables: { input },
    })
    console.log('Result:', result)
    if (result.errors) displayErrors(result.errors)
    if (!result.data) return

    const queryName = Object.keys(result.data)[0]
    const data = result.data[queryName]

    return data
  } catch (error) {
    // Figure out how errors are handled by apollo
    console.error(error)
    throw new Error(error)
  }
}
