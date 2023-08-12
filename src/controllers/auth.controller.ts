import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import { ITokenPair } from "../types";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenPair>> {
    try {
      const { _id } = req.res.locals.user;
      const tokenPair = await authService.login(req.body, _id);

      return res.status(200).json(tokenPair);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenPair>> {
    try {
      const payload = req.res.locals.payload;
      const oldTokenPair = req.res.locals.oldTokenPair;

      const tokenPair = await authService.refresh(payload, oldTokenPair);

      return res.status(200).json(tokenPair);
    } catch (e) {
      next(e);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const oldTokenPair = req.res.locals.oldTokenPair;
      await authService.logout(oldTokenPair);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
