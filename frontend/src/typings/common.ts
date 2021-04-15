export type MarkPartial<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | undefined }

export type { IColDef, IGridOptions } from './ag-grid'

// export type UnionToTuple<T> = (
//   (T extends any ? (t: T) => T : never) extends infer U
//     ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
//       ? V
//       : never
//     : never
// ) extends (_: any) => infer W
//   ? [...UnionToTuple<Exclude<T, W>>, W]
//   : []

export type UnionToTuple<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : UnionToTuple<Exclude<U, S>, [...R, S]>
}[U] &
  string[]
