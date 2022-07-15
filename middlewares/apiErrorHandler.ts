import { codes, messages } from "@constants/codes";
import ApiError from "@utils/apiError";
import { NextFunction, Request, Response } from "express";

class ApiErrorHandler {
  static errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof ApiError) {
      return res.status(err.code).json(err);
    }
    const error = ApiError.internalServerError(
      messages[codes.STATUS_SERVER_ERROR]
    );
    res.status(error.code).json(error);
  };
}

export default ApiErrorHandler;
