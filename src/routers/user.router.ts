import { Router } from "express";

import { userController } from "../controllers";
import { EToken, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  permissionsMiddleware,
} from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isUserExist,
  userController.getUserWithCarAds,
);

router.post(
  "/setPremiumAccount/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isUserExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.setPremiumAccount,
);

router.post(
  "/createManager",
  authMiddleware.isBodyValid(UserValidator.register),
  authMiddleware.isEmailUnique,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([EUserRole.ADMINISTRATOR]),
  userController.createManager,
);

router.patch(
  "/update/:userId",
  authMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
  ]),
  userController.update,
);

router.delete(
  "/delete/:userId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.delete,
);

export const userRouter = router;
