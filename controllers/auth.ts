import { validationResult } from "express-validator";
import { Response, NextFunction, Request } from "express";
import { COGNITO } from "@constants/services";
import { codes, messages } from "@constants/codes";
import ApiError from "@utils/apiError";

class AuthController {
  private validateData = (req) => {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest(
        messages[codes.STATUS_BAD_REQUEST],
        [...new Set(errors?.errors?.map((error: any) => error.param))],
        errors.messages
      );
    }
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.validateData(req);

      const { username, password, email, name, phone_number } = req.body;
      const user = await req
        .service(COGNITO)
        .signUpUser({ username, password, email, name, phone_number });

      res.createSuccessResponse(user);
    } catch (err) {
      next(err);
    }
  };

  confirmSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.validateData(req);
      const { session, username, newPassword } = req.body;
      return await req
        .service(COGNITO)
        .confirmUserSignUp({ session, username, newPassword });
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.validateData(req);
      const { username, password } = req.body;
      const user = await req
        .service(COGNITO)
        .signInUser({ username, password });

      res.createSuccessResponse(user);
    } catch (err) {
      next(err);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.validateData(req);
      const { password, newPassword } = req.body;
      const { token } = req.user;
      return await req
        .service(COGNITO)
        .changeUserPassword({ token, password, newPassword });
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
