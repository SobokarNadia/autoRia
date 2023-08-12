import { NextFunction, Request, Response } from "express";

import { EUserRole } from "../enums";
import { ApiError } from "../errors/api.error";
import { User } from "../models";
import { IUser } from "../types";

class UserMiddleware {
  public async isUserExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let user: IUser;
      if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
      } else {
        user = await User.findById(req.params.userId);
      }

      if (!user) {
        throw new ApiError(`User with such email does not exist.`, 400);
      }

      req.res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public carAdPermissions(permisions) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { _id, role } = req.res.locals.payload;
        const user = await User.findById(_id);

        if (permisions.includes(role)) {
          if (
            role === EUserRole.SELLER &&
            !user["_carAds"]
              .map((val) => val.toString())
              .includes(req.params.carAdId)
          ) {
            throw new ApiError(
              "You are not an owner of this carAd. You cannot update it.",
              400,
            );
          }
          next();
        } else {
          throw new ApiError("You dont have access to this ad.", 400);
        }
      } catch (e) {
        next(e);
      }
    };
  }

  public userPermissions(permisions) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { _id: accountId, role } = req.res.locals.payload;
        const userId = req.params.userId;
        // const user = await User.findById(userId);

        // if (permisions.includes(role)) {
        //   if (
        //     (role === EUserRole.SELLER && accountId !== userId) ||
        //     (role === EUserRole.MANAGER &&
        //       (user.role === EUserRole.ADMINISTRATOR ||
        //         (user.role === EUserRole.MANAGER && user._id !== accountId)))
        //   ) {
        //     throw new ApiError("You dont have enough permissions.", 400);
        //   }
        //   next();
        // }

        if (permisions.includes(role)) {
          switch (role) {
            case EUserRole.ADMINISTRATOR:
              next();
              break;
            case EUserRole.SELLER:
              if (accountId !== userId) {
                throw new ApiError(
                  "You cannot manipulate data of another users.",
                  400,
                );
              }
              next();
              break;
            case EUserRole.MANAGER:
              const user = await User.findById(userId);
              if (
                user.role === EUserRole.ADMINISTRATOR ||
                (user.role === EUserRole.MANAGER && user._id !== accountId)
              ) {
                throw new ApiError(
                  "You cannot manipulate data of administrator or another manager ",
                  400,
                );
              }
              next();
              break;
          }
        } else {
          throw new ApiError("You dont have enough permissions", 400);
        }
      } catch (e) {
        next(e);
      }
    };
  }

  public async isUserOwn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { _id } = req.res.locals.payload;
      const user = await User.findById(_id);

      if (
        !user["_carAds"]
          .map((val) => val.toString())
          .includes(req.params.carAdId)
      ) {
        throw new ApiError(
          "You are not an owner of this carAd. You cannot update it.",
          400,
        );
      }
      req.res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
