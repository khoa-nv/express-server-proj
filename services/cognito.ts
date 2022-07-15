import ApiError from "@utils/apiError";
import { codes, messages } from "@constants/codes";
import { IUser } from "@interfaces/IUser";
import AWS from "aws-sdk";
import crypto from "crypto";

class Cognito {
  private config = {
    apiVersion: "2016-04-18",
    region: process.env.AWS_REGION || "ap-southeast-1",
  };

  private clientId = process.env.COGNITO_CLIENT_ID || "";
  private secretHash = process.env.COGNITO_CLIENT_SECRET || "";

  private cognitoIdentity;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  private handleError(error: any) {
    if (error.statusCode === codes.STATUS_BAD_REQUEST) {
      return ApiError.badRequest(error.message, [], error.code);
    } else {
      return ApiError.internalServerError(messages[codes.STATUS_SERVER_ERROR]);
    }
  }

  signUpUser = async (user: IUser) => {
    const params = {
      ClientId: this.clientId,
      Username: user.username,
      Password: user.password,
      SecretHash: this.hashSecret(user.username),
      UserAttributes: [
        { Name: "name", Value: user.name },
        { Name: "phone_number", Value: user.phone_number },
        { Name: "email", Value: user.email },
      ],
    };

    try {
      return await this.cognitoIdentity.signUp(params).promise();
    } catch (error) {
      console.log(error);
      throw this.handleError(error);
    }
  };

  signInUser = async (user: { username: string; password: string }) => {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: user.username,
        PASSWORD: user.password,
        SECRET_HASH: this.hashSecret(user.username),
      },
    };

    try {
      return await this.cognitoIdentity.initiateAuth(params).promise();
    } catch (error) {
      throw this.handleError(error);
    }
  };

  changeUserPassword = async (user: {
    token: string;
    password: string;
    newPassword: string;
  }) => {
    const params = {
      AccessToken: user.token,
      PreviousPassword: user.password,
      ProposedPassword: user.newPassword,
    };

    try {
      return await this.cognitoIdentity.changePassword(params).promise();
    } catch (error) {
      throw this.handleError(error);
    }
  };

  confirmUserSignUp = async (user: {
    username: string;
    session: string;
    newPassword: string;
  }) => {
    const params = {
      ClientId: this.clientId,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      Session: user.session,
      ChallengeResponses: {
        USERNAME: user.username,
        NEW_PASSWORD: user.newPassword,
        SECRET_HASH: this.hashSecret(user.username),
      },
    };
    try {
      return await this.cognitoIdentity
        .respondToAuthChallenge(params)
        .promise();
    } catch (error) {
      throw this.handleError(error);
    }
  };

  private hashSecret(username: string): string {
    return crypto
      .createHmac("SHA256", this.secretHash)
      .update(username + this.clientId)
      .digest("base64");
  }
}

export default Cognito;
