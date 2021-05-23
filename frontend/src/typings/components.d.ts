import type {
  ElButton,
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElTabs,
} from 'element-plus'
import type _FormItem from 'element-plus/lib/el-form-item'

// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof ElButton
    ElTabs: typeof ElTabs
    ElForm: typeof ElForm
    ElCheckbox: typeof ElCheckbox
    ElInputNumber: typeof ElInputNumber
    ElInput: typeof ElInput
    ElFormItem: typeof ElFormItem
    ElOption: typeof ElOption
    ElSelect: typeof ElSelect
  }
}

export {}
