import { Router } from "express";

import { companyController } from "../controllers";
import { EToken, EUserRole } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  permissionsMiddleware,
} from "../middlewares";
import { CompanyValidator, UserValidator } from "../validators";

const router = Router();

router.get(
  "/:companyId",
  commonMiddleware.isIdValid("companyId"),
  commonMiddleware.isCompanyExist,
  companyController.getCompanyWithUsersAndCarAds,
);

router.post(
  "/create",
  authMiddleware.isBodyValid(CompanyValidator.create),
  authMiddleware.isEmailUnique,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  companyController.create,
);

router.post(
  "/createManager/:companyId",
  commonMiddleware.isIdValid("companyId"),
  authMiddleware.isBodyValid(UserValidator.register),
  commonMiddleware.isCompanyExist,
  authMiddleware.isEmailUnique,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.ADMINISTRATOR,
  ]),
  companyController.createManager,
);

router.patch(
  "/update/:companyId",
  commonMiddleware.isIdValid("companyId"),
  authMiddleware.isBodyValid(CompanyValidator.update),
  commonMiddleware.isCompanyExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.ADMINISTRATOR,
    EUserRole.MANAGER,
  ]),
  companyController.update,
);

router.delete(
  "/delete/:companyId",
  commonMiddleware.isIdValid("companyId"),
  commonMiddleware.isCompanyExist,
  authMiddleware.checkAuthToken(EToken.ACCESSTOKEN),
  permissionsMiddleware.userPermissions([
    EUserRole.COMPANY_ADMINISTRATOR,
    EUserRole.ADMINISTRATOR,
    EUserRole.MANAGER,
  ]),
  companyController.delete,
);

export const companyRouter = router;
