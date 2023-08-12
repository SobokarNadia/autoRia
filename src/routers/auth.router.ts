import { Router } from "express";

import { authController } from "../controllers";
import { EToken } from "../enums";
import { authMiddleware, userMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  authMiddleware.isBodyValid(UserValidator.register),
  authController.register,
);
router.post(
  "/login",
  authMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserExist,
  authController.login,
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
