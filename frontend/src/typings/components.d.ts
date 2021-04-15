import type { ElButton, ElCheckbox,ElForm, ElTabs } from 'element-plus'

// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof ElButton
    ElTabs: typeof ElTabs
    ElForm: typeof ElForm
    ElCheckbox: typeof ElCheckbox
  }
}

export {}
