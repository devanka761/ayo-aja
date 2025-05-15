export type ValidateObj = {
  [key:string]: "string"|"number"|"boolean"
}

export type ValidateArr = string[];

type PossibleValue = string|number|boolean|object

type PossibleData = {
  [key:string]: PossibleValue|PossibleData
}

export type PayloadData = PossibleData;