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
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isUserExist,
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    // EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.setPremiumAccount,
);

router.post(
  "/createManager",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  authMiddleware.isBodyValid(UserValidator.register),
  authMiddleware.isEmailUnique,
  permissionsMiddleware.userPermissions([EUserRole.ADMINISTRATOR]),
  userController.createManager,
);

router.patch(
  "/update/:userId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  authMiddleware.isBodyValid(UserValidator.update),
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    // EUserRole.SELLER,
  ]),
  userController.update,
);

router.delete(
  "/delete/:userId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.ADMINISTRATOR,
    // EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  userController.delete,
);

export const userRouter = router;
