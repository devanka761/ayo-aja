export type ValidProviders = "kirimin"|"discord"|"github"|"google";
export interface TempUserData {
  id?: string|number
  email: string|null
  provider: ValidProviders
}
export interface SessionUserData extends TempUserData {
  id: string|number
}
export type TempUserDatum = [TempUserData, ...TempUserData[]];
export type SessionUserDatum = [SessionUserData, ...SessionUserData[]];