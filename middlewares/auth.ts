import { codes, messages } from "@constants/codes";
import { createError } from "@utils/createError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

const jwks = {
  keys: [
    {
      alg: "RS256",
      e: "AQAB",
      kid: "8k928aQ0mm+hFBLcgMzoZR1rKFTeQtAsQGkyC2bv2sU=",
      kty: "RSA",
      n: "xFC1ouHLZG71eEgpXiOabPtDkqJx5T7CI4HPUq4WbbVk4nN3i2GAUVdKtIU175lWk7fXFPujqTihUuc5efbwXz4mMFPFKBr98YNkBwm0ktcaTMhFOEoyIgsxcTiU5dwtA56vMmf4zf1ChaeelnvCUbamsY79RPJnHjQW7XL5JfOWxZBbentZEzGksFUuTUU_RGQbn-2DsGCDaq4DaVDTdFxd9OV28HNGpiec__-itYJ63tmewnnn1OMTjNU7WipK3EaUEw-FgvYlV5A8BvJnGJQbfeklLYInjb4TDkogRNIVJkWM524e71YnM-NzqH8FMnG9P_cR-RBDHAEavrs81w",
      use: "sig",
    },
    {
      alg: "RS256",
      e: "AQAB",
      kid: "nkjuvCr4psKshCL5r+Tf933gYK5+yMoWqqhy6J466IE=",
      kty: "RSA",
      n: "uUOzUC1McWuLfdZCgJpPnU-uYjbc6XNWaNSw9aK2BoK-FwPGaACAYQCRWQnvEF0VWCXfWlR4FMUns1xmEhrDEZnV9dwdBMRDiqTGOUxjllH9pjTyI0ZOf4Eh0ZFS859YzaCfJzvvoDtNAuK3RLPqQwOpl1v6w8LZ9qv9XXddiQNoGX6wNOo19rIAZzpmkS98kuE7S21wLeooshS2EzHFT7TcdFFN9l0mxaDoe2sNz7URRXtHTl6b-jXxbcJ7V-gGtI8o2WQ4Bf6jtznu2OtX-4UvsfMp95hfV0ZN49x24Jhh77lRSN1yx1tP4bWPRoVHErwbC6XnDOuia00oRVOovQ",
      use: "sig",
    },
  ],
};

class AuthMiddleware {
  private pems: { [key: string]: string } = {};

  constructor() {
    this.setup();
  }
  private setup() {
    try {
      const { keys } = jwks;
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
    const token = req.headers["authorization"]?.split(" ")[1] || "";

    if (!token) {
      return res.createErrorResponse({
        statusCode: codes.STATUS_UNAUTHORIZED_API,
        message: "Unauthorized",
      });
    }
    let decodedJwt: any = jwt.decode(token, { complete: true });
    if (!decodedJwt) {
      return res.createErrorResponse({
        statusCode: codes.STATUS_UNAUTHORIZED_API,
        message: "Unauthorized",
      });
    }

    let kid = decodedJwt.header.kid;
    let pem = this.pems[kid];

    if (!pem) {
      return res.createErrorResponse({
        statusCode: codes.STATUS_UNAUTHORIZED_API,
        message: "Unauthorized",
      });
    }
    jwt.verify(token, pem, function (err: any, payload: any) {
      if (err) {
        res.createErrorResponse({
          ...createError(codes.STATUS_UNAUTHORIZED_API, {
            authorization: messages[codes.STATUS_UNAUTHORIZED_API],
          }),
        });
        return;
      } else {
        req.user = {
          username: payload.username,
          token,
        };
        next();
      }
    });
  };
}

export default AuthMiddleware;
