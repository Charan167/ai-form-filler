export interface IFormFields {
  [key: string]:
    | Record<
        string,
        | string
        | number
        | null
        | boolean
        | string[]
        | Record<string, string | number | boolean | string[] | number[] | null>
        | Record<string, string>[]
        | boolean
      >
    | string
    | number
    | string[]
    | number[]
    | boolean
    | null;
}
