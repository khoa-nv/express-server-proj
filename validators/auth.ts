import { AUTH } from "./../constants/collections";
import routePaths from "@constants/routes";
import { body } from "express-validator";
class AuthValidator {
  validator = (type: string) => {
    switch (type) {
      case routePaths[AUTH].signIn: {
        return [
          body("username").notEmpty().isLength({ min: 5 }),
          body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        ];
      }
      case routePaths[AUTH].signUp: {
        return [
          body("username").notEmpty().isLength({ min: 5 }),
          body("email").notEmpty().normalizeEmail().isEmail(),
          body("name").notEmpty(),
          body("phone_number").isLength({ min: 10, max: 12 }),
          body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        ];
      }
      case routePaths[AUTH].confirmSignUp: {
        return [
          body("username").notEmpty(),
          body("session").notEmpty(),
          body("newPassword")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        ];
      }

      case routePaths[AUTH].updatePassword: {
        return [
          body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
          body("newPassword")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        ];
      }
    }
  };
}
export default AuthValidator;
