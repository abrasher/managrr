import { prisma } from './prisma'

export interface ContextType {
  prisma: typeof prisma
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Collection } from '@mikro-orm/core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CollectionToArray<T> = T extends Collection<any, unknown> ? T[0][] : string

/**
 * Resolves problem that MikroORM requires relationships to be defined as collections
 */
export type ResolverType<T extends object> = {
  [P in keyof T]?: (
    root: T,
    ...args: any[]
  ) => CollectionToArray<T[P]> | Promise<CollectionToArray<T[P]>>
}

export type TypeConvert<T extends object> = {
  [P in keyof T]?: CollectionToArray<T[P]>
}
