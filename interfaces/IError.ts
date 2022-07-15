export interface IErrorMessage {
  [index: number]: string;
}

export interface IErrors {
  statusCode: number;
  fields?: any;
}
