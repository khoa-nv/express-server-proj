import { IUser } from "./IUser";

declare global {
  namespace Express {
    export interface Request {
      service: (collection: string) => any;
      controller: (collection: string) => any;
      user: IUser;
    }

    export interface Response {
      createSuccessResponse: (data: any) => void;
      createErrorResponse: (error: any) => void;
    }
  }
}
