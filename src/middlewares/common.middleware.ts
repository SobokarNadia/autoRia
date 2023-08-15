import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error";
import { CarAd, Company, User } from "../models";
import { IUser } from "../types";

class CommonMiddleware {
  public isIdValid(idField: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const id = req.params[idField];

        if (!isObjectIdOrHexString(id)) {
          throw new ApiError("Id is not valid.", 400);
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async isCarAdExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const carAd = await CarAd.findById(req.params.carAdId);

      if (!carAd) {
        throw new ApiError("Car's ad does not exist.", 400);
      }
      req.res.locals.carAd = carAd;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isCompanyExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const company = await Company.findById(req.params.companyId);

      if (!company) {
        throw new ApiError(`Company does not exist.`, 400);
      }
      req.res.locals.company = company;

      next();
    } catch (e) {
      next(e);
    }
  }

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
        throw new ApiError(`User does not exist.`, 400);
      }

      req.res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
