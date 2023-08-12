import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { EToken } from "../enums";
import { ApiError } from "../errors/api.error";
import { Token } from "../models";
import { tokenService } from "../services";

class AuthMiddleware {
  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const { error, value } = validator.validate(req.body);

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
}

export const authMiddleware = new AuthMiddleware();
