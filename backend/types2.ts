import { BaseEntity, Collection } from '@mikro-orm/core'

import { ExpandRecursively } from './types'

type Relation<T> = {
  [P in keyof T as T[P] extends
    | Array<unknown>
    | Record<string | number | symbol, unknown>
    ? P
    : never]?: T[P]
}

type Combine<T> = Omit<T, keyof Relation<T>> & Relation<T>

type Remove<Child, Parent = never> = {
  [Key in keyof Child as Child[Key] extends Parent
    ? never
    : Child[Key] extends Collection<infer Q>
    ? Q extends Parent
      ? never
      : Key
    : Key]: Child[Key] extends Collection<infer Q>
    ? Remove<Q, Child>[]
    : Child[Key] extends string | undefined | boolean | number | null
    ? Child[Key]
    : Remove<Child[Key], Child>
}

type RemoveBaseEntity<T> = Omit<T, keyof BaseEntity<T, keyof T>>

type RemoveRecursive<T> = {
  [K in keyof T]: T[K] extends Array<infer Q>
    ? Combine<RemoveRecursive<RemoveBaseEntity<Q>>>[]
    : T[K] extends Record<string | number | symbol, unknown>
    ? Combine<RemoveRecursive<RemoveBaseEntity<T[K]>>>
    : T[K]
}

export type EntityData<T> = ExpandRecursively<
  Combine<RemoveBaseEntity<RemoveRecursive<Remove<T>>>>
>
