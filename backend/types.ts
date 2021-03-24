import { BaseEntity, Collection, EntityManager } from '@mikro-orm/core'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { ContainerInstance } from 'typedi'

import { Settings } from './entities'

export interface ContextType {
  em: EntityManager<SqliteDriver>
  requestId: string
  container: ContainerInstance
}

export type EntityInput<T> = RemoveBaseEntity<Omit<T, keyof RelationsToArray<T>> & RelationsToArray<T>>

type RelationsToArray<T> = {
  [P in keyof T as T[P] extends Collection<infer K> | Record<string, any> ? P : never]?:
    | CollectionToArray<T[P]>
    | undefined
}

type CollectionToArray<T> = T extends Collection<infer K> ? K[] : T

/**
 * Resolves problem that MikroORM requires relationships to be defined as collections
 */
export type ResolverType<T> = {
  [P in keyof T]?: (root: T, ...args: unknown[]) => CollectionToArray<T[P]> | Promise<CollectionToArray<T[P]>>
}

export type TypeConvert<T> = {
  [P in keyof T]?: CollectionToArray<T[P]>
}

type Relation<T> = {
  [P in keyof T as T[P] extends Array<unknown> | Record<string | number | symbol, unknown> ? P : never]?: T[P]
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

export type EntityData<T> = Combine<RemoveBaseEntity<RemoveRecursive<Remove<T>>>>

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T
