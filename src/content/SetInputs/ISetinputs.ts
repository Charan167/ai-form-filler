export interface ISetInputs {
  elementId: string;
  name: string;
  suggestedValue: string;
}

export interface IFieldInputData {
  formId: string;
  fields: ISetInputs[];
}

export type IDiffHTMLTypes =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | null;

export interface SetInputReturnFmt {
  status: SetInputStatus;
  message: string;
  error: boolean;
}

export enum SetInputStatus {
  SUCCESS = "Success",
  ERROR = "Error",
  SKIPPED = "Skipped",
}
