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
  array.map((entry) => reactive(JSON.parse(JSON.stringify(entry))) as T)

export type RecursiveRemove<T, K extends string> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key] extends Record<string, unknown>
    ? RecursiveRemove<T[Key], K>
    : T[Key] extends Array<infer J>
    ? RecursiveRemove<J, K>
    : T[Key]
}

export const stripProperty = <T, K extends string>(obj: T, prop: K): RecursiveRemove<T, K> => {
  const { [prop]: _, ...stripedObj } = obj
  for (const key of Object.keys(stripedObj)) {
    if (Array.isArray(stripedObj[key])) {
      stripedObj[key] = stripedObj[key].map((val) => stripProperty(val, prop))
    } else if (typeof stripedObj[key] === 'object' && stripedObj[key] !== null) {
      stripedObj[key] = stripProperty(stripedObj[key], prop)
    }
  }
  return stripedObj
}
