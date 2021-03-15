import { ICellRendererComp, ICellRendererParams } from '@ag-grid-community/core'

export default class CheckboxCellRenderer implements ICellRendererComp {
  private eGui!: HTMLInputElement
  params!: ICellRendererParams

  init(params: ICellRendererParams): void {
    this.params = params

    this.eGui = document.createElement('input')
    this.eGui.type = 'checkbox'
    this.eGui.checked = params.value

    this.eGui.addEventListener('click', this.checkedHandler.bind(this))
  }

  checkedHandler(e: Event): void {
    const el = e.target as HTMLInputElement
    //el.checked = false
    const colId = this.params.column.getColId()
    this.params.node.setDataValue(colId, el.checked)
    //e.preventDefault()
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.eGui.checked = params.value

    return true
  }

  destroy(): void {
    this.eGui.removeEventListener('click', this.checkedHandler)
  }
}
