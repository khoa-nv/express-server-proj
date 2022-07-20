import { codes, messages } from "@constants/codes";
import ApiError from "@utils/apiError";
import JWKs from "@utils/getJWK";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

class AuthMiddleware {
  private pems: { [key: string]: string } = {};

  constructor() {
    this.setup();
  }

  private async setup() {
    try {
      const { keys } = await JWKs.get();
      for (let i = 0; i < keys.length; i++) {
        const key_id = keys[i].kid;
        const modulus = keys[i].n;
        const exponent = keys[i].e;
        const key_type = keys[i].kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);
        this.pems[key_id] = pem;
      }
    } catch (err) {
      console.log(err);
    }
  }

  isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1] || "";

      if (!token) {
        next(ApiError.unauthorized(messages[codes.STATUS_UNAUTHORIZED]));
        return;
      }
      let decodedJwt: any = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        next(ApiError.unauthorized(messages[codes.STATUS_UNAUTHORIZED]));

        return;
      }

      let kid = decodedJwt.header.kid;
      let pem = this.pems[kid];

      if (!pem) {
        next(ApiError.unauthorized(messages[codes.STATUS_UNAUTHORIZED]));
        return;
      }
      jwt.verify(token, pem, function (err: any, payload: any) {
        if (err) {
          next(ApiError.unauthorized(messages[codes.STATUS_UNAUTHORIZED]));
          return;
        } else {
          req.user = {
            username: payload.username,
            token,
          };
          next();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default AuthMiddleware;
