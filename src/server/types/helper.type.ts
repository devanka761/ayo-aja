export interface KiriminObject {
  id: string
  data?: object | null | undefined
}

export type RepBack = {
  ok: boolean
  code: number
  msg: string
  data?: object | null
}

export type UserUID = string|number|undefined 