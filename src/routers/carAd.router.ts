import { Router } from "express";

import { carAdController } from "../controllers";
import { EToken, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  userMiddleware,
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
  userMiddleware.userPermissions([EUserRole.SELLER, EUserRole.ADMINISTRATOR]),
  carAdController.getStatisticInfo,
);

router.post(
  "/create",
  authMiddleware.isBodyValid(CarAdValidator.create),
  commonMiddleware.isVinUnique,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  carAdController.create,
);

router.patch(
  "/update/:carAdId",
  commonMiddleware.isIdValid("carAdId"),
  authMiddleware.isBodyValid(CarAdValidator.update),
  commonMiddleware.isCarAdExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.carAdPermissions([EUserRole.ADMINISTRATOR, EUserRole.SELLER]),
  carAdController.update,
);

router.delete(
  "/delete/:carAdId",
  commonMiddleware.isIdValid("carAdId"),
  commonMiddleware.isCarAdExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  userMiddleware.carAdPermissions([
    EUserRole.ADMINISTRATOR,
    EUserRole.SELLER,
    EUserRole.MANAGER,
  ]),
  carAdController.delete,
);

export const carAdRouter = router;
