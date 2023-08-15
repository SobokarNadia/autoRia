import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import filter from "leo-profanity";

import { EToken } from "../enums";
import { ApiError } from "../errors/api.error";
import { CarAd, Company, Token, User } from "../models";
import { tokenService } from "../services";

class AuthMiddleware {
  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const body = req.body;
        const { error, value } = validator.validate(body);

        for (const key in body) {
          if (typeof body[key] === "string" && filter.check(body[key])) {
            throw new ApiError("Profanity is not allowed!", 400);
          }
        }

        if (error) {
          throw new ApiError(error.message, 400);
        }

        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public checkAuthToken(tokenType: EToken) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = req.get("Authorization");
        if (!token) {
          throw new ApiError("Token is empty.", 401);
        }

        const payload = await tokenService.checkToken(token, tokenType);
        const tokenPair = await Token.findOne({ [tokenType]: token });

        if (!tokenPair) {
          throw new ApiError("Token is not exist.", 401);
        }
        req.res.locals.payload = payload;
        req.res.locals.oldTokenPair = tokenPair;

        next();
      } catch (e) {
        next(e);
      }
    };
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

  public async isEmailUnique(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (
        (await User.findOne({ email })) ||
        (await Company.findOne({ email }))
      ) {
        throw new ApiError(
          `User with such ${email} email is already exist.`,
          400,
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
