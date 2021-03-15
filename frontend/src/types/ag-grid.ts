import {
  ColDef,
  ValueSetterParams,
  ValueGetterParams,
  GridOptions,
  ColGroupDef,
} from '@ag-grid-community/core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AddData<T extends Record<string, any>, K> = Omit<T, 'data'> & {
  data: K
}

interface ISingleColDef<T> extends ColDef {
  valueSetter?: (params: AddData<ValueSetterParams, T>) => boolean
  valueGetter?: (params: AddData<ValueGetterParams, T>) => unknown
}

interface IGroupColDef<T> extends Omit<ColGroupDef, 'children'> {
  children: Array<IColDef<T>>
}

export type IColDef<T> = ISingleColDef<T> | IGroupColDef<T>

export interface IGridOptions<T> extends GridOptions {
  rowData?: T[]
  columnDefs: Array<IColDef<T>>
}
