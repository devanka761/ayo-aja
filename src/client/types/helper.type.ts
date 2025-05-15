type PossibleData = {
  [key:string]: string|number|object|PossibleData|string[]|number[]|object[]|PossibleData[]
}
export interface KiriminHttpResponse {
  ok: boolean
  code: number
  msg: string
  data?: PossibleData
}

export type Languages = "id"|"en";

export interface LocalesLang {
  lang: string
}
export interface LangObject {
  [key:string]: string
}
interface ModalObject {
  ic: string
  msg: string
}
export interface ModalAlert extends ModalObject {
  okx: string
  ok?: VoidFunction
}
export interface ModalConfirm extends ModalAlert {
  cancelx: string
  cancel?: VoidFunction
}
export interface ModalPrompt extends ModalConfirm {
  tarea?: boolean
  iregex?: RegExp
  max?: number
  min?: number
  pholder?: string
  val?: string
}

interface SelectionItem {
  id: string
  label: string
  activated?: boolean
}

export interface ModalSelect extends ModalConfirm {
  items: SelectionItem[]
}