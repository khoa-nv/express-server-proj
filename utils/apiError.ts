import { codes } from "@constants/codes";

class ApiError {
  code: number;
  message: string;
  fields?: any;
  description?: any;
  constructor(code: number, message: string, fields?: any, description?: any) {
    this.code = code;
    this.message = message;
    this.fields = fields;
    this.description = description;
  }

  static badRequest(message: string, fields?: any, description?: any) {
    return new ApiError(codes.STATUS_BAD_REQUEST, message, fields, description);
  }

  static unauthorized(message: string, fields?: any, description?: any) {
    return new ApiError(
      codes.STATUS_UNAUTHORIZED_API,
      message,
      fields,
      description
    );
  }

  static forbidden(message: string, fields?: any, description?: any) {
    return new ApiError(codes.STATUS_FORBIDDEN, message, fields, description);
  }

  static notFound(message: string, fields?: any, description?: any) {
    return new ApiError(codes.STATUS_NOT_FOUND, message, fields, description);
  }

  static internalServerError(message: string, fields?: any, description?: any) {
    return new ApiError(
      codes.STATUS_SERVER_ERROR,
      message,
      fields,
      description
    );
  }
}

export default ApiError;
