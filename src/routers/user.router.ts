import { Router } from "express";

import { userController } from "../controllers";
import { EToken, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  userMiddleware,
} from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.isUserExist,
  userController.getUserWithCarAds,
);

router.post(
  "/setPremiumAccount/:userId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.setPremiumAccount,
);

router.post(
  "/createManager",
  authMiddleware.isBodyValid(UserValidator.register),
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.userPermissions([EUserRole.ADMINISTRATOR]),
  userController.createManager,
);

router.patch(
  "/update/:userId",
  authMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.userPermissions([EUserRole.ADMINISTRATOR, EUserRole.SELLER]),
  userController.update,
);

router.delete(
  "/delete/:userId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.delete,
);

export const userRouter = router;
