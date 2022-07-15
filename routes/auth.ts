import { AUTH } from "@constants/controller";
import routePaths from "@constants/routes";
import AuthValidator from "@validators/auth";
import * as express from "express";
import { NextFunction, Request, Response } from "express";

export class AuthRoute {
  public protectedRoutes = express.Router();
  public unProtectedRoutes = express.Router();
  public path = "/" + AUTH;
  private validator = new AuthValidator().validator;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.unProtectedRoutes.post(
      routePaths[AUTH].signIn,
      this.validator(routePaths[AUTH].signIn),
      (req: Request, res: Response, next: NextFunction) =>
        req.controller(AUTH).signIn(req, res, next)
    );

    this.unProtectedRoutes.post(
      routePaths[AUTH].signUp,
      this.validator(routePaths[AUTH].signUp),
      (req: Request, res: Response, next: NextFunction) =>
        req.controller(AUTH).signUp(req, res, next)
    );

    this.unProtectedRoutes.post(
      routePaths[AUTH].confirmSignUp,
      this.validator(routePaths[AUTH].confirmSignUp),
      (req: Request, res: Response, next: NextFunction) =>
        req.controller(AUTH).confirmSignUp(req, res, next)
    );

    this.protectedRoutes.post(
      routePaths[AUTH].updatePassword,
      this.validator(routePaths[AUTH].updatePassword),
      (req: Request, res: Response, next: NextFunction) =>
        req.controller(AUTH).updatePassword(req, res, next)
    );
  }
}

export default AuthRoute;
