import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error";
import { CarAd } from "../models";

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

  public async isVinUnique(req: Request, res: Response, next: NextFunction) {
    try {
      const { VIN } = req.body;

      if (await CarAd.findOne({ VIN })) {
        throw new ApiError(
          `CarAd with such ${VIN} vin code is already exist. VIN code should be unique.`,
          400,
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
