import { SessionUserDatum, TempUserDatum } from "./binder.type"

export interface TemporaryAuth {
  email: string
  otp: {
    code: string|number
    expiry: Date | number
  }
  rate: number
  cd?: number
}

export interface UserFixed {
  id: string
  uname: string
  email: string
  dname: string
  data: SessionUserDatum
  b?: number[]
  bio?: string
  img?: string
  req?: string[]
  zzz?: object[]
  peer?: string
  lu?: number
  ld?: number
  lb?: number
}
export interface UserTemp {
  id: string
  data: TempUserDatum
  peer?: string
  zzz?: object[]
}
export type User = UserFixed|UserTemp

interface ChatObject {
  u: string
  ts: string
  w?: string[]
  txt?: string
  e?: string
  i?: string
  d?: string
  r?: string
  v?: string
  vc?: 1 | 0 | null
  rj?: 1 | 0 | null
  dur?: string
}

export interface Chat {
  u: string[]
  f?: 1 | 0 | null
  c: { [ key: string ] : ChatObject }
}

export interface Group extends Chat {
  o: string
  n: string
  i?: string
  t?: string
  b?: number[]
  l?: string
}

interface PostCommentObject {
  u: string
  txt: string
  ts: string
}

export interface Post {
  u: string
  ts: string
  l?: string[]
  i: string
  txt?: string
  c?: { [ key: string ] : PostCommentObject }
}

export interface Call {
  t: 1 | 0
  o: number
  st: 0
  u: Array<{
    id: string
    j: boolean
  }>
}

export type Databases = {
  u: { [ key: string ] : User }
  t: { [ key: string ] : TemporaryAuth }
  c: { [ key: string ] : Chat }
  g: { [ key: string ] : Group }
  p: { [ key: string ] : Post }
  v: { [ key: string ] : Call }
}