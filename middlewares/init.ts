import { NextFunction } from "express";
import { codes, messages } from "@constants/codes";
import { Response, Request } from "express";
import getServices from "@services";
import runController from "@controllers";

class InitReqRes {
  private static createSuccessResponse = function (this: any, data: any) {
    this.status(codes.STATUS_SUCCESS).json(data);
  };

  static init = (req: Request, res: Response, next: NextFunction) => {
    req.service = getServices(req);
    req.controller = runController(req);
    res.createSuccessResponse = this.createSuccessResponse;
    next();
  };
}

export default InitReqRes;
