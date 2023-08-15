import { Router } from "express";

import { authController } from "../controllers";
import { EToken } from "../enums";
import { authMiddleware, commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  authMiddleware.isBodyValid(UserValidator.register),
  authMiddleware.isEmailUnique,
  authController.register,
);

router.post(
  "/login",
  authMiddleware.isBodyValid(UserValidator.login),
  commonMiddleware.isUserExist,
  authController.login,
);

router.post(
  "/changePassword",
  authMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  authController.changePassword,
);

router.post(
  "/refresh",
  authMiddleware.checkAuthToken(EToken.REFRESHTOKEN),
  authController.refresh,
);

router.post(
  "/logout",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  authController.logout,
);

export const authRouter = router;
