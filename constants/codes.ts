import { IErrorMessage } from "@interfaces/IError";

export const messages: IErrorMessage = {
  400: "Invalid data passed.",
  401: "Not authenticated.",
  402: "Not authenticated.",
  403: "You do not have enough permissions.",
  404: "Requested resource is not found.",
  409: "Data conflict. An object with the specified key or id may already exist.",
  500: "Internal server error.",
};
export const codes = {
  STATUS_SUCCESS: 200,
  STATUS_BAD_REQUEST: 400,
  STATUS_UNAUTHORIZED_API: 401,
  STATUS_UNAUTHORIZED: 402,
  STATUS_FORBIDDEN: 403,
  STATUS_NOT_FOUND: 404,
  STATUS_CONFLICT: 409,
  STATUS_SERVER_ERROR: 500,
};
