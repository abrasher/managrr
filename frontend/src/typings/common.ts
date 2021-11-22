export type MarkPartial<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | undefined }

export type { IColDef, IGridOptions } from './ag-grid'

export type UnionToTuple<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : UnionToTuple<Exclude<U, S>, [...R, S]>
}[U] &
  string[]
