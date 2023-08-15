import { Router } from "express";

import { carAdController } from "../controllers";
import { EToken, EUserAccount, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
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
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.accountPermissions([EUserAccount.PREMIUM]),
  carAdController.getStatisticInfo,
);

router.post(
  "/create",
  authMiddleware.isBodyValid(CarAdValidator.create),
  authMiddleware.isVinUnique,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.accountPermissions([
    EUserAccount.PREMIUM,
    EUserAccount.BASIC,
  ]),
  carAdController.create,
);

router.patch(
  "/update/:carAdId",
  commonMiddleware.isIdValid("carAdId"),
  authMiddleware.isBodyValid(CarAdValidator.update),
  commonMiddleware.isCarAdExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.update,
);

router.delete(
  "/delete/:carAdId",
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.COMPANY_MANAGER,
  ]),
  carAdController.delete,
);

export const carAdRouter = router;
