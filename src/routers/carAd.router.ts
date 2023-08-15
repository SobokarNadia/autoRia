import { Router } from "express";

import { carAdController } from "../controllers";
import { EToken, EUserAccount, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
  permissionsMiddleware,
} from "../middlewares";
import { CarAdValidator } from "../validators";

const router = Router();

router.get("/getAll", carAdController.getAll);

router.get(
  "/getById/:carAdId",
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  carAdController.getById,
);

router.get(
  "/getStatisticInfo/:carAdId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  permissionsMiddleware.accountPermissions([EUserAccount.PREMIUM]),
  carAdController.getStatisticInfo,
);

router.post(
  "/create",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  authMiddleware.isBodyValid(CarAdValidator.create),
  authMiddleware.isVinUnique,
  permissionsMiddleware.accountPermissions([
    EUserAccount.PREMIUM,
    EUserAccount.BASIC,
  ]),
  carAdController.create,
);

router.post(
  "/:carAdId/photos",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  fileMiddleware.isPhotosValid,
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.uploadPhoto,
);

router.delete(
  "/:carAdId/:photoId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.deletePhoto,
);

router.patch(
  "/update/:carAdId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("carAdId"),
  authMiddleware.isBodyValid(CarAdValidator.update),
  commonMiddleware.isCarAdExist,
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.update,
);

router.delete(
  "/delete/:carAdId",
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.MANAGER,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.delete,
);

export const carAdRouter = router;
