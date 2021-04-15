import { ElMessage } from 'element-plus'
import type { GraphQLError } from 'graphql'
import { reactive } from 'vue'

type Primitive = string | number | boolean

export const pickProperties = <T extends Record<string, Primitive>>(
  obj: T,
  keys: (keyof T)[]
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key as never)))

export const displayErrors = (errors: readonly GraphQLError[]): void => {
  for (const error of errors) {
    ElMessage.error(error.message)
  }
}

export const mapToReactive = <T extends Record<string, unknown>>(array: T[]): T[] =>
  array.map((entry) => reactive(entry) as T)

  // arrayRef.value = arrayRef.value.filter((val) => val !== ref)