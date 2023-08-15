import { NextFunction, Request, Response } from "express";

import { EUserAccount, EUserRole } from "../enums";
import { ApiError } from "../errors/api.error";
import { User } from "../models";

class PermissionsMiddleware {
  public userPermissions(roles) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { _id: accountId, role } = req.res.locals.payload;
        const entityId = req.params.userId || req.params.companyId;

        if (roles.includes(role) || accountId === entityId) {
          switch (role) {
            case EUserRole.MANAGER:
              const user = await User.findById(entityId);
              if (
                user &&
                (user.role === EUserRole.ADMINISTRATOR ||
                  (user.role === EUserRole.MANAGER && entityId !== accountId))
              ) {
                throw new ApiError(
                  "You cannot manipulate data of administrator or another manager ",
                  400,
                );
              }
              break;
            case EUserRole.COMPANY_MANAGER:
            case EUserRole.COMPANY_ADMINISTRATOR:
              const admin = await User.findById(accountId);
              if (entityId && admin._company === entityId) {
                throw new ApiError(
                  "Just administrator of company can manipulate data of company.",
                  400,
                );
              }
              break;
          }
          next();
        } else {
          throw new ApiError("You dont have enough permissions", 400);
        }
      } catch (e) {
        next(e);
      }
    };
  }

  public carAdPermissions(roles) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { _id: accountId, role } = req.res.locals.payload;
        const carAd = req.res.locals.carAd;
        const user = await User.findById(accountId);

        if (
          roles.includes(role) ||
          accountId === carAd._user ||
          user._company === carAd._company
        ) {
          switch (role) {
            case EUserRole.MANAGER:
              const owner = await User.findById(carAd._user);

              if (
                owner &&
                (owner.role === EUserRole.ADMINISTRATOR ||
                  (owner.role === EUserRole.MANAGER &&
                    carAd._user.toString() !== accountId))
              ) {
                throw new ApiError(
                  "You cannot manipulate data of administrator or another manager ",
                  400,
                );
              }
              break;
            case EUserRole.COMPANY_ADMINISTRATOR:
            case EUserRole.COMPANY_MANAGER:
              if (user._company.toString() !== carAd._company.toString()) {
                throw new ApiError(
                  "You cannot manipulate data of another users or companies .",
                  400,
                );
              }
          }
          next();
        } else {
          throw new ApiError("You dont have enough permissions", 400);
        }
      } catch (e) {
        next(e);
      }
    };
  }
  public accountPermissions(accounts) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { _id } = req.res.locals.payload;
        const { account, _carAds } = await User.findById(_id);

        if (accounts.includes(account)) {
          if (account === EUserAccount.BASIC && _carAds.length !== 0) {
            throw new ApiError(
              "You have basic account, so you car create just one ad.",
              400,
            );
          }
          next();
        } else {
          throw new ApiError("You dont have enough permissions", 400);
        }
      } catch (e) {
        next(e);
      }
    };
  }
}

export const permissionsMiddleware = new PermissionsMiddleware();
